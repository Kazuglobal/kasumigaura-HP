'use client'

import { useCallback, useState } from 'react'
import {
  type ChatMessage,
  type ChatOption,
  searchChatbotKnowledge,
  WELCOME_MESSAGE,
} from '@/data/chatbot'
import { ChatbotTrigger } from './chatbot-trigger'
import { ChatbotWindow } from './chatbot-window'

const getFormattedTime = (): string => {
  const d = new Date()
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init-msg',
      sender: 'bot',
      text: WELCOME_MESSAGE.text,
      timestamp: getFormattedTime(),
      options: WELCOME_MESSAGE.options,
      actions: WELCOME_MESSAGE.actions,
    },
  ])

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const handleSendMessage = useCallback((text: string) => {
    const time = getFormattedTime()
    const userMsgId = `user-${Date.now()}`

    // ユーザーメッセージを追加
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        text,
        timestamp: time,
      },
    ])

    // ボットのタイピング状態を開始
    setIsTyping(true)

    // 少し自然なウェイトを設けて回答
    setTimeout(() => {
      const botResponse = searchChatbotKnowledge(text)
      const botMsgId = `bot-${Date.now()}`

      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          sender: 'bot',
          text: botResponse.text,
          timestamp: getFormattedTime(),
          options: botResponse.options,
          actions: botResponse.actions,
        },
      ])
      setIsTyping(false)
    }, 450)
  }, [])

  const handleSelectOption = useCallback(
    (option: ChatOption) => {
      handleSendMessage(option.query)
    },
    [handleSendMessage]
  )

  const handleReset = useCallback(() => {
    setIsTyping(false)
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'bot',
        text: WELCOME_MESSAGE.text,
        timestamp: getFormattedTime(),
        options: WELCOME_MESSAGE.options,
        actions: WELCOME_MESSAGE.actions,
      },
    ])
  }, [])

  return (
    <>
      <ChatbotTrigger isOpen={isOpen} onToggle={toggleOpen} />
      <ChatbotWindow
        isOpen={isOpen}
        messages={messages}
        isTyping={isTyping}
        onSendMessage={handleSendMessage}
        onSelectOption={handleSelectOption}
        onReset={handleReset}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
