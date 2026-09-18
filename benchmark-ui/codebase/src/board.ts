import type { TaskCard, TaskStatus, Column, FilterCriteria } from './types.ts';
import { TaskStore } from './store.ts';

export const COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export function createTaskCardElement(task: TaskCard): HTMLElement {
  const card = document.createElement('article');
  card.className = 'task-card';
  card.id = `card-${task.id}`;
  card.setAttribute('data-task-id', task.id);
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-haspopup', 'dialog');
  card.setAttribute('aria-label', `View details for task: ${task.title}`);
  card.draggable = true;

  const header = document.createElement('div');
  header.className = 'task-card-header';

  const title = document.createElement('h3');
  title.className = 'task-title';
  title.textContent = task.title;

  const priority = document.createElement('span');
  priority.className = `priority-badge priority-${task.priority}`;
  priority.textContent = task.priority;

  header.appendChild(title);
  header.appendChild(priority);

  const desc = document.createElement('p');
  desc.className = 'task-desc';
  desc.textContent = task.description;

  const meta = document.createElement('div');
  meta.className = 'task-meta';

  const tagsDiv = document.createElement('div');
  tagsDiv.className = 'task-tags';
  for (const t of task.tags) {
    const span = document.createElement('span');
    span.className = `tag-badge tag-${t}`;
    span.textContent = `#${t}`;
    tagsDiv.appendChild(span);
  }

  meta.appendChild(tagsDiv);

  card.appendChild(header);
  card.appendChild(desc);
  card.appendChild(meta);

  return card;
}

export function renderBoard(boardContainer: HTMLElement, store: TaskStore): void {
  const tasks = store.getTasks();
  boardContainer.innerHTML = '';

  for (let i = 0; i < COLUMNS.length; i++) {
    const col = COLUMNS[i];
    const colEl = document.createElement('section');
    // First column is active on mobile by default
    colEl.className = `board-column ${i === 0 ? 'mobile-active' : ''}`;
    colEl.id = `col-${col.id}`;
    colEl.setAttribute('data-column-id', col.id);
    colEl.setAttribute('aria-labelledby', `title-${col.id}`);

    const header = document.createElement('header');
    header.className = 'column-header';

    const colTasks = tasks.filter((t) => t.status === col.id);

    const titleEl = document.createElement('h2');
    titleEl.id = `title-${col.id}`;
    titleEl.className = 'column-title';
    titleEl.textContent = col.title;

    const countEl = document.createElement('span');
    countEl.className = 'column-count';
    countEl.textContent = String(colTasks.length);
    titleEl.appendChild(countEl);

    header.appendChild(titleEl);
    colEl.appendChild(header);

    const listEl = document.createElement('div');
    listEl.className = 'task-list';
    listEl.setAttribute('role', 'list');
    listEl.id = `list-${col.id}`;

    for (const t of colTasks) {
      listEl.appendChild(createTaskCardElement(t));
    }

    colEl.appendChild(listEl);
    boardContainer.appendChild(colEl);
  }
}

/**
 * Non-destructive filtering:
 * Toggles visibility on existing DOM cards and updates column counters without
 * wiping innerHTML, losing input focus, or detaching event listeners.
 */
export function applyFilter(boardContainer: HTMLElement, criteria: FilterCriteria): void {
  const cards = boardContainer.querySelectorAll<HTMLElement>('.task-card');
  const query = criteria.searchQuery?.toLowerCase().trim() || '';
  const selectedTags = new Set(criteria.tags || []);

  const visibleCountPerCol: Record<string, number> = { todo: 0, in_progress: 0, done: 0 };

  cards.forEach((card) => {
    const title = card.querySelector('.task-title')?.textContent?.toLowerCase() || '';
    const desc = card.querySelector('.task-desc')?.textContent?.toLowerCase() || '';
    const matchesQuery = !query || title.includes(query) || desc.includes(query);

    const cardTags = Array.from(card.querySelectorAll('.tag-badge')).map(
      (el) => el.textContent?.replace('#', '') || ''
    );
    const matchesTags = selectedTags.size === 0 || cardTags.some((t) => selectedTags.has(t));

    const isVisible = matchesQuery && matchesTags;
    card.classList.toggle('task-card-hidden', !isVisible);

    if (isVisible) {
      const colId = card.closest('.board-column')?.getAttribute('data-column-id');
      if (colId && visibleCountPerCol[colId] !== undefined) {
        visibleCountPerCol[colId]++;
      }
    }
  });

  // Update badge counts non-destructively
  for (const [colId, count] of Object.entries(visibleCountPerCol)) {
    const countEl = boardContainer.querySelector(`#col-${colId} .column-count`);
    if (countEl) countEl.textContent = String(count);
  }
}

/**
 * Populates task details inside modal dialog body.
 */
export function renderTaskDetail(dialogBody: HTMLElement, task: TaskCard): void {
  dialogBody.innerHTML = `
    <div class="dialog-field">
      <strong>Priority:</strong>
      <span class="priority-badge priority-${task.priority}">${task.priority}</span>
    </div>
    <div class="dialog-field">
      <strong>Status:</strong>
      <span>${task.status.replace('_', ' ').toUpperCase()}</span>
    </div>
    <div class="dialog-field">
      <strong>Description:</strong>
      <p>${task.description}</p>
    </div>
    <div class="dialog-field">
      <strong>Tags:</strong>
      <div class="task-tags">
        ${task.tags.map((t) => `<span class="tag-badge tag-${t}">#${t}</span>`).join(' ')}
      </div>
    </div>
  `;
}
