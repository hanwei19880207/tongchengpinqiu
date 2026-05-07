import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { getUserFavoriteVenueIds, fetchVenueById } from '../../services/venue'
import { getFavoriteVenues } from '../../data/storage'
import { MOCK_VENUES } from '../../data/mock'
import { getVenueImage } from '../../data/images'
import type { Venue } from '../../types'
import './index.scss'

export default function MyFavorites() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const ids = await getUserFavoriteVenueIds()
        const results: Venue[] = []
        for (const id of ids) {
          const v = await fetchVenueById(id)
          if (v) results.push(v)
        }
        setVenues(results)
      } catch {
        const localIds = getFavoriteVenues()
        setVenues(MOCK_VENUES.filter(v => localIds.includes(v.id)))
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return <View className="my-favorites"><View className="loading"><Text>加载中...</Text></View></View>
  }

  return (
    <View className="my-favorites">
      {venues.length === 0 ? (
        <View className="empty-state">
          <Text className="empty-icon">📍</Text>
          <Text className="empty-text">还没有收藏场馆</Text>
          <View className="empty-btn" onClick={() => Taro.switchTab({ url: '/pages/venue/index' })}>
            <Text>去看看</Text>
          </View>
        </View>
      ) : (
        venues.map((v, idx) => {
          const id = v.id || (v as any)._id
          return (
            <View key={id} className="venue-item" onClick={() => Taro.navigateTo({ url: `/pages/venue-detail/index?id=${id}` })}>
              <Image className="venue-item__image" src={v.image || getVenueImage(idx)} mode="aspectFill" />
              <View className="venue-item__info">
                <Text className="venue-item__name">{v.name}</Text>
                <Text className="venue-item__address">📍 {v.address || v.distance}</Text>
                <View className="venue-item__meta">
                  <Text className="venue-item__rating">⭐ {v.rating}</Text>
                  <Text className="venue-item__price">¥{v.price}/小时</Text>
                </View>
              </View>
            </View>
          )
        })
      )}
    </View>
  )
}
