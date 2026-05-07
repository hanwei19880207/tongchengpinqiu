import { useState, useEffect } from 'react'
import Taro, { getCurrentInstance, useShareAppMessage } from '@tarojs/taro'
import { View, Text, Image, Input } from '@tarojs/components'
import { fetchPostById, likePost, getUserLikedPostIds, addComment } from '../../services/post'
import { getPostById } from '../../data/mock'
import { getLikedPosts, toggleLikePost, getBookmarkedPosts, toggleBookmarkPost } from '../../data/storage'
import { getPostImage } from '../../data/images'
import { isLoggedIn, getProfile } from '../../services/user'
import type { Post } from '../../types'
import './index.scss'

export default function PostDetail() {
  const [post, setPost] = useState<Post | null>(null)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [useCloud, setUseCloud] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const params = getCurrentInstance().router?.params
    const id = params?.id
    if (!id) return
    const source = params?.source

    setBookmarked(getBookmarkedPosts().includes(id))

    const load = async () => {
      if (source !== 'mock') {
        try {
          const data = await Promise.race([
            fetchPostById(id),
            new Promise<null>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
          ])
          if (data) {
            setPost(data)
            try {
              const likedIds = await getUserLikedPostIds()
              setLiked(likedIds.includes(id))
            } catch {}
            return
          }
        } catch {}
      }
      const data = getPostById(id)
      if (data) {
        setPost(data)
        setLiked(getLikedPosts().includes(id))
      } else {
        setNotFound(true)
      }
    }
    load()
  }, [])

  useShareAppMessage(() => {
    const id = post?.id || (post as any)?._id || ''
    return {
      title: post?.title || '来约球吧看看这条动态',
      path: `/pages/post-detail/index?id=${id}&source=cloud`,
      imageUrl: post?.image || '',
    }
  })

  const handleLike = async () => {
    if (!post) return
    const id = post.id || (post as any)._id
    try {
      if (useCloud) {
        await likePost(id)
        const likedIds = await getUserLikedPostIds()
        setLiked(likedIds.includes(id))
        return
      }
    } catch {}
    toggleLikePost(id)
    setLiked(!liked)
  }

  const handleBookmark = () => {
    if (!post) return
    const id = post.id || (post as any)._id
    const added = toggleBookmarkPost(id)
    setBookmarked(added)
    Taro.showToast({ title: added ? '已收藏' : '已取消收藏', icon: 'none' })
  }

  const handleShare = () => {
    Taro.showToast({ title: '点击右上角分享给好友', icon: 'none' })
  }

  const handleSendComment = async () => {
    if (!post || !commentText.trim()) return
    const id = post.id || (post as any)._id
    let author = '匿名球友'
    let avatar = '🎾'
    if (isLoggedIn()) {
      const profile = await getProfile()
      if (profile) {
        author = profile.name
        avatar = '🎾'
      }
    }
    try {
      if (useCloud) {
        await addComment(id, commentText.trim(), author, avatar)
      }
    } catch {}
    const newComment = {
      id: Date.now().toString(),
      author,
      avatar,
      content: commentText.trim(),
      createdAt: '刚刚',
    }
    setPost({ ...post, comments: [...(post.comments || []), newComment] })
    setCommentText('')
    setShowInput(false)
    Taro.showToast({ title: '评论成功', icon: 'success' })
  }

  if (!post) {
    return (
      <View className="post-detail">
        <View className="loading"><Text>{notFound ? '内容不存在' : '加载中...'}</Text></View>
      </View>
    )
  }

  return (
    <View className="post-detail">
      <Image className="post-detail__hero" src={post.image || getPostImage(post.id || (post as any)._id || '0')} mode="aspectFill" />

      <View className="post-detail__body">
        <Text className="post-detail__title">{post.title}</Text>

        <View className="post-detail__author">
          <View className="author-avatar"><Text>{post.avatar}</Text></View>
          <View className="author-info">
            <Text className="author-name">{post.author}</Text>
            <Text className="author-time">{post.createdAt}</Text>
          </View>
        </View>

        <View className="post-detail__content">
          <Text className="content-text">{post.content}</Text>
        </View>

        {post.comments && post.comments.length > 0 && (
          <View className="post-detail__comments">
            <Text className="comments-title">评论 ({post.comments.length})</Text>
            {post.comments.map(c => (
              <View key={c.id} className="comment-item">
                <View className="comment-avatar"><Text>{c.avatar}</Text></View>
                <View className="comment-body">
                  <View className="comment-header">
                    <Text className="comment-author">{c.author}</Text>
                    <Text className="comment-time">{c.createdAt}</Text>
                  </View>
                  <Text className="comment-content">{c.content}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {showInput ? (
        <View className="post-detail__bar post-detail__bar--input">
          <Input
            className="comment-input"
            placeholder="写评论..."
            value={commentText}
            onInput={(e) => setCommentText(e.detail.value)}
            focus
            confirmType="send"
            onConfirm={handleSendComment}
          />
          <View className="send-btn" onClick={handleSendComment}>
            <Text>发送</Text>
          </View>
        </View>
      ) : (
        <View className="post-detail__bar">
          <View className={`bar-item ${liked ? 'bar-item--active' : ''}`} onClick={handleLike}>
            <Text className="bar-icon">♥</Text>
            <Text className="bar-label">{liked ? '已赞' : '点赞'}</Text>
          </View>
          <View className="bar-item" onClick={() => setShowInput(true)}>
            <Text className="bar-icon">💬</Text>
            <Text className="bar-label">评论</Text>
          </View>
          <View className={`bar-item ${bookmarked ? 'bar-item--bookmarked' : ''}`} onClick={handleBookmark}>
            <Text className="bar-icon">{bookmarked ? '★' : '☆'}</Text>
            <Text className="bar-label">{bookmarked ? '已收藏' : '收藏'}</Text>
          </View>
          <View className="bar-item" onClick={handleShare}>
            <Text className="bar-icon">↗</Text>
            <Text className="bar-label">分享</Text>
          </View>
        </View>
      )}
    </View>
  )
}
