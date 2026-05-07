import { View } from '@tarojs/components'
import { PropsWithChildren } from 'react'
import './index.scss'

interface CardProps {
  className?: string
  elevated?: boolean
}

export function Card({ children, className = '', elevated }: PropsWithChildren<CardProps>) {
  return (
    <View className={`yq-card ${elevated ? 'yq-card--elevated' : ''} ${className}`}>
      {children}
    </View>
  )
}
