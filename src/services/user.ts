import Taro from '@tarojs/taro'
import { usersCollection } from './db'
import type { User } from '../types'

const USER_KEY = 'current_user'

export async function login(): Promise<{ openid: string; isNew: boolean }> {
  const res = await Taro.cloud.callFunction({ name: 'login' })
  const result = res.result as { openid: string; isNew: boolean }
  Taro.setStorageSync('openid', result.openid)
  return result
}

export function getOpenid(): string {
  return Taro.getStorageSync('openid') || ''
}

export function isLoggedIn(): boolean {
  return !!getOpenid()
}

export async function getProfile(): Promise<User | null> {
  const cached = Taro.getStorageSync(USER_KEY)
  if (cached) return cached as User

  const openid = getOpenid()
  if (!openid) return null

  const { data } = await usersCollection().where({ _openid: openid }).get()
  if (data.length > 0) {
    const user = data[0] as any
    const profile: User = {
      id: user._id,
      name: user.nickName || '球友',
      avatar: user.avatarUrl || '',
      level: user.level || 'NTRP 2.5',
      bio: user.bio || '',
      stats: user.stats || { matches: 0, rating: 0, friends: 0, badges: 0 },
    }
    Taro.setStorageSync(USER_KEY, profile)
    return profile
  }
  return null
}

export async function updateProfile(data: Partial<{ nickName: string; avatarUrl: string; level: string; bio: string }>) {
  const openid = getOpenid()
  if (!openid) return

  const { data: users } = await usersCollection().where({ _openid: openid }).get()
  if (users.length > 0) {
    await usersCollection().doc(users[0]._id).update({ data })
    Taro.removeStorageSync(USER_KEY)
  }
}

export function clearUserCache() {
  Taro.removeStorageSync(USER_KEY)
  Taro.removeStorageSync('openid')
}
