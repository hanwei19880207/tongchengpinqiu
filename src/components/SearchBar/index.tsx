import { View, Text, Input } from '@tarojs/components'
import './index.scss'

interface SearchBarProps {
  placeholder?: string
  value?: string
  onInput?: (value: string) => void
  onFocus?: () => void
}

export function SearchBar({ placeholder = '搜索...', value, onInput, onFocus }: SearchBarProps) {
  return (
    <View className="yq-search">
      <Text className="yq-search__icon">🔍</Text>
      <Input
        className="yq-search__input"
        placeholder={placeholder}
        value={value}
        onInput={(e) => onInput?.(e.detail.value)}
        onFocus={onFocus}
      />
    </View>
  )
}
