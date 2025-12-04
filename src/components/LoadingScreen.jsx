// src/components/LoadingScreen.jsx
import React, { useEffect, useState } from 'react'

export default function LoadingScreen({ started }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (started) {
      // 给予一点延迟让淡出动画播放
      const timer = setTimeout(() => setVisible(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [started])

  if (!visible) return null

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-1000 ${started ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="text-center">
        <div className="luxury-text text-5xl md:text-7xl font-bold mb-6 text-luxury-gold">
          GRAND LUXURY
        </div>
        <div className="luxury-text text-xl md:text-2xl font-light tracking-widest mb-8 text-white">
          CHRISTMAS TREE
        </div>
        
        {/* Loading Bar */}
        <div className="w-64 h-1 mx-auto bg-gray-800 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500 to-transparent w-1/2 animate-[shimmer_1.5s_infinite_linear]" />
        </div>
        
        <p className="text-gray-400 mt-6 text-xs uppercase tracking-widest">
          Initializing 3D Environment...
        </p>
      </div>
    </div>
  )
}