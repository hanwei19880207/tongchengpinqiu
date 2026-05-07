import { useState, useEffect } from 'react'
import Taro, { usePullDownRefresh, useReachBottom } from '@tarojs/taro'
import { View, Text, Image, Input } from '@tarojs/components'
import { fetchPosts, getUserLikedPostIds, likePost } from '../../services/post'
import { getPosts, MOCK_POSTS } from '../../data/mock'
import { getLikedPosts, toggleLikePost } from '../../data/storage'
import { getPostImage } from '../../data/images'
import type { Post } from '../../types'
import './index.scss'

const TOPICS = ['全部', '#周末约球', '#网球教学', '#场馆推荐', '#装备测评']

export default function Discover() {
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [activeChip, setActiveChip] = useState(0)
  const [likedIds, setLikedIds] = useState<string[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [useCloud, setUseCloud] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [searching, setSearching] = useState(false)

  const loadPosts = async (p: number, reset = false) => {
    try {
      if (useCloud) {
        const data = await Promise.race([
          fetchPosts(p),
          new Promise<Post[]>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
        ])
        if (data.length === 0 && p === 1) throw new Error('empty')
        if (reset) setPosts(data)
        else setPosts(prev => [...prev, ...data])
        setHasMore(data.length >= 6)
        return
      }
    } catch {
      setUseCloud(false)
    }
    const data = getPosts(p)
    if (reset) setPosts(data)
    else setPosts(prev => [...prev, ...data])
    setHasMore(data.length >= 6)
  }

  const loadLikedIds = async () => {
    try {
      if (useCloud) {
        const ids = await getUserLikedPostIds()
        setLikedIds(ids)
        return
      }
    } catch {}
    setLikedIds(getLikedPosts())
  }

  useEffect(() => {
    loadPosts(1, true)
    loadLikedIds()
  }, [])

  usePullDownRefresh(() => {
    setPage(1)
    setKeyword('')
    setSearching(false)
    loadPosts(1, true).then(() => {
      loadLikedIds()
      Taro.stopPullDownRefresh()
    })
  })

  useReachBottom(() => {
    if (!hasMore || searching) return
    const next = page + 1
    setPage(next)
    loadPosts(next)
  })

  const handleSearch = () => {
    const kw = keyword.trim()
    if (!kw) {
      setSearching(false)
      loadPosts(1, true)
      return
    }
    setSearching(true)
    const allPosts = MOCK_POSTS
    const filtered = allPosts.filter(p =>
      p.title.includes(kw) || p.author.includes(kw) || (p.content && p.content.includes(kw))
    )
    setPosts(filtered)
    setHasMore(false)
  }

  const handleCardTap = (id: string) => {
    Taro.navigateTo({ url: `/pages/post-detail/index?id=${id}&source=${useCloud ? 'cloud' : 'mock'}` })
  }

  const handleLike = async (e, id: string) => {
    e.stopPropagation()
    try {
      if (useCloud) {
        await likePost(id)
        await loadLikedIds()
        return
      }
    } catch {}
    toggleLikePost(id)
    setLikedIds(getLikedPosts())
  }

  const handleTopicTap = (idx: number) => {
    setActiveChip(idx)
    if (idx === 0) {
      setSearching(false)
      setKeyword('')
      loadPosts(1, true)
      return
    }
    const topic = TOPICS[idx].replace('#', '')
    setSearching(true)
    const filtered = MOCK_POSTS.filter(p =>
      p.title.includes(topic) || (p.content && p.content.includes(topic)) || p.tags?.includes(topic)
    )
    setPosts(filtered.length > 0 ? filtered : MOCK_POSTS.slice(0, 4))
    setHasMore(false)
  }

  const leftPosts = posts.filter((_, i) => i % 2 === 0)
  const rightPosts = posts.filter((_, i) => i % 2 === 1)

  const formatLikes = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)

  const renderCard = (card: Post, index: number) => (
    <View key={card.id || (card as any)._id} className="feed-card" onClick={() => handleCardTap(card.id || (card as any)._id)}>
      <Image className="feed-card__image" src={card.image || getPostImage(card.id || (card as any)._id || index)} mode="widthFix" />
      <View className="feed-card__content">
        <Text className="feed-card__title">{card.title}</Text>
        <View className="feed-card__meta">
          <View className="feed-card__author">
            <Text className="feed-card__avatar">{card.avatar}</Text>
            <Text className="feed-card__name">{card.author}</Text>
          </View>
          <View
            className={`feed-card__likes ${likedIds.includes(card.id || (card as any)._id) ? 'feed-card__likes--active' : ''}`}
            onClick={(e) => handleLike(e, card.id || (card as any)._id)}
          >
            <Text className="like-icon">♥</Text>
            <Text className="like-count">{formatLikes(card.likes)}</Text>
          </View>
        </View>
      </View>
    </View>
  )

  return (
    <View className="discover">
      <View className="search-bar">
        <Text className="search-icon">🔍</Text>
        <Input
          className="search-input"
          placeholder="搜索球友、场馆、动态..."
          value={keyword}
          onInput={(e) => setKeyword(e.detail.value)}
          confirmType="search"
          onConfirm={handleSearch}
        />
        <View className="msg-icon" onClick={() => Taro.navigateTo({ url: '/pages/messages/index' })}>
          <Text>🔔</Text>
        </View>
      </View>

      <View className="topic-row">
        {TOPICS.map((topic, i) => (
          <View
            key={topic}
            className={`topic-chip ${activeChip === i ? 'topic-chip--active' : ''}`}
            onClick={() => handleTopicTap(i)}
          >
            <Text>{topic}</Text>
          </View>
        ))}
      </View>

      <View className="waterfall">
        <View className="column">
          {leftPosts.map((card, i) => renderCard(card, i * 2))}
        </View>
        <View className="column">
          {rightPosts.map((card, i) => renderCard(card, i * 2 + 1))}
        </View>
      </View>

      {posts.length === 0 && (
        <View className="empty-state"><Text>没有找到相关内容</Text></View>
      )}

      {!hasMore && posts.length > 0 && (
        <View className="load-end">
          <Text>— 已经到底啦 —</Text>
        </View>
      )}
    </View>
  )
}
