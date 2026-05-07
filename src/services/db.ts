import Taro from '@tarojs/taro'

let _db: any = null

export function getDb() {
  if (!_db) {
    _db = Taro.cloud.database()
  }
  return _db
}

export const _ = () => getDb().command

export function postsCollection() {
  return getDb().collection('posts')
}

export function matchesCollection() {
  return getDb().collection('matches')
}

export function venuesCollection() {
  return getDb().collection('venues')
}

export function usersCollection() {
  return getDb().collection('users')
}

export function actionsCollection() {
  return getDb().collection('user_actions')
}

export function ratingsCollection() {
  return getDb().collection('ratings')
}
