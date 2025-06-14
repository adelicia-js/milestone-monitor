import React from 'react'

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-r-2 border-b-2 border-teal-500">🚀</div>
    </div>
  )
}