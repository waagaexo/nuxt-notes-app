import type { Note, NoteInput } from '~/types/note'

const STORAGE_KEY = 'nuxt-notes-app:v1'

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function normalizeTags(tags: string[]) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const raw of tags) {
    const t = raw.trim().toLowerCase()
    if (!t || seen.has(t)) continue
    seen.add(t)
    out.push(t)
  }
  return out
}

function loadNotes(): Note[] {
  if (!import.meta.client) return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedNotes()
    const parsed = JSON.parse(raw) as Note[]
    return Array.isArray(parsed) ? parsed : seedNotes()
  } catch {
    return seedNotes()
  }
}

function seedNotes(): Note[] {
  const now = new Date().toISOString()
  return [
    {
      id: uid(),
      title: 'Идея для лендинга',
      content: 'Собрать оффер, форму заявки и FAQ. Проверить скорость на мобиле.',
      tags: ['работа', 'seo'],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid(),
      title: 'Купить продукты',
      content: 'Молоко, хлеб, яйца. Не забыть кофе.',
      tags: ['личное'],
      createdAt: now,
      updatedAt: now,
    },
  ]
}

function saveNotes(notes: Note[]) {
  if (!import.meta.client) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

export function useNotes() {
  const notes = useState<Note[]>('notes', () => [])
  const query = useState('notes-query', () => '')
  const activeTag = useState<string | null>('notes-tag', () => null)
  const ready = useState('notes-ready', () => false)

  const ensureLoaded = () => {
    if (ready.value) return
    notes.value = loadNotes()
    ready.value = true
  }

  if (import.meta.client) {
    onMounted(ensureLoaded)
  }

  const allTags = computed(() => {
    const set = new Set<string>()
    for (const n of notes.value) n.tags.forEach((t) => set.add(t))
    return [...set].sort((a, b) => a.localeCompare(b, 'ru'))
  })

  const filteredNotes = computed(() => {
    const q = query.value.trim().toLowerCase()
    return notes.value
      .filter((n) => {
        if (activeTag.value && !n.tags.includes(activeTag.value)) return false
        if (!q) return true
        return (
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((t) => t.includes(q))
        )
      })
      .slice()
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  })

  const createNote = (input: NoteInput) => {
    ensureLoaded()
    const now = new Date().toISOString()
    const note: Note = {
      id: uid(),
      title: input.title.trim() || 'Без названия',
      content: input.content.trim(),
      tags: normalizeTags(input.tags),
      createdAt: now,
      updatedAt: now,
    }
    notes.value = [note, ...notes.value]
    saveNotes(notes.value)
    return note
  }

  const updateNote = (id: string, input: NoteInput) => {
    ensureLoaded()
    notes.value = notes.value.map((n) =>
      n.id === id
        ? {
            ...n,
            title: input.title.trim() || 'Без названия',
            content: input.content.trim(),
            tags: normalizeTags(input.tags),
            updatedAt: new Date().toISOString(),
          }
        : n,
    )
    saveNotes(notes.value)
  }

  const deleteNote = (id: string) => {
    ensureLoaded()
    notes.value = notes.value.filter((n) => n.id !== id)
    saveNotes(notes.value)
    if (activeTag.value && !allTags.value.includes(activeTag.value)) {
      activeTag.value = null
    }
  }

  const getNote = (id: string) => notes.value.find((n) => n.id === id)

  return {
    notes,
    query,
    activeTag,
    ready,
    allTags,
    filteredNotes,
    ensureLoaded,
    createNote,
    updateNote,
    deleteNote,
    getNote,
  }
}
