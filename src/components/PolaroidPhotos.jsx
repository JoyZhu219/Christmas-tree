import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

// 接收 isMobile 属性
export default function PolaroidPhotos({ progress, isMobile }) {
  const groupRef = useRef()
  const photoCount = 12

  const texturePaths = useMemo(() => 
    Array.from({ length: photoCount }, (_, i) => `/photos/photo-${i + 1}.jpg`), 
  [photoCount])
  
  const textures = useTexture(texturePaths)

  const photosData = useMemo(() => {
    const data = []
    
    for (let i = 0; i < photoCount; i++) {
      // -------------------------------------------------------------
      // 1. CHAOS 状态: 适配移动端布局
      // -------------------------------------------------------------
      
      // PC端: 宽屏分布 (宽22, 高8)
      // Mobile: 竖屏分布 (宽6, 高14) -> 让照片在垂直方向散开，适应手机屏幕
      const spreadX = isMobile ? 6 : 22 
      const spreadY = isMobile ? 14 : 8  
      
      // 基础位置
      const chaosX = (Math.random() - 0.5) * spreadX
      // 手机端稍微抬高一点中心点 (center Y 从 4 提到 5)，避免被底部UI挡住
      const centerY = isMobile ? 5 : 4
      const chaosY = (Math.random() - 0.5) * spreadY + centerY
      
      // 深度: 手机端为了看得清，稍微拉近一点点 (12-16 -> 10-14)
      const baseZ = isMobile ? 10 : 12
      const chaosZ = baseZ + Math.random() * (isMobile ? 4 : 6)
      
      const chaosPos = new THREE.Vector3(chaosX, chaosY, chaosZ)

      // 旋转: 保持轻微随机
      const chaosRot = new THREE.Euler(
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.2
      )

      // -------------------------------------------------------------
      // 2. FORMED 状态: 贴合树身
      // -------------------------------------------------------------
      const treeY = 1.0 + (i / photoCount) * 8.5 
      const maxRadiusAtY = 4.0 * (1 - treeY / 11) 
      const radius = maxRadiusAtY + 0.6 
      
      const angleSpread = Math.PI / 1.2 
      const angleOffset = (Math.random() - 0.5) * 0.5 
      const normalizedIndex = (i / (photoCount - 1)) - 0.5 
      const angle = normalizedIndex * angleSpread + angleOffset + Math.PI / 2
      
      const targetPos = new THREE.Vector3(
        Math.cos(angle) * radius,
        treeY,
        Math.sin(angle) * radius
      )

      const targetRot = new THREE.Euler(
        -0.1, 
        -angle + Math.PI / 2, 
        (Math.random() - 0.5) * 0.15 
      )

      data.push({ chaosPos, chaosRot, targetPos, targetRot })
    }
    return data
  }, [photoCount, isMobile]) // 依赖项加入 isMobile，切换设备时重新计算布局

  useFrame((state) => {
    if (groupRef.current) {
      const t = progress
      const ease = t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1

      groupRef.current.children.forEach((child, i) => {
        const data = photosData[i]
        
        child.position.lerpVectors(data.chaosPos, data.targetPos, ease)
        
        child.rotation.x = THREE.MathUtils.lerp(data.chaosRot.x, data.targetRot.x, ease)
        child.rotation.y = THREE.MathUtils.lerp(data.chaosRot.y, data.targetRot.y, ease)
        child.rotation.z = THREE.MathUtils.lerp(data.chaosRot.z, data.targetRot.z, ease)

        if (progress < 0.8) {
             child.position.y += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.002
        } else {
             child.position.y += Math.sin(state.clock.elapsedTime * 1.0 + i) * 0.002
        }
      })
    }
  })

  return (
    <group ref={groupRef}>
      {photosData.map((data, i) => (
        <group key={i}>
            {/* 1. 金框: 手机端关闭投影 (castShadow={!isMobile}) */}
            <mesh castShadow={!isMobile} position={[0, 0, -0.02]}>
                <boxGeometry args={[1.3, 1.6, 0.05]} /> 
                <meshStandardMaterial 
                    color="#FFD700" 
                    metalness={1.0} 
                    roughness={0.15} 
                    envMapIntensity={1.5} 
                />
            </mesh>
            
            {/* 2. 纸底 */}
            <mesh position={[0, 0, 0.01]}>
                <boxGeometry args={[1.2, 1.5, 0.01]} />
                <meshStandardMaterial color="#FDF5E6" roughness={0.9} />
            </mesh>

            {/* 3. 照片 */}
            <mesh position={[0, 0.1, 0.02]}>
                <planeGeometry args={[1.0, 1.0]} />
                <meshBasicMaterial map={textures[i]} />
            </mesh>
            
            {/* 4. 玻璃质感层: 性能优化重点 */}
            {/* 手机端完全移除这层玻璃，或者使用极简材质 */}
            {!isMobile && (
                <mesh position={[0, 0.1, 0.025]}>
                    <planeGeometry args={[1.0, 1.0]} />
                    <meshPhysicalMaterial 
                        color="white"
                        transmission={0.9} // 这是一个极其昂贵的属性
                        opacity={0.3}
                        transparent
                        roughness={0.0}
                        metalness={0.2}
                        clearcoat={1.0}
                    />
                </mesh>
            )}
            
            {/* 移动端替代方案：如果你想要一点点光泽，可以用简单的 StandardMaterial */}
            {isMobile && (
               <mesh position={[0, 0.1, 0.025]}>
                    <planeGeometry args={[1.0, 1.0]} />
                    <meshStandardMaterial 
                        color="white"
                        opacity={0.1} // 仅增加一点点微弱的白色反光
                        transparent
                        roughness={0.1}
                        metalness={0.5}
                    />
               </mesh>
            )}
        </group>
      ))}
    </group>
  )
}