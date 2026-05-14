import { Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'

export function ChatMessageSection() {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="bg-transparent px-5 py-4 md:px-6">
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#8a9ab0]">
        Message
      </p>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <label htmlFor="chat-message" className="sr-only">
          Follow-up message
        </label>
        <textarea
          id="chat-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask a follow-up question…"
          rows={2}
          className="min-h-[52px] flex-1 resize-none rounded-xl border border-[#e2e8f2] bg-white px-3 py-3 text-base leading-snug text-[#1a2433] shadow-sm placeholder:text-[#8a9ab0] focus:border-[#0f6e56] focus:outline-none focus:ring-2 focus:ring-[#0f6e56]/20"
        />
        <button
          type="submit"
          className="inline-flex size-11 shrink-0 items-center justify-center self-end rounded-xl bg-[#0f6e56] text-white shadow-sm transition-colors hover:bg-[#1d9e75]"
          aria-label="Send message"
        >
          <Send className="size-5" strokeWidth={2} aria-hidden />
        </button>
      </form>
    </div>
  )
}
