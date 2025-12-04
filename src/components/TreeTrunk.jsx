import React from 'react'

export default function TreeTrunk() {
  return (
    <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.8, 1.2, 2, 16]} />
      <meshStandardMaterial 
        color="#3E2723"
        metalness={0.2}
        roughness={0.9}
      />
    </mesh>
  )
}