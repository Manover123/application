import {createSlice} from '@reduxjs/toolkit';
const initialState = {
  idlock: null,
  idOrder: null,
  dataId_sal: null,
  idOrder_membersal: null,
  dataId_membersal: null,
};
export const product = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setLock: (state, action) => {
      state.idlock = action.payload.idlock;
    },
    setidOrder: (state, action) => {
      state.idOrder = action.payload.idOrder;
    },
    setMarketproduct: (state, action) => {
      state.dataId_sal = action.payload.dataId_sal;
    },
    setidOrder_membersal: (state, action) => {
      state.idOrder_membersal = action.payload.idOrder_membersal;
    },
    setMarketproduct_membersal: (state, action) => {
      state.dataId_membersal = action.payload.dataId_membersal;
    },
  },
});
export const {
  setLock,
  setidOrder,
  setMarketproduct,
  setidOrder_membersal,
  setMarketproduct_membersal,
} = product.actions;
export default product.reducer;
