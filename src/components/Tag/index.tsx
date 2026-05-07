import { View, Text } from '@tarojs/components'
import './index.scss'

type TagVariant = 'primary' | 'secondary' | 'accent'

interface TagProps {
  label: string
  variant?: TagVariant
}

export function Tag({ label, variant = 'primary' }: TagProps) {
  return (
    <View className={`yq-tag yq-tag--${variant}`}>
      <Text>{label}</Text>
    </View>
  )
}
