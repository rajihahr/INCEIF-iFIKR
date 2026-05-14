import { FileText } from 'lucide-react'
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'

import type { Citation } from '../types/citation'

type CitationPopoverProps = {
  citation: Citation | null
  anchorEl: HTMLElement | null
  onDismiss: () => void
}

const MAX_W = 440

export function CitationPopover({
  citation,
  anchorEl,
  onDismiss,
}: CitationPopoverProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<CSSProperties>({
    top: 0,
    left: 0,
    opacity: 0,
  })

  const open = Boolean(citation && anchorEl)

  useLayoutEffect(() => {
    if (!open || !anchorEl || !cardRef.current) {
      return
    }

    const margin = 8
    const anchor = anchorEl.getBoundingClientRect()
    const pop = cardRef.current.getBoundingClientRect()
    let top = anchor.bottom + margin
    if (top + pop.height > window.innerHeight - margin) {
      top = Math.max(margin, anchor.top - pop.height - margin)
    }
    let left = anchor.left
    const maxLeft = window.innerWidth - MAX_W - margin
    if (left > maxLeft) {
      left = Math.max(margin, maxLeft)
    }

    setStyle({
      position: 'fixed',
      top,
      left,
      width: MAX_W,
      maxWidth: `min(${MAX_W}px, calc(100vw - ${margin * 2}px))`,
      zIndex: 50,
      opacity: 1,
    })
  }, [open, anchorEl, citation?.cite_id])

  useEffect(() => {
    if (!open) {
      return
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss()
      }
    }

    const onDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (cardRef.current?.contains(t)) {
        return
      }
      if ((t as Element).closest?.('[data-citation-interactive]')) {
        return
      }
      onDismiss()
    }

    window.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [open, onDismiss])

  useEffect(() => {
    if (!open || !anchorEl) {
      return
    }

    const update = () => {
      if (!cardRef.current || !anchorEl) {
        return
      }
      const margin = 8
      const anchor = anchorEl.getBoundingClientRect()
      const pop = cardRef.current.getBoundingClientRect()
      let top = anchor.bottom + margin
      if (top + pop.height > window.innerHeight - margin) {
        top = Math.max(margin, anchor.top - pop.height - margin)
      }
      let left = anchor.left
      const maxLeft = window.innerWidth - MAX_W - margin
      if (left > maxLeft) {
        left = Math.max(margin, maxLeft)
      }
      setStyle((s) => ({ ...s, top, left }))
    }

    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [open, anchorEl])

  if (!citation || !anchorEl) {
    return null
  }

  return (
    <div
      ref={cardRef}
      style={style}
      role="dialog"
      aria-label={`Citation ${citation.cite_id}`}
      className="citation-popover-enter rounded-xl bg-white p-5 shadow-xl ring-1 ring-black/5"
    >
      <div className="flex min-w-0 gap-3">
        <FileText
          className="mt-1 size-5 shrink-0 text-[#0f6e56]"
          strokeWidth={1.75}
          aria-hidden
        />
        <p className="min-w-0 truncate text-base font-medium text-[#1a2433]">
          {citation.document_title}
        </p>
      </div>
      <p className="mt-3 font-mono text-sm text-[#8a9ab0]">
        Page {citation.page} · {citation.section}
      </p>
      <blockquote className="mt-4 border-l-[3px] border-[#0f6e56] pl-4 text-base italic leading-relaxed text-[#1a2433]">
        {citation.cited_text}
      </blockquote>
      <p className="mt-4 font-mono text-xs leading-relaxed text-[#8a9ab0] md:text-sm">
        {citation.authors} · {citation.year}
        <br />
        {citation.source}
      </p>
    </div>
  )
}
