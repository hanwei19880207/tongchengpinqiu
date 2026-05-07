import { View, Text } from '@tarojs/components'
import './index.scss'

interface RatingProps {
  score: number
  count?: number
  size?: 'large' | 'small'
}

export function Rating({ score, count, size = 'small' }: RatingProps) {
  const stars = '★'.repeat(Math.round(score / 2)) + '☆'.repeat(5 - Math.round(score / 2))

  return (
    <View className={`yq-rating yq-rating--${size}`}>
      <Text className="yq-rating__score">{score.toFixed(1)}</Text>
      <View className="yq-rating__detail">
        <Text className="yq-rating__stars">{stars}</Text>
        {count !== undefined && <Text className="yq-rating__count">{count}条评价</Text>}
      </View>
    </View>
  )
}
