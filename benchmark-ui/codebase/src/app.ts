import { TaskStore } from './store.ts';
import { renderBoard, applyFilter, renderTaskDetail } from './board.ts';
import type { TaskStatus, FilterCriteria } from './types.ts';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('board-container');
  if (!container) return;

  const store = new TaskStore();
  renderBoard(container, store);

  // Active filter state
  const currentFilter: FilterCriteria = {
    searchQuery: '',
    tags: [],
  };

  // 1. Live Non-Destructive Search Filter
  const searchInput = document.getElementById('filter-search') as HTMLInputElement | null;
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentFilter.searchQuery = searchInput.value;
      applyFilter(container, currentFilter);
    });
  }

  // 2. Tag Filter Pills
  const tagContainer = document.getElementById('filter-tags');
  if (tagContainer) {
    tagContainer.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('.pill-btn') as HTMLButtonElement | null;
      if (btn) {
        const tag = btn.getAttribute('data-tag');
        if (!tag) return;

        const isPressed = btn.getAttribute('aria-pressed') === 'true';
        btn.setAttribute('aria-pressed', String(!isPressed));
        btn.classList.toggle('active', !isPressed);

        if (!isPressed) {
          currentFilter.tags = [...(currentFilter.tags || []), tag];
        } else {
          currentFilter.tags = (currentFilter.tags || []).filter((t) => t !== tag);
        }

        applyFilter(container, currentFilter);
      }
    });
  }

  // 3. Mobile Column Switcher (< 768px)
  const mobileTabs = document.getElementById('mobile-column-tabs');
  if (mobileTabs) {
    mobileTabs.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('.tab-btn') as HTMLButtonElement | null;
      if (btn) {
        const targetTab = btn.getAttribute('data-tab');
        if (!targetTab) return;

        // Update tab states
        mobileTabs.querySelectorAll('.tab-btn').forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // Update active column visibility
        container.querySelectorAll('.board-column').forEach((col) => {
          const colId = col.getAttribute('data-column-id');
          col.classList.toggle('mobile-active', colId === targetTab);
        });
      }
    });
  }

  // 4. Accessible Task Modal Dialog (WCAG 2.1 AA)
  const dialog = document.getElementById('task-dialog') as HTMLDialogElement | null;
  const dialogTitle = document.getElementById('dialog-task-title');
  const dialogBody = document.getElementById('dialog-body');
  let lastFocusedCard: HTMLElement | null = null;

  const openTaskModal = (card: HTMLElement) => {
    const taskId = card.getAttribute('data-task-id');
    if (!taskId || !dialog || !dialogBody || !dialogTitle) return;

    const task = store.getTaskById(taskId);
    if (!task) return;

    lastFocusedCard = card;
    dialogTitle.textContent = task.title;
    renderTaskDetail(dialogBody, task);

    dialog.showModal();
  };

  container.addEventListener('click', (e) => {
    const card = (e.target as HTMLElement).closest('.task-card') as HTMLElement | null;
    if (card) {
      openTaskModal(card);
    }
  });

  container.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = (e.target as HTMLElement).closest('.task-card') as HTMLElement | null;
      if (card && document.activeElement === card) {
        e.preventDefault();
        openTaskModal(card);
      }
    }
  });

  // Restore focus to card upon closing dialog
  if (dialog) {
    dialog.addEventListener('close', () => {
      if (lastFocusedCard && document.body.contains(lastFocusedCard)) {
        lastFocusedCard.focus();
      }
    });
  }

  // 5. Drag and Drop Handling
  let draggedTaskId: string | null = null;

  container.addEventListener('dragstart', (e) => {
    const target = (e.target as HTMLElement).closest('.task-card');
    if (target) {
      draggedTaskId = target.getAttribute('data-task-id');
      if (e.dataTransfer) {
        e.dataTransfer.setData('text/plain', draggedTaskId || '');
        e.dataTransfer.effectAllowed = 'move';
      }
    }
  });

  container.addEventListener('dragover', (e) => {
    const column = (e.target as HTMLElement).closest('.board-column');
    if (column) {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
      }
    }
  });

  container.addEventListener('drop', (e) => {
    const column = (e.target as HTMLElement).closest('.board-column');
    if (column && draggedTaskId) {
      e.preventDefault();
      const colId = column.getAttribute('data-column-id') as TaskStatus;
      if (colId) {
        store.moveTask(draggedTaskId, colId);
        renderBoard(container, store);
        applyFilter(container, currentFilter);
      }
      draggedTaskId = null;
    }
  });
});
