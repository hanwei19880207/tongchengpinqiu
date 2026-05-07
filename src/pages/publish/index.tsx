import { useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Text, Input, Textarea, Image, Picker } from '@tarojs/components'
import { createMatch } from '../../services/match'
import { getProfile, isLoggedIn, getOpenid } from '../../services/user'
import type { User } from '../../types'
import './index.scss'

const SPORT_TYPES = ['网球', '羽毛球', '乒乓球']
const LEVELS: Array<'初级' | '中级' | '高级'> = ['初级', '中级', '高级']
const VENUE_OPTIONS = [
  '国家网球中心', '光彩体育馆网球场', '望京南湖网球馆',
  '朝阳公园网球中心', '奥林匹克森林公园网球场', '天坛体育活动中心',
  '匠心之轮网球俱乐部', '中关村网球场', '其他',
]

export default function Publish() {
  const [title, setTitle] = useState('')
  const [sportType, setSportType] = useState('网球')
  const [level, setLevel] = useState<'初级' | '中级' | '高级'>('中级')
  const [date, setDate] = useState('')
  const [timeStart, setTimeStart] = useState('')
  const [timeEnd, setTimeEnd] = useState('')
  const [venue, setVenue] = useState('')
  const [maxPlayers, setMaxPlayers] = useState(4)
  const [fee, setFee] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [image, setImage] = useState('')
  const [user, setUser] = useState<User | null>(null)

  useDidShow(() => {
    if (isLoggedIn()) {
      getProfile().then(p => { if (p) setUser(p) })
    }
  })

  const handleChooseImage = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        setImage(res.tempFilePaths[0])
      },
    })
  }

  const handleSubmit = async () => {
    if (!isLoggedIn()) {
      Taro.showToast({ title: '请先在"我的"页面登录', icon: 'none' })
      return
    }
    if (!title.trim()) {
      Taro.showToast({ title: '请填写标题', icon: 'none' })
      return
    }
    if (submitting) return
    setSubmitting(true)

    const openid = getOpenid()
    const hostName = user?.name || '球友'
    const hostLevel = user?.level?.replace('NTRP ', '') || '3.0'
    const hostAvatar = '🎾'
    const timeStr = date && timeStart ? `${date} ${timeStart}${timeEnd ? '-' + timeEnd : ''}` : '待定'

    let uploadedImage = ''
    if (image) {
      try {
        const ext = image.split('.').pop() || 'jpg'
        const cloudPath = `match-images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const uploadRes = await Taro.cloud.uploadFile({ cloudPath, filePath: image })
        uploadedImage = uploadRes.fileID
      } catch {}
    }

    try {
      await createMatch({
        image: uploadedImage,
        title: title.trim(),
        level,
        host: hostName,
        hostLevel,
        hostOpenid: openid,
        location: venue || '待定',
        time: timeStr,
        spots: { current: 1, total: maxPlayers },
        fee: Number(fee) || 0,
        tags: [sportType, level],
        description,
        participants: [{ id: openid, name: hostName, avatar: hostAvatar, level: hostLevel, openid }],
      })
      Taro.showToast({ title: '发布成功！', icon: 'success' })
      setTitle('')
      setDate('')
      setTimeStart('')
      setTimeEnd('')
      setVenue('')
      setFee('')
      setDescription('')
      setMaxPlayers(4)
      setImage('')
    } catch {
      Taro.showToast({ title: '发布失败，请重试', icon: 'none' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <View className="publish">
      <View className="form-section">
        <Text className="form-label">封面图片</Text>
        <View className="image-picker" onClick={handleChooseImage}>
          {image ? (
            <Image className="preview-image" src={image} mode="aspectFill" />
          ) : (
            <View className="image-placeholder">
              <Text className="placeholder-icon">📷</Text>
              <Text className="placeholder-text">点击上传</Text>
            </View>
          )}
        </View>
      </View>

      <View className="form-section">
        <Text className="form-label">约球标题</Text>
        <Input
          className="form-input"
          placeholder="例：周六下午约球，中级水平"
          value={title}
          onInput={(e) => setTitle(e.detail.value)}
        />
      </View>

      <View className="form-section">
        <Text className="form-label">运动类型</Text>
        <View className="type-chips">
          {SPORT_TYPES.map(type => (
            <View
              key={type}
              className={`type-chip ${sportType === type ? 'type-chip--active' : ''}`}
              onClick={() => setSportType(type)}
            >
              <Text>{type}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="form-section">
        <Text className="form-label">水平要求</Text>
        <View className="type-chips">
          {LEVELS.map(lv => (
            <View
              key={lv}
              className={`type-chip ${level === lv ? 'type-chip--active' : ''}`}
              onClick={() => setLevel(lv)}
            >
              <Text>{lv}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="form-section">
        <Text className="form-label">日期</Text>
        <Picker mode="date" onChange={(e) => setDate(e.detail.value)}>
          <View className="form-picker">
            <Text className={`picker-text ${date ? 'picker-text--selected' : ''}`}>{date || '选择日期'}</Text>
          </View>
        </Picker>
      </View>

      <View className="form-section">
        <Text className="form-label">时间</Text>
        <View className="time-row">
          <Picker mode="time" onChange={(e) => setTimeStart(e.detail.value)}>
            <View className="form-picker form-picker--half">
              <Text className={`picker-text ${timeStart ? 'picker-text--selected' : ''}`}>{timeStart || '开始时间'}</Text>
            </View>
          </Picker>
          <Text className="time-sep">至</Text>
          <Picker mode="time" onChange={(e) => setTimeEnd(e.detail.value)}>
            <View className="form-picker form-picker--half">
              <Text className={`picker-text ${timeEnd ? 'picker-text--selected' : ''}`}>{timeEnd || '结束时间'}</Text>
            </View>
          </Picker>
        </View>
      </View>

      <View className="form-section">
        <Text className="form-label">场馆</Text>
        <Picker mode="selector" range={VENUE_OPTIONS} onChange={(e) => setVenue(VENUE_OPTIONS[Number(e.detail.value)])}>
          <View className="form-picker">
            <Text className={`picker-text ${venue ? 'picker-text--selected' : ''}`}>{venue || '选择场馆'}</Text>
          </View>
        </Picker>
      </View>

      <View className="form-section">
        <Text className="form-label">人数</Text>
        <View className="number-row">
          <View className="num-btn" onClick={() => setMaxPlayers(Math.max(2, maxPlayers - 1))}>
            <Text>-</Text>
          </View>
          <Text className="num-value">{maxPlayers}</Text>
          <View className="num-btn" onClick={() => setMaxPlayers(Math.min(10, maxPlayers + 1))}>
            <Text>+</Text>
          </View>
        </View>
      </View>

      <View className="form-section">
        <Text className="form-label">费用（每人）</Text>
        <Input
          className="form-input"
          placeholder="¥0 表示免费"
          type="digit"
          value={fee}
          onInput={(e) => setFee(e.detail.value)}
        />
      </View>

      <View className="form-section">
        <Text className="form-label">补充说明</Text>
        <Textarea
          className="form-textarea"
          placeholder="水平要求、自带装备等..."
          value={description}
          onInput={(e) => setDescription(e.detail.value)}
        />
      </View>

      <View className={`submit-btn ${submitting ? 'submit-btn--disabled' : ''}`} onClick={handleSubmit}>
        <Text>{submitting ? '发布中...' : '发布约球'}</Text>
      </View>
    </View>
  )
}
