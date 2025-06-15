
import * as React from "react"

// Enhanced breakpoints for modern mobile devices
const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024
const LARGE_MOBILE_BREAKPOINT = 480

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [deviceInfo, setDeviceInfo] = React.useState({
    isIOS: false,
    isAndroid: false,
    isIPad: false,
    hasNotch: false,
    orientation: 'portrait' as 'portrait' | 'landscape'
  })

  React.useEffect(() => {
    // Enhanced mobile detection with platform-specific optimizations
    const checkIsMobile = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const userAgent = navigator.userAgent.toLowerCase()
      
      // Detect specific platforms with better accuracy
      const isIOS = /ipad|iphone|ipod/.test(userAgent)
      const isAndroid = /android/.test(userAgent)
      const isWindowsPhone = /windows phone/.test(userAgent)
      const isIPad = /ipad/.test(userAgent) || (navigator.maxTouchPoints > 1 && /macintosh/.test(userAgent))
      
      // Enhanced touch detection
      const isTouchDevice = 'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 || 
        (navigator as any).msMaxTouchPoints > 0
      
      // Screen orientation detection
      const isPortrait = height > width
      
      // Device pixel ratio check
      const devicePixelRatio = window.devicePixelRatio || 1
      const isHighDPR = devicePixelRatio > 1
      
      // Detect notched devices (iPhone X and later)
      const hasNotch = isIOS && (
        width === 375 && height === 812 || // iPhone X, XS, 11 Pro
        width === 414 && height === 896 || // iPhone XR, 11, XS Max, 11 Pro Max
        width === 390 && height === 844 || // iPhone 12, 12 Pro
        width === 428 && height === 926 || // iPhone 12 Pro Max
        width === 375 && height === 667    // iPhone 6/7/8 with safe area
      ) || CSS.supports('padding: max(0px, env(safe-area-inset-top))')
      
      // Update device info
      setDeviceInfo({
        isIOS,
        isAndroid,
        isIPad,
        hasNotch,
        orientation: isPortrait ? 'portrait' : 'landscape'
      })
      
      // iOS devices are always considered mobile regardless of screen size
      if (isIOS && !isIPad) {
        return true
      }
      
      // iPad detection - treat as mobile if in portrait or smaller screen
      if (isIPad && (isPortrait || width < TABLET_BREAKPOINT)) {
        return true
      }
      
      // Android-specific checks
      if (isAndroid && width < TABLET_BREAKPOINT) {
        return true
      }
      
      // General mobile detection logic
      if (width < MOBILE_BREAKPOINT) {
        return true
      }
      
      // Edge case: Large Android tablets or foldable devices
      if (isTouchDevice && width < TABLET_BREAKPOINT && 
          (isAndroid || /mobile/.test(userAgent))) {
        return true
      }
      
      return false
    }
    
    // Initial check with performance optimization
    const initialCheck = () => {
      requestAnimationFrame(() => {
        setIsMobile(checkIsMobile())
      })
    }
    
    initialCheck()
    
    // Optimized resize handler with enhanced debouncing
    let timeoutId: NodeJS.Timeout
    let rafId: number
    
    const handleResize = () => {
      // Cancel previous requests
      clearTimeout(timeoutId)
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
      
      // Use RAF for smooth performance
      rafId = requestAnimationFrame(() => {
        timeoutId = setTimeout(() => {
          setIsMobile(checkIsMobile())
        }, 100)
      })
    }
    
    // Enhanced orientation change handler
    const handleOrientationChange = () => {
      clearTimeout(timeoutId)
      
      // Different delays for different platforms
      const delay = deviceInfo.isIOS ? 200 : 150
      
      setTimeout(() => {
        setIsMobile(checkIsMobile())
      }, delay)
    }
    
    // Visual viewport handler for mobile browsers
    const handleVisualViewportChange = () => {
      if (!window.visualViewport) return
      
      const threshold = 100
      const heightDiff = Math.abs(window.innerHeight - window.visualViewport.height)
      
      if (heightDiff > threshold) {
        // Keyboard is likely open/closed
        document.documentElement.style.setProperty(
          '--viewport-height', 
          `${window.visualViewport.height}px`
        )
      }
    }
    
    // Add event listeners with passive option for better performance
    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('orientationchange', handleOrientationChange, { passive: true })
    
    // Visual viewport API support
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportChange, { passive: true })
    }
    
    // Performance monitoring for mobile
    if (deviceInfo.isIOS || deviceInfo.isAndroid) {
      // Set CSS custom properties for device info
      document.documentElement.style.setProperty('--is-mobile', isMobile ? '1' : '0')
      document.documentElement.style.setProperty('--is-ios', deviceInfo.isIOS ? '1' : '0')
      document.documentElement.style.setProperty('--is-android', deviceInfo.isAndroid ? '1' : '0')
      document.documentElement.style.setProperty('--has-notch', deviceInfo.hasNotch ? '1' : '0')
    }
    
    // Cleanup function
    return () => {
      clearTimeout(timeoutId)
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientationChange)
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportChange)
      }
    }
  }, [deviceInfo.isIOS, deviceInfo.isAndroid])

  return isMobile
}

// Enhanced utility hooks for mobile development
export function useIsIOS() {
  return React.useMemo(() => {
    return /ipad|iphone|ipod/.test(navigator.userAgent.toLowerCase())
  }, [])
}

export function useIsAndroid() {
  return React.useMemo(() => {
    return /android/.test(navigator.userAgent.toLowerCase())
  }, [])
}

export function useDeviceOrientation() {
  const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>('portrait')
  
  React.useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
    }
    
    updateOrientation()
    window.addEventListener('orientationchange', updateOrientation, { passive: true })
    window.addEventListener('resize', updateOrientation, { passive: true })
    
    return () => {
      window.removeEventListener('orientationchange', updateOrientation)
      window.removeEventListener('resize', updateOrientation)
    }
  }, [])
  
  return orientation
}

export function useHasNotch() {
  return React.useMemo(() => {
    return CSS.supports('padding: max(0px, env(safe-area-inset-top))')
  }, [])
}

export function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = React.useState(0)
  
  React.useEffect(() => {
    if (!window.visualViewport) return
    
    const updateKeyboardHeight = () => {
      const heightDiff = window.innerHeight - window.visualViewport.height
      setKeyboardHeight(Math.max(0, heightDiff))
    }
    
    window.visualViewport.addEventListener('resize', updateKeyboardHeight, { passive: true })
    
    return () => {
      window.visualViewport?.removeEventListener('resize', updateKeyboardHeight)
    }
  }, [])
  
  return keyboardHeight
}

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine)
  const [connection, setConnection] = React.useState<any>(null)
  
  React.useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine)
    
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    
    // Network Information API (experimental)
    if ('connection' in navigator) {
      setConnection((navigator as any).connection)
    }
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])
  
  return { isOnline, connection }
}
