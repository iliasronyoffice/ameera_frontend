import React from 'react'

export default function FilterCard({ title, children }) {
  return (
    <div className="border border-gray-200 rounded-xl p-3">
      <details open>
        <summary className="font-semibold text-gray-800 cursor-pointer flex items-center justify-between">
          {title}
          <span className="text-gray-400">⌄</span>
        </summary>
        {children}
      </details>
    </div>
  )
}