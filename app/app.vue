<script setup lang="ts">
import type { Note, NoteInput } from '~/types/note'

const {
  query,
  activeTag,
  ready,
  allTags,
  filteredNotes,
  ensureLoaded,
  createNote,
  updateNote,
  deleteNote,
} = useNotes()

onMounted(() => ensureLoaded())

const showModal = ref(false)
const editing = ref<Note | null>(null)
const form = reactive<NoteInput>({
  title: '',
  content: '',
  tags: [],
})
const tagsInput = ref('')

function openCreate() {
  editing.value = null
  form.title = ''
  form.content = ''
  form.tags = []
  tagsInput.value = ''
  showModal.value = true
}

function openEdit(note: Note) {
  editing.value = note
  form.title = note.title
  form.content = note.content
  form.tags = [...note.tags]
  tagsInput.value = note.tags.join(', ')
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function parseTags(raw: string) {
  return raw
    .split(/[,#]+/)
    .map((t) => t.trim())
    .filter(Boolean)
}

function save() {
  const payload: NoteInput = {
    title: form.title,
    content: form.content,
    tags: parseTags(tagsInput.value),
  }
  if (editing.value) updateNote(editing.value.id, payload)
  else createNote(payload)
  closeModal()
}

function remove(note: Note) {
  if (!confirm(`Удалить заметку «${note.title}»?`)) return
  deleteNote(note.id)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function toggleTag(tag: string | null) {
  activeTag.value = activeTag.value === tag ? null : tag
}
</script>

<template>
  <div class="app">
    <header class="hero">
      <div>
        <h1>Заметки</h1>
        <p>Nuxt 3 · CRUD · поиск · теги</p>
      </div>
      <button class="btn btn-primary" type="button" @click="openCreate">
        Новая заметка
      </button>
    </header>

    <div class="toolbar">
      <input
        v-model="query"
        class="search"
        type="search"
        placeholder="Поиск по заголовку, тексту или тегу…"
        aria-label="Поиск заметок"
      >
    </div>

    <div class="layout">
      <aside class="panel">
        <p class="tags-title">Теги</p>
        <div class="tag-list">
          <button
            class="tag"
            :class="{ active: !activeTag }"
            type="button"
            @click="toggleTag(null)"
          >
            Все
          </button>
          <button
            v-for="tag in allTags"
            :key="tag"
            class="tag"
            :class="{ active: activeTag === tag }"
            type="button"
            @click="toggleTag(tag)"
          >
            #{{ tag }}
          </button>
        </div>
      </aside>

      <section class="notes" aria-live="polite">
        <div v-if="!ready" class="empty">Загрузка…</div>

        <div v-else-if="!filteredNotes.length" class="empty">
          Ничего не найдено. Создайте заметку или сбросьте фильтр.
        </div>

        <article v-for="note in filteredNotes" :key="note.id" class="note">
          <div class="note-head">
            <div>
              <h2>{{ note.title }}</h2>
              <p>{{ note.content || '—' }}</p>
            </div>
            <div class="actions">
              <button class="btn btn-ghost" type="button" @click="openEdit(note)">
                Изменить
              </button>
              <button class="btn btn-danger" type="button" @click="remove(note)">
                Удалить
              </button>
            </div>
          </div>
          <div class="note-meta">
            <span>обновлено {{ formatDate(note.updatedAt) }}</span>
            <span
              v-for="tag in note.tags"
              :key="`${note.id}-${tag}`"
              class="chip"
            >#{{ tag }}</span>
          </div>
        </article>
      </section>
    </div>

    <div
      v-if="showModal"
      class="modal-backdrop"
      @click.self="closeModal"
    >
      <div class="modal" role="dialog" aria-modal="true">
        <h3>{{ editing ? 'Редактировать' : 'Новая заметка' }}</h3>

        <div class="field">
          <label for="title">Заголовок</label>
          <input id="title" v-model="form.title" type="text" placeholder="Название">
        </div>

        <div class="field">
          <label for="content">Текст</label>
          <textarea id="content" v-model="form.content" placeholder="Содержимое заметки" />
        </div>

        <div class="field">
          <label for="tags">Теги (через запятую)</label>
          <input
            id="tags"
            v-model="tagsInput"
            type="text"
            placeholder="работа, идеи, личное"
          >
        </div>

        <div class="modal-actions">
          <button class="btn btn-ghost" type="button" @click="closeModal">Отмена</button>
          <button class="btn btn-primary" type="button" @click="save">Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>
