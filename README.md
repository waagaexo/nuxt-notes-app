# Nuxt 3 Notes — тестовое задание

CRUD-приложение для заметок на **Nuxt 3**: создание, редактирование, удаление, поиск и теги.

## Стек

- Nuxt 3 + Vue 3
- Composition API
- Хранение в `localStorage` (без бэкенда — удобно для демо)
- TypeScript

## Возможности

- CRUD заметок (title + content)
- Поиск по заголовку и тексту
- Теги у заметок + фильтр по тегу
- Данные сохраняются в браузере

## Запуск

```bash
npm install
npm run dev
```

Открыть: http://localhost:3000

## Сборка

```bash
npm run build
npm run preview
```

## Структура

```
app/app.vue             — UI приложения
app/assets/css/main.css — стили
composables/useNotes.ts — CRUD, поиск, теги, persistence
types/note.ts           — типы
```

## ТЗ

Тестовое: todo/notes приложение — CRUD одной сущности, поиск, теги. Результат — репозиторий с кодом.
