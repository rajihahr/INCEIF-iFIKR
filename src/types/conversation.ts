import type { Citation } from './citation'

export type Conversation = {
  id: string
  title: string
  subtitle: string
  question: string
  /** Body text; inline markers `[cite:n]` become citation badges */
  answer: string
  citations: Citation[]
}
