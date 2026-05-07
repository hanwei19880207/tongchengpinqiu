import { ratingsCollection } from './db'
import { getOpenid } from './user'
import type { PeerRating, RatingScores, AggregatedRating } from '../types'

export async function submitRating(params: {
  matchId: string
  toOpenid: string
  fromName: string
  fromAvatar: string
  toName: string
  toAvatar: string
  scores: RatingScores
  comment?: string
}): Promise<void> {
  const openid = getOpenid()
  if (!openid) throw new Error('not logged in')
  const { data: existing } = await ratingsCollection()
    .where({ matchId: params.matchId, toOpenid: params.toOpenid, _openid: openid })
    .limit(1)
    .get()
  if (existing.length > 0) throw new Error('already rated')
  await ratingsCollection().add({
    data: {
      matchId: params.matchId,
      toOpenid: params.toOpenid,
      fromName: params.fromName,
      fromAvatar: params.fromAvatar,
      toName: params.toName,
      toAvatar: params.toAvatar,
      scores: params.scores,
      comment: params.comment || '',
      createdAt: new Date().toISOString(),
    },
  })
}

export async function getMyRatingsForMatch(matchId: string): Promise<PeerRating[]> {
  const openid = getOpenid()
  if (!openid) return []
  const { data } = await ratingsCollection()
    .where({ matchId, _openid: openid })
    .get()
  return data as PeerRating[]
}

export async function fetchRatingsForUser(openid: string): Promise<PeerRating[]> {
  const { data } = await ratingsCollection()
    .where({ toOpenid: openid })
    .orderBy('createdAt', 'desc')
    .get()
  return data as PeerRating[]
}

export function computeAggregatedRating(ratings: PeerRating[]): AggregatedRating {
  if (ratings.length === 0) {
    return { skill: 0, punctuality: 0, friendliness: 0, count: 0 }
  }
  const sum = ratings.reduce(
    (acc, r) => ({
      skill: acc.skill + r.scores.skill,
      punctuality: acc.punctuality + r.scores.punctuality,
      friendliness: acc.friendliness + r.scores.friendliness,
    }),
    { skill: 0, punctuality: 0, friendliness: 0 }
  )
  const count = ratings.length
  return {
    skill: Math.round((sum.skill / count) * 10) / 10,
    punctuality: Math.round((sum.punctuality / count) * 10) / 10,
    friendliness: Math.round((sum.friendliness / count) * 10) / 10,
    count,
  }
}

export async function fetchMyGivenRatings(): Promise<PeerRating[]> {
  const openid = getOpenid()
  if (!openid) return []
  const { data } = await ratingsCollection()
    .where({ _openid: openid })
    .orderBy('createdAt', 'desc')
    .get()
  return data as PeerRating[]
}
