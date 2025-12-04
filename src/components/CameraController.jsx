import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function CameraController({ handX, handY }) {
  const { camera } = useThree()
  
  useFrame(() => {
    // 基础参数
    const defaultDist = 24 
    const defaultHeight = 4 
    
    const targetAngle = (handX || 0) * 1.5 
    const targetY = defaultHeight + (handY || 0) * 8

    const targetX = Math.sin(targetAngle) * defaultDist
    const targetZ = Math.cos(targetAngle) * defaultDist

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05)
    
    // --- 修改点：提高 LookAt 的 Y 值 ---
    // 之前是 lookAt(0, 5, 0)。
    // 改为 lookAt(0, 6.5, 0)。
    // 原理：摄像机抬头看更高的地方，相对而言，物体在屏幕上就会“下沉”，从而居中。
    camera.lookAt(0, 6.5, 0)
  })

  return null
}