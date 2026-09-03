'use client'

import { usePathname, useRouter } from 'next/navigation'
import type { ChatMessage, ChatOption } from '@/data/chatbot'
import styles from './chatbot.module.css'

type Props = {
  message: ChatMessage
  onSelectOption: (option: ChatOption) => void
  onCloseChat?: () => void
}

export function ChatbotMessage({ message, onSelectOption, onCloseChat }: Props) {
  const isBot = message.sender === 'bot'
  const pathname = usePathname()
  const router = useRouter()

  const handleActionClick = (href: string) => {
    if (href.startsWith('#')) {
      if (pathname === '/') {
        const target = document.querySelector(href)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        router.push(`/${href}`)
      }
    } else {
      router.push(href)
    }

    // SP等の場合、クリック後にチャットを閉じると見やすい
    if (typeof window !== 'undefined' && window.innerWidth <= 767) {
      onCloseChat?.()
    }
  }

  return (
    <div className={`${styles.messageRow} ${isBot ? styles.bot : styles.user}`}>
      {isBot && (
        <div className={styles.botAvatar} aria-hidden="true">
          霞
        </div>
      )}

      <div className={styles.messageContent}>
        <div className={styles.bubble}>{message.text}</div>

        {/* Action Links (e.g. #contact, /stories) */}
        {message.actions && message.actions.length > 0 && (
          <div className={styles.actionsWrapper}>
            {message.actions.map((act) => (
              <button
                key={act.href}
                type="button"
                className={styles.actionBtn}
                onClick={() => handleActionClick(act.href)}
              >
                <span>{act.label}</span>
                <span className={styles.actionArrow}>→</span>
              </button>
            ))}
          </div>
        )}

        {/* Suggestion Option Chips */}
        {message.options && message.options.length > 0 && (
          <div className={styles.optionsWrapper}>
            {message.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={styles.optionChip}
                onClick={() => onSelectOption(opt)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        <span className={styles.timestamp}>{message.timestamp}</span>
      </div>
    </div>
  )
}
