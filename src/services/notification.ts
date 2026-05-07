import { getDb } from './db'

export interface Notification {
  id: string
  type: 'like' | 'comment' | 'match' | 'system'
  title: string
  content: string
  time: string
  read: boolean
  targetId?: string
}

export async function fetchNotifications(): Promise<Notification[]> {
  const db = getDb()
  const { data } = await db.collection('notifications')
    .orderBy('createdAt', 'desc')
    .limit(20)
    .get()
  return (data as any[]).map(item => ({
    id: item._id,
    type: item.type,
    title: item.title,
    content: item.content,
    time: typeof item.createdAt === 'string' ? item.createdAt : '',
    read: item.read || false,
    targetId: item.targetId,
  }))
}
