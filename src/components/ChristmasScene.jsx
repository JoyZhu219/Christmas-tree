import React, { memo } from 'react'
import { PerspectiveCamera, Environment, Sparkles, Float } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing'
import FoliageSystem from './FoliageSystem'
import Ornaments from './Ornaments'
import PolaroidPhotos from './PolaroidPhotos'
import TreeTrunk from './TreeTrunk'
import GoldenStar from './GoldenStar'
import CameraController from './CameraController'

// --- 关键优化：使用 memo 锁定重型组件 ---
// 这样当 CameraController 导致父组件刷新时，这些 3D 物体不会跟着刷新
const MemoizedFoliage = memo(FoliageSystem)
const MemoizedOrnaments = memo(Ornaments)
const MemoizedPolaroids = memo(PolaroidPhotos)
const MemoizedTrunk = memo(TreeTrunk)
const MemoizedStar = memo(GoldenStar)

export default function ChristmasScene({ state, progress, handX, handY, isMobile }) {
  return (
    <>
      {/* 手机端视野稍宽 (65)，电脑端标准 (50) */}
      <PerspectiveCamera makeDefault position={[0, 4, 24]} fov={isMobile ? 65 : 50} />
      
      {/* 只有这个组件会跟随手势数据高频更新 */}
      <CameraController handX={handX} handY={handY} />
      
      {/* --- 背景与氛围 --- */}
      <color attach="background" args={['#050A1F']} /> 
      <fog attach="fog" args={['#050A1F', 10, 50]} /> 

      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sparkles 
          count={isMobile ? 100 : 500} 
          scale={[30, 20, 30]} 
          size={isMobile ? 8 : 5} 
          speed={0.2} 
          opacity={0.8} 
          color="#FFD700" 
        />
      </Float>

      {/* --- 灯光系统 --- */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={3.0} color="#FFD700" decay={2} distance={50} />
      <pointLight position={[-10, 5, -10]} intensity={2.0} color="#E6E6FA" decay={2} />
      
      <spotLight 
        position={[0, 30, 0]} 
        angle={0.3} 
        penumbra={0.5} 
        intensity={5.0}
        color="#FFD700"
        castShadow={!isMobile} // 手机端关闭投影计算
        shadow-bias={-0.0001}
      />

      {/* --- 3D 核心组件 (Memoized) --- */}
      {/* 这里传递 props，只要这些 props 没变，组件就不会重绘 */}
      <MemoizedFoliage state={state} progress={progress} isMobile={isMobile} />
      <MemoizedOrnaments state={state} progress={progress} isMobile={isMobile} />
      <MemoizedPolaroids progress={progress} isMobile={isMobile} />
      <MemoizedTrunk />
      <MemoizedStar />

      {/* --- 环境与后期 --- */}
      <Environment preset="lobby" background={false} blur={0.6} />
      
      <EffectComposer disableNormalPass enabled={!isMobile || progress > 0.1}> 
        <Bloom 
          intensity={isMobile ? 1.2 : 1.8} 
          luminanceThreshold={0.7} 
          luminanceSmoothing={0.9}
          mipmapBlur={!isMobile} // 手机端关闭 mipmapBlur 以防显存爆炸
        />
        {!isMobile && <Noise opacity={0.015} />} 
        <Vignette eskil={false} offset={0.1} darkness={0.5} />
      </EffectComposer>
    </>
  )
}