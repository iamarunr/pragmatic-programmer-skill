import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { TaskStore } from '../src/store.ts';

// Mock storage for deterministic testing without DOM
class MockStorage implements Storage {
  private data: Map<string, string> = new Map();

  get length(): number {
    return this.data.size;
  }

  clear(): void {
    this.data.clear();
  }

  getItem(key: string): string | null {
    return this.data.get(key) || null;
  }

  key(index: number): string | null {
    return Array.from(this.data.keys())[index] || null;
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
}

describe('TaskStore State Management', () => {
  let store: TaskStore;
  let mockStorage: MockStorage;

  beforeEach(() => {
    mockStorage = new MockStorage();
    store = new TaskStore(mockStorage);
  });

  it('loads initial seed tasks on clean start', () => {
    const tasks = store.getTasks();
    assert.equal(tasks.length, 4);
    assert.equal(tasks[0].id, 'task-1');
  });

  it('moves task to different column and persists state', () => {
    const success = store.moveTask('task-1', 'in_progress');
    assert.equal(success, true);

    const task = store.getTaskById('task-1');
    assert.equal(task?.status, 'in_progress');

    // Verify persisted in storage
    const reloaded = new TaskStore(mockStorage);
    assert.equal(reloaded.getTaskById('task-1')?.status, 'in_progress');
  });

  it('adds a new task with unique id and persists', () => {
    const created = store.addTask({
      title: 'New Unit Test Task',
      description: 'Testing store insertion',
      status: 'todo',
      priority: 'low',
      tags: ['ops'],
    });

    assert.ok(created.id);
    assert.equal(store.getTasks().length, 5);
  });

  it('filters tasks by search query and tags', () => {
    const queryResults = store.filterTasks({ searchQuery: 'oauth' });
    assert.equal(queryResults.length, 1);
    assert.equal(queryResults[0].id, 'task-1');

    const tagResults = store.filterTasks({ tags: ['bug'] });
    assert.equal(tagResults.length, 1);
    assert.equal(tagResults[0].id, 'task-2');
  });
});
