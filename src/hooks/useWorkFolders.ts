import { useCallback, useEffect, useState } from 'react'

export type WorkFolder = {
  id: string
  name: string
  conversationIds: string[]
}

const STORAGE_KEY = 'inceif-pdf-work-folders-v1'

function defaultFolders(): WorkFolder[] {
  return [{ id: 'wf-oil-gas', name: 'Oil and Gas', conversationIds: [] }]
}

function loadFolders(): WorkFolder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return defaultFolders()
    }
    const parsed = JSON.parse(raw) as WorkFolder[]
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return defaultFolders()
    }
    return parsed.map((f) => ({
      id: String(f.id),
      name: String(f.name),
      conversationIds: Array.isArray(f.conversationIds)
        ? f.conversationIds.map(String)
        : [],
    }))
  } catch {
    return defaultFolders()
  }
}

function newFolderId(): string {
  return `wf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function useWorkFolders() {
  const [folders, setFolders] = useState<WorkFolder[]>(loadFolders)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(folders))
  }, [folders])

  const createFolder = useCallback((name: string) => {
    const trimmed = name.trim()
    if (!trimmed) {
      return null
    }
    const id = newFolderId()
    setFolders((prev) => [...prev, { id, name: trimmed, conversationIds: [] }])
    return id
  }, [])

  /** One state update so the new folder exists before attaching the conversation */
  const createFolderAndAddConversation = useCallback(
    (name: string, conversationId: string) => {
      const trimmed = name.trim()
      if (!trimmed) {
        return null
      }
      const id = newFolderId()
      setFolders((prev) => [
        ...prev,
        { id, name: trimmed, conversationIds: [conversationId] },
      ])
      return id
    },
    [],
  )

  const addConversationToFolder = useCallback(
    (folderId: string, conversationId: string) => {
      setFolders((prev) =>
        prev.map((f) =>
          f.id === folderId && !f.conversationIds.includes(conversationId)
            ? { ...f, conversationIds: [...f.conversationIds, conversationId] }
            : f,
        ),
      )
    },
    [],
  )

  return {
    folders,
    createFolder,
    createFolderAndAddConversation,
    addConversationToFolder,
  }
}
