import { useState, useEffect } from 'react'
import Taro, { usePullDownRefresh } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { fetchMatches, getUserJoinedMatchIds, joinMatchCloud } from '../../services/match'
import { MOCK_MATCHES } from '../../data/mock'
import { getJoinedMatches, joinMatch as joinMatchLocal } from '../../data/storage'
import { getMatchImage } from '../../data/images'
import type { Match } from '../../types'
import './index.scss'

const FILTERS = [
  { label: '全部', value: '全部' },
  { label: '初级', value: '初级' },
  { label: '中级', value: '中级' },
  { label: '高级', value: '高级' },
]

export default function MatchPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [activeFilter, setActiveFilter] = useState('全部')
  const [joinedIds, setJoinedIds] = useState<string[]>([])
  const [useCloud, setUseCloud] = useState(true)

  const loadMatches = async (filter: string) => {
    try {
      if (useCloud) {
        const data = await Promise.race([
          fetchMatches(filter),
          new Promise<Match[]>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
        ])
        if (data.length === 0 && filter === '全部') throw new Error('empty')
        setMatches(data)
        return
      }
    } catch {
      setUseCloud(false)
    }
    const filtered = filter === '全部'
      ? MOCK_MATCHES
      : MOCK_MATCHES.filter(m => m.level === filter)
    setMatches(filtered)
  }

  const loadJoinedIds = async () => {
    try {
      if (useCloud) {
        const ids = await getUserJoinedMatchIds()
        setJoinedIds(ids)
        return
      }
    } catch {}
    setJoinedIds(getJoinedMatches())
  }

  useEffect(() => {
    loadJoinedIds()
  }, [])

  useEffect(() => {
    loadMatches(activeFilter)
  }, [activeFilter])

  usePullDownRefresh(() => {
    loadJoinedIds()
    loadMatches(activeFilter).then(() => Taro.stopPullDownRefresh())
  })

  const handleCardTap = (id: string) => {
    Taro.navigateTo({ url: `/pages/match-detail/index?id=${id}&source=${useCloud ? 'cloud' : 'mock'}` })
  }

  const handleJoin = async (e, m: Match) => {
    e.stopPropagation()
    const id = m.id || (m as any)._id
    if (joinedIds.includes(id)) return
    if (m.spots.current >= m.spots.total) {
      Taro.showToast({ title: '名额已满', icon: 'none' })
      return
    }
    try {
      if (useCloud) {
        await joinMatchCloud(id, { name: '我', avatar: '🎾', level: '3.5' })
        await loadJoinedIds()
        Taro.showToast({ title: '加入成功！', icon: 'success' })
        return
      }
    } catch {}
    joinMatchLocal(id)
    setJoinedIds(getJoinedMatches())
    Taro.showToast({ title: '加入成功！', icon: 'success' })
  }

  const handleNearby = () => {
    Taro.getLocation({
      type: 'wgs84',
      success: () => {
        Taro.showToast({ title: '附近约球暂无数据，已显示全部', icon: 'none' })
      },
      fail: () => {
        Taro.showToast({ title: '请在设置中允许位置权限', icon: 'none' })
      },
    })
  }

  return (
    <View className="match">
      <View className="match-hero">
        <View className="hero-content">
          <Text className="hero-title">找到你的最佳搭档</Text>
          <Text className="hero-subtitle">附近 {matches.length} 场约球正在等你加入</Text>
        </View>
        <View className="hero-btn" onClick={() => Taro.switchTab({ url: '/pages/publish/index' })}>
          <Text>发起约球</Text>
        </View>
      </View>

      <View className="filters">
        {FILTERS.map(f => (
          <View
            key={f.value}
            className={`filter-chip ${activeFilter === f.value ? 'filter-chip--active' : ''}`}
            onClick={() => setActiveFilter(f.value)}
          >
            <Text>{f.label}</Text>
          </View>
        ))}
        <View className="filter-chip filter-chip--icon" onClick={handleNearby}><Text>📍 附近3km</Text></View>
      </View>

      <View className="match-list">
        {matches.map((m) => {
          const id = m.id || (m as any)._id
          return (
            <View key={id} className="match-card" onClick={() => handleCardTap(id)}>
              <Image className="match-card__image" src={m.image || getMatchImage(id)} mode="widthFix" />
              <View className="match-card__body">
                <View className="match-card__header">
                  <Text className="match-card__title">{m.title}</Text>
                  <View className={`match-card__level match-card__level--${m.level === '初级' ? 'beginner' : m.level === '中级' ? 'mid' : 'advanced'}`}>
                    <Text>{m.level}</Text>
                  </View>
                </View>

                <View className="match-card__host">
                  <View className="host-avatar" />
                  <Text className="host-name">{m.host}</Text>
                  <Text className="host-level">NTRP {m.hostLevel}</Text>
                </View>

                <View className="match-card__info">
                  <View className="info-row">
                    <Text className="info-icon">📍</Text>
                    <Text className="info-text">{m.location}</Text>
                  </View>
                  <View className="info-row">
                    <Text className="info-icon">🕐</Text>
                    <Text className="info-text">{m.time}</Text>
                  </View>
                </View>

                <View className="match-card__tags">
                  {m.tags.map((tag) => (
                    <View key={tag} className="tag-item"><Text>{tag}</Text></View>
                  ))}
                </View>

                <View className="match-card__footer">
                  <View className="footer-left">
                    <Text className="fee">¥{m.fee}</Text>
                    <Text className="fee-unit">/人</Text>
                  </View>
                  <View className="footer-right">
                    <View className="spots-bar">
                      <View className="spots-fill" style={{ width: `${(m.spots.current / m.spots.total) * 100}%` }} />
                    </View>
                    <Text className="spots-text">{m.spots.current}/{m.spots.total}人</Text>
                  </View>
                  <View
                    className={`join-btn ${joinedIds.includes(id) ? 'join-btn--joined' : ''}`}
                    onClick={(e) => handleJoin(e, m)}
                  >
                    <Text>{joinedIds.includes(id) ? '已加入' : '加入'}</Text>
                  </View>
                </View>
              </View>
            </View>
          )
        })}

        {matches.length === 0 && (
          <View className="empty-state">
            <Text>暂无{activeFilter === '全部' ? '' : activeFilter}约球活动</Text>
          </View>
        )}
      </View>
    </View>
  )
}
