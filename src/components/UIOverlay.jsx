import React from 'react'

export default function UIOverlay({ 
  state, 
  isMobile, 
  cameraEnabled, 
  onToggleCamera, 
  isLoading, 
  isMuted, 
  onToggleMute 
}) {
  // 定义 Info 点击事件
  const handleInfoClick = (e) => {
    e.stopPropagation()
    alert('🎄 Joyeux Noël\n\n✨ 沉浸式 3D 视觉盛宴\n\n🌟 数万颗流光金粉粒子\n🎁 纯金丝带礼盒与璀璨钻石\n📸 悬浮拍立得回忆画廊\n\n🔮 交互指南：\n✋ 张开手掌 / 点击屏幕：解构星云 (Unleash)\n✊ 握紧拳头 / 再次点击：重塑辉煌 (Reform)\n👋 手势移动 / 滑动屏幕：环绕视角 (Rotate)')
  }

  return (
    <>
      {/* 1. 标题 (Updated Title & Mobile Fix) */}
      <div 
        className="fixed top-8 left-1/2 transform -translate-x-1/2 text-center pointer-events-none z-10 transition-opacity duration-2000 w-full px-4"
        style={{ 
          opacity: isLoading ? 0 : 0.7,
          transitionDelay: '500ms'
        }}
      >
        <h1 
          className="luxury-text font-bold tracking-wider text-luxury-gold drop-shadow-md whitespace-nowrap"
          style={{ 
            fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', 
            fontFamily: 'serif' 
          }}
        >
          Joyeux Noël
        </h1>
        
        <p 
          className="luxury-text font-light text-white/80 text-[10px] md:text-base whitespace-nowrap"
          style={{ 
            letterSpacing: isMobile ? '0.15em' : '0.25em', 
            marginTop: '0.5rem',
            lineHeight: 1
          }}
        >
          ✧ Christmas Tree ✧
        </p>
      </div>

      {/* 2. 状态指示器 (右上角) */}
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

      {/* 3. 左侧控制组 (功能按钮统一归纳于此) */}
      <div className="fixed top-8 left-8 z-20 flex flex-col gap-4 transition-opacity duration-1000" style={{ opacity: isLoading ? 0 : 1 }}>
        
        {/* 相机开关 (仅桌面端) */}
        {!isMobile && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleCamera(); }}
            className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-luxury-gold/30 hover:bg-black/80 hover:border-luxury-gold transition-all duration-300 group flex items-center gap-2"
          >
            <span className="text-luxury-gold/80 group-hover:text-luxury-gold text-xs font-bold tracking-wider flex items-center gap-2">
              {cameraEnabled ? (
                <><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> VISION ON</>
              ) : (
                <><span className="w-2 h-2 rounded-full bg-red-500"/> VISION OFF</>
              )}
            </span>
          </button>
        )}

        {/* 声音开关 */}
        <button
          onClick={onToggleMute}
          className="w-10 h-10 rounded-full border border-luxury-gold/30 bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-luxury-gold/20 transition-all text-luxury-gold"
          title="Toggle Music"
        >
          <span className="text-lg">{isMuted ? '🔇' : '🔊'}</span>
        </button>

        {/* --- Info 按钮  --- */}
        {/* 这样手机上它就在声音按钮下面，绝对不会遮挡底部的文字 */}
        <button
          onClick={handleInfoClick}
          className="w-10 h-10 rounded-full border border-luxury-gold/30 bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-luxury-gold/20 transition-all text-luxury-gold"
          title="Info"
        >
          <span className="text-lg">ℹ️</span>
        </button>
      </div>

      {/* 4. 底部操作提示 (现在它是底部唯一的元素了，非常干净) */}
      <div 
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 transition-opacity duration-1000 w-max max-w-[90vw]"
        style={{ 
          opacity: isLoading ? 0 : 0.9,
          background: 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(20,20,20,0.9) 50%, rgba(0,0,0,0.6) 100%)',
          padding: '10px 40px',
          borderRadius: '30px',
          borderTop: '1px solid rgba(255, 215, 0, 0.3)',
          borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
          pointerEvents: 'none'
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
            ? '👆 点击屏幕切换状态 • ✨ 体验奢华互动'
            : cameraEnabled 
              ? '🖐️ 张手: 散开 • ✊ 握拳: 聚合 • 👋 移动: 旋转'
              : '🖱️ 点击切换状态 • 📷 开启摄像头体验魔法'
          }
        </p>
      </div>
    </>
  )
}