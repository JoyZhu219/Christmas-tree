import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Ornaments({ state, progress, isMobile }) {
  // 引用
  const giftBodyRef = useRef()
  const giftRibbon1Ref = useRef()
  const giftRibbon2Ref = useRef()
  const ballRef = useRef()
  const diamondRef = useRef()
  
  // 1. 分级配置：手机端数量减半
  const ornamentCount = isMobile 
    ? { gifts: 20, balls: 40, diamonds: 20 }
    : { gifts: 40, balls: 80, diamonds: 40 }
  
  // 2. 数据生成 (保持不变)
  const { giftData, ballData, diamondData } = useMemo(() => {
    const createOrnamentData = (count, yRange, radiusFactor) => {
      const data = []
      for (let i = 0; i < count; i++) {
        // Chaos
        const chaosRadius = 10 + Math.random() * 5
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const chaosPos = new THREE.Vector3(
          chaosRadius * Math.sin(phi) * Math.cos(theta),
          chaosRadius * Math.sin(phi) * Math.sin(theta),
          chaosRadius * Math.cos(phi)
        )
        // Target
        const treeY = Math.random() * yRange
        const maxRadius = (11 - treeY) * radiusFactor 
        const angle = Math.random() * Math.PI * 2
        const radius = maxRadius * (0.75 + Math.random() * 0.2) 
        const targetPos = new THREE.Vector3(
          Math.cos(angle) * radius,
          treeY,
          Math.sin(angle) * radius
        )
        data.push({ chaosPos, targetPos, scale: 0.8 + Math.random() * 0.5 })
      }
      return data
    }

    const giftData = createOrnamentData(ornamentCount.gifts, 6, 0.55)
    const ballData = createOrnamentData(ornamentCount.balls, 10, 0.45)
    const diamondData = createOrnamentData(ornamentCount.diamonds, 9, 0.50)

    return { giftData, ballData, diamondData }
  }, [ornamentCount])

  // 3. 动画帧循环
  useFrame((state) => {
    const t = progress
    const ease = t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    
    const dummy = new THREE.Object3D()

    // --- 更新礼物盒 ---
    if (giftBodyRef.current && giftRibbon1Ref.current && giftRibbon2Ref.current) {
      giftData.forEach((ornament, i) => {
        const currentPos = new THREE.Vector3().lerpVectors(ornament.chaosPos, ornament.targetPos, ease)
        dummy.position.copy(currentPos)
        
        // [修复点] 使用绝对时间 (=)，而不是累加 (+=)
        // 这样无论组件渲染多少次，位置都是确定的，不会加速
        dummy.rotation.x = i + state.clock.elapsedTime * 0.1
        dummy.rotation.y = i + state.clock.elapsedTime * 0.05
        dummy.rotation.z = i * 0.5 
        
        const s = ornament.scale
        dummy.scale.set(s, s, s)
        dummy.updateMatrix()

        giftBodyRef.current.setMatrixAt(i, dummy.matrix)
        giftRibbon1Ref.current.setMatrixAt(i, dummy.matrix)
        giftRibbon2Ref.current.setMatrixAt(i, dummy.matrix)
      })
      giftBodyRef.current.instanceMatrix.needsUpdate = true
      giftRibbon1Ref.current.instanceMatrix.needsUpdate = true
      giftRibbon2Ref.current.instanceMatrix.needsUpdate = true
    }

    // --- 更新金球 ---
    if (ballRef.current) {
      ballData.forEach((ornament, i) => {
        const currentPos = new THREE.Vector3().lerpVectors(ornament.chaosPos, ornament.targetPos, ease)
        dummy.position.copy(currentPos)
        dummy.rotation.set(0, 0, 0)
        dummy.scale.setScalar(ornament.scale * 0.5)
        dummy.updateMatrix()
        ballRef.current.setMatrixAt(i, dummy.matrix)
      })
      ballRef.current.instanceMatrix.needsUpdate = true
    }

    // --- 更新钻石 ---
    if (diamondRef.current) {
      diamondData.forEach((ornament, i) => {
        const currentPos = new THREE.Vector3().lerpVectors(ornament.chaosPos, ornament.targetPos, ease)
        dummy.position.copy(currentPos)
        
        dummy.rotation.y = i + state.clock.elapsedTime * 0.3
        dummy.rotation.x = i + state.clock.elapsedTime * 0.2
        
        dummy.scale.setScalar(ornament.scale * 0.35)
        dummy.updateMatrix()
        diamondRef.current.setMatrixAt(i, dummy.matrix)
      })
      diamondRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <>
      <group>
        {/* [修复点] 添加 key 属性，防止 Buffer Resize Error */}
        <instancedMesh key={`gift-body-${ornamentCount.gifts}`} ref={giftBodyRef} args={[null, null, ornamentCount.gifts]} castShadow={!isMobile}>
          <boxGeometry args={[0.6, 0.6, 0.6]} /> 
          <meshStandardMaterial color="#8B0000" metalness={isMobile ? 0.2 : 0.3} roughness={0.4} envMapIntensity={isMobile ? 0.5 : 1.0} />
        </instancedMesh>

        <instancedMesh key={`ribbon1-${ornamentCount.gifts}`} ref={giftRibbon1Ref} args={[null, null, ornamentCount.gifts]} castShadow={!isMobile}>
          <boxGeometry args={[0.62, 0.15, 0.62]} /> 
          <meshStandardMaterial color="#FFD700" metalness={1.0} roughness={0.1} emissive="#B8860B" emissiveIntensity={0.2} />
        </instancedMesh>

        <instancedMesh key={`ribbon2-${ornamentCount.gifts}`} ref={giftRibbon2Ref} args={[null, null, ornamentCount.gifts]} castShadow={!isMobile}>
          <boxGeometry args={[0.15, 0.62, 0.62]} /> 
          <meshStandardMaterial color="#FFD700" metalness={1.0} roughness={0.1} emissive="#B8860B" emissiveIntensity={0.2} />
        </instancedMesh>
      </group>

      <instancedMesh key={`balls-${ornamentCount.balls}`} ref={ballRef} args={[null, null, ornamentCount.balls]} castShadow={!isMobile}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#FFD700" metalness={1.0} roughness={0.05} emissive="#FFD700" emissiveIntensity={isMobile ? 0.2 : 0.4} envMapIntensity={isMobile ? 1.0 : 2.5} />
      </instancedMesh>

      <instancedMesh key={`diamonds-${ornamentCount.diamonds}`} ref={diamondRef} args={[null, null, ornamentCount.diamonds]} castShadow={!isMobile}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshPhysicalMaterial color="#E0FFFF" metalness={0.0} roughness={0.0} transmission={isMobile ? 0.6 : 0.9} thickness={1.5} ior={2.4} envMapIntensity={isMobile ? 1.0 : 3.0} />
      </instancedMesh>
    </>
  )
}