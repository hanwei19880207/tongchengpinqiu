import { useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Textarea } from '@tarojs/components'
import { submitRating } from '../../services/rating'
import { getOpenid } from '../../services/user'
import type { RatingScores } from '../../types'
import './index.scss'

const DIMENSIONS = [
  { key: 'skill', label: '技术水平', emoji: '🎾' },
  { key: 'punctuality', label: '守时靠谱', emoji: '⏰' },
  { key: 'friendliness', label: '态度友好', emoji: '😊' },
] as const

export default function RatePage() {
  const params = getCurrentInstance().router?.params || {}
  const matchId = params.matchId || ''
  const toOpenid = params.toOpenid || ''
  const toName = decodeURIComponent(params.toName || '')
  const toAvatar = decodeURIComponent(params.toAvatar || '')

  const [scores, setScores] = useState<RatingScores>({ skill: 7, punctuality: 7, friendliness: 7 })
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleScore = (key: keyof RatingScores, value: number) => {
    setScores(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      const openid = getOpenid()
      if (!openid) {
        Taro.showToast({ title: '请先登录', icon: 'none' })
        return
      }
      await submitRating({
        matchId,
        toOpenid,
        fromName: '我',
        fromAvatar: '🎾',
        toName,
        toAvatar,
        scores,
        comment,
      })
      Taro.showToast({ title: '评价成功', icon: 'success' })
      setTimeout(() => Taro.navigateBack(), 1500)
    } catch {
      Taro.showToast({ title: '提交失败', icon: 'none' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <View className="rate-page">
      <View className="rate-page__target">
        <View className="target-avatar"><Text>{toAvatar || '🎾'}</Text></View>
        <Text className="target-name">{toName || '球友'}</Text>
      </View>

      <View className="rate-page__scores">
        {DIMENSIONS.map(d => (
          <View key={d.key} className="score-row">
            <View className="score-label">
              <Text className="score-emoji">{d.emoji}</Text>
              <Text className="score-text">{d.label}</Text>
            </View>
            <View className="score-dots">
              {Array.from({ length: 10 }).map((_, i) => (
                <View
                  key={i}
                  className={`dot ${i < scores[d.key] ? 'dot--active' : ''}`}
                  onClick={() => handleScore(d.key, i + 1)}
                />
              ))}
            </View>
            <Text className="score-num">{scores[d.key]}</Text>
          </View>
        ))}
      </View>

      <View className="rate-page__comment">
        <Text className="comment-title">评语（选填）</Text>
        <Textarea
          className="comment-input"
          placeholder="说点什么..."
          value={comment}
          onInput={(e) => setComment(e.detail.value)}
          maxlength={100}
        />
      </View>

      <View className={`rate-page__submit ${submitting ? 'rate-page__submit--disabled' : ''}`} onClick={handleSubmit}>
        <Text>提交评价</Text>
      </View>
    </View>
  )
}
