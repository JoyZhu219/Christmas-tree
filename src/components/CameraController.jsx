import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function CameraController({ handX, handY }) {
  const { camera } = useThree()
  
  useFrame(() => {
    // 基础参数
    const defaultDist = 24 
    // [修复 1] 降低摄像机高度 (5.5 -> 4.0)，与默认视角保持一致
    const defaultHeight = 4.0 
    
    // 计算目标位置
    const targetAngle = (handX || 0) * 1.5 
    const targetY = defaultHeight + (handY || 0) * 8

    const targetX = Math.sin(targetAngle) * defaultDist
    const targetZ = Math.cos(targetAngle) * defaultDist

    // 平滑移动
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05)
    
    // [修复 2] 降低聚焦点 (LookAt Y: 5.5 -> 4.5)
    // 摄像机看向更低的位置，树在屏幕中就会“往上走”，从而垂直居中
    camera.lookAt(0, 4.5, 0)
  })

  return null
}