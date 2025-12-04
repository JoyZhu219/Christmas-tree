import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function FoliageSystem({ state, progress, isMobile }) {
  const pointsRef = useRef()
  const materialRef = useRef()
  
  // 1. 确定粒子数量
  const particleCount = isMobile ? 6000 : 25000 

  const { positions, colors, sizes, targetPositions, randomAngles } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const targetPositions = new Float32Array(particleCount * 3)
    const randomAngles = new Float32Array(particleCount)

    // Deep Forest Green 配色
    const greenShades = [
      new THREE.Color('#002400'),
      new THREE.Color('#004b23'),
      new THREE.Color('#006400'),
      new THREE.Color('#007200'),
      new THREE.Color('#008000'),
      new THREE.Color('#38b000'),
    ]
    const goldColor = new THREE.Color('#FFD700') 

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      randomAngles[i] = Math.random() * Math.PI * 2

      // Chaos 分布
      const chaosRadius = 12 + Math.random() * 8
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      positions[i3] = chaosRadius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = chaosRadius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = chaosRadius * Math.cos(phi)

      // Formed 分布
      const layer = Math.pow(Math.random(), 1.5)
      const treeY = layer * 11
      const maxRadiusAtY = 5.5 * (1 - layer) 
      const spiralAngle = layer * 25.0 + Math.random() * Math.PI * 2
      const radius = Math.sqrt(Math.random()) * maxRadiusAtY
      
      targetPositions[i3] = Math.cos(spiralAngle) * radius
      targetPositions[i3 + 1] = treeY - 1
      targetPositions[i3 + 2] = Math.sin(spiralAngle) * radius

      // 1% 金色点缀
      const isGold = Math.random() > 0.99
      let color
      
      if (isGold) {
          color = goldColor
          sizes[i] = (Math.random() * 2.5 + 0.5) * (isMobile ? 1.5 : 1.0)
      } else {
          const shadeIndex = Math.floor(Math.pow(Math.random(), 1.5) * greenShades.length)
          color = greenShades[shadeIndex]
          sizes[i] = (Math.random() * 1.5 + 0.2) * (isMobile ? 1.5 : 1.0)
      }
      
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    }

    return { positions, colors, sizes, targetPositions, randomAngles }
  }, [particleCount, isMobile])

  useFrame((state) => {
    const t = progress 
    const ease = 1 - Math.pow(1 - t, 4)

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }

    // --- 速度修复 1: 漩涡强度 ---
    // 之前是 15.0，现在降到 2.0
    // 这决定了粒子从 Chaos 变到 Formed 时“甩”的力度。太大会晕。
    const swirlStrength = (1 - ease) * 2.0 
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      let x = THREE.MathUtils.lerp(positions[i3], targetPositions[i3], ease)
      let y = THREE.MathUtils.lerp(positions[i3+1], targetPositions[i3+1], ease)
      let z = THREE.MathUtils.lerp(positions[i3+2], targetPositions[i3+2], ease)
      
      if (t < 0.99) {
          const angle = swirlStrength * (1.0 - y/12.0) + randomAngles[i] * 0.1
          const cosA = Math.cos(angle)
          const sinA = Math.sin(angle)
          const nx = x * cosA - z * sinA
          const nz = x * sinA + z * cosA
          x = nx
          z = nz
      }
      pointsRef.current.geometry.attributes.position.array[i3] = x
      pointsRef.current.geometry.attributes.position.array[i3+1] = y
      pointsRef.current.geometry.attributes.position.array[i3+2] = z
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
    
    // --- 速度修复 2: 整体自转速度 ---
    // 当 progress 为 0 (Chaos) 时，基础速度是 0.005 (极其缓慢，甚至几乎静止)
    // 当 progress 为 1 (Formed) 时，增加 0.05 的速度 (正常展示)
    const rotationSpeed = 0.005 + (progress * 0.05)
    pointsRef.current.rotation.y += rotationSpeed * 0.016 
  })

  const vertexShader = `
    uniform float uTime;
    attribute float size;
    attribute vec3 color; 
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      float twinkle = sin(uTime * 5.0 + position.x * 10.0) * 0.5 + 0.5;
      bool isGold = color.r > 0.8 && color.g > 0.8;
      float boost = isGold ? 4.0 : 1.0; 
      vAlpha = (0.7 + twinkle * 0.3) * boost; 
      gl_PointSize = size * (350.0 + twinkle * 150.0) * boost / -mvPosition.z;
      gl_Position = projectionMatrix * mvPosition;
    }
  `

  const fragmentShader = `
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      if (dist > 0.5) discard;
      float glow = 1.0 - (dist * 2.0);
      glow = pow(glow, 2.0); 
      vec3 glowColor = vColor.g > 0.4 ? vec3(0.0, 0.2, 0.0) : vec3(0.2, 0.2, 0.0);
      gl_FragColor = vec4(vColor + glowColor * glow * 0.5, vAlpha * glow);
    }
  `

  return (
    // --- 报错修复核心：添加 key={particleCount} ---
    // 这强制 React 在数量变化时销毁旧对象，创建新对象，而不是尝试调整大小
    <points ref={pointsRef} key={particleCount}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particleCount} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={particleCount} array={sizes} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ uTime: { value: 0 } }}
      />
    </points>
  )
}