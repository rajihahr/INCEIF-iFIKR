import { ChevronDown, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'

import type { Citation } from '../types/citation'

type SourcesPanelProps = {
  citations: Citation[]
  activeCitationId: number | null
  onSelectCitation: (id: number, anchor: HTMLElement) => void
}

const SNIPPET_LEN = 80

export function SourcesPanel({
  citations,
  activeCitationId,
  onSelectCitation,
}: SourcesPanelProps) {
  const [expanded, setExpanded] = useState(false)

  const docCount = useMemo(() => {
    return new Set(citations.map((c) => c.document_title)).size
  }, [citations])

  return (
    <div className="rounded-lg border border-[#e2e8f2] bg-[#f0f4f8]/60">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center justify-between gap-2 px-2 py-3.5 text-left text-base text-[#1a2433] transition-colors hover:bg-[#e8f7f2]/80"
      >
        <span className="flex items-center gap-2">
          <span aria-hidden>📎</span>
          <span>
            {citations.length} sources from {docCount} document
            {docCount === 1 ? '' : 's'}
          </span>
        </span>
        {expanded ? (
          <ChevronDown className="size-5 shrink-0 text-[#8a9ab0]" aria-hidden />
        ) : (
          <ChevronRight className="size-5 shrink-0 text-[#8a9ab0]" aria-hidden />
        )}
      </button>

      {expanded && (
        <ul className="space-y-1 border-t border-[#e2e8f2] px-2 pb-3 pt-2">
          {citations.map((c) => (
            <li key={c.cite_id}>
              <button
                type="button"
                data-citation-interactive
                onClick={(e) => onSelectCitation(c.cite_id, e.currentTarget)}
                className={[
                  'flex w-full gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                  activeCitationId === c.cite_id
                    ? 'bg-[#e8f7f2] ring-1 ring-[#c8f0e2]'
                    : 'hover:bg-white/80',
                ].join(' ')}
              >
                <span className="flex h-7 min-w-[1.75rem] shrink-0 items-center justify-center rounded-full bg-[#e8f7f2] text-xs font-semibold text-[#0f6e56]">
                  {c.cite_id}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-xs text-[#8a9ab0] md:text-sm">
                    p.{c.page} · {c.section}
                  </span>
                  <span className="mt-1 line-clamp-2 text-sm leading-snug text-[#1a2433] md:text-base">
                    {c.cited_text.length > SNIPPET_LEN
                      ? `${c.cited_text.slice(0, SNIPPET_LEN).trim()}…`
                      : c.cited_text}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
