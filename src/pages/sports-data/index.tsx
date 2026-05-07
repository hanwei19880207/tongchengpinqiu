import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { getProfile } from '../../services/user'
import { actionsCollection } from '../../services/db'
import { fetchMatches } from '../../services/match'
import './index.scss'

const DAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export default function SportsData() {
  const [stats, setStats] = useState({ matches: 0, rating: 0, friends: 0, badges: 0 })
  const [weeklyData, setWeeklyData] = useState(DAY_NAMES.slice(1).concat(DAY_NAMES[0]).map(day => ({ day, hours: 0 })))

  useEffect(() => {
    const load = async () => {
      const profile = await getProfile()
      if (profile) setStats(profile.stats)

      try {
        const { data: joins } = await actionsCollection()
          .where({ type: 'join' })
          .orderBy('createdAt', 'desc')
          .limit(50)
          .get()

        if (joins.length > 0) {
          const matchIds = joins.map((j: any) => j.targetId).filter(Boolean)
          const allMatches = await fetchMatches('全部')
          const joinedMatches = allMatches.filter(m => {
            const mid = m.id || (m as any)._id
            return matchIds.includes(mid)
          })

          const now = new Date()
          const mondayOffset = (now.getDay() + 6) % 7
          const monday = new Date(now)
          monday.setDate(now.getDate() - mondayOffset)
          monday.setHours(0, 0, 0, 0)

          const hoursPerDay = [0, 0, 0, 0, 0, 0, 0]
          for (const m of joinedMatches) {
            const timeStr = m.time || ''
            const dayMatch = timeStr.match(/(周[一二三四五六日])/)
            if (dayMatch) {
              const dayIndex = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'].indexOf(dayMatch[1])
              if (dayIndex >= 0) {
                const durationMatch = timeStr.match(/(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/)
                let hours = 2
                if (durationMatch) {
                  const start = parseInt(durationMatch[1]) + parseInt(durationMatch[2]) / 60
                  const end = parseInt(durationMatch[3]) + parseInt(durationMatch[4]) / 60
                  hours = end - start
                }
                hoursPerDay[dayIndex] += hours
              }
            }
          }

          setWeeklyData(['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day, i) => ({
            day,
            hours: hoursPerDay[i],
          })))
        }
      } catch {}
    }
    load()
  }, [])

  const maxHours = Math.max(...weeklyData.map(d => d.hours), 1)
  const totalHours = weeklyData.reduce((a, b) => a + b.hours, 0)

  const dataItems = [
    { icon: '🎾', label: '总约球次数', value: `${stats.matches}次`, color: '#7EB8DA' },
    { icon: '⭐', label: '综合评分', value: stats.rating > 0 ? `${stats.rating}分` : '暂无', color: '#F9D88D' },
    { icon: '👥', label: '球友数量', value: `${stats.friends}人`, color: '#B8D8BA' },
    { icon: '🏆', label: '获得徽章', value: `${stats.badges}个`, color: '#C3B1E1' },
  ]

  return (
    <View className="sports-data">
      <View className="stats-grid">
        {dataItems.map(item => (
          <View key={item.label} className="stat-card">
            <Text className="stat-icon">{item.icon}</Text>
            <Text className="stat-value" style={{ color: item.color }}>{item.value}</Text>
            <Text className="stat-label">{item.label}</Text>
          </View>
        ))}
      </View>

      <View className="chart-card">
        <Text className="chart-title">本周运动时长</Text>
        <View className="bar-chart">
          {weeklyData.map(d => (
            <View key={d.day} className="bar-col">
              <View className="bar-wrapper">
                <View className="bar" style={{ height: `${(d.hours / maxHours) * 100}%` }} />
              </View>
              <Text className="bar-label">{d.day}</Text>
            </View>
          ))}
        </View>
        <Text className="chart-total">
          {totalHours > 0 ? `本周共运动 ${totalHours} 小时` : '本周暂无运动记录'}
        </Text>
      </View>
    </View>
  )
}
