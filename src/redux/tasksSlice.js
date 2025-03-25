import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    loadTasksFromStorage: (state) => {
      const storedTasks = JSON.parse(localStorage.getItem('tasks'));
      if (storedTasks) {
        state.tasks = storedTasks;
      }
    },
    sortByPriority: (state) => {
      state.tasks.sort((a, b) => {
        const priorities = { High: 1, Medium: 2, Low: 3 };
        return priorities[a.priority] - priorities[b.priority];
      });
    },
    sortByDeadline: (state) => {
      state.tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    },
    completeTask: (state, action) => {
        state.tasks = state.tasks.map(task =>
          task.id === action.payload ? { ...task, completed: true } : task
        );
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      },
      
  },
});

export const { addTask, deleteTask, loadTasksFromStorage, sortByPriority, sortByDeadline, completeTask } = tasksSlice.actions;
export default tasksSlice.reducer;
