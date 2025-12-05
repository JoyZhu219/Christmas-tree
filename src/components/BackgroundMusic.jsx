import React, { useEffect, useRef, useState } from 'react'

export default function BackgroundMusic({ isMuted, onToggleMute }) {
  const audioRef = useRef(null)
  const [hasInteracted, setHasInteracted] = useState(false)

  // 1. 监听第一次点击：这是最关键的一步 (iOS/Android 必须)
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted && audioRef.current) {
        // --- 核心修复 ---
        // 在点击事件内部直接调用 play()，不要等待 state 变化
        // 这样 iOS 才会认为这是“用户想听”，从而授权音频播放
        
        audioRef.current.muted = false // 确保不静音
        // 尝试设置音量 (在部分手机上可能无效，但对 PC 有用)
        audioRef.current.volume = 0.5 
        
        const playPromise = audioRef.current.play()
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Audio started successfully")
              setHasInteracted(true)
              // 成功播放后，移除监听器
              window.removeEventListener('click', handleFirstInteraction)
              window.removeEventListener('touchstart', handleFirstInteraction)
            })
            .catch(error => {
              console.log("Auto-play prevented:", error)
            })
        }
      }
    }

    // 监听整个窗口的点击
    window.addEventListener('click', handleFirstInteraction)
    window.addEventListener('touchstart', handleFirstInteraction)

    return () => {
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('touchstart', handleFirstInteraction)
    }
  }, [hasInteracted])

  // 2. 监听 Mute 开关
  useEffect(() => {
    if (audioRef.current && hasInteracted) {
      if (isMuted) {
        // 手机端静音最稳健的方法：设置 muted 属性并暂停
        audioRef.current.muted = true
        audioRef.current.pause() 
      } else {
        // 取消静音并恢复播放
        audioRef.current.muted = false
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
            playPromise.catch(e => console.log("Resume failed:", e))
        }
      }
    }
  }, [isMuted, hasInteracted])

  return (
    <audio 
        ref={audioRef} 
        src="/music/bgm.mp3" 
        loop 
        preload="auto" 
        playsInline 
    />
  )
}