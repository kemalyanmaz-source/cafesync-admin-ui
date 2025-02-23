// components/WaveSpinner.tsx
"use client"

export default function WaveSpinner() {
  return (
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-gray-600 rounded-full animate-bounce" />
      <div className="w-3 h-3 bg-gray-600 rounded-full animate-bounce delay-100" />
      <div className="w-3 h-3 bg-gray-600 rounded-full animate-bounce delay-200" />
    </div>
  )
}