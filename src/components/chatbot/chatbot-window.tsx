'use client'

import { useEffect, useRef, useState } from 'react'
import type { ChatMessage, ChatOption } from '@/data/chatbot'
import { ChatbotMessage } from './chatbot-message'
import styles from './chatbot.module.css'

type Props = {
  isOpen: boolean
  messages: ChatMessage[]
  isTyping: boolean
  onSendMessage: (text: string) => void
  onSelectOption: (option: ChatOption) => void
  onReset: () => void
  onClose: () => void
}

export function ChatbotWindow({
  isOpen,
  messages,
  isTyping,
  onSendMessage,
  onSelectOption,
  onReset,
  onClose,
}: Props) {
  const [inputText, setInputText] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // メッセージ追加またはタイピング変化時に最下部へスクロール
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping, isOpen])

  // ウィンドウオープン時にフォーカス
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 150)
    }
  }, [isOpen])

  // ESCキーで閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = inputText.trim()
    if (!trimmed || isTyping) return
    onSendMessage(trimmed)
    setInputText('')
  }

  return (
    <div className={styles.chatWindow} role="dialog" aria-modal="true" aria-label="同窓会Webコンシェルジュ">
      {/* Header */}
      <div className={styles.windowHeader}>
        <div className={styles.headerInfo}>
          <div className={styles.headerAvatar} aria-hidden="true">
            <svg viewBox="0 0 24 24" className={styles.headerAvatarIcon} fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className={styles.headerTitles}>
            <span className={styles.headerTitle}>同窓会 Webコンシェルジュ</span>
            <span className={styles.headerSub}>KASUMIGAURA ALUMNI CONCIERGE</span>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.headerBtn}
            onClick={onReset}
            title="会話をリセットして最初に戻る"
            aria-label="会話を最初に戻す"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
          <button
            type="button"
            className={styles.headerBtn}
            onClick={onClose}
            title="閉じる"
            aria-label="チャットボットを閉じる"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Message List */}
      <div className={styles.messageList} ref={scrollRef}>
        {messages.map((msg) => (
          <ChatbotMessage
            key={msg.id}
            message={msg}
            onSelectOption={onSelectOption}
            onCloseChat={onClose}
          />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className={styles.typingRow}>
            <div className={styles.botAvatar} aria-hidden="true">
              霞
            </div>
            <div className={styles.typingBubble}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form className={styles.inputForm} onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className={styles.inputField}
          placeholder="質問を入力（例: 住所変更、会費など）"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isTyping}
          maxLength={200}
        />
        <button
          type="submit"
          className={styles.sendBtn}
          disabled={!inputText.trim() || isTyping}
          aria-label="メッセージを送信"
        >
          <svg viewBox="0 0 24 24" className={styles.sendIcon}>
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>
    </div>
  )
}
