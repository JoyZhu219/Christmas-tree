import React, { useEffect, useRef, useState } from 'react'

export default function BackgroundMusic({ isMuted, onToggleMute }) {
  const audioRef = useRef(null)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted && audioRef.current) {
        // --- 修改 1: 直接设置目标音量，不再从 0 开始 ---
        audioRef.current.volume = 0.5 
        
        const playPromise = audioRef.current.play()
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setHasInteracted(true)
              window.removeEventListener('click', handleFirstInteraction)
              window.removeEventListener('touchstart', handleFirstInteraction)
            })
            .catch(error => {
              console.log("Auto-play prevented:", error)
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

  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        // 静音时快速淡出（保留淡出比较自然）
        const fadeAudio = setInterval(() => {
            if (audioRef.current.volume > 0.05) {
                audioRef.current.volume -= 0.1 // 加快淡出速度
            } else {
                audioRef.current.pause()
                clearInterval(fadeAudio)
            }
        }, 50)
      } else {
        if (hasInteracted) {
            audioRef.current.play()
            // --- 修改 2: 取消淡入，直接恢复音量 ---
            audioRef.current.volume = 0.5 
        }
      }
    }
  }, [isMuted, hasInteracted])

  return (
    <audio 
        ref={audioRef} 
        src="/music/bgm.mp4" 
        loop 
        preload="auto" 
    />
  )
}