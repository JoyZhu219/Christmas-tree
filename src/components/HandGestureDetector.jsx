import React, { useRef, useState, useEffect } from 'react'
import * as handpose from '@tensorflow-models/handpose'
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-webgl'

export default function HandGestureDetector({ onGestureChange, onHandMove, isMobile }) {
  const videoRef = useRef()
  const canvasRef = useRef()
  const [model, setModel] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const lastDetectTimeRef = useRef(0)

  // 1. 智能配置：根据设备决定检测频率和分辨率
  const detectInterval = isMobile ? 300 : 100 
  const videoWidth = isMobile ? 320 : 640 
  const videoHeight = isMobile ? 240 : 480

  useEffect(() => {
    let isMounted = true

    const setupCameraAndModel = async () => {
      try {
        // WebGL Backend Init
        try {
            await tf.setBackend('webgl')
        } catch (e) {
            console.warn('WebGL backend failed, falling back to cpu')
            await tf.setBackend('cpu')
        }
        await tf.ready()

        const video = videoRef.current
        if (!video) return

        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: videoWidth, 
            height: videoHeight,
            facingMode: 'user'
          } 
        })
        
        if (!isMounted) return
        video.srcObject = stream
        video.playsInline = true // 关键：防止 iOS 全屏
        
        await new Promise(resolve => {
          video.onloadedmetadata = resolve
        })
        await video.play()

        setIsLoading(true)

        // 加载模型 (带超时保护)
        const modelPromise = handpose.load()
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Model load timeout')), 20000)
        )

        const handposeModel = await Promise.race([modelPromise, timeoutPromise])
        
        if (isMounted) {
            setModel(handposeModel)
            setIsLoading(false)
        }

      } catch (err) {
        console.error('Setup error:', err)
        if (isMounted) {
            setError(err.message || 'Camera/Model Error')
            setIsLoading(false)
        }
      }
    }

    setupCameraAndModel()

    return () => {
      isMounted = false
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop())
      }
    }
  }, [videoWidth, videoHeight])

  useEffect(() => {
    if (!model) return

    let animationId
    const detectHands = async () => {
      const now = Date.now()
      
      // 2. 节流检测
      if (now - lastDetectTimeRef.current > detectInterval && videoRef.current && videoRef.current.readyState === 4) {
        lastDetectTimeRef.current = now
        
        try {
          const video = videoRef.current
          // Mobile 下可能识别率会下降，但性能提升巨大
          const predictions = await model.estimateHands(video, false)
          
          // Canvas 绘制 (可选，为了调试和视觉反馈)
          if (canvasRef.current) {
             const ctx = canvasRef.current.getContext('2d')
             ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
             // 简单的镜像绘制
             ctx.save()
             ctx.scale(-1, 1)
             ctx.translate(-canvasRef.current.width, 0)
             if (predictions.length > 0) {
                 ctx.fillStyle = '#FFD700'
                 predictions[0].landmarks.forEach(point => {
                     // 坐标映射
                     const x = point[0] * (canvasRef.current.width / videoWidth)
                     const y = point[1] * (canvasRef.current.height / videoHeight)
                     ctx.beginPath()
                     ctx.arc(x, y, 2, 0, 2 * Math.PI)
                     ctx.fill()
                 })
             }
             ctx.restore()
          }

          if (predictions.length > 0) {
             const hand = predictions[0]
             const landmarks = hand.landmarks

             // 简单的张手/握拳判定
             const fingertips = [8, 12, 16, 20] 
             const bases = [5, 9, 13, 17] 
             let openFingers = 0
             if (landmarks[4][0] > landmarks[3][0]) openFingers++ // 拇指
             for (let i = 0; i < 4; i++) {
               if (landmarks[fingertips[i]][1] < landmarks[bases[i]][1]) openFingers++
             }

             onGestureChange(openFingers >= 3)

             const palmCenter = landmarks[0]
             // 归一化坐标 (-1 ~ 1)
             const normalizedX = -(palmCenter[0] / videoWidth - 0.5) * 2
             const normalizedY = -(palmCenter[1] / videoHeight - 0.5) * 2
             
             onHandMove(normalizedX, normalizedY)
          } else {
             onGestureChange(false)
             onHandMove(0, 0)
          }

        } catch (err) {
          console.error(err)
        }
      }
      animationId = requestAnimationFrame(detectHands)
    }

    detectHands()
    return () => cancelAnimationFrame(animationId)
  }, [model, onGestureChange, onHandMove, detectInterval, videoWidth, videoHeight])

  if (error) return null 

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-center">
      <div className="relative rounded-lg overflow-hidden border-2 border-luxury-gold shadow-[0_0_20px_rgba(255,215,0,0.4)] bg-black">
        {/* 视频和 Canvas 大小随设备变化 */}
        <video 
          ref={videoRef} 
          className="object-cover scale-x-[-1]" 
          style={{ width: isMobile ? '120px' : '160px', height: isMobile ? '90px' : '120px' }}
          playsInline 
          muted
        />
        <canvas 
          ref={canvasRef} 
          width={isMobile ? 120 : 160} 
          height={isMobile ? 90 : 120}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  )
}