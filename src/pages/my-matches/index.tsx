import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { getUserJoinedMatchIds, fetchMatchById } from '../../services/match'
import { getJoinedMatches } from '../../data/storage'
import { MOCK_MATCHES } from '../../data/mock'
import { getMatchImage } from '../../data/images'
import type { Match } from '../../types'
import './index.scss'

export default function MyMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const ids = await getUserJoinedMatchIds()
        const results: Match[] = []
        for (const id of ids) {
          const m = await fetchMatchById(id)
          if (m) results.push(m)
        }
        setMatches(results)
      } catch {
        const localIds = getJoinedMatches()
        setMatches(MOCK_MATCHES.filter(m => localIds.includes(m.id)))
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return <View className="my-matches"><View className="loading"><Text>加载中...</Text></View></View>
  }

  return (
    <View className="my-matches">
      {matches.length === 0 ? (
        <View className="empty-state">
          <Text className="empty-icon">🎾</Text>
          <Text className="empty-text">还没有参加过约球</Text>
          <View className="empty-btn" onClick={() => Taro.switchTab({ url: '/pages/match/index' })}>
            <Text>去看看</Text>
          </View>
        </View>
      ) : (
        matches.map((m, idx) => {
          const id = m.id || (m as any)._id
          return (
            <View key={id} className="match-item" onClick={() => Taro.navigateTo({ url: `/pages/match-detail/index?id=${id}` })}>
              <Image className="match-item__image" src={m.image || getMatchImage(idx)} mode="aspectFill" />
              <View className="match-item__info">
                <Text className="match-item__title">{m.title}</Text>
                <Text className="match-item__time">🕐 {m.time}</Text>
                <Text className="match-item__location">📍 {m.location}</Text>
                <View className={`match-item__status ${m.status === 'completed' ? 'match-item__status--done' : ''}`}>
                  <Text>{m.status === 'completed' ? '已结束' : '进行中'}</Text>
                </View>
              </View>
            </View>
          )
        })
      )}
    </View>
  )
}
