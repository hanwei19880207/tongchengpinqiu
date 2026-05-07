import { useEffect, PropsWithChildren } from 'react'
import Taro from '@tarojs/taro'
import './app.scss'

function App({ children }: PropsWithChildren) {
  useEffect(() => {
    if (Taro.cloud) {
      Taro.cloud.init({
        env: 'cloud1-d2getwu7qca6f2767',
        traceUser: true,
      })
    }
  }, [])

  return <>{children}</>
}

export default App
