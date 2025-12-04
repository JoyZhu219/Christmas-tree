import React, { useState, Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { isMobile } from './utils/deviceDetection'

import ChristmasScene from './components/ChristmasScene'
import UIOverlay from './components/UIOverlay'
import LoadingScreen from './components/LoadingScreen'
import HandGestureDetector from './components/HandGestureDetector' 

import './index.css'

export default function App() {
  const [state, setState] = useState('FORMED') 
  const [progress, setProgress] = useState(1)
  const [handX, setHandX] = useState(0)
  const [handY, setHandY] = useState(0)
  const [cameraEnabled, setCameraEnabled] = useState(false)
  const [started, setStarted] = useState(false)
  
  // 检测设备类型
  const mobile = isMobile()

  useEffect(() => {
    // 桌面端加载快，2秒；手机端给3秒
    const timer = setTimeout(() => setStarted(true), mobile ? 3000 : 2000)
    return () => clearTimeout(timer)
  }, [mobile])

  useEffect(() => {
    let target = state === 'FORMED' ? 1 : 0
    let current = progress
    
    const interval = setInterval(() => {
      if (Math.abs(target - current) > 0.01) {
        current += (target - current) * 0.05
        setProgress(current)
      } else {
        setProgress(target)
      }
    }, 16)
    return () => clearInterval(interval)
  }, [state, progress])

  const handleGestureChange = (isOpen) => {
    const newState = isOpen ? 'CHAOS' : 'FORMED'
    if (newState !== state) setState(newState)
  }

  const handleHandMove = (x, y) => {
    setHandX(x)
    setHandY(y)
  }

  // 手机端：如果没有开摄像头，点击屏幕任何地方都可以切换状态
  const handleScreenInteract = () => {
    if (mobile && !cameraEnabled) {
      setState(prev => prev === 'FORMED' ? 'CHAOS' : 'FORMED')
    }
  }

  return (
    <div onClick={handleScreenInteract} className="w-full h-full bg-[#050A1F]">
      <Suspense fallback={null}>
        <Canvas
          // --- 画质分级核心 ---
          // PC: 开启阴影 | Mobile: 关闭阴影
          shadows={!mobile} 
          // PC: 高DPR (最高2倍) 极致清晰 | Mobile: 限制1.5倍 保证不发烫
          dpr={mobile ? [1, 1.5] : [1, 2]} 
          gl={{ 
            antialias: !mobile, // PC开启抗锯齿，手机关闭
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
            powerPreference: "high-performance",
            // PC: 保留深度缓冲 | Mobile: 优化缓冲
            stencil: !mobile,
            depth: true
          }}
        >
          {/* 手机端允许触摸旋转 */}
          {(!cameraEnabled || mobile) && (
            <OrbitControls 
              enableZoom={true} 
              enablePan={false} 
              rotateSpeed={0.5} 
              autoRotate={state === 'FORMED'}
              autoRotateSpeed={0.5}
              maxDistance={40}
              minDistance={10}
            />
          )}

          <ChristmasScene 
            state={state} 
            progress={progress} 
            handX={handX} 
            handY={handY}
            isMobile={mobile} 
          />
        </Canvas>
      </Suspense>

      <LoadingScreen started={started} />
      
      {started && (
        <>
          <UIOverlay 
            state={state} 
            isMobile={mobile} 
            cameraEnabled={cameraEnabled}
            onToggleCamera={() => setCameraEnabled(!cameraEnabled)}
            isLoading={false} 
          />

          {/* 只有开启摄像头时才加载 TensorFlow，避免手机后台跑 AI 导致掉帧 */}
          {cameraEnabled && (
            <HandGestureDetector 
              onGestureChange={handleGestureChange} 
              onHandMove={handleHandMove} 
            />
          )}
        </>
      )}
      <Loader />
    </div>
  )
}