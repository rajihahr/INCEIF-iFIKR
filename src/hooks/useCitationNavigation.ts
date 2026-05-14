import { useCallback, useState } from 'react'

import type { Citation } from '../types/citation'

/**
 * Manages the active citation and coordinates between chat panel and PDF viewer.
 *
 * State:
 * - activeCitationId: number | null
 * - currentPage: number
 * - popoverAnchor: HTMLElement | null (for positioning the popover)
 *
 * Actions:
 * - selectCitation(id: number, anchorEl: HTMLElement): sets active citation,
 *   updates currentPage to citation's page, sets popover anchor
 * - clearCitation(): resets everything
 * - setPage(page: number): manual page navigation (clears active citation)
 */
export function useCitationNavigation(citations: Citation[]) {
  const [activeCitationId, setActiveCitationId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null)

  const selectCitation = useCallback(
    (id: number, anchorEl: HTMLElement) => {
      const citation = citations.find((c) => c.cite_id === id)
      setActiveCitationId(id)
      setPopoverAnchor(anchorEl)
      if (citation) {
        setCurrentPage(citation.page)
      }
    },
    [citations],
  )

  const clearCitation = useCallback(() => {
    setActiveCitationId(null)
    setPopoverAnchor(null)
  }, [])

  const setPage = useCallback((page: number) => {
    setCurrentPage(page)
    setActiveCitationId(null)
    setPopoverAnchor(null)
  }, [])

  return {
    activeCitationId,
    currentPage,
    popoverAnchor,
    selectCitation,
    clearCitation,
    setPage,
  }
}
