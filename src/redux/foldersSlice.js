import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  folders: JSON.parse(localStorage.getItem('folders')) || [],
};

const foldersSlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {
    addFolder: (state, action) => {
      state.folders.push(action.payload);
      localStorage.setItem('folders', JSON.stringify(state.folders));
    },
    loadFoldersFromStorage: (state) => {
      const storedFolders = JSON.parse(localStorage.getItem('folders'));
      if (storedFolders) {
        state.folders = storedFolders;
      }
    },
  },
});

export const { addFolder, loadFoldersFromStorage } = foldersSlice.actions;
export default foldersSlice.reducer;
