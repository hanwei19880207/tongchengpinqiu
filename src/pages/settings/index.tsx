import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { clearUserCache } from '../../services/user'
import './index.scss'

export default function Settings() {
  const handleLogout = () => {
    Taro.showModal({
      title: '确认退出',
      content: '退出登录后需要重新登录才能使用完整功能',
      confirmText: '退出',
      confirmColor: '#E74C6F',
      success: (res) => {
        if (res.confirm) {
          clearUserCache()
          Taro.showToast({ title: '已退出登录', icon: 'success' })
          setTimeout(() => Taro.switchTab({ url: '/pages/profile/index' }), 1000)
        }
      },
    })
  }

  const handleClearCache = () => {
    Taro.showModal({
      title: '清除缓存',
      content: '将清除本地缓存数据（不会退出登录）',
      success: (res) => {
        if (res.confirm) {
          const openid = Taro.getStorageSync('openid')
          Taro.clearStorageSync()
          if (openid) Taro.setStorageSync('openid', openid)
          Taro.showToast({ title: '缓存已清除', icon: 'success' })
        }
      },
    })
  }

  const handleAbout = () => {
    Taro.showModal({
      title: '关于约球吧',
      content: '版本 1.0.0\n一个属于网球爱好者的社交平台',
      showCancel: false,
    })
  }

  return (
    <View className="settings">
      <View className="settings-group">
        <View className="settings-item" onClick={handleClearCache}>
          <Text className="item-icon">🗑️</Text>
          <Text className="item-label">清除缓存</Text>
          <Text className="item-arrow">›</Text>
        </View>
        <View className="settings-item" onClick={handleAbout}>
          <Text className="item-icon">ℹ️</Text>
          <Text className="item-label">关于</Text>
          <Text className="item-arrow">›</Text>
        </View>
      </View>

      <View className="logout-btn" onClick={handleLogout}>
        <Text>退出登录</Text>
      </View>
    </View>
  )
}
