import { useEffect, useRef, useState } from 'react'

export const useTimer = (seconds: number, onExpire: () => void) => {
  const [remaining, setRemaining] = useState(seconds)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  useEffect(() => {
    if (remaining <= 0) {
      onExpireRef.current()
      return
    }
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id)
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [remaining])

  const minutes = Math.floor(remaining / 60)
  const secs = remaining % 60
  const formatted = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  const fraction = remaining / seconds

  return { remaining, formatted, fraction }
}
