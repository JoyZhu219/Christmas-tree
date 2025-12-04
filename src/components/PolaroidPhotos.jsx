import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function PolaroidPhotos({ progress, isMobile }) {
  const groupRef = useRef()
  const photoCount = 12
  const { gl } = useThree()

  const texturePaths = useMemo(() => 
    Array.from({ length: photoCount }, (_, i) => `/photos/photo-${i + 1}.jpg`), 
  [photoCount])
  
  const textures = useTexture(texturePaths)

  // 保持高清纹理
  useEffect(() => {
    textures.forEach(texture => {
      texture.anisotropy = gl.capabilities.getMaxAnisotropy()
      texture.colorSpace = THREE.SRGBColorSpace
      texture.minFilter = THREE.LinearMipmapLinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.needsUpdate = true
    })
  }, [textures, gl])

  const photosData = useMemo(() => {
    const data = []
    
    for (let i = 0; i < photoCount; i++) {
      // -------------------------------------------------------------
      // 1. CHAOS 状态 (核心修改：响应式布局)
      // -------------------------------------------------------------
      
      // 宽度 (Spread X):
      // PC: 22 (宽屏) -> 照片左右排开
      // Mobile: 6 (竖屏) -> 限制在手机屏幕宽度内，防止飞出视野
      const spreadX = isMobile ? 6 : 22 
      
      // 高度 (Spread Y):
      // PC: 8 (扁平)
      // Mobile: 14 (高耸) -> 利用手机垂直空间，上下拉开距离，避免重叠
      const spreadY = isMobile ? 14 : 8  
      
      const chaosX = (Math.random() - 0.5) * spreadX
      
      // 中心点高度调整: 
      // 手机端稍微抬高一点 (5)，避免被底部的 UI 提示文字挡住
      const centerY = isMobile ? 5 : 4
      const chaosY = (Math.random() - 0.5) * spreadY + centerY
      
      // 深度 (Z轴):
      // 手机端 FOV 较大，物体显得远。稍微拉近一点 (Base 10) 让照片看清楚细节
      const baseZ = isMobile ? 10 : 12
      const chaosZ = baseZ + Math.random() * (isMobile ? 4 : 6)
      
      const chaosPos = new THREE.Vector3(chaosX, chaosY, chaosZ)

      // Chaos 旋转: 稍微乱一点，但大致面向观众
      const chaosRot = new THREE.Euler(
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.2
      )

      // -------------------------------------------------------------
      // 2. FORMED 状态: 贴合树身 (保持不变)
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
  }, [photoCount, isMobile]) // 依赖 isMobile，切换设备时自动重算布局

  useFrame((state) => {
    if (groupRef.current) {
      const t = progress
      const ease = t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1

      groupRef.current.children.forEach((child, i) => {
        const data = photosData[i]
        
        child.position.lerpVectors(data.chaosPos, data.targetPos, ease)
        
        // 旋转插值
        child.rotation.x = THREE.MathUtils.lerp(data.chaosRot.x, data.targetRot.x, ease)
        child.rotation.y = THREE.MathUtils.lerp(data.chaosRot.y, data.targetRot.y, ease)
        child.rotation.z = THREE.MathUtils.lerp(data.chaosRot.z, data.targetRot.z, ease)

        // 悬浮呼吸效果 (极慢，防止眩晕)
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
            {/* 1. 金框: 手机端关闭投影以提升性能 */}
            <mesh castShadow={!isMobile} position={[0, 0, -0.02]}>
                <boxGeometry args={[1.3, 1.6, 0.05]} /> 
                <meshStandardMaterial color="#FFD700" metalness={1.0} roughness={0.15} envMapIntensity={1.5} />
            </mesh>
            
            {/* 2. 纸底 */}
            <mesh position={[0, 0, 0.01]}>
                <boxGeometry args={[1.2, 1.5, 0.01]} />
                <meshStandardMaterial color="#FDF5E6" roughness={0.9} />
            </mesh>

            {/* 3. 照片 */}
            <mesh position={[0, 0.1, 0.02]}>
                <planeGeometry args={[1.0, 1.0]} />
                <meshBasicMaterial 
                  map={textures[i]} 
                  toneMapped={false} // 保持色彩鲜艳
                />
            </mesh>
            
            {/* 4. 玻璃层: PC端物理材质，手机端极简模拟 */}
            {!isMobile ? (
                <mesh position={[0, 0.1, 0.025]}>
                    <planeGeometry args={[1.0, 1.0]} />
                    <meshPhysicalMaterial color="white" transmission={0.9} opacity={0.3} transparent roughness={0.0} metalness={0.2} clearcoat={1.0} />
                </mesh>
            ) : (
               <mesh position={[0, 0.1, 0.025]}>
                    <planeGeometry args={[1.0, 1.0]} />
                    <meshStandardMaterial color="white" opacity={0.15} transparent roughness={0.1} metalness={0.5} />
               </mesh>
            )}
        </group>
      ))}
    </group>
  )
}