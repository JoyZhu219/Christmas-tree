import React, { useRef, useEffect, useState } from 'react'

// Lightweight hand gesture detection using color tracking
export default function HandGestureDetector({ onGestureChange, onHandMove }) {
  const videoRef = useRef()
  const canvasRef = useRef()
  const [cameraActive, setCameraActive] = useState(false)
  const [error, setError] = useState(null)
  const gestureStateRef = useRef(false)

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: 320,
            height: 240,
            facingMode: 'user'
          }
        })
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          setCameraActive(true)
        }
      } catch (err) {
        console.error('Camera error:', err)
        setError('摄像头访问失败')
      }
    }

    setupCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  useEffect(() => {
    if (!cameraActive) return

    let animationId
    const canvas = canvasRef.current
    const video = videoRef.current
    
    if (!canvas || !video) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    let frameCount = 0

    const detectGesture = () => {
      // Process every 3 frames for performance
      frameCount++
      if (frameCount % 3 !== 0) {
        animationId = requestAnimationFrame(detectGesture)
        return
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        
        // Detect hand using skin tone detection
        let skinPixels = 0
        let totalBrightPixels = 0
        let centerX = 0
        let centerY = 0
        let spreadX = 0
        let spreadY = 0

        // Sample every 4th pixel for performance
        for (let i = 0; i < data.length; i += 16) { // 4 pixels * 4 channels
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          
          // Skin tone detection (simple RGB rule)
          const isSkin = r > 95 && g > 40 && b > 20 &&
                        r > g && r > b &&
                        Math.abs(r - g) > 15
          
          if (isSkin) {
            skinPixels++
            const pixelIndex = i / 4
            const x = (pixelIndex % canvas.width)
            const y = Math.floor(pixelIndex / canvas.width)
            centerX += x
            centerY += y
          }

          // Bright pixels for open hand detection
          const brightness = (r + g + b) / 3
          if (brightness > 120) {
            totalBrightPixels++
            const pixelIndex = i / 4
            const x = (pixelIndex % canvas.width)
            const y = Math.floor(pixelIndex / canvas.width)
            spreadX += Math.abs(x - canvas.width / 2)
            spreadY += Math.abs(y - canvas.height / 2)
          }
        }

        if (skinPixels > 100) {
          // Calculate hand center position
          centerX /= skinPixels
          centerY /= skinPixels

          // Normalize position for camera control
          const normalizedX = (centerX / canvas.width - 0.5) * 2
          const normalizedY = -(centerY / canvas.height - 0.5) * 2
          onHandMove(normalizedX * 0.8, normalizedY * 0.8)

          // Detect open vs closed based on spread
          const avgSpread = (spreadX + spreadY) / totalBrightPixels
          const isOpen = avgSpread > 25 // Threshold for open hand

          // Only trigger change if state actually changed
          if (isOpen !== gestureStateRef.current) {
            gestureStateRef.current = isOpen
            onGestureChange(isOpen ? 'CHAOS' : 'FORMED')
          }

          // Visual feedback - draw hand tracking
          ctx.fillStyle = isOpen ? 'rgba(255, 68, 68, 0.3)' : 'rgba(255, 215, 0, 0.3)'
          ctx.fillRect(centerX - 20, centerY - 20, 40, 40)
          
          ctx.strokeStyle = isOpen ? '#FF4444' : '#FFD700'
          ctx.lineWidth = 3
          ctx.strokeRect(centerX - 25, centerY - 25, 50, 50)
        }
      } catch (err) {
        console.error('Detection error:', err)
      }

      animationId = requestAnimationFrame(detectGesture)
    }

    detectGesture()
    return () => cancelAnimationFrame(animationId)
  }, [cameraActive, onGestureChange, onHandMove])

  if (error) {
    return (
      <div style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 50,
        background: 'rgba(139, 0, 0, 0.9)',
        padding: '12px 20px',
        borderRadius: '15px',
        border: '2px solid #FF4444',
        color: 'white',
        fontSize: '0.85rem'
      }}>
        ⚠️ {error}
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 50
    }}>
      <video 
        ref={videoRef}
        style={{ display: 'none' }}
        width={320}
        height={240}
      />
      <div style={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={160}
          height={120}
          style={{
            borderRadius: '12px',
            border: '2px solid rgba(255, 215, 0, 0.5)',
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
            background: '#000'
          }}
        />
        {!cameraActive && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.8)',
            borderRadius: '12px',
            color: '#FFD700',
            fontSize: '0.75rem'
          }}>
            启动中...
          </div>
        )}
      </div>
      
      {/* Instructions */}
      <div style={{
        marginTop: '8px',
        padding: '8px 12px',
        background: 'rgba(0,0,0,0.8)',
        borderRadius: '10px',
        border: '1px solid rgba(255, 215, 0, 0.3)',
        fontSize: '0.7rem',
        color: '#FFD700',
        textAlign: 'center',
        lineHeight: '1.4'
      }}>
        <div>✋ 张开手 = CHAOS</div>
        <div>✊ 握拳 = FORMED</div>
        <div style={{ fontSize: '0.65rem', opacity: 0.7, marginTop: '4px' }}>
          移动手调整视角
        </div>
      </div>
    </div>
  )
}