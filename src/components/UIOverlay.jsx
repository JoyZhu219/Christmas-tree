import React from 'react'

export default function UIOverlay({ state, isMobile, cameraEnabled, onToggleCamera, isLoading }) {
  return (
    <>
      {/* Title - 加载后淡入 */}
      <div 
        className="fixed top-8 left-1/2 transform -translate-x-1/2 text-center pointer-events-none z-10 transition-opacity duration-2000"
        style={{ 
          opacity: isLoading ? 0 : 0.7,
          transitionDelay: '500ms'
        }}
      >
        <h1 className="luxury-text font-bold tracking-wider text-luxury-gold drop-shadow-md" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
          GRAND LUXURY
        </h1>
        <p className="luxury-text font-light tracking-widest text-white/80 text-sm md:text-base" style={{ letterSpacing: '0.3em' }}>
          CHRISTMAS TREE
        </p>
      </div>

      {/* State Indicator - 右上角状态胶囊 */}
      <div 
        className="fixed top-8 right-8 z-20 pointer-events-none transition-opacity duration-1000"
        style={{ opacity: isLoading ? 0 : 0.8 }}
      >
        <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-luxury-gold/30 shadow-[0_0_15px_rgba(255,215,0,0.2)]">
          <p className="text-luxury-gold text-xs md:text-sm font-bold tracking-wider">
            {state === 'CHAOS' ? '✋ UNLEASHED' : '✨ FORMED'}
          </p>
        </div>
      </div>

      {/* Controls Hint - 底部操作提示 (核心修改) */}
      <div 
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 transition-opacity duration-1000 w-max max-w-[90vw]"
        style={{ 
          opacity: isLoading ? 0 : 0.9,
          background: 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(20,20,20,0.9) 50%, rgba(0,0,0,0.6) 100%)',
          padding: '10px 40px',
          borderRadius: '30px',
          borderTop: '1px solid rgba(255, 215, 0, 0.3)',
          borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
          pointerEvents: 'none' // 让点击穿透到底层的 Canvas
        }}
      >
        <p style={{ 
          color: '#FFD700',
          fontSize: '0.85rem',
          margin: 0,
          textAlign: 'center',
          fontFamily: 'system-ui',
          letterSpacing: '0.05em',
          textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
          whiteSpace: 'nowrap'
        }}>
          {isMobile 
            ? '👆 Tap Screen to Toggle • ✨ Experience Luxury'
            : cameraEnabled 
              ? '🖐️ Open: Chaos • ✊ Fist: Form • 👋 Move: Rotate View'
              : '🖱️ Click to Toggle State • 📷 Enable Camera for Magic'
          }
        </p>
      </div>

      {/* Camera Toggle Button (Desktop) */}
      {!isMobile && (
        <button
          onClick={onToggleCamera}
          className="fixed top-8 left-8 z-20 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-luxury-gold/30 hover:bg-black/80 hover:border-luxury-gold transition-all duration-300 group"
          style={{ opacity: isLoading ? 0 : 1 }}
        >
          <span className="text-luxury-gold/80 group-hover:text-luxury-gold text-xs font-bold tracking-wider flex items-center gap-2">
            {cameraEnabled ? (
              <><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> AI VISION ON</>
            ) : (
              <><span className="w-2 h-2 rounded-full bg-red-500"/> AI VISION OFF</>
            )}
          </span>
        </button>
      )}

      {/* Info Button */}
      <button
        onClick={() => {
          alert('🎄 Grand Luxury Christmas Tree\n\nInteractive 3D Experience\n\n✨ 18,000 Gold-Dust Particles\n🎁 Physics-based Ornaments\n📸 Floating Polaroid Gallery\n\nGestures:\n• Open Hand: Explode Tree\n• Closed Fist: Reform Tree\n• Hand Position: Rotate Camera')
        }}
        className="fixed bottom-8 right-8 z-20 w-10 h-10 rounded-full border border-luxury-gold/30 bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-luxury-gold/20 transition-all text-luxury-gold"
        style={{ opacity: isLoading ? 0 : 0.8 }}
      >
        <span className="text-lg">ℹ️</span>
      </button>
    </>
  )
}