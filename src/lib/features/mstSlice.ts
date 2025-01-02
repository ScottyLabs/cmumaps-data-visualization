import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Mst } from "../../components/shared/types";

interface MstState {
  mst: Mst | null;
}

const initialState: MstState = {
  mst: null,
};

const mstSlice = createSlice({
  name: "mst",
  initialState,
  reducers: {
    setMst(state, action: PayloadAction<Mst | null>) {
      state.mst = action.payload;
    },
  },
});

export const { setMst } = mstSlice.actions;
export default mstSlice.reducer;