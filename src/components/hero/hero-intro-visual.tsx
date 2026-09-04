'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { hero } from '@/data/hero'
import { WaveDivider } from '@/components/motion/wave-divider'
import styles from './hero.module.css'

const WAVE_HEIGHT = 5
const WAVE_FILL = 'var(--c-bg2)'

const SP_QUERY = '(max-width: 767px)'

/**
 * 何で見せるか。
 * - still  : 1枚目だけ。JS が動く前、動きを望まない人、通信を절約したい人。
 * - video  : 波形の断ち切りで紙をめくる動画（remotion/ で書き出したもの）。
 * - slides : 動画が使えないときの差し替え。CSS のクロスフェードで5枚を回す。
 */
type Mode = 'still' | 'video' | 'slides'

/**
 * A3: キャッチコピーの背後のファーストビュー。
 *
 * **サーバでは1枚目しか描かない。** 5枚とも置くと、動画を使う端末でも写真を
 * 5枚ぶん落としてしまう。何で見せるかが決まってから、必要な分だけ増やす。
 *
 * 写真の URL は hero.module.css のブレークポイント側にあるので、PC と SP は
 * それぞれ自分のアートディレクションぶんしか取得しない。動画も同じ考えで、
 * 横位置と縦位置を別に書き出してある。
 */
export function HeroIntroVisual() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mode, setMode] = useState<Mode>('still')
  const [isSp, setIsSp] = useState(false)
  const [index, setIndex] = useState(0)

  /** 動画が再生できなかったときは黙って紙芝居へ落ちる。読者には何も知らせない。 */
  const fallBackToSlides = useCallback(() => setMode('slides'), [])

  useEffect(() => {
    const mq = window.matchMedia(SP_QUERY)
    const sync = () => setIsSp(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    // 動きを望まない人には1枚目のまま。動画も紙芝居も始めない。
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // データ節約モードで背景に動画を落とすのは筋が悪い。写真1枚で足りる。
    const connection = (navigator as { connection?: { saveData?: boolean } }).connection
    if (connection?.saveData) return
    // 1コマ描いてから差し替える。写真が出るより先に動画の取得を始めると、
    // ファーストビューが空のまま待たされる。
    const id = requestAnimationFrame(() => setMode('video'))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    if (mode !== 'video') return
    const video = videoRef.current
    if (!video) return
    // iOS の低電力モードでは autoPlay が拒否される。その場で紙芝居に替える。
    video.play().catch(fallBackToSlides)
  }, [mode, isSp, fallBackToSlides])

  const slideCount = mode === 'slides' ? (isSp ? hero.introSlidesSp : hero.introSlidesPc) : 1

  useEffect(() => {
    if (slideCount < 2) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slideCount)
    }, hero.introIntervalMs)
    return () => window.clearInterval(id)
  }, [slideCount])

  return (
    <div className={styles.introVisual} aria-hidden>
      {Array.from({ length: slideCount }, (_, i) => (
        <div key={i} className={`${styles.slide} ${i === index ? styles.slideActive : ''}`} />
      ))}
      {mode === 'video' ? (
        <video
          ref={videoRef}
          className={styles.video}
          // 横位置と縦位置で構図が違う。source の media は video では当てに
          // できないので、どちらを読むかは JS で決める。
          src={isSp ? hero.videoSp : hero.videoPc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={fallBackToSlides}
        />
      ) : null}
      <div className={styles.scrim} />
      <WaveDivider fill={WAVE_FILL} height={WAVE_HEIGHT} className={styles.wave} />
    </div>
  )
}
