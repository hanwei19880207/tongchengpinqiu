import { venuesCollection, actionsCollection, getDb } from './db'
import type { Venue } from '../types'

function normalizeVenue(raw: any): Venue {
  return {
    ...raw,
    id: raw.id || raw._id,
  }
}

export async function fetchVenues(filter?: string): Promise<Venue[]> {
  let query: any

  if (!filter || filter === '全部') {
    query = venuesCollection()
  } else if (filter === '高分') {
    const db = getDb()
    query = venuesCollection().where({ rating: db.command.gte(8.5) })
  } else if (filter === '平价') {
    const db = getDb()
    query = venuesCollection().where({ price: db.command.lte(70) })
  } else {
    query = venuesCollection().where({ tags: filter })
  }

  const { data } = await query.limit(20).get()
  return (data as any[]).map(normalizeVenue)
}

export async function fetchVenueById(id: string): Promise<Venue | null> {
  const { data } = await venuesCollection().doc(id).get()
  return data ? normalizeVenue(data) : null
}

export async function toggleFavoriteVenueCloud(venueId: string): Promise<boolean> {
  const db = getDb()
  const { data } = await actionsCollection()
    .where({ targetId: venueId, type: 'fav' })
    .get()

  if (data.length > 0) {
    await actionsCollection().doc(data[0]._id).remove()
    return false
  } else {
    await actionsCollection().add({
      data: { targetId: venueId, type: 'fav', createdAt: db.serverDate() },
    })
    return true
  }
}

export async function getUserFavoriteVenueIds(): Promise<string[]> {
  const { data } = await actionsCollection()
    .where({ type: 'fav' })
    .field({ targetId: true })
    .get()
  return data.map((d: any) => d.targetId)
}
