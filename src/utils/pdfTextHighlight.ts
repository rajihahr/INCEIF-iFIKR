import { highlightRegions } from '../data/highlightRegions'

const HIGHLIGHT_CLASS = 'pdf-text-citation-highlight'

type Zone = {
  left: number
  top: number
  right: number
  bottom: number
}

function pctRegionToViewportZone(
  pageRect: DOMRect,
  region: { top: number; left: number; width: number; height: number },
): Zone {
  return {
    left: pageRect.left + (region.left / 100) * pageRect.width,
    top: pageRect.top + (region.top / 100) * pageRect.height,
    right: pageRect.left + ((region.left + region.width) / 100) * pageRect.width,
    bottom: pageRect.top + ((region.top + region.height) / 100) * pageRect.height,
  }
}

function rectsIntersect(span: DOMRect, zone: Zone): boolean {
  return !(
    span.right < zone.left ||
    span.left > zone.right ||
    span.bottom < zone.top ||
    span.top > zone.bottom
  )
}

export function clearTextHighlightMarks(root: HTMLElement): void {
  root.querySelectorAll(`.textLayer span.${HIGHLIGHT_CLASS}`).forEach((el) => {
    el.classList.remove(HIGHLIGHT_CLASS)
  })
}

/**
 * Highlights selectable text in the PDF.js text layer by marking spans that
 * intersect the configured percentage region for the active citation.
 */
export function applyCitationTextHighlight(
  root: HTMLElement,
  citeId: number | null,
  visible: boolean,
): void {
  const layer = root.querySelector('.textLayer')
  const pageEl = root.querySelector('.react-pdf__Page')

  if (!layer || !pageEl) {
    return
  }

  clearTextHighlightMarks(root)

  if (!visible || citeId == null) {
    return
  }

  const region = highlightRegions[citeId]
  if (!region) {
    return
  }

  const pageRect = pageEl.getBoundingClientRect()
  const zone = pctRegionToViewportZone(pageRect, region)

  const spans = layer.querySelectorAll('span[role="presentation"]')
  spans.forEach((span) => {
    const sr = span.getBoundingClientRect()
    if (sr.width === 0 && sr.height === 0) {
      return
    }
    if (rectsIntersect(sr, zone)) {
      span.classList.add(HIGHLIGHT_CLASS)
    }
  })
}

/**
 * Scrolls highlighted citation text toward the center of the PDF scroll pane.
 * Uses scrollIntoView(block: 'center') so the nearest scrollable ancestor
 * (the PDF column) receives the scroll. Retried after a short delay in the caller
 * so text-layer layout has settled.
 */
export function scrollCitationHighlightIntoView(pageRoot: HTMLElement | null): void {
  if (!pageRoot) {
    return
  }

  const highlights = pageRoot.querySelectorAll(
    `.textLayer span.${HIGHLIGHT_CLASS}`,
  )
  if (highlights.length === 0) {
    return
  }

  const anchorIndex = Math.floor((highlights.length - 1) / 2)
  const anchor = highlights[anchorIndex] as HTMLElement

  const run = () => {
    anchor.scrollIntoView({
      block: 'center',
      inline: 'nearest',
      behavior: 'smooth',
    })
  }

  run()
}
