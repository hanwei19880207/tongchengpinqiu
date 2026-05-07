import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { fetchMyGivenRatings } from '../../services/rating'
import type { PeerRating } from '../../types'
import './index.scss'

export default function RatingHistoryPage() {
  const [ratings, setRatings] = useState<PeerRating[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMyGivenRatings()
        setRatings(data)
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <View className="rating-history">
        <View className="loading"><Text>加载中...</Text></View>
      </View>
    )
  }

  return (
    <View className="rating-history">
      {ratings.length === 0 ? (
        <View className="empty-state">
          <Text className="empty-icon">📝</Text>
          <Text className="empty-text">暂无评价记录</Text>
        </View>
      ) : (
        <View className="rating-list">
          {ratings.map(r => (
            <View key={r._id} className="rating-card">
              <View className="rating-card__header">
                <View className="target-avatar"><Text>{r.toAvatar || '🎾'}</Text></View>
                <View className="target-info">
                  <Text className="target-name">{r.toName}</Text>
                  <Text className="target-time">{r.createdAt?.slice(0, 10)}</Text>
                </View>
              </View>
              <View className="rating-card__scores">
                <View className="score-item">
                  <Text className="score-label">技术</Text>
                  <Text className="score-value">{r.scores.skill}</Text>
                </View>
                <View className="score-item">
                  <Text className="score-label">守时</Text>
                  <Text className="score-value">{r.scores.punctuality}</Text>
                </View>
                <View className="score-item">
                  <Text className="score-label">态度</Text>
                  <Text className="score-value">{r.scores.friendliness}</Text>
                </View>
              </View>
              {r.comment && (
                <View className="rating-card__comment">
                  <Text>{r.comment}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  )
}
