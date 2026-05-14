import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Folder,
  FolderPlus,
  Library,
  MessageSquare,
  Plus,
  Search,
  User,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { WorkFolder } from '../hooks/useWorkFolders'
import type { Conversation } from '../types/conversation'

export type SidebarTab = 'chat' | 'library' | 'work'

type AddMenuAnchor = {
  conversationId: string
  top: number
  left: number
}

type AppSidebarProps = {
  collapsed: boolean
  onToggleCollapsed: () => void
  /** When sidebar is collapsed, switching tabs should expand it */
  onRequestExpandSidebar: () => void
  conversations: Conversation[]
  activeConversationId: string
  onSelectConversation: (id: string) => void
  workFolders: WorkFolder[]
  onAddConversationToFolder: (
    folderId: string,
    conversationId: string,
  ) => void
  onCreateWorkFolder: (name: string) => string | null
  onCreateWorkFolderAndAdd: (
    name: string,
    conversationId: string,
  ) => string | null
}

export function AppSidebar({
  collapsed,
  onToggleCollapsed,
  onRequestExpandSidebar,
  conversations,
  activeConversationId,
  onSelectConversation,
  workFolders,
  onAddConversationToFolder,
  onCreateWorkFolder,
  onCreateWorkFolderAndAdd,
}: AppSidebarProps) {
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('chat')
  const [addMenuAnchor, setAddMenuAnchor] = useState<AddMenuAnchor | null>(null)
  const [newFolderDraft, setNewFolderDraft] = useState('')
  const [workNewFolderName, setWorkNewFolderName] = useState('')
  const [collapsedFolderIds, setCollapsedFolderIds] = useState<Set<string>>(
    () => new Set(),
  )
  const addMenuRef = useRef<HTMLDivElement>(null)

  const closeAddMenu = useCallback(() => {
    setAddMenuAnchor(null)
    setNewFolderDraft('')
  }, [])

  const selectTab = useCallback(
    (tab: SidebarTab) => {
      setSidebarTab(tab)
      setAddMenuAnchor(null)
      setNewFolderDraft('')
      if (collapsed) {
        onRequestExpandSidebar()
      }
    },
    [collapsed, onRequestExpandSidebar],
  )

  useEffect(() => {
    if (!addMenuAnchor) {
      return
    }
    const onPointerDown = (e: PointerEvent) => {
      const el = e.target
      if (!(el instanceof Element)) {
        return
      }
      if (el.closest('[data-folder-add-trigger]')) {
        return
      }
      if (addMenuRef.current?.contains(el)) {
        return
      }
      closeAddMenu()
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    return () =>
      document.removeEventListener('pointerdown', onPointerDown, true)
  }, [addMenuAnchor, closeAddMenu])

  useEffect(() => {
    if (!addMenuAnchor) {
      return
    }
    const onScrollOrResize = () => {
      closeAddMenu()
    }
    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [addMenuAnchor, closeAddMenu])

  const toggleFolderExpanded = useCallback((folderId: string) => {
    setCollapsedFolderIds((prev) => {
      const next = new Set(prev)
      if (next.has(folderId)) {
        next.delete(folderId)
      } else {
        next.add(folderId)
      }
      return next
    })
  }, [])

  const handleAddToExisting = useCallback(
    (folderId: string, conversationId: string) => {
      onAddConversationToFolder(folderId, conversationId)
      closeAddMenu()
    },
    [onAddConversationToFolder, closeAddMenu],
  )

  const handleCreateFolderAndAdd = useCallback(() => {
    if (!addMenuAnchor) {
      return
    }
    const id = onCreateWorkFolderAndAdd(
      newFolderDraft,
      addMenuAnchor.conversationId,
    )
    if (id) {
      closeAddMenu()
    }
  }, [
    addMenuAnchor,
    newFolderDraft,
    onCreateWorkFolderAndAdd,
    closeAddMenu,
  ])

  const handleAddFolderFromWorkTab = useCallback(() => {
    const id = onCreateWorkFolder(workNewFolderName)
    if (id) {
      setWorkNewFolderName('')
    }
  }, [workNewFolderName, onCreateWorkFolder])

  const tabButtonClass = (tab: SidebarTab) =>
    [
      'flex flex-1 flex-col items-center gap-1 rounded-t-md px-0.5 py-2.5 text-xs font-semibold transition-colors',
      sidebarTab === tab
        ? 'bg-white/15 text-white'
        : 'text-white/50 hover:text-white/80',
    ].join(' ')

  const railIconClass = (tab: SidebarTab) =>
    [
      'flex size-10 items-center justify-center rounded-lg transition-colors',
      sidebarTab === tab
        ? 'bg-[#e8f7f2] text-[#0f6e56]'
        : 'text-[#8a9ab0] hover:bg-[#e8f7f2] hover:text-[#0f6e56]',
    ].join(' ')

  const workFolderList = (
    <ul className="space-y-1">
      {workFolders.length === 0 ? (
        <li className="rounded-lg bg-[#f8fafc] px-3 py-3 text-sm text-[#8a9ab0]">
          No work folders yet. Add a folder above, or save a conversation from
          the Chat tab.
        </li>
      ) : (
        workFolders.map((folder) => {
          const expanded = !collapsedFolderIds.has(folder.id)
          return (
            <li
              key={folder.id}
              className="rounded-lg border border-[#e2e8f2] bg-[#f8fafc]"
            >
              <button
                type="button"
                onClick={() => toggleFolderExpanded(folder.id)}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
              >
                {expanded ? (
                  <ChevronDown
                    className="size-4 shrink-0 text-[#8a9ab0]"
                    aria-hidden
                  />
                ) : (
                  <ChevronRight
                    className="size-4 shrink-0 text-[#8a9ab0]"
                    aria-hidden
                  />
                )}
                <Folder
                  className="size-4 shrink-0 text-[#0f6e56]"
                  strokeWidth={2}
                />
                <span className="min-w-0 flex-1 truncate text-base font-semibold text-[#1a2433]">
                  {folder.name}
                </span>
                <span className="shrink-0 rounded-full bg-[#e8f7f2] px-2 py-0.5 text-xs font-semibold text-[#0f6e56]">
                  {folder.conversationIds.length}
                </span>
              </button>
              {expanded ? (
                <ul className="border-t border-[#e2e8f2] px-2 py-1">
                  {folder.conversationIds.length === 0 ? (
                    <li className="px-2 py-2 text-sm text-[#8a9ab0]">
                      No conversations yet.
                    </li>
                  ) : (
                    folder.conversationIds.map((cid) => {
                      const conv = conversations.find((x) => x.id === cid)
                      if (!conv) {
                        return (
                          <li
                            key={cid}
                            className="px-2 py-2 text-sm text-[#8a9ab0]"
                          >
                            Missing conversation
                          </li>
                        )
                      }
                      const isActive = cid === activeConversationId
                      return (
                        <li key={cid}>
                          <button
                            type="button"
                            onClick={() => onSelectConversation(conv.id)}
                            className={[
                              'w-full rounded-md px-2 py-2 text-left text-sm transition-colors',
                              isActive
                                ? 'bg-[#e8f7f2] font-semibold text-[#0f6e56]'
                                : 'text-[#1a2433] hover:bg-white',
                            ].join(' ')}
                          >
                            {conv.title}
                          </button>
                        </li>
                      )
                    })
                  )}
                </ul>
              ) : null}
            </li>
          )
        })
      )}
    </ul>
  )

  const addToFolderMenu =
    addMenuAnchor &&
    createPortal(
      <div
        ref={addMenuRef}
        role="dialog"
        aria-label="Add to work folder"
        className="fixed z-[200] w-[min(220px,calc(100vw-16px))] rounded-lg border border-[#e2e8f2] bg-white py-1 shadow-lg"
        style={{ top: addMenuAnchor.top, left: addMenuAnchor.left }}
      >
        <p className="border-b border-[#e2e8f2] px-3 py-2 text-xs font-semibold text-[#8a9ab0]">
          Add to work folder
        </p>
        <div className="max-h-40 overflow-y-auto py-1">
          {workFolders.length === 0 ? (
            <p className="px-3 py-2 text-sm text-[#8a9ab0]">
              No folders yet. Create one on the Work tab or below.
            </p>
          ) : (
            workFolders.map((f) => {
              const already = f.conversationIds.includes(
                addMenuAnchor.conversationId,
              )
              return (
                <button
                  key={f.id}
                  type="button"
                  disabled={already}
                  onClick={() =>
                    handleAddToExisting(f.id, addMenuAnchor.conversationId)
                  }
                  className={[
                    'flex w-full items-center gap-2 px-3 py-2 text-left text-sm',
                    already
                      ? 'cursor-default text-[#8a9ab0]'
                      : 'text-[#1a2433] hover:bg-[#e8f7f2]',
                  ].join(' ')}
                >
                  <Folder
                    className="size-4 shrink-0 text-[#0f6e56]"
                    strokeWidth={2}
                  />
                  <span className="min-w-0 flex-1 truncate">{f.name}</span>
                  {already ? (
                    <span className="shrink-0 text-xs text-[#8a9ab0]">
                      Saved
                    </span>
                  ) : null}
                </button>
              )
            })
          )}
        </div>
        <div className="border-t border-[#e2e8f2] p-2">
          <input
            value={newFolderDraft}
            onChange={(e) => setNewFolderDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleCreateFolderAndAdd()
              }
            }}
            placeholder="New folder name…"
            className="mb-2 w-full rounded-md border border-[#e2e8f2] bg-[#f8fafc] px-2.5 py-2 text-sm text-[#1a2433] outline-none focus:border-[#0f6e56]"
          />
          <button
            type="button"
            onClick={handleCreateFolderAndAdd}
            disabled={!newFolderDraft.trim()}
            className="w-full rounded-md bg-[#0f6e56] py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0c5a47] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Create folder &amp; add
          </button>
        </div>
      </div>,
      document.body,
    )

  return (
    <>
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-white">
      <div className="shrink-0 bg-gradient-to-br from-[#085041] to-[#1d9e75] px-2.5 pb-0 pt-3">
        <div className="mb-2.5 flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2 overflow-hidden">
            <img
              src={`${import.meta.env.BASE_URL}ifikr-logo.png`}
              alt="I-FiKR"
              width={32}
              height={32}
              className="size-8 shrink-0 rounded-lg bg-white object-contain p-0.5 shadow-sm"
              decoding="async"
            />
            <div
              className={[
                'min-w-0 overflow-hidden transition-[opacity,max-width] duration-200',
                collapsed ? 'max-w-0 opacity-0' : 'max-w-[220px] opacity-100',
              ].join(' ')}
            >
              <h1 className="whitespace-nowrap text-base font-bold leading-tight text-white">
                I-FiKR AI
              </h1>
              <p className="whitespace-nowrap text-sm leading-snug text-white/70">
                I-FiKR · INCEIF
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleCollapsed}
            className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/15 text-white/85 transition-colors hover:bg-white/30"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft
              className={[
                'size-4 transition-transform duration-300',
                collapsed ? 'rotate-180' : '',
              ].join(' ')}
              strokeWidth={2.5}
            />
          </button>
        </div>
        <div
          className={[
            'mb-2.5 flex items-center gap-1.5 transition-all duration-200',
            collapsed ? 'pointer-events-none m-0 h-0 opacity-0' : '',
          ].join(' ')}
        >
          <span className="whitespace-nowrap text-sm text-white/60">
            Language:
          </span>
          <div className="flex overflow-hidden rounded-md border border-white/20 bg-white/10">
            <button
              type="button"
              className="bg-white/20 px-3 py-1.5 text-sm font-semibold text-white"
            >
              EN
            </button>
            <button
              type="button"
              className="px-3 py-1.5 text-sm font-semibold text-white/55"
            >
              BM
            </button>
          </div>
        </div>
        <div
          className={['flex gap-px', collapsed ? 'hidden' : 'flex'].join(' ')}
          role="tablist"
          aria-label="Sidebar sections"
        >
          <button
            type="button"
            role="tab"
            aria-selected={sidebarTab === 'chat'}
            onClick={() => selectTab('chat')}
            className={tabButtonClass('chat')}
          >
            <MessageSquare className="size-4" strokeWidth={2} />
            <span className="whitespace-nowrap">Chat</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={sidebarTab === 'library'}
            onClick={() => selectTab('library')}
            className={tabButtonClass('library')}
          >
            <Library className="size-4" strokeWidth={2} />
            <span className="whitespace-nowrap">Library</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={sidebarTab === 'work'}
            onClick={() => selectTab('work')}
            className={tabButtonClass('work')}
          >
            <Folder className="size-4" strokeWidth={2} />
            <span className="whitespace-nowrap">Work</span>
          </button>
        </div>
      </div>

      <div
        className={[
          'flex min-h-0 flex-1 flex-col overflow-hidden',
          collapsed ? 'hidden' : 'flex',
        ].join(' ')}
      >
        {sidebarTab === 'chat' ? (
          <>
            <button
              type="button"
              className="mx-2 mt-2 flex shrink-0 items-center gap-2 rounded-lg border border-dashed border-[#c8f0e2] bg-[#e8f7f2] px-3 py-3 text-base font-semibold text-[#0f6e56] transition-colors hover:bg-[#c8f0e2]"
            >
              <Plus className="size-[18px] shrink-0" strokeWidth={2.5} />
              New conversation
            </button>
            <div className="mt-2 flex min-h-0 flex-1 flex-col overflow-hidden px-2">
              <div className="mx-0.5 mb-1 flex shrink-0 items-center gap-2 rounded-lg border border-[#e2e8f2] bg-[#f0f4f8] px-3 py-2.5">
                <Search
                  className="size-4 shrink-0 text-[#8a9ab0]"
                  strokeWidth={2}
                />
                <input
                  readOnly
                  placeholder="Search conversations…"
                  className="min-w-0 flex-1 border-0 bg-transparent text-base text-[#1a2433] outline-none placeholder:text-[#8a9ab0]"
                />
              </div>
              <p className="shrink-0 px-1.5 pb-1 pt-2 text-xs font-bold uppercase tracking-wide text-[#8a9ab0]">
                This session
              </p>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-0.5 pb-2">
                <ul className="space-y-1">
                  {conversations.map((c) => {
                    const active = c.id === activeConversationId
                    return (
                      <li key={c.id} className="relative">
                        <div
                          className={[
                            'flex items-stretch gap-0 rounded-lg border transition-colors',
                            active
                              ? 'border-[#c8f0e2] bg-[#e8f7f2]'
                              : 'border-transparent bg-[#f8fafc] hover:border-[#e2e8f2] hover:bg-[#f0f4f8]',
                          ].join(' ')}
                        >
                          <button
                            type="button"
                            onClick={() => onSelectConversation(c.id)}
                            className="min-w-0 flex-1 px-3 py-2.5 text-left"
                          >
                            <p className="truncate text-base font-semibold text-[#1a2433]">
                              {c.title}
                            </p>
                            <p className="truncate text-sm text-[#8a9ab0]">
                              {c.subtitle}
                            </p>
                          </button>
                          <div className="flex shrink-0 items-center pr-1">
                            <button
                              type="button"
                              data-folder-add-trigger
                              onClick={(e) => {
                                e.stopPropagation()
                                const rect = e.currentTarget.getBoundingClientRect()
                                const MENU_W = 220
                                const pad = 8
                                const vw = window.innerWidth
                                const left = Math.max(
                                  pad,
                                  Math.min(
                                    rect.right - MENU_W,
                                    vw - MENU_W - pad,
                                  ),
                                )
                                setAddMenuAnchor((cur) =>
                                  cur?.conversationId === c.id
                                    ? null
                                    : {
                                        conversationId: c.id,
                                        top: rect.bottom + 4,
                                        left,
                                      },
                                )
                                setNewFolderDraft('')
                              }}
                              className={[
                                'flex size-9 items-center justify-center rounded-md text-[#4a5d72] transition-colors hover:bg-white/80 hover:text-[#0f6e56]',
                                addMenuAnchor?.conversationId === c.id
                                  ? 'bg-white text-[#0f6e56] ring-1 ring-[#c8f0e2]'
                                  : '',
                              ].join(' ')}
                              aria-label={`Add “${c.title}” to a work folder`}
                              title="Add to work folder"
                              aria-expanded={
                                addMenuAnchor?.conversationId === c.id
                              }
                            >
                              <FolderPlus
                                className="size-[18px]"
                                strokeWidth={2}
                              />
                            </button>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </>
        ) : null}

        {sidebarTab === 'library' ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-2 pt-3">
            <p className="rounded-lg border border-[#e2e8f2] bg-[#f8fafc] px-4 py-6 text-center text-sm leading-relaxed text-[#8a9ab0]">
              Library is coming soon. Saved documents and references will appear
              here.
            </p>
          </div>
        ) : null}

        {sidebarTab === 'work' ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-2 pt-3">
            <p className="shrink-0 px-1.5 pb-2 text-xs font-bold uppercase tracking-wide text-[#8a9ab0]">
              Work folders
            </p>
            <div className="shrink-0 rounded-lg border border-[#e2e8f2] bg-[#f8fafc] p-3">
              <p className="mb-2 text-sm font-semibold text-[#1a2433]">
                New folder
              </p>
              <input
                value={workNewFolderName}
                onChange={(e) => setWorkNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddFolderFromWorkTab()
                  }
                }}
                placeholder="e.g. Oil and Gas"
                className="mb-2 w-full rounded-md border border-[#e2e8f2] bg-white px-2.5 py-2 text-sm text-[#1a2433] outline-none focus:border-[#0f6e56]"
              />
              <button
                type="button"
                onClick={handleAddFolderFromWorkTab}
                disabled={!workNewFolderName.trim()}
                className="w-full rounded-md bg-[#0f6e56] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0c5a47] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add folder
              </button>
            </div>
            <div className="mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain px-0.5 pb-2">
              {workFolderList}
            </div>
          </div>
        ) : null}

        <div className="shrink-0 border-t border-[#e2e8f2] bg-white px-2 py-3">
          <div className="mb-1 flex justify-between">
            <span className="text-sm text-[#4a5d72]">Free usage</span>
            <span className="text-sm font-bold text-[#0f6e56]">Included</span>
          </div>
          <div className="h-0.5 overflow-hidden rounded-full bg-[#e2e8f2]">
            <div className="h-full w-[12%] rounded-full bg-gradient-to-r from-[#0f6e56] to-[#3cb878]" />
          </div>
        </div>
      </div>

      <div
        className={[
          'hidden min-h-0 flex-1 flex-col items-center gap-0.5 overflow-y-auto overscroll-contain py-2.5',
          collapsed ? 'flex' : 'hidden',
        ].join(' ')}
        role="tablist"
        aria-label="Sidebar sections (collapsed)"
      >
        <button
          type="button"
          role="tab"
          aria-selected={sidebarTab === 'chat'}
          onClick={() => selectTab('chat')}
          className={railIconClass('chat')}
          title="Chat"
        >
          <MessageSquare className="size-[18px]" strokeWidth={2} />
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={sidebarTab === 'library'}
          onClick={() => selectTab('library')}
          className={railIconClass('library')}
          title="Library"
        >
          <Library className="size-[18px]" strokeWidth={2} />
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={sidebarTab === 'work'}
          onClick={() => selectTab('work')}
          className={railIconClass('work')}
          title="Work folders"
        >
          <Folder className="size-[18px]" strokeWidth={2} />
        </button>
        <button
          type="button"
          className="mt-auto flex size-10 items-center justify-center rounded-lg text-[#8a9ab0] transition-colors hover:bg-[#e8f7f2] hover:text-[#0f6e56]"
          title="Profile"
        >
          <User className="size-[18px]" strokeWidth={2} />
        </button>
      </div>
    </div>
    {addToFolderMenu}
    </>
  )
}
