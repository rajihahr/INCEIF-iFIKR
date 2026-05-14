type CitationBadgeProps = {
  citeId: number
  active: boolean
  onSelect: (id: number, anchor: HTMLElement) => void
}

export function CitationBadge({ citeId, active, onSelect }: CitationBadgeProps) {
  return (
    <button
      type="button"
      data-citation-interactive
      title={`Citation ${citeId}`}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onSelect(citeId, e.currentTarget)
      }}
      className={[
        'mx-0.5 inline-flex h-[22px] min-w-[22px] cursor-pointer items-center justify-center rounded-full px-1 align-super text-xs font-semibold leading-none transition-colors',
        active
          ? 'bg-[#085041] text-white ring-2 ring-[#0f6e56]/30 ring-offset-1 ring-offset-white'
          : 'bg-[#e8f7f2] text-[#0f6e56] hover:bg-[#0f6e56] hover:text-white',
      ].join(' ')}
    >
      {citeId}
    </button>
  )
}
