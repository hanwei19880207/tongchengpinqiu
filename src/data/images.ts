import tennisCourt1 from '../assets/images/tennis-court-1.jpg'
import tennisCourt2 from '../assets/images/tennis-court-2.jpg'
import tennisPlayer1 from '../assets/images/tennis-player-1.jpg'
import tennisBall from '../assets/images/tennis-ball.jpg'
import tennisRacket from '../assets/images/tennis-racket.jpg'
import tennisDoubles from '../assets/images/tennis-doubles.jpg'
import venue1 from '../assets/images/venue-1.jpg'
import venue2 from '../assets/images/venue-2.jpg'
import venue3 from '../assets/images/venue-3.jpg'

const POST_IMAGES = [tennisCourt1, tennisRacket, tennisCourt2, tennisPlayer1, tennisBall, tennisDoubles, tennisCourt1, tennisPlayer1, tennisRacket, tennisDoubles, tennisBall, tennisCourt2]
const MATCH_IMAGES = [tennisCourt1, tennisDoubles, tennisCourt2, venue1, venue2, venue3]
const VENUE_IMAGES = [venue1, venue2, venue3, venue1, venue2, venue3]

function safeIndex(index: number): number {
  return Number.isFinite(index) ? Math.abs(index) : 0
}

function hashStr(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function getPostImage(index: number | string): string {
  const i = typeof index === 'string' ? hashStr(index) : safeIndex(index)
  return POST_IMAGES[i % POST_IMAGES.length]
}

export function getMatchImage(index: number | string): string {
  const i = typeof index === 'string' ? hashStr(index) : safeIndex(index)
  return MATCH_IMAGES[i % MATCH_IMAGES.length]
}

export function getVenueImage(index: number | string): string {
  const i = typeof index === 'string' ? hashStr(index) : safeIndex(index)
  return VENUE_IMAGES[i % VENUE_IMAGES.length]
}

export function getVenueImages(index: number | string): string[] {
  const base = (typeof index === 'string' ? hashStr(index) : safeIndex(index)) % 3
  return [VENUE_IMAGES[base], VENUE_IMAGES[(base + 1) % 3], VENUE_IMAGES[(base + 2) % 3]]
}
