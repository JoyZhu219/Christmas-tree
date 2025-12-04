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
          {/* --- 1. 触摸/鼠标控制 --- */}
          {(!cameraEnabled) && (
            <OrbitControls 
              enableZoom={true} 
              enablePan={false} 
              rotateSpeed={0.5} 
              autoRotate={state === 'FORMED'} 
              autoRotateSpeed={0.5}
              maxDistance={40}
              minDistance={10}
              
              // [修复 3] 这里的 target 也同步改为 [0, 4.5, 0]
              // 这样不开摄像头时，树也会稍微往下一点点（之前的 5.5 太高了）
              // 让视觉重心回到树身的中下部，看起来最稳重
              target={[0, 4.5, 0]} 
              
              minPolarAngle={0} 
              maxPolarAngle={Math.PI / 1.8} 
            />
          )}

          <ChristmasScene 
            state={state} 
            progress={progress} 
            handX={handX} 
            handY={handY}
            isMobile={mobile}
            cameraEnabled={cameraEnabled} 
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