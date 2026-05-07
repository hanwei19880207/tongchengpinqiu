import { postsCollection, actionsCollection, getDb } from './db'
import type { Post } from '../types'

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

function normalizePost(raw: any): Post {
  return {
    ...raw,
    id: raw.id || raw._id,
    createdAt: formatDate(raw.createdAt),
    comments: (raw.comments || []).map((c: any) => ({
      ...c,
      createdAt: formatDate(c.createdAt),
    })),
  }
}

export async function fetchPosts(page: number, pageSize = 6): Promise<Post[]> {
  const { data } = await postsCollection()
    .orderBy('createdAt', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get()
  return (data as any[]).map(normalizePost)
}

export async function fetchPostById(id: string): Promise<Post | null> {
  const { data } = await postsCollection().doc(id).get()
  return data ? normalizePost(data) : null
}

export async function likePost(postId: string): Promise<boolean> {
  const db = getDb()
  const { data } = await actionsCollection()
    .where({ targetId: postId, type: 'like' })
    .get()

  if (data.length > 0) {
    await actionsCollection().doc(data[0]._id).remove()
    await postsCollection().doc(postId).update({
      data: { likes: db.command.inc(-1) },
    })
    return false
  } else {
    await actionsCollection().add({
      data: { targetId: postId, type: 'like', createdAt: db.serverDate() },
    })
    await postsCollection().doc(postId).update({
      data: { likes: db.command.inc(1) },
    })
    return true
  }
}

export async function getUserLikedPostIds(): Promise<string[]> {
  const { data } = await actionsCollection()
    .where({ type: 'like' })
    .field({ targetId: true })
    .get()
  return data.map((d: any) => d.targetId)
}

export async function addComment(postId: string, content: string, author: string, avatar: string) {
  const db = getDb()
  await postsCollection().doc(postId).update({
    data: {
      comments: db.command.push({
        each: [{ id: Date.now().toString(), author, avatar, content, createdAt: '刚刚' }],
      }),
    },
  })
}
