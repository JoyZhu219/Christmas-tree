import React, { useState, Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { isMobile } from './utils/deviceDetection' 

import ChristmasScene from './components/ChristmasScene'
import UIOverlay from './components/UIOverlay'
import LoadingScreen from './components/LoadingScreen'
import HandGestureDetector from './components/HandGestureDetector' 
import BackgroundMusic from './components/BackgroundMusic'

import './index.css'

export default function App() {
  const [state, setState] = useState('FORMED') 
  const [progress, setProgress] = useState(1)
  const [handX, setHandX] = useState(0)
  const [handY, setHandY] = useState(0)
  
  const [cameraEnabled, setCameraEnabled] = useState(false)
  const [started, setStarted] = useState(false)
  const [isMuted, setIsMuted] = useState(false) 
  
  const mobile = isMobile()

  useEffect(() => {
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

  const handleScreenInteract = () => {
    if (!cameraEnabled) {
      setState(prev => prev === 'FORMED' ? 'CHAOS' : 'FORMED')
    }
  }

  return (
    <div className="w-full h-full bg-[#050A1F]" onClick={handleScreenInteract}>
      
      <BackgroundMusic isMuted={isMuted} />

      <Suspense fallback={null}>
        <Canvas
          shadows={!mobile} 
          dpr={mobile ? [1, 1.5] : [1, 2]} 
          gl={{ 
            antialias: !mobile, 
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
            powerPreference: "high-performance",
            stencil: !mobile,
            depth: true
          }}
        >
          {/* --- 1. 触摸/鼠标控制 (OrbitControls) --- */}
          {/* 只有在 AI 关闭时才启用，避免冲突 */}
          {(!cameraEnabled) && (
            <OrbitControls 
              enableZoom={true} 
              enablePan={false} 
              rotateSpeed={0.5} 
              // 自动旋转仅在 Formed 状态开启，增加展示感
              autoRotate={state === 'FORMED'} 
              autoRotateSpeed={0.5}
              maxDistance={40}
              minDistance={10}
              // 移除 azimuth 限制，允许 360 度旋转
              minPolarAngle={0} 
              maxPolarAngle={Math.PI / 1.8} // 限制不能钻到地底下去
            />
          )}

          {/* --- 2. 场景内容 --- */}
          <ChristmasScene 
            state={state} 
            progress={progress} 
            handX={handX} 
            handY={handY}
            isMobile={mobile}
            cameraEnabled={cameraEnabled} // <--- 关键：传进去
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
            isMuted={isMuted}
            onToggleMute={(e) => {
              e.stopPropagation() 
              setIsMuted(!isMuted)
            }}
            isLoading={false} 
          />

          {cameraEnabled && (
            <HandGestureDetector 
              onGestureChange={handleGestureChange} 
              onHandMove={handleHandMove} 
              isMobile={mobile} 
            />
          )}
        </>
      )}
      
      <Loader />
    </div>
  )
}