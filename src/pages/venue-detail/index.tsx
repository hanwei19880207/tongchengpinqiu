import { useState, useEffect } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import { fetchVenueById, toggleFavoriteVenueCloud, getUserFavoriteVenueIds } from '../../services/venue'
import { getVenueById } from '../../data/mock'
import { getFavoriteVenues, toggleFavoriteVenue } from '../../data/storage'
import { getVenueImages } from '../../data/images'
import type { Venue } from '../../types'
import './index.scss'

export default function VenueDetail() {
  const [venue, setVenue] = useState<Venue | null>(null)
  const [favorited, setFavorited] = useState(false)
  const [useCloud, setUseCloud] = useState(true)

  useEffect(() => {
    const params = getCurrentInstance().router?.params
    const id = params?.id
    if (!id) return
    const source = params?.source

    const load = async () => {
      if (source !== 'mock') {
        try {
          const data = await Promise.race([
            fetchVenueById(id),
            new Promise<null>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
          ])
          if (data) {
            setVenue(data)
            try {
              const favIds = await getUserFavoriteVenueIds()
              setFavorited(favIds.includes(id))
            } catch {}
            return
          }
        } catch {}
      }
      const data = getVenueById(id)
      if (data) {
        setVenue(data)
        setFavorited(getFavoriteVenues().includes(id))
      }
    }
    load()
  }, [])

  const handleFavorite = async () => {
    if (!venue) return
    const id = venue.id || (venue as any)._id
    try {
      if (useCloud) {
        const isFav = await toggleFavoriteVenueCloud(id)
        setFavorited(isFav)
        Taro.showToast({ title: isFav ? '已收藏' : '已取消收藏', icon: 'none' })
        return
      }
    } catch {}
    toggleFavoriteVenue(id)
    setFavorited(!favorited)
    Taro.showToast({ title: favorited ? '已取消收藏' : '已收藏', icon: 'none' })
  }

  const handleCall = () => {
    if (!venue?.phone) return
    Taro.makePhoneCall({ phoneNumber: venue.phone })
  }

  const handleNavigate = () => {
    if (!venue?.address) return
    Taro.openLocation({
      latitude: venue.latitude || 39.9,
      longitude: venue.longitude || 116.4,
      name: venue.name,
      address: venue.address,
      scale: 15,
    })
  }

  const handleBook = () => {
    if (!venue?.phone) {
      Taro.showToast({ title: '暂无联系电话', icon: 'none' })
      return
    }
    Taro.showActionSheet({
      itemList: ['电话预约', '导航到场馆'],
      success: (res) => {
        if (res.tapIndex === 0) {
          Taro.makePhoneCall({ phoneNumber: venue.phone! })
        } else if (res.tapIndex === 1) {
          handleNavigate()
        }
      },
    })
  }

  if (!venue) {
    return (
      <View className="venue-detail">
        <View className="loading"><Text>加载中...</Text></View>
      </View>
    )
  }

  const swiperImages = (venue.images && venue.images.length > 0 && venue.images[0])
    ? venue.images
    : getVenueImages(venue.id || (venue as any)._id || '0')

  return (
    <View className="venue-detail">
      <Swiper className="venue-detail__swiper" indicatorDots autoplay circular>
        {swiperImages.map((img, i) => (
          <SwiperItem key={i}>
            <Image className="swiper-img" src={img} mode="aspectFill" />
          </SwiperItem>
        ))}
      </Swiper>

      <View className="venue-detail__body">
        <View className="venue-detail__name-row">
          <Text className="venue-name">{venue.name}</Text>
          <View className={`fav-btn ${favorited ? 'fav-btn--active' : ''}`} onClick={handleFavorite}>
            <Text>{favorited ? '♥' : '♡'}</Text>
          </View>
        </View>

        <View className="venue-detail__rating-card">
          <View className="rating-big">
            <Text className="rating-score">{venue.rating}</Text>
            <View className="rating-stars">
              <Text className="stars">{'★'.repeat(Math.round(venue.rating / 2))}{'☆'.repeat(5 - Math.round(venue.rating / 2))}</Text>
              <Text className="review-count">{venue.reviews}条评价</Text>
            </View>
          </View>
          <View className="rating-bars">
            <View className="bar-row">
              <Text className="bar-label">环境</Text>
              <View className="bar-track">
                <View className="bar-fill" style={{ width: `${venue.scores.env * 10}%` }} />
              </View>
              <Text className="bar-num">{venue.scores.env}</Text>
            </View>
            <View className="bar-row">
              <Text className="bar-label">服务</Text>
              <View className="bar-track">
                <View className="bar-fill bar-fill--green" style={{ width: `${venue.scores.service * 10}%` }} />
              </View>
              <Text className="bar-num">{venue.scores.service}</Text>
            </View>
            <View className="bar-row">
              <Text className="bar-label">性价比</Text>
              <View className="bar-track">
                <View className="bar-fill bar-fill--purple" style={{ width: `${venue.scores.value * 10}%` }} />
              </View>
              <Text className="bar-num">{venue.scores.value}</Text>
            </View>
          </View>
        </View>

        <View className="venue-detail__info">
          {venue.address && (
            <View className="info-row" onClick={handleNavigate}>
              <Text className="info-icon">📍</Text>
              <Text className="info-text info-text--link">{venue.address}</Text>
              <Text className="info-nav">导航 ›</Text>
            </View>
          )}
          {venue.phone && (
            <View className="info-row" onClick={handleCall}>
              <Text className="info-icon">📞</Text>
              <Text className="info-text info-text--link">{venue.phone}</Text>
            </View>
          )}
          {venue.openHours && (
            <View className="info-row">
              <Text className="info-icon">🕐</Text>
              <Text className="info-text">{venue.openHours}</Text>
            </View>
          )}
          <View className="info-row">
            <Text className="info-icon">💰</Text>
            <Text className="info-text">¥{venue.price}/小时</Text>
          </View>
        </View>

        {venue.facilities && venue.facilities.length > 0 && (
          <View className="venue-detail__facilities">
            <Text className="section-title">场馆设施</Text>
            <View className="facility-grid">
              {venue.facilities.map(f => (
                <View key={f} className="facility-chip"><Text>{f}</Text></View>
              ))}
            </View>
          </View>
        )}

        <View className="venue-detail__tags">
          {venue.tags.map(tag => (
            <View key={tag} className="tag-chip"><Text>{tag}</Text></View>
          ))}
        </View>
      </View>

      <View className="venue-detail__bar">
        <View className="bar-call" onClick={handleCall}>
          <Text>📞 电话</Text>
        </View>
        <View className="bar-book" onClick={handleBook}>
          <Text>立即预约</Text>
        </View>
      </View>
    </View>
  )
}
