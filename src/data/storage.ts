import Taro from '@tarojs/taro'

const LIKED_POSTS_KEY = 'liked_posts'
const FAVORITE_VENUES_KEY = 'favorite_venues'
const JOINED_MATCHES_KEY = 'joined_matches'
const BOOKMARKED_POSTS_KEY = 'bookmarked_posts'

export function getLikedPosts(): string[] {
  return Taro.getStorageSync(LIKED_POSTS_KEY) || []
}

export function toggleLikePost(id: string): boolean {
  const liked = getLikedPosts()
  const idx = liked.indexOf(id)
  if (idx > -1) {
    liked.splice(idx, 1)
  } else {
    liked.push(id)
  }
  Taro.setStorageSync(LIKED_POSTS_KEY, liked)
  return idx === -1
}

export function getBookmarkedPosts(): string[] {
  return Taro.getStorageSync(BOOKMARKED_POSTS_KEY) || []
}

export function toggleBookmarkPost(id: string): boolean {
  const bookmarks = getBookmarkedPosts()
  const idx = bookmarks.indexOf(id)
  if (idx > -1) {
    bookmarks.splice(idx, 1)
  } else {
    bookmarks.push(id)
  }
  Taro.setStorageSync(BOOKMARKED_POSTS_KEY, bookmarks)
  return idx === -1
}

export function getFavoriteVenues(): string[] {
  return Taro.getStorageSync(FAVORITE_VENUES_KEY) || []
}

export function toggleFavoriteVenue(id: string): boolean {
  const favs = getFavoriteVenues()
  const idx = favs.indexOf(id)
  if (idx > -1) {
    favs.splice(idx, 1)
  } else {
    favs.push(id)
  }
  Taro.setStorageSync(FAVORITE_VENUES_KEY, favs)
  return idx === -1
}

export function getJoinedMatches(): string[] {
  return Taro.getStorageSync(JOINED_MATCHES_KEY) || []
}

export function joinMatch(id: string): void {
  const joined = getJoinedMatches()
  if (!joined.includes(id)) {
    joined.push(id)
    Taro.setStorageSync(JOINED_MATCHES_KEY, joined)
  }
}
