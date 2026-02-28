import { RootState } from '@/redux/store';
import { IAttribute } from '@/types/attribute';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';



type TAttributeState = {
  attributes: IAttribute[];
  singleAttribute: IAttribute | null;
};

const initialState: TAttributeState = {
  attributes: [],
  singleAttribute: null,
};

const attributeSlice = createSlice({
  name: 'attributes',
  initialState,
  reducers: {
    setAttributes: (state, action: PayloadAction<IAttribute[]>) => {
      state.attributes = action.payload;
    },
    setSingleAttribute: (state, action: PayloadAction<IAttribute>) => {
      state.singleAttribute = action.payload;
    },
  },
});

export const { setAttributes, setSingleAttribute } = attributeSlice.actions;

// selectors
export const selectAttributes = (state: RootState) =>
  state.attributes.attributes;
export const selectSingleAttribute = (state: RootState) =>
  state.attributes.singleAttribute;

export default attributeSlice.reducer;
