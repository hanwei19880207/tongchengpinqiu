import { matchesCollection, actionsCollection, getDb } from './db'
import { getOpenid } from './user'
import type { Match } from '../types'

function formatDate(val: any): string {
  if (!val) return ''
  if (typeof val === 'string') return val
  if (val instanceof Date) {
    const m = val.getMonth() + 1
    const d = val.getDate()
    return `${m}月${d}日`
  }
  if (val.$date) return formatDate(new Date(val.$date))
  return String(val)
}

function normalizeMatch(raw: any): Match {
  return {
    ...raw,
    id: raw.id || raw._id,
    createdAt: formatDate(raw.createdAt),
  }
}

export async function fetchMatches(filter?: string): Promise<Match[]> {
  let query = matchesCollection().orderBy('createdAt', 'desc')
  if (filter && filter !== '全部') {
    query = matchesCollection().where({ level: filter }).orderBy('createdAt', 'desc')
  }
  const { data } = await query.limit(20).get()
  return (data as any[]).map(normalizeMatch)
}

export async function fetchMatchById(id: string): Promise<Match | null> {
  const { data } = await matchesCollection().doc(id).get()
  return data ? normalizeMatch(data) : null
}

export async function createMatch(matchData: Omit<Match, 'id'>): Promise<string> {
  const db = getDb()
  const { _id } = await matchesCollection().add({
    data: { ...matchData, createdAt: db.serverDate() },
  })
  return _id as string
}

export async function joinMatchCloud(matchId: string, participant: { name: string; avatar: string; level: string }) {
  const db = getDb()
  const openid = getOpenid()
  await matchesCollection().doc(matchId).update({
    data: {
      'spots.current': db.command.inc(1),
      participants: db.command.push({ each: [{ ...participant, openid }] }),
    },
  })
  await actionsCollection().add({
    data: { targetId: matchId, type: 'join', createdAt: db.serverDate() },
  })
}

export async function getUserJoinedMatchIds(): Promise<string[]> {
  const { data } = await actionsCollection()
    .where({ type: 'join' })
    .field({ targetId: true })
    .get()
  return data.map((d: any) => d.targetId)
}

export async function completeMatch(matchId: string): Promise<void> {
  await matchesCollection().doc(matchId).update({
    data: { status: 'completed' },
  })
}

export function isMatchHost(match: Match): boolean {
  const openid = getOpenid()
  return !!openid && match.hostOpenid === openid
}

export function isMatchCompleted(match: Match): boolean {
  return match.status === 'completed'
}
