import {createSlice} from '@reduxjs/toolkit';
const initialState = {
  user: [],
  memberSal: [],
  member: null,
  memberSal: null,
  itemPd: [],
  sumamont: 0,
};
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
    setMemberSalr: (state, action) => {
      state.memberSal = action.payload.memberSal;
    },
    setMember: (state, action) => {
      state.member = action.payload.member;
    },
    setMembersal_login: (state, action) => {
      state.memberSal = action.payload.memberSal;
    },
    itemProduct: (state, action) => {
      state.itemPd.push(action.payload);
    },

    removeFromCart(state, action) {
      state.itemPd.map(cartItem => {
        if (
          cartItem.itemPd.image_Product === action.payload.itemPd.image_Product
        ) {
          const nextCartItems = state.itemPd.filter(
            item => item.itemPd.image_Product !== cartItem.itemPd.image_Product,
          );
          state.itemPd = nextCartItems;
        }
        return state;
      });
    },
    clearCart(state, action) {
      state.itemPd = [];
    },
    clearIduser(state, action) {
      state.user = [];
    },
    clearIdmemberSal(state, action) {
      state.memberSal = [];
    },
  },
});
export const {
  setUser,
  setMemberSalr,
  setMember,
  setMembersal_login,
  itemProduct,
  removeFromCart,
  clearCart,
  clearIduser,
  clearIdmemberSal,
} = authSlice.actions;
export default authSlice.reducer;
