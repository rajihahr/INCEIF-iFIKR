import { PanelLeft } from 'lucide-react'
import { Fragment } from 'react'

import type { Citation } from '../types/citation'

import { ChatMessageSection } from './ChatMessageSection'
import { CitationBadge } from './CitationBadge'
import { SourcesPanel } from './SourcesPanel'

type ChatPanelProps = {
  question: string
  answer: string
  citations: Citation[]
  activeCitationId: number | null
  onSelectCitation: (id: number, anchor: HTMLElement) => void
  pdfPanelOpen: boolean
  /** Toggles expanded (254px) vs icon (52px) sidebar when PDF is open; collapses sidebar when PDF is closed */
  onToggleSidebarRail: () => void
}

function renderParagraphWithCitations(
  paragraph: string,
  activeCitationId: number | null,
  onSelectCitation: (id: number, anchor: HTMLElement) => void,
  keyPrefix: string,
) {
  const parts = paragraph.split(/(\[cite:\d+\])/g)
  return parts.map((part, i) => {
    const m = part.match(/^\[cite:(\d+)\]$/)
    if (m) {
      const id = Number(m[1])
      return (
        <CitationBadge
          key={`${keyPrefix}-${i}`}
          citeId={id}
          active={activeCitationId === id}
          onSelect={onSelectCitation}
        />
      )
    }
    return <Fragment key={`${keyPrefix}-${i}`}>{part}</Fragment>
  })
}

export function ChatPanel({
  question,
  answer,
  citations,
  activeCitationId,
  onSelectCitation,
  pdfPanelOpen,
  onToggleSidebarRail,
}: ChatPanelProps) {
  const paragraphs = answer.trim().split(/\n\n+/)

  return (
    <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden bg-white">
      <header className="z-20 flex shrink-0 items-center justify-between border-b border-[#e2e8f2] bg-white px-4 py-3 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="flex min-w-0 items-center gap-3">
          {pdfPanelOpen ? (
            <button
              type="button"
              onClick={onToggleSidebarRail}
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f0f4f8] text-[#4a5d72] transition-colors hover:bg-[#e2e8f2]"
              aria-label="Expand or collapse sidebar"
              title="Expand or collapse sidebar"
            >
              <PanelLeft className="size-5" strokeWidth={2} />
            </button>
          ) : null}
          <span
            className="size-2 shrink-0 rounded-full bg-[#22c55e]"
            aria-hidden
          />
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold text-[#1a2433] md:text-lg">
              Islamic Finance Knowledge Assistant
            </h1>
            <p className="truncate text-sm text-[#8a9ab0]">
              Source-linked answers · INCEIF-style layout
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <span className="rounded-full bg-[#e0f2fe] px-2.5 py-1 text-xs font-semibold text-[#0369a1] md:text-sm">
            INCEIF
          </span>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 md:px-6 md:py-6">
        <div className="space-y-5">
          <div className="rounded-lg border border-[#e2e8f2] bg-[#f0f4f8]/80 px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#8a9ab0] md:text-xs">
              Question
            </p>
            <p className="mt-2 text-base font-medium leading-relaxed text-[#1a2433] md:text-[17px]">
              {question}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#8a9ab0] md:text-xs">
              Answer
            </p>
            <div className="mt-3 space-y-5 text-base leading-[1.7] text-[#1a2433] md:text-[17px]">
              {paragraphs.map((para, idx) => (
                <p key={idx}>
                  {renderParagraphWithCitations(
                    para,
                    activeCitationId,
                    onSelectCitation,
                    `p${idx}`,
                  )}
                </p>
              ))}
            </div>
          </div>

          {citations.length > 0 ? (
            <SourcesPanel
              citations={citations}
              activeCitationId={activeCitationId}
              onSelectCitation={onSelectCitation}
            />
          ) : null}
        </div>
      </div>

      <div className="z-10 shrink-0 border-t border-[#e2e8f2] bg-[#f0f4f8]/90 shadow-[0_-1px_0_rgba(0,0,0,0.04)] backdrop-blur-sm">
        <ChatMessageSection />
      </div>
    </div>
  )
}
