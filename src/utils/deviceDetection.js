export const isMobile = () => {
  if (typeof window === 'undefined') return false

  // 1. 基础 User Agent 检测 (手机)
  const isAndroidOrBasicMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )

  // 2. iPadOS 13+ 检测 (伪装成 Mac 的 iPad)
  const isIpad =
    navigator.userAgent.includes('Mac') && 
    navigator.maxTouchPoints > 1

  // 3. 屏幕宽度检测 (分屏或小窗口)
  const isSmallScreen = window.innerWidth < 1024

  return isAndroidOrBasicMobile || isIpad || isSmallScreen
}