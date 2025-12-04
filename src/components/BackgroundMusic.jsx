import React, { useEffect, useRef, useState } from 'react'

export default function BackgroundMusic({ isMuted, onToggleMute }) {
  const audioRef = useRef(null)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted && audioRef.current) {
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
        // 淡出
        const fadeAudio = setInterval(() => {
            if (audioRef.current.volume > 0.05) {
                audioRef.current.volume -= 0.05
            } else {
                audioRef.current.pause()
                clearInterval(fadeAudio)
            }
        }, 50)
      } else {
        if (hasInteracted) {
            audioRef.current.play()
            // 淡入
            audioRef.current.volume = 0
            const fadeAudio = setInterval(() => {
                if (audioRef.current.volume < 0.5) {
                    audioRef.current.volume += 0.05
                } else {
                    clearInterval(fadeAudio)
                }
            }, 50)
        }
      }
    }
  }, [isMuted, hasInteracted])

  return (
    <audio 
        ref={audioRef} 
        /* 指向 mp4 文件 */
        src="/music/bgm.mp4" 
        loop 
        preload="auto" 
        /* 即使是 mp4，放在 audio 标签里也只会播放声音 */
    />
  )
}