import { View, Text } from '@tarojs/components'
import { PropsWithChildren } from 'react'
import './index.scss'

type ButtonVariant = 'primary' | 'secondary' | 'outline'
type ButtonSize = 'large' | 'medium' | 'small'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  onClick?: () => void
}

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  onClick,
}: PropsWithChildren<ButtonProps>) {
  return (
    <View
      className={`yq-btn yq-btn--${variant} yq-btn--${size} ${className}`}
      onClick={onClick}
    >
      <Text>{children}</Text>
    </View>
  )
}
