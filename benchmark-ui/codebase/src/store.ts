import type { TaskCard, TaskStatus, FilterCriteria } from './types.ts';

const STORAGE_KEY = 'workflow_board_tasks_v1';

const INITIAL_TASKS: TaskCard[] = [
  {
    id: 'task-1',
    title: 'Implement OAuth 2.0 PKCE flow',
    description: 'Secure authorization code exchange for single page app clients.',
    status: 'todo',
    priority: 'high',
    tags: ['feature'],
    createdAt: 1700000000000,
  },
  {
    id: 'task-2',
    title: 'Fix token refresh race condition',
    description: 'Concurrent requests trigger multiple simultaneous token refresh calls.',
    status: 'in_progress',
    priority: 'high',
    tags: ['bug'],
    createdAt: 1700000005000,
  },
  {
    id: 'task-3',
    title: 'Optimize database connection pooling',
    description: 'Configure pool max connections and health check timeout for PostgreSQL.',
    status: 'done',
    priority: 'medium',
    tags: ['ops'],
    createdAt: 1700000010000,
  },
  {
    id: 'task-4',
    title: 'Design accessible modal component',
    description: 'Ensure focus trap, ESC key close, and aria-modal attributes comply with WCAG.',
    status: 'todo',
    priority: 'medium',
    tags: ['feature'],
    createdAt: 1700000015000,
  },
];

export class TaskStore {
  private tasks: Map<string, TaskCard> = new Map();
  private storage: Storage | null = null;

  constructor(customStorage?: Storage | null) {
    if (customStorage !== undefined) {
      this.storage = customStorage;
    } else if (typeof window !== 'undefined' && window.localStorage) {
      this.storage = window.localStorage;
    }
    this.load();
  }

  private load(): void {
    if (this.storage) {
      const raw = this.storage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.tasks.clear();
            for (const item of parsed) {
              if (item && typeof item.id === 'string') {
                this.tasks.set(item.id, item);
              }
            }
            return;
          }
        } catch {
          // Fallback to initial seed
        }
      }
    }

    // Default initial seed
    this.tasks.clear();
    for (const t of INITIAL_TASKS) {
      this.tasks.set(t.id, { ...t });
    }
    this.persist();
  }

  private persist(): void {
    if (this.storage) {
      const arr = Array.from(this.tasks.values());
      this.storage.setItem(STORAGE_KEY, JSON.stringify(arr));
    }
  }

  public getTasks(): TaskCard[] {
    return Array.from(this.tasks.values()).sort((a, b) => a.createdAt - b.createdAt);
  }

  public getTasksByStatus(status: TaskStatus): TaskCard[] {
    return this.getTasks().filter((t) => t.status === status);
  }

  public getTaskById(id: string): TaskCard | undefined {
    const found = this.tasks.get(id);
    return found ? { ...found } : undefined;
  }

  public addTask(data: Omit<TaskCard, 'id' | 'createdAt'>): TaskCard {
    const id = `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const task: TaskCard = {
      ...data,
      id,
      createdAt: Date.now(),
    };
    this.tasks.set(id, task);
    this.persist();
    return task;
  }

  public updateTask(id: string, updates: Partial<Omit<TaskCard, 'id' | 'createdAt'>>): TaskCard | null {
    const existing = this.tasks.get(id);
    if (!existing) return null;

    const updated: TaskCard = {
      ...existing,
      ...updates,
    };
    this.tasks.set(id, updated);
    this.persist();
    return { ...updated };
  }

  public moveTask(id: string, newStatus: TaskStatus): boolean {
    return this.updateTask(id, { status: newStatus }) !== null;
  }

  public deleteTask(id: string): boolean {
    const deleted = this.tasks.delete(id);
    if (deleted) {
      this.persist();
    }
    return deleted;
  }

  public filterTasks(criteria: FilterCriteria): TaskCard[] {
    let list = this.getTasks();

    if (criteria.searchQuery && criteria.searchQuery.trim() !== '') {
      const q = criteria.searchQuery.toLowerCase().trim();
      list = list.filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }

    if (criteria.tags && criteria.tags.length > 0) {
      const set = new Set(criteria.tags);
      list = list.filter((t) => t.tags.some((tag) => set.has(tag)));
    }

    return list;
  }
}
