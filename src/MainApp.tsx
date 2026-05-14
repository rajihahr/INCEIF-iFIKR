import { useCallback, useMemo, useState } from 'react'

import { AppSidebar } from './components/AppSidebar'
import { ChatPanel } from './components/ChatPanel'
import { CitationPopover } from './components/CitationPopover'
import { PdfViewerPanel } from './components/PdfViewerPanel'
import { sessionConversations } from './data/sessionData'
import { useCitationNavigation } from './hooks/useCitationNavigation'
import { useWorkFolders } from './hooks/useWorkFolders'

const initialConversationId = sessionConversations[0]?.id ?? ''

export function MainApp() {
  const [activeConversationId, setActiveConversationId] = useState(
    initialConversationId,
  )
  const [pdfPanelOpen, setPdfPanelOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  /** When PDF is open, full sidebar (254px) vs icon rail only — toggled by chevron / menu, not by chat clicks */
  const [sidebarExpandedWithPdf, setSidebarExpandedWithPdf] = useState(false)

  const {
    folders,
    createFolder,
    createFolderAndAddConversation,
    addConversationToFolder,
  } = useWorkFolders()

  const activeConversation = useMemo(
    () =>
      sessionConversations.find((c) => c.id === activeConversationId) ??
      sessionConversations[0],
    [activeConversationId],
  )

  const {
    activeCitationId,
    currentPage,
    popoverAnchor,
    selectCitation,
    clearCitation,
    setPage,
  } = useCitationNavigation(activeConversation.citations)

  const activeCitation = useMemo(
    () =>
      activeConversation.citations.find((c) => c.cite_id === activeCitationId) ??
      null,
    [activeConversation.citations, activeCitationId],
  )

  const selectActiveConversation = useCallback(
    (id: string) => {
      setActiveConversationId(id)
      clearCitation()
      setPdfPanelOpen(false)
      setSidebarExpandedWithPdf(false)
      setPage(1)
    },
    [clearCitation, setPage],
  )

  /** Close PDF + restore sidebar; PDF ✕ only */
  const exitCitationView = useCallback(() => {
    setPdfPanelOpen(false)
    setSidebarExpandedWithPdf(false)
    setSidebarCollapsed(false)
    clearCitation()
  }, [clearCitation])

  /** Popover dismiss / Escape / outside click — does not close PDF */
  const dismissCitationPopover = useCallback(() => {
    clearCitation()
  }, [clearCitation])

  const handleSelectCitation = useCallback(
    (id: number, anchorEl: HTMLElement) => {
      setPdfPanelOpen(true)
      setSidebarExpandedWithPdf(false)
      selectCitation(id, anchorEl)
    },
    [selectCitation],
  )

  const toggleSidebarCollapsed = useCallback(() => {
    if (pdfPanelOpen) {
      setSidebarExpandedWithPdf((e) => !e)
    } else {
      setSidebarCollapsed((c) => !c)
    }
  }, [pdfPanelOpen])

  /** Expand sidebar when user picks a tab from the icon rail while collapsed */
  const requestExpandSidebar = useCallback(() => {
    if (pdfPanelOpen) {
      setSidebarExpandedWithPdf(true)
    } else {
      setSidebarCollapsed(false)
    }
  }, [pdfPanelOpen])

  /* 254px = prior w-56 (224px) + 30px; literals so Tailwind can scan classes */
  const asideWidthClass =
    pdfPanelOpen && !sidebarExpandedWithPdf
      ? 'w-[52px] min-w-[52px]'
      : pdfPanelOpen && sidebarExpandedWithPdf
        ? 'w-[254px] min-w-[254px]'
        : sidebarCollapsed
          ? 'w-[52px] min-w-[52px]'
          : 'w-[254px] min-w-[254px]'

  const sidebarVisualCollapsed = pdfPanelOpen
    ? !sidebarExpandedWithPdf
    : sidebarCollapsed

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white font-sans text-[#1a2433]">
      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        <aside
          className={[
            'flex min-h-0 shrink-0 flex-col overflow-hidden border-r border-[#e2e8f2] transition-[width,min-width] duration-300 ease-out',
            asideWidthClass,
          ].join(' ')}
        >
          <AppSidebar
            collapsed={sidebarVisualCollapsed}
            onToggleCollapsed={toggleSidebarCollapsed}
            onRequestExpandSidebar={requestExpandSidebar}
            conversations={sessionConversations}
            activeConversationId={activeConversation.id}
            onSelectConversation={selectActiveConversation}
            workFolders={folders}
            onAddConversationToFolder={addConversationToFolder}
            onCreateWorkFolder={createFolder}
            onCreateWorkFolderAndAdd={createFolderAndAddConversation}
          />
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
          <section
            className={[
              'flex min-h-0 min-w-0 flex-col overflow-hidden bg-white',
              pdfPanelOpen ? 'min-w-0 flex-1 basis-0' : 'min-w-0 flex-1',
            ].join(' ')}
          >
            <ChatPanel
              question={activeConversation.question}
              answer={activeConversation.answer}
              citations={activeConversation.citations}
              activeCitationId={activeCitationId}
              onSelectCitation={handleSelectCitation}
              pdfPanelOpen={pdfPanelOpen}
              onToggleSidebarRail={toggleSidebarCollapsed}
            />
          </section>

          <section
            className={[
              'flex min-h-0 flex-col overflow-hidden bg-white transition-[flex-basis,width,opacity,border-width] duration-300 ease-out',
              pdfPanelOpen
                ? 'min-w-0 flex-1 basis-0 border-l border-[#e2e8f2] opacity-100'
                : 'pointer-events-none w-0 min-w-0 max-w-0 shrink-0 grow-0 basis-0 border-l-0 opacity-0',
            ].join(' ')}
            aria-hidden={!pdfPanelOpen}
          >
            <PdfViewerPanel
              currentPage={currentPage}
              onUserPageChange={setPage}
              activeCitation={activeCitation}
              panelOpen={pdfPanelOpen}
              onClosePanel={exitCitationView}
            />
          </section>
        </div>
      </div>

      <CitationPopover
        citation={activeCitation}
        anchorEl={popoverAnchor}
        onDismiss={dismissCitationPopover}
      />
    </div>
  )
}
