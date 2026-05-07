import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input, Textarea, Image, Picker } from '@tarojs/components'
import { getProfile, updateProfile } from '../../services/user'
import './index.scss'

import defaultAvatar from '../../assets/images/avatar.jpg'

const LEVELS = ['NTRP 1.0', 'NTRP 1.5', 'NTRP 2.0', 'NTRP 2.5', 'NTRP 3.0', 'NTRP 3.5', 'NTRP 4.0', 'NTRP 4.5', 'NTRP 5.0']

export default function EditProfile() {
  const [nickName, setNickName] = useState('')
  const [level, setLevel] = useState('NTRP 2.5')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const load = async () => {
      const profile = await getProfile()
      if (profile) {
        setNickName(profile.name || '')
        setLevel(profile.level || 'NTRP 2.5')
        setBio(profile.bio || '')
        setAvatarUrl(profile.avatar || '')
      }
    }
    load()
  }, [])

  const handleChooseAvatar = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        const tempPath = res.tempFilePaths[0]
        setAvatarUrl(tempPath)
      },
    })
  }

  const handleSave = async () => {
    if (!nickName.trim()) {
      Taro.showToast({ title: '请输入昵称', icon: 'none' })
      return
    }
    setSubmitting(true)
    try {
      let finalAvatarUrl = avatarUrl
      if (avatarUrl && (avatarUrl.startsWith('http://tmp') || avatarUrl.startsWith('wxfile://'))) {
        const ext = avatarUrl.split('.').pop() || 'jpg'
        const cloudPath = `avatars/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const uploadRes = await Taro.cloud.uploadFile({ cloudPath, filePath: avatarUrl })
        finalAvatarUrl = uploadRes.fileID
      }
      await updateProfile({ nickName: nickName.trim(), avatarUrl: finalAvatarUrl, level, bio: bio.trim() })
      Taro.showToast({ title: '保存成功', icon: 'success' })
      setTimeout(() => Taro.navigateBack(), 1000)
    } catch {
      Taro.showToast({ title: '保存失败', icon: 'none' })
    }
    setSubmitting(false)
  }

  return (
    <View className="edit-profile">
      <View className="form-section avatar-section">
        <Text className="form-label">头像</Text>
        <View className="avatar-picker" onClick={handleChooseAvatar}>
          <Image className="avatar-preview" src={avatarUrl || defaultAvatar} mode="aspectFill" />
          <View className="avatar-overlay">
            <Text>更换</Text>
          </View>
        </View>
      </View>

      <View className="form-section">
        <Text className="form-label">昵称</Text>
        <Input
          className="form-input"
          placeholder="输入昵称"
          value={nickName}
          onInput={(e) => setNickName(e.detail.value)}
          maxlength={20}
        />
      </View>

      <View className="form-section">
        <Text className="form-label">水平等级</Text>
        <Picker mode="selector" range={LEVELS} value={LEVELS.indexOf(level)} onChange={(e) => setLevel(LEVELS[e.detail.value])}>
          <View className="form-picker">
            <Text className="picker-text picker-text--selected">{level}</Text>
          </View>
        </Picker>
      </View>

      <View className="form-section">
        <Text className="form-label">个人简介</Text>
        <Textarea
          className="form-textarea"
          placeholder="介绍一下自己..."
          value={bio}
          onInput={(e) => setBio(e.detail.value)}
          maxlength={100}
        />
      </View>

      <View className={`save-btn ${submitting ? 'save-btn--disabled' : ''}`} onClick={submitting ? undefined : handleSave}>
        <Text>{submitting ? '保存中...' : '保存'}</Text>
      </View>
    </View>
  )
}
