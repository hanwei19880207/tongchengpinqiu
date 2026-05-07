import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { getProfile, getOpenid } from '../../services/user'
import { fetchRatingsForUser, computeAggregatedRating } from '../../services/rating'
import { actionsCollection, postsCollection } from '../../services/db'
import './index.scss'

const BADGES = [
  { icon: '🎾', name: '初入球场', desc: '完成第一次约球', unlocked: true },
  { icon: '🏆', name: '百战勇士', desc: '参与10场以上约球', unlocked: false },
  { icon: '⭐', name: '好评如潮', desc: '获得5次以上好评', unlocked: false },
  { icon: '🔥', name: '连续打卡', desc: '参加3场以上约球', unlocked: false },
  { icon: '👥', name: '社交达人', desc: '互动(点赞+收藏)达10次', unlocked: false },
  { icon: '📝', name: '内容创作者', desc: '发布过动态', unlocked: false },
]

export default function Achievements() {
  const [matchCount, setMatchCount] = useState(0)
  const [ratingCount, setRatingCount] = useState(0)
  const [joinCount, setJoinCount] = useState(0)
  const [interactionCount, setInteractionCount] = useState(0)
  const [postCount, setPostCount] = useState(0)

  useEffect(() => {
    const load = async () => {
      const profile = await getProfile()
      if (profile) setMatchCount(profile.stats.matches || 0)
      try {
        const openid = getOpenid()
        if (openid) {
          const ratings = await fetchRatingsForUser(openid)
          const agg = computeAggregatedRating(ratings)
          setRatingCount(agg.count)
        }
      } catch {}
      try {
        const { data: joins } = await actionsCollection().where({ type: 'join' }).get()
        setJoinCount(joins.length)
        const { data: likes } = await actionsCollection().where({ type: 'like' }).get()
        const { data: bookmarks } = await actionsCollection().where({ type: 'bookmark' }).get()
        setInteractionCount(likes.length + bookmarks.length)
      } catch {}
      try {
        const { total } = await postsCollection().count()
        setPostCount(total)
      } catch {}
    }
    load()
  }, [])

  const badges = BADGES.map(b => {
    if (b.name === '百战勇士' && matchCount >= 10) return { ...b, unlocked: true }
    if (b.name === '好评如潮' && ratingCount >= 5) return { ...b, unlocked: true }
    if (b.name === '连续打卡' && joinCount >= 3) return { ...b, unlocked: true }
    if (b.name === '社交达人' && interactionCount >= 10) return { ...b, unlocked: true }
    if (b.name === '内容创作者' && postCount >= 1) return { ...b, unlocked: true }
    return b
  })

  return (
    <View className="achievements">
      <View className="summary">
        <View className="summary-item">
          <Text className="summary-num">{badges.filter(b => b.unlocked).length}</Text>
          <Text className="summary-label">已解锁</Text>
        </View>
        <View className="summary-item">
          <Text className="summary-num">{badges.length}</Text>
          <Text className="summary-label">全部成就</Text>
        </View>
      </View>

      <View className="badge-list">
        {badges.map(b => (
          <View key={b.name} className={`badge-item ${b.unlocked ? '' : 'badge-item--locked'}`}>
            <Text className="badge-icon">{b.icon}</Text>
            <View className="badge-info">
              <Text className="badge-name">{b.name}</Text>
              <Text className="badge-desc">{b.desc}</Text>
            </View>
            <Text className="badge-status">{b.unlocked ? '✅' : '🔒'}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
