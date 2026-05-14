import { Minus, Plus } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Document, Page } from 'react-pdf'

import type { Citation } from '../types/citation'
import {
  applyCitationTextHighlight,
  scrollCitationHighlightIntoView,
} from '../utils/pdfTextHighlight'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

type PdfViewerPanelProps = {
  currentPage: number
  onUserPageChange: (page: number) => void
  activeCitation: Citation | null
  panelOpen: boolean
  onClosePanel: () => void
}

const pdfFile = `${import.meta.env.BASE_URL}paper.pdf`

const ZOOM_MIN = 0.5
const ZOOM_MAX = 2.5
const ZOOM_STEP = 0.1

function clampZoom(z: number): number {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(z * 100) / 100))
}

export function PdfViewerPanel({
  currentPage,
  onUserPageChange,
  activeCitation,
  panelOpen,
  onClosePanel,
}: PdfViewerPanelProps) {
  const sizerRef = useRef<HTMLDivElement>(null)
  const pageHighlightRootRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(320)
  const [pdfZoom, setPdfZoom] = useState(1)
  const [numPages, setNumPages] = useState<number | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [overlayCiteId, setOverlayCiteId] = useState<number | null>(null)
  const [overlayVisible, setOverlayVisible] = useState(false)

  const pageRenderWidth = Math.max(
    160,
    Math.floor(containerWidth * pdfZoom),
  )

  const citeForOverlay =
    activeCitation && currentPage === activeCitation.page
      ? activeCitation.cite_id
      : null

  /* eslint-disable react-hooks/set-state-in-effect -- reset zoom when panel closes */
  useEffect(() => {
    if (!panelOpen) {
      setPdfZoom(1)
    }
  }, [panelOpen])
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    const el = sizerRef.current
    if (!el || !panelOpen) {
      return
    }
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width
      if (w && w > 0) {
        setContainerWidth(Math.floor(w))
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [panelOpen])

  const onLoadSuccess = useCallback(
    ({ numPages: n }: { numPages: number }) => {
      setNumPages(n)
      setLoadError(false)
    },
    [],
  )

  const onLoadError = useCallback(() => {
    setLoadError(true)
    setNumPages(null)
  }, [])

  /* eslint-disable react-hooks/set-state-in-effect -- exit fade needs delayed unmount */
  useEffect(() => {
    if (citeForOverlay != null) {
      setOverlayCiteId(citeForOverlay)
      setOverlayVisible(true)
      return
    }
    setOverlayVisible(false)
    const id = window.setTimeout(() => {
      setOverlayCiteId(null)
    }, 300)
    return () => window.clearTimeout(id)
  }, [citeForOverlay])
  /* eslint-enable react-hooks/set-state-in-effect */

  const scheduleTextHighlights = useCallback(() => {
    const root = pageHighlightRootRef.current
    if (!root) {
      return
    }

    applyCitationTextHighlight(root, overlayCiteId, overlayVisible)

    const scrollOnce = () => scrollCitationHighlightIntoView(root)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollOnce()
        window.setTimeout(scrollOnce, 120)
      })
    })
  }, [overlayCiteId, overlayVisible])

  useEffect(() => {
    if (!panelOpen) {
      return
    }
    scheduleTextHighlights()
  }, [
    scheduleTextHighlights,
    currentPage,
    pageRenderWidth,
    panelOpen,
    pdfZoom,
  ])

  const zoomOut = () => setPdfZoom((z) => clampZoom(z - ZOOM_STEP))
  const zoomIn = () => setPdfZoom((z) => clampZoom(z + ZOOM_STEP))

  const prev = () => {
    if (currentPage <= 1) {
      return
    }
    onUserPageChange(currentPage - 1)
  }

  const next = () => {
    if (numPages != null && currentPage >= numPages) {
      return
    }
    onUserPageChange(currentPage + 1)
  }

  if (!panelOpen) {
    return null
  }

  return (
    <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden bg-white">
      <header className="z-20 flex shrink-0 items-center gap-3 border-b border-[#e2e8f2] bg-white px-4 py-3 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <button
          type="button"
          onClick={onClosePanel}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f0f4f8] text-base leading-none text-[#4a5d72] transition-colors hover:bg-[#e2e8f2]"
          aria-label="Close PDF panel"
        >
          ✕
        </button>
        <div className="min-w-0 flex-1">
          <span className="mb-1 inline-block rounded-full bg-[#fef3c7] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#92400e]">
            Research paper
          </span>
          <p className="truncate text-sm font-bold text-[#1a2433]">
            {activeCitation?.document_title ?? 'Source document'}
          </p>
        </div>
      </header>

      <div className="z-10 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[#3d3d42] bg-[#4a4a4e] px-3 py-2.5 text-sm text-white/85">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="inline-block size-3 shrink-0 rounded-sm border border-amber-400/80 bg-amber-300/50"
            aria-hidden
          />
          <span>Cited passage highlighted</span>
        </div>
        <div className="flex shrink-0 items-center gap-1 rounded-lg border border-white/15 bg-black/20 px-1 py-0.5">
          <button
            type="button"
            onClick={zoomOut}
            disabled={pdfZoom <= ZOOM_MIN + 1e-6}
            className="flex size-8 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 disabled:pointer-events-none disabled:opacity-35"
            aria-label="Zoom out"
          >
            <Minus className="size-4" strokeWidth={2.5} />
          </button>
          <span className="min-w-[3.25rem] text-center text-[13px] font-semibold tabular-nums text-white">
            {Math.round(pdfZoom * 100)}%
          </span>
          <button
            type="button"
            onClick={zoomIn}
            disabled={pdfZoom >= ZOOM_MAX - 1e-6}
            className="flex size-8 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 disabled:pointer-events-none disabled:opacity-35"
            aria-label="Zoom in"
          >
            <Plus className="size-4" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => setPdfZoom(1)}
            className="ml-0.5 rounded-md px-2 py-1.5 text-[12px] font-semibold text-white/90 transition-colors hover:bg-white/10"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-auto overscroll-contain bg-[#4a4a4e]">
        <div className="p-3">
          <div ref={sizerRef} className="w-full min-w-0">
            <div className="relative w-full rounded-md border border-white/15 bg-white shadow-xl">
              {loadError ? (
                <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 bg-white p-8 text-center">
                  <p className="text-base font-medium text-[#1a2433]">
                    Could not load the PDF
                  </p>
                  <p className="max-w-md text-sm leading-relaxed text-[#8a9ab0]">
                    Place the PDF at{' '}
                    <code className="rounded bg-[#f0f4f8] px-1.5 py-0.5 text-[13px]">
                      docs/ESTABLISHING ZAKAT ON OIL AND GAS.pdf
                    </code>{' '}
                    and run{' '}
                    <code className="rounded bg-[#f0f4f8] px-1.5 py-0.5 text-[13px]">
                      npm run sync-pdf
                    </code>
                    .
                  </p>
                </div>
              ) : (
                <Document
                  file={pdfFile}
                  onLoadSuccess={onLoadSuccess}
                  onLoadError={onLoadError}
                  loading={
                    <div className="flex min-h-[280px] items-center justify-center bg-white text-base text-[#8a9ab0]">
                      Loading document…
                    </div>
                  }
                  className="flex justify-center bg-white"
                >
                  <div
                    ref={pageHighlightRootRef}
                    className="relative inline-block max-w-full"
                  >
                    <Page
                      pageNumber={currentPage}
                      width={pageRenderWidth}
                      renderTextLayer
                      renderAnnotationLayer={false}
                      className="!bg-white"
                      onRenderTextLayerSuccess={scheduleTextHighlights}
                      onRenderSuccess={scheduleTextHighlights}
                    />
                  </div>
                </Document>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="z-20 flex shrink-0 items-center justify-between gap-3 border-t border-[#e2e8f2] bg-[#f0f4f8] px-4 py-2.5 shadow-[0_-1px_0_rgba(0,0,0,0.04)]">
        <button
          type="button"
          onClick={prev}
          disabled={currentPage <= 1 || loadError}
          className="rounded-lg border border-[#e2e8f2] bg-white px-3 py-2 text-sm font-medium text-[#4a5d72] transition-colors hover:border-[#c8f0e2] hover:bg-[#e8f7f2] hover:text-[#0f6e56] disabled:pointer-events-none disabled:opacity-40"
        >
          ‹ Prev
        </button>
        <p className="min-w-0 flex-1 text-center text-sm font-medium text-[#4a5d72]">
          {loadError || numPages == null
            ? '—'
            : `Page ${currentPage} of ${numPages}`}
        </p>
        <button
          type="button"
          onClick={next}
          disabled={
            loadError || numPages == null || currentPage >= numPages
          }
          className="rounded-lg border border-[#e2e8f2] bg-white px-3 py-2 text-sm font-medium text-[#4a5d72] transition-colors hover:border-[#c8f0e2] hover:bg-[#e8f7f2] hover:text-[#0f6e56] disabled:pointer-events-none disabled:opacity-40"
        >
          Next ›
        </button>
      </footer>
    </div>
  )
}
