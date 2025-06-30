'use client'
import React from 'react'
import { useAuth } from '@/lib/hooks/useAuth'

export default function LogoutButton() {

  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <button
      className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      onClick={handleSignOut}
    >
      Logout
    </button>
  )
}
