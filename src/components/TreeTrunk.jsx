import React from 'react'

export default function TreeTrunk() {
  return (
    <group>
      {/* 1. 原始树根 (Base Trunk) - 底部可见部分 */}
      <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 1.2, 2, 16]} />
        <meshStandardMaterial 
          color="#3E2723"
          metalness={0.2}
          roughness={0.9}
        />
      </mesh>

      {/* 2. 新增：深绿内芯 (Inner Core) - 填补树叶缝隙，防止漏光 */}
      {/* 高度 10，细长圆锥，直通树顶 */}
      <mesh position={[0, 5, 0]}>
        <cylinderGeometry args={[0.1, 2.0, 11, 8]} />
        <meshStandardMaterial 
          color="#001a00" // 极深的绿色，接近黑色，不反光
          roughness={1.0}
          metalness={0.0}
        />
      </mesh>
    </group>
  )
}