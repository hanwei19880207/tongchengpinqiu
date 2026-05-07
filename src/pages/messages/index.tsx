import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { fetchNotifications, Notification } from '../../services/notification'
import './index.scss'

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'like', title: '收到点赞', content: '张鹏飞 赞了你的动态"周末约球"', time: '5分钟前', read: false, targetId: '1' },
  { id: '2', type: 'comment', title: '新评论', content: '李思远 评论了你的动态"正手技巧分享"', time: '30分钟前', read: false, targetId: '2' },
  { id: '3', type: 'match', title: '约球提醒', content: '你参加的"周六下午奥体约球"即将开始', time: '1小时前', read: false, targetId: '1' },
  { id: '4', type: 'system', title: '系统通知', content: '欢迎使用约球吧！完善资料获得更多关注', time: '昨天', read: true },
  { id: '5', type: 'like', title: '收到点赞', content: '王晓琳 赞了你的动态', time: '2天前', read: true, targetId: '3' },
]

const ICONS: Record<string, string> = {
  like: '❤️',
  comment: '💬',
  match: '🎾',
  system: '📢',
}

export default function Messages() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const data = await Promise.race([
          fetchNotifications(),
          new Promise<Notification[]>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
        ])
        if (data.length > 0) {
          setNotifications(data)
          return
        }
      } catch {}
      setNotifications(MOCK_NOTIFICATIONS)
    }
    load()
  }, [])

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    Taro.showToast({ title: '全部已读', icon: 'success' })
  }

  const handleTap = (n: Notification) => {
    setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item))
    if (!n.targetId) return
    if (n.type === 'like' || n.type === 'comment') {
      Taro.navigateTo({ url: `/pages/post-detail/index?id=${n.targetId}&source=cloud` })
    } else if (n.type === 'match') {
      Taro.navigateTo({ url: `/pages/match-detail/index?id=${n.targetId}&source=cloud` })
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <View className="messages">
      <View className="messages-header">
        <Text className="header-title">消息 {unreadCount > 0 ? `(${unreadCount})` : ''}</Text>
        {unreadCount > 0 && (
          <View className="mark-read" onClick={markAllRead}>
            <Text>全部已读</Text>
          </View>
        )}
      </View>

      {notifications.length === 0 ? (
        <View className="empty-state">
          <Text className="empty-icon">📭</Text>
          <Text className="empty-text">暂无消息</Text>
        </View>
      ) : (
        <View className="notification-list">
          {notifications.map(n => (
            <View key={n.id} className={`notification-item ${!n.read ? 'notification-item--unread' : ''}`} onClick={() => handleTap(n)}>
              <Text className="notification-icon">{ICONS[n.type]}</Text>
              <View className="notification-body">
                <Text className="notification-title">{n.title}</Text>
                <Text className="notification-content">{n.content}</Text>
                <Text className="notification-time">{n.time}</Text>
              </View>
              {!n.read && <View className="unread-dot" />}
            </View>
          ))}
        </View>
      )}
    </View>
  )
}
