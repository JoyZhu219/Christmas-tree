import React, { useEffect, useRef, useState } from 'react'

export default function BackgroundMusic({ isMuted, onToggleMute }) {
  const audioRef = useRef(null)
  const [hasInteracted, setHasInteracted] = useState(false)

  // 1. 处理第一次点击播放 (浏览器策略)
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted && audioRef.current) {
        // 尝试播放
        const playPromise = audioRef.current.play()
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setHasInteracted(true)
              // 移除监听器
              window.removeEventListener('click', handleFirstInteraction)
              window.removeEventListener('touchstart', handleFirstInteraction)
            })
            .catch(error => {
              console.log("Auto-play prevented, waiting for interaction:", error)
            })
        }
      }
    }

    window.addEventListener('click', handleFirstInteraction)
    window.addEventListener('touchstart', handleFirstInteraction)

    return () => {
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('touchstart', handleFirstInteraction)
    }
  }, [hasInteracted])

  // 2. 处理静音/播放逻辑 (修复了手机端无效的问题)
  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        // --- 手机端修复核心 ---
        // 不要依赖 volume 渐变，直接使用 muted 属性或 pause
        // muted = true 是硬件加速的，最稳健
        audioRef.current.muted = true 
        // 可选：为了省电和流量，直接暂停
        audioRef.current.pause() 
      } else {
        // 取消静音
        audioRef.current.muted = false
        // 只有当用户已经交互过（解锁了音频上下文）才播放
        if (hasInteracted) {
            // 手机端音量通常不可控，这行代码在PC生效，手机忽略
            audioRef.current.volume = 0.5 
            
            const playPromise = audioRef.current.play()
            if (playPromise !== undefined) {
                playPromise.catch(e => console.log("Resume play failed:", e))
            }
        }
      }
    }
  }, [isMuted, hasInteracted])

  return (
    <audio 
        ref={audioRef} 
        src="/music/bgm.mp4" // 确保这里是你压缩好的小文件
        loop 
        preload="auto" 
        playsInline // 增加这个属性，对兼容性有帮助
    />
  )
}