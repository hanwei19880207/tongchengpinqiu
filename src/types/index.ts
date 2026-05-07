export interface Comment {
  id: string
  author: string
  avatar: string
  content: string
  createdAt: string
}

export interface Post {
  id: string
  image: string
  title: string
  author: string
  avatar: string
  likes: number
  content?: string
  createdAt?: string
  comments?: Comment[]
  tags?: string[]
}

export interface Participant {
  id: string
  name: string
  avatar: string
  level: string
  openid?: string
}

export interface Match {
  id: string
  image: string
  title: string
  level: '初级' | '中级' | '高级'
  host: string
  hostLevel: string
  hostOpenid?: string
  location: string
  time: string
  spots: { current: number; total: number }
  fee: number
  tags: string[]
  description?: string
  participants?: Participant[]
  status?: 'upcoming' | 'completed'
}

export interface Venue {
  id: string
  name: string
  image: string
  rating: number
  reviews: number
  distance: string
  price: number
  tags: string[]
  scores: { env: number; service: number; value: number }
  address?: string
  phone?: string
  openHours?: string
  facilities?: string[]
  images?: string[]
  latitude?: number
  longitude?: number
}

export interface User {
  id: string
  name: string
  avatar: string
  level: string
  bio: string
  stats: { matches: number; rating: number; friends: number; badges: number }
}

export interface PublishForm {
  title: string
  sportType: string
  time: string
  venue: string
  maxPlayers: number
  fee: string
  description: string
}

export interface RatingScores {
  skill: number
  punctuality: number
  friendliness: number
}

export interface PeerRating {
  _id?: string
  matchId: string
  toOpenid: string
  fromName: string
  fromAvatar: string
  toName: string
  toAvatar: string
  scores: RatingScores
  comment?: string
  createdAt?: string
}

export interface AggregatedRating {
  skill: number
  punctuality: number
  friendliness: number
  count: number
}
