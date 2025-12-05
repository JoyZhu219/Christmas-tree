import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function PolaroidPhotos({ progress, isMobile }) {
  const groupRef = useRef()
  const photoCount = 12
  const { gl } = useThree()
  const [introFinished, setIntroFinished] = useState(false)

  const texturePaths = useMemo(() => 
    Array.from({ length: photoCount }, (_, i) => `/photos/photo-${i + 1}.jpg`), 
  [photoCount])
  
  const textures = useTexture(texturePaths)

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
      // 1. CHAOS (Mobile Friendly)
      const spreadX = isMobile ? 6 : 22 
      const spreadY = isMobile ? 14 : 8  
      const chaosX = (Math.random() - 0.5) * spreadX
      const chaosY = (Math.random() - 0.5) * spreadY + (isMobile ? 5 : 4)
      const baseZ = isMobile ? 10 : 12
      const chaosZ = baseZ + Math.random() * (isMobile ? 4 : 6)
      
      const chaosPos = new THREE.Vector3(chaosX, chaosY, chaosZ)
      const chaosRot = new THREE.Euler(
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.2
      )

      // 2. FORMED
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

      data.push({ chaosPos, chaosRot, targetPos, targetRot, angle, radius, treeY })
    }
    return data
  }, [photoCount, isMobile])

  // --- 缓动函数：让动画更有质感 ---
  //以此实现 "快启动 -> 慢结束" 的梦幻感
  const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
  // 以此实现 "到达后回弹" 的奢华感
  const easeOutBack = (x) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  }

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime
      
      // 动画时间轴配置
      const introDelay = 2.5 // 等待 LoadingScreen 消失
      const introDuration = 3.0 // 延长动画时间，更优雅
      const isIntro = time < (introDelay + introDuration + 1.0)

      if (isIntro && !introFinished) {
        // --- 🌟 梦幻涡流特效 (Magic Vortex) ---
        groupRef.current.children.forEach((child, i) => {
          const data = photosData[i]
          
          // 错落感：根据高度决定出发顺序，像喷泉一样涌出
          const myDelay = i * 0.1 
          let myTime = time - introDelay - myDelay
          
          if (myTime < 0) {
             child.scale.set(0,0,0) // 还没开始时隐藏
             return
          }

          // 归一化进度
          let t = Math.min(1, myTime / 2.0) // 每个物体运动 2秒
          const easeT = easeOutCubic(t)
          const bounceT = easeOutBack(t)

          // 1. 涡流路径 (Vortex Path)
          // 初始半径很大 (15)，随着上升迅速收缩归位 -> 形成龙卷风形状
          const vortexRadius = THREE.MathUtils.lerp(15, data.radius, easeT)
          
          // 初始高度很深 (-15)，从深渊升起
          const currentY = THREE.MathUtils.lerp(-15, data.treeY, easeT)
          
          // 旋转圈数：从 5圈 (10PI) 减速到 0
          const spinAngle = data.angle + (1 - easeT) * Math.PI * 6 

          child.position.x = Math.cos(spinAngle) * vortexRadius
          child.position.y = currentY
          child.position.z = Math.sin(spinAngle) * vortexRadius

          // 2. 梦幻翻转 (Dreamy Flip)
          if (t < 0.8) {
             // 上升期：高速自转，展示金色的背面，产生闪烁感
             // 加上 i * 0.5 让每个照片旋转相位不同，更自然
             child.rotation.set(time * 2 + i, time * 3, time) 
          } else {
             // 归位期 (0.8 - 1.0)：优雅地翻转回正面
             const flipT = (t - 0.8) * 5 // 归一化 0->1
             // 使用 S 形曲线平滑过渡
             const smoothFlip = flipT * flipT * (3 - 2 * flipT)
             
             child.rotation.x = THREE.MathUtils.lerp(child.rotation.x % (Math.PI*2), data.targetRot.x, smoothFlip)
             child.rotation.y = THREE.MathUtils.lerp(child.rotation.y % (Math.PI*2), data.targetRot.y, smoothFlip)
             child.rotation.z = THREE.MathUtils.lerp(child.rotation.z % (Math.PI*2), data.targetRot.z, smoothFlip)
          }

          // 3. 弹性缩放 (Elastic Pop)
          // 到达时稍微放大到 1.1 倍再弹回 1.0，显得有弹性
          child.scale.setScalar(bounceT)
        })

        if (time > introDelay + introDuration + 2) setIntroFinished(true)

      } else {
        // --- 正常交互模式 ---
        const t = progress
        // 使用更柔和的缓动
        const ease = t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t

        groupRef.current.children.forEach((child, i) => {
          const data = photosData[i]
          
          child.position.lerpVectors(data.chaosPos, data.targetPos, ease)
          
          // 旋转逻辑优化：确保平滑
          // 使用 Quaternion 插值可能更好，但 Euler 插值在小范围也够用
          child.rotation.x = THREE.MathUtils.lerp(data.chaosRot.x, data.targetRot.x, ease)
          child.rotation.y = THREE.MathUtils.lerp(data.chaosRot.y, data.targetRot.y, ease)
          child.rotation.z = THREE.MathUtils.lerp(data.chaosRot.z, data.targetRot.z, ease)

          child.scale.setScalar(1) 
          
          // 悬浮呼吸 (Float)
          const floatSpeed = 1.5
          const floatAmp = 0.003
          child.position.y += Math.sin(state.clock.elapsedTime * floatSpeed + i) * floatAmp
        })
      }
    }
  })

  return (
    <group ref={groupRef}>
      {photosData.map((data, i) => (
        <group key={i}>
            {/* 1. 奢华金背板 (加厚，圆角感) */}
            <mesh castShadow={!isMobile} position={[0, 0, -0.02]}>
                <boxGeometry args={[1.35, 1.65, 0.06]} /> 
                <meshStandardMaterial 
                    color="#FFD700" 
                    metalness={1.0} 
                    roughness={0.1} // 更加光滑，提升闪烁感
                    envMapIntensity={2.0} 
                />
            </mesh>
            
            {/* 2. 纸底 */}
            <mesh position={[0, 0, 0.01]}>
                <boxGeometry args={[1.2, 1.5, 0.01]} />
                <meshStandardMaterial color="#FFF8DC" roughness={0.9} />
            </mesh>

            {/* 3. 照片 */}
            <mesh position={[0, 0.1, 0.02]}>
                <planeGeometry args={[1.0, 1.0]} />
                <meshBasicMaterial 
                  map={textures[i]} 
                  toneMapped={false}
                  side={THREE.FrontSide} // 关键：只渲染正面
                />
            </mesh>
            
            {/* 4. 玻璃层 */}
            {!isMobile ? (
                <mesh position={[0, 0.1, 0.025]}>
                    <planeGeometry args={[1.0, 1.0]} />
                    <meshPhysicalMaterial color="white" transmission={0.9} opacity={0.3} transparent roughness={0.0} metalness={0.2} clearcoat={1.0} side={THREE.FrontSide} />
                </mesh>
            ) : (
               <mesh position={[0, 0.1, 0.025]}>
                    <planeGeometry args={[1.0, 1.0]} />
                    <meshStandardMaterial color="white" opacity={0.15} transparent roughness={0.1} metalness={0.5} side={THREE.FrontSide} />
               </mesh>
            )}
        </group>
      ))}
    </group>
  )
}