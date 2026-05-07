import { useState, useEffect } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { fetchMatchById, getUserJoinedMatchIds, joinMatchCloud, completeMatch, isMatchHost, isMatchCompleted } from '../../services/match'
import { getMyRatingsForMatch } from '../../services/rating'
import { getOpenid } from '../../services/user'
import { getMatchById } from '../../data/mock'
import { getJoinedMatches, joinMatch as joinMatchLocal } from '../../data/storage'
import { getMatchImage } from '../../data/images'
import type { Match } from '../../types'
import './index.scss'

export default function MatchDetail() {
  const [match, setMatch] = useState<Match | null>(null)
  const [joined, setJoined] = useState(false)
  const [useCloud, setUseCloud] = useState(true)
  const [ratedOpenids, setRatedOpenids] = useState<string[]>([])

  useEffect(() => {
    const params = getCurrentInstance().router?.params
    const id = params?.id
    if (!id) return
    const source = params?.source

    const load = async () => {
      if (source !== 'mock') {
        try {
          const data = await Promise.race([
            fetchMatchById(id),
            new Promise<null>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
          ])
          if (data) {
            setMatch(data)
            try {
              const joinedIds = await getUserJoinedMatchIds()
              setJoined(joinedIds.includes(id))
              if (data.status === 'completed') {
                const myRatings = await getMyRatingsForMatch(id)
                setRatedOpenids(myRatings.map(r => r.toOpenid))
              }
            } catch {}
            return
          }
        } catch {}
      }
      const data = getMatchById(id)
      if (data) {
        setMatch(data)
        setJoined(getJoinedMatches().includes(id))
      }
    }
    load()
  }, [])

  const handleJoin = async () => {
    if (!match || joined) return
    const id = match.id || (match as any)._id
    if (match.spots.current >= match.spots.total) {
      Taro.showToast({ title: '名额已满', icon: 'none' })
      return
    }
    try {
      if (useCloud) {
        await joinMatchCloud(id, { name: '我', avatar: '🎾', level: '3.5' })
        setMatch({ ...match, spots: { ...match.spots, current: match.spots.current + 1 } })
        setJoined(true)
        Taro.showToast({ title: '加入成功！', icon: 'success' })
        return
      }
    } catch {}
    joinMatchLocal(id)
    setMatch({ ...match, spots: { ...match.spots, current: match.spots.current + 1 } })
    setJoined(true)
    Taro.showToast({ title: '加入成功！', icon: 'success' })
  }

  const handleComplete = async () => {
    if (!match) return
    const id = match.id || (match as any)._id
    try {
      await completeMatch(id)
      setMatch({ ...match, status: 'completed' })
      Taro.showToast({ title: '已标记完成', icon: 'success' })
    } catch {
      Taro.showToast({ title: '操作失败', icon: 'none' })
    }
  }

  const handleRate = (participant: { openid?: string; name: string; avatar: string }) => {
    if (!match || !participant.openid) return
    const matchId = match.id || (match as any)._id
    Taro.navigateTo({
      url: `/pages/rate/index?matchId=${matchId}&toOpenid=${participant.openid}&toName=${encodeURIComponent(participant.name)}&toAvatar=${encodeURIComponent(participant.avatar)}`,
    })
  }

  if (!match) {
    return (
      <View className="match-detail">
        <View className="loading"><Text>加载中...</Text></View>
      </View>
    )
  }

  const levelClass = match.level === '初级' ? 'beginner' : match.level === '中级' ? 'mid' : 'advanced'
  const emptySlots = match.spots.total - (match.participants?.length || 0)
  const completed = isMatchCompleted(match)
  const canComplete = useCloud && isMatchHost(match) && !completed
  const myOpenid = getOpenid()

  return (
    <View className="match-detail">
      <Image className="match-detail__hero" src={match.image || getMatchImage(match.id || (match as any)._id || '0')} mode="aspectFill" />

      <View className="match-detail__body">
        <View className="match-detail__header">
          <Text className="match-detail__title">{match.title}</Text>
          <View className={`level-badge level-badge--${levelClass}`}>
            <Text>{match.level}</Text>
          </View>
        </View>

        {completed && (
          <View className="match-detail__status">
            <Text>✅ 比赛已结束</Text>
          </View>
        )}

        <View className="match-detail__host-card">
          <View className="host-avatar-lg" />
          <View className="host-info">
            <Text className="host-name">{match.host}</Text>
            <Text className="host-rating">NTRP {match.hostLevel}</Text>
          </View>
          <Text className="host-label">发起人</Text>
        </View>

        <View className="match-detail__info">
          <View className="info-row">
            <Text className="info-icon">📍</Text>
            <Text className="info-label">地点</Text>
            <Text className="info-value">{match.location}</Text>
          </View>
          <View className="info-row">
            <Text className="info-icon">🕐</Text>
            <Text className="info-label">时间</Text>
            <Text className="info-value">{match.time}</Text>
          </View>
          <View className="info-row">
            <Text className="info-icon">💰</Text>
            <Text className="info-label">费用</Text>
            <Text className="info-value">¥{match.fee}/人</Text>
          </View>
          <View className="info-row">
            <Text className="info-icon">👥</Text>
            <Text className="info-label">名额</Text>
            <Text className="info-value">{match.spots.current}/{match.spots.total}人</Text>
          </View>
        </View>

        <View className="match-detail__tags">
          {match.tags.map(tag => (
            <View key={tag} className="tag-chip"><Text>{tag}</Text></View>
          ))}
        </View>

        {match.description && (
          <View className="match-detail__desc">
            <Text className="desc-title">活动说明</Text>
            <Text className="desc-text">{match.description}</Text>
          </View>
        )}

        <View className="match-detail__participants">
          <Text className="participants-title">参与球友 ({match.participants?.length || 0}/{match.spots.total})</Text>
          <View className="participants-grid">
            {match.participants?.map(p => (
              <View key={p.id || p.openid} className="participant">
                <View className="participant-avatar"><Text>{p.avatar}</Text></View>
                <Text className="participant-name">{p.name}</Text>
                <Text className="participant-level">{p.level}</Text>
                {completed && p.openid && p.openid !== myOpenid && (
                  <View
                    className={`rate-btn ${ratedOpenids.includes(p.openid) ? 'rate-btn--done' : ''}`}
                    onClick={() => handleRate(p)}
                  >
                    <Text>{ratedOpenids.includes(p.openid) ? '已评' : '评价'}</Text>
                  </View>
                )}
              </View>
            ))}
            {Array.from({ length: emptySlots }).map((_, i) => (
              <View key={`empty-${i}`} className="participant participant--empty">
                <View className="participant-avatar participant-avatar--empty"><Text>?</Text></View>
                <Text className="participant-name">等你加入</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className="match-detail__bar">
        {canComplete ? (
          <View className="bar-btn bar-btn--complete" onClick={handleComplete}>
            <Text>完成比赛</Text>
          </View>
        ) : (
          <>
            <View className="bar-price">
              <Text className="price-amount">¥{match.fee}</Text>
              <Text className="price-unit">/人</Text>
            </View>
            <View
              className={`bar-btn ${joined ? 'bar-btn--joined' : ''} ${match.spots.current >= match.spots.total ? 'bar-btn--full' : ''}`}
              onClick={handleJoin}
            >
              <Text>{joined ? '已加入' : match.spots.current >= match.spots.total ? '名额已满' : '加入约球'}</Text>
            </View>
          </>
        )}
      </View>
    </View>
  )
}
