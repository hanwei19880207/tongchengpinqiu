import { useState, useEffect } from 'react'
import Taro, { usePullDownRefresh } from '@tarojs/taro'
import { View, Text, Image, Input, Picker } from '@tarojs/components'
import { fetchVenues } from '../../services/venue'
import { MOCK_VENUES } from '../../data/mock'
import { getVenueImage } from '../../data/images'
import type { Venue } from '../../types'
import './index.scss'

const QUICK_FILTERS = [
  { icon: '🏟️', label: '全部', value: '全部' },
  { icon: '🏠', label: '室内', value: '室内' },
  { icon: '🌳', label: '室外', value: '室外' },
  { icon: '⭐', label: '高分', value: '高分' },
  { icon: '💰', label: '平价', value: '平价' },
]

const AREAS = ['全城', '朝阳区', '海淀区', '东城区', '丰台区', '顺义区']

export default function VenuePage() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [activeFilter, setActiveFilter] = useState('全部')
  const [useCloud, setUseCloud] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [searching, setSearching] = useState(false)
  const [area, setArea] = useState('全城')

  const loadVenues = async (filter: string) => {
    try {
      if (useCloud) {
        const data = await Promise.race([
          fetchVenues(filter),
          new Promise<Venue[]>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
        ])
        if (data.length === 0 && filter === '全部') throw new Error('empty')
        setVenues(data)
        return
      }
    } catch {
      setUseCloud(false)
    }
    const filtered = MOCK_VENUES.filter(v => {
      if (filter === '全部') return true
      if (filter === '高分') return v.rating >= 8.5
      if (filter === '平价') return v.price <= 70
      return v.tags.includes(filter)
    })
    setVenues(filtered)
  }

  useEffect(() => {
    if (!searching) loadVenues(activeFilter)
  }, [activeFilter])

  usePullDownRefresh(() => {
    setKeyword('')
    setSearching(false)
    loadVenues(activeFilter).then(() => Taro.stopPullDownRefresh())
  })

  const handleSearch = () => {
    const kw = keyword.trim()
    if (!kw) {
      setSearching(false)
      loadVenues(activeFilter)
      return
    }
    setSearching(true)
    const filtered = MOCK_VENUES.filter(v =>
      v.name.includes(kw) || (v.address && v.address.includes(kw)) || v.tags.some(t => t.includes(kw))
    )
    setVenues(filtered)
  }

  const handleCardTap = (id: string) => {
    Taro.navigateTo({ url: `/pages/venue-detail/index?id=${id}&source=${useCloud ? 'cloud' : 'mock'}` })
  }

  const handleBook = (e, v: Venue) => {
    e.stopPropagation()
    if (!v.phone) {
      Taro.navigateTo({ url: `/pages/venue-detail/index?id=${v.id || (v as any)._id}&source=${useCloud ? 'cloud' : 'mock'}` })
      return
    }
    Taro.showActionSheet({
      itemList: ['电话预约', '查看详情'],
      success: (res) => {
        if (res.tapIndex === 0) {
          Taro.makePhoneCall({ phoneNumber: v.phone! })
        } else {
          Taro.navigateTo({ url: `/pages/venue-detail/index?id=${v.id || (v as any)._id}&source=${useCloud ? 'cloud' : 'mock'}` })
        }
      },
    })
  }

  const handleAreaChange = (e) => {
    const selected = AREAS[e.detail.value]
    setArea(selected)
    if (selected === '全城') {
      setSearching(false)
      loadVenues(activeFilter)
    } else {
      setSearching(true)
      const filtered = MOCK_VENUES.filter(v => v.address && v.address.includes(selected))
      setVenues(filtered)
    }
  }

  return (
    <View className="venue">
      <View className="search-bar">
        <Text className="search-icon">🔍</Text>
        <Input
          className="search-input"
          placeholder="搜索附近场馆..."
          value={keyword}
          onInput={(e) => setKeyword(e.detail.value)}
          confirmType="search"
          onConfirm={handleSearch}
        />
        <Picker mode="selector" range={AREAS} value={AREAS.indexOf(area)} onChange={handleAreaChange}>
          <View className="search-location">
            <Text>📍 {area}</Text>
          </View>
        </Picker>
      </View>

      <View className="quick-filters">
        {QUICK_FILTERS.map(f => (
          <View
            key={f.value}
            className={`qf-item ${activeFilter === f.value ? 'qf-item--active' : ''}`}
            onClick={() => setActiveFilter(f.value)}
          >
            <Text className="qf-icon">{f.icon}</Text>
            <Text className="qf-label">{f.label}</Text>
          </View>
        ))}
      </View>

      <View className="venue-list">
        {venues.map((v, index) => {
          const id = v.id || (v as any)._id
          return (
            <View key={id} className="venue-card" onClick={() => handleCardTap(id)}>
              <View className="venue-card__hero">
                <Image className="venue-card__image" src={v.image || getVenueImage(id)} mode="aspectFill" />
                <View className="venue-card__overlay">
                  <View className="venue-card__badge">
                    <Text className="badge-score">{v.rating}</Text>
                    <Text className="badge-label">{v.rating >= 9 ? '极力推荐' : v.rating >= 8.5 ? '强烈推荐' : '值得一去'}</Text>
                  </View>
                  {index === 0 && <View className="venue-card__hot"><Text>🔥 热门</Text></View>}
                </View>
              </View>

              <View className="venue-card__content">
                <Text className="venue-card__name">{v.name}</Text>

                <View className="venue-card__ratings">
                  <View className="rating-item">
                    <Text className="rating-label">环境</Text>
                    <View className="rating-bar">
                      <View className="rating-fill" style={{ width: `${v.scores.env * 10}%` }} />
                    </View>
                    <Text className="rating-num">{v.scores.env}</Text>
                  </View>
                  <View className="rating-item">
                    <Text className="rating-label">服务</Text>
                    <View className="rating-bar">
                      <View className="rating-fill rating-fill--green" style={{ width: `${v.scores.service * 10}%` }} />
                    </View>
                    <Text className="rating-num">{v.scores.service}</Text>
                  </View>
                  <View className="rating-item">
                    <Text className="rating-label">性价比</Text>
                    <View className="rating-bar">
                      <View className="rating-fill rating-fill--blue" style={{ width: `${v.scores.value * 10}%` }} />
                    </View>
                    <Text className="rating-num">{v.scores.value}</Text>
                  </View>
                </View>

                <View className="venue-card__tags">
                  {v.tags.map((tag) => (
                    <View key={tag} className="v-tag"><Text>{tag}</Text></View>
                  ))}
                </View>

                <View className="venue-card__footer">
                  <View className="footer-info">
                    <Text className="venue-distance">📍 {v.distance}</Text>
                    <Text className="venue-reviews">{v.reviews}条评价</Text>
                  </View>
                  <View className="footer-action">
                    <Text className="venue-price">¥{v.price}</Text>
                    <Text className="venue-price-unit">/小时</Text>
                    <View className="book-btn" onClick={(e) => handleBook(e, v)}><Text>预约</Text></View>
                  </View>
                </View>
              </View>
            </View>
          )
        })}

        {venues.length === 0 && (
          <View className="empty-state">
            <Text>暂无符合条件的场馆</Text>
          </View>
        )}
      </View>
    </View>
  )
}
