'use client'

import { useState } from 'react'
import styles from './chatbot.module.css'

type Props = {
  isOpen: boolean
  onToggle: () => void
}

export function ChatbotTrigger({ isOpen, onToggle }: Props) {
  const [showTooltip, setShowTooltip] = useState(true)

  const handleOpen = () => {
    setShowTooltip(false)
    onToggle()
  }

  return (
    <aside className={styles.launcherWrapper} aria-label="同窓会Webコンシェルジュ">
      {!isOpen && showTooltip && (
        <div className={styles.tooltipBubble} onClick={handleOpen} role="status">
          <span>ご案内・チャット相談</span>
          <button
            type="button"
            className={styles.tooltipClose}
            aria-label="案内吹き出しを閉じる"
            onClick={(e) => {
              e.stopPropagation()
              setShowTooltip(false)
            }}
          >
            ✕
          </button>
        </div>
      )}

      <button
        type="button"
        className={styles.launcherBtn}
        onClick={handleOpen}
        aria-label={isOpen ? 'チャットボットを閉じる' : '同窓会Webコンシェルジュを開く'}
        aria-expanded={isOpen}
      >
        <div className={styles.launcherIcon}>
          {isOpen ? (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          )}
        </div>
        {!isOpen && <span className={styles.launcherLabel}>AI</span>}
      </button>
    </aside>
  )
}
