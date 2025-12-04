import React, { useState, Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { isMobile } from './utils/deviceDetection' 

import ChristmasScene from './components/ChristmasScene'
import UIOverlay from './components/UIOverlay'
import LoadingScreen from './components/LoadingScreen'
import HandGestureDetector from './components/HandGestureDetector' 
import BackgroundMusic from './components/BackgroundMusic' // 确保你创建了这个组件

import './index.css'

export default function App() {
  const [state, setState] = useState('FORMED') 
  const [progress, setProgress] = useState(1)
  const [handX, setHandX] = useState(0)
  const [handY, setHandY] = useState(0)
  
  // 交互状态
  const [cameraEnabled, setCameraEnabled] = useState(false)
  const [started, setStarted] = useState(false)
  const [isMuted, setIsMuted] = useState(false) // 默认有声（等待交互触发）
  
  // 设备检测
  const mobile = isMobile()

  // 模拟加载延迟 (给 3D 资源一点时间)
  useEffect(() => {
    // 桌面端 2秒，手机端 3秒
    const timer = setTimeout(() => setStarted(true), mobile ? 3000 : 2000)
    return () => clearTimeout(timer)
  }, [mobile])

  // 核心动画循环: 平滑过渡 Chaos <-> Formed
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

  // 手势回调
  const handleGestureChange = (isOpen) => {
    const newState = isOpen ? 'CHAOS' : 'FORMED'
    if (newState !== state) setState(newState)
  }

  const handleHandMove = (x, y) => {
    setHandX(x)
    setHandY(y)
  }

  // 屏幕交互回调 (用于手机端点击切换，或 PC 端未开启摄像头时)
  const handleScreenInteract = () => {
    // 如果没有开启摄像头控制，允许点击屏幕切换状态
    if (!cameraEnabled) {
      setState(prev => prev === 'FORMED' ? 'CHAOS' : 'FORMED')
    }
  }

  return (
    <div className="w-full h-full bg-[#050A1F]" onClick={handleScreenInteract}>
      
      {/* 背景音乐组件 */}
      <BackgroundMusic isMuted={isMuted} />

      <Suspense fallback={null}>
        <Canvas
          // --- 画质分级 ---
          // PC: 开启阴影 | Mobile: 关闭阴影
          shadows={!mobile} 
          // PC: 最高2倍像素比 | Mobile: 限制1.5倍 防发热
          dpr={mobile ? [1, 1.5] : [1, 2]} 
          gl={{ 
            antialias: !mobile, // 手机端关闭抗锯齿以提升 FPS
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
            powerPreference: "high-performance",
            stencil: !mobile,
            depth: true
          }}
        >
          {/* 触控旋转 (当摄像头关闭或在手机上时启用) */}
          {(!cameraEnabled || mobile) && (
            <OrbitControls 
              enableZoom={true} 
              enablePan={false} 
              rotateSpeed={0.5} 
              autoRotate={state === 'FORMED'} // 仅在成型时自动旋转展示
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
            isMobile={mobile} // 传递给子组件做降级处理
          />
        </Canvas>
      </Suspense>

      {/* 加载屏 */}
      <LoadingScreen started={started} />
      
      {/* 启动后显示的 UI 层 */}
      {started && (
        <>
          <UIOverlay 
            state={state} 
            isMobile={mobile} 
            cameraEnabled={cameraEnabled}
            onToggleCamera={() => setCameraEnabled(!cameraEnabled)}
            isMuted={isMuted}
            onToggleMute={(e) => {
              e.stopPropagation() // 防止触发 handleScreenInteract
              setIsMuted(!isMuted)
            }}
            isLoading={false} 
          />

          {/* AI 手势层 (开启时加载) */}
          {cameraEnabled && (
            <HandGestureDetector 
              onGestureChange={handleGestureChange} 
              onHandMove={handleHandMove} 
              isMobile={mobile} // 传递给 AI 做降频处理
            />
          )}
        </>
      )}
      
      {/* Drei 默认加载条 */}
      <Loader />
    </div>
  )
}