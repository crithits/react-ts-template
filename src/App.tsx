import { useState, type SubmitEvent } from 'react';

type Task = { id: string; title: string; done: boolean };

type Filter = 'all' | 'open' | 'done';

const filters = ['all', 'open', 'done'] as const satisfies readonly Filter[];

export function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [draft, setDraft] = useState('');

  // Derived during render — no effect, no extra state.
  const visible = tasks.filter((task) => {
    switch (filter) {
      case 'all':
        return true;
      case 'open':
        return !task.done;
      case 'done':
        return task.done;
    }
  });
  const remaining = tasks.filter((task) => !task.done).length;

  function addTask(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = draft.trim();
    if (!title) return;
    setTasks((prev) => [...prev, { id: crypto.randomUUID(), title, done: false }]);
    setDraft('');
  }

  function toggle(id: string) {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  }

  return (
    <main>
      <h1>Tasks</h1>

      <form onSubmit={addTask}>
        <label htmlFor="new-task">New task</label>
        <input
          id="new-task"
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
          }}
        />
        <button type="submit">Add</button>
      </form>

      <fieldset>
        <legend>Show</legend>
        {filters.map((value) => (
          <label key={value}>
            <input
              type="radio"
              name="filter"
              value={value}
              checked={filter === value}
              onChange={() => {
                setFilter(value);
              }}
            />
            {value}
          </label>
        ))}
      </fieldset>

      <ul>
        {visible.map((task) => (
          <li key={task.id}>
            <label>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => {
                  toggle(task.id);
                }}
              />
              {task.title}
            </label>
          </li>
        ))}
      </ul>

      <p>{remaining} remaining</p>
    </main>
  );
}
