import { useState, useCallback } from 'react'

export default function useModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'info' })

  const showModal = useCallback(({ title, message, type = 'info' }) => {
    setModalContent({ title, message, type })
    setIsOpen(true)
  }, [])

  const hideModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  return {
    isOpen,
    modalContent,
    showModal,
    hideModal
  }
} 