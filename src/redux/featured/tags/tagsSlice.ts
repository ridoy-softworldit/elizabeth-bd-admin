import { RootState } from '@/redux/store';
import { ITag } from '@/types/tags';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TTagsState = {
  tags: ITag[];
  singleTag: ITag | null;
};

const initialState: TTagsState = {
  tags: [],
  singleTag: null,
};

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    setTags: (state, action: PayloadAction<ITag[]>) => {
      state.tags = action.payload;
    },
    setSingleTag: (state, action: PayloadAction<ITag>) => {
      state.singleTag = action.payload;
    },
  },
});

export const { setTags, setSingleTag } = tagsSlice.actions;

// selectors
export const selectTags = (state: RootState) => state.tags.tags;
export const selectSingleTag = (state: RootState) => state.tags.singleTag;

export default tagsSlice.reducer;
