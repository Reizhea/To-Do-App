import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tasksReducer from './tasksSlice';
import foldersReducer from './foldersSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    folders: foldersReducer,
  },
});

export default store;
