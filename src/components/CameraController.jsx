import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function CameraController({ handX, handY }) {
  const { camera } = useThree()
  
  useFrame(() => {
    // 基础参数
    const radius = 22 // 摄像机距离
    const height = 5  // 摄像机高度中心
    
    // 旋转逻辑：handX (-1 到 1) 映射为角度偏移
    // 范围设为 ±1.5 弧度 (约 ±85度)，让你能看到树的侧面
    const angleOffset = (handX || 0) * 1.5 
    const baseAngle = Math.PI / 2 // 初始位置在 Z 轴正向 (90度位置)

    // 高度逻辑：handY 控制俯仰
    const targetY = height + (handY || 0) * 8

    // 计算轨道位置 (Orbit)
    // x = cos(angle) * r, z = sin(angle) * r
    // 注意：Three.js 坐标系通常 Z 是正前方
    const targetX = Math.cos(baseAngle + angleOffset) * radius
    const targetZ = Math.sin(baseAngle + angleOffset) * radius

    // 平滑插值
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05)
    
    // 始终盯着树的中心
    camera.lookAt(0, 6, 0)
  })

  return null
}