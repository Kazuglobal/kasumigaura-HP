'use client'

import { useSyncExternalStore } from 'react'
import { site } from '@/data/site'

const QUERY = `(max-width: ${site.breakpointSp}px)`

const subscribe = (onChange: () => void): (() => void) => {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

const getSnapshot = (): boolean => window.matchMedia(QUERY).matches

const getServerSnapshot = (): undefined => undefined

/**
 * SSR-safe SP detection. Returns `undefined` until mounted so that
 * server and first client render agree (no hydration mismatch).
 */
export function useIsSp(): boolean | undefined {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
