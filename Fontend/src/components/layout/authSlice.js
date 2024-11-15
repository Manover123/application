import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  user: null,
  nameTypes: null,
  typename: null,
  Chacts: null,
  Chacts2: null,
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
    setChact: (state, action) => {
      state.Chacts = action.payload.Chacts;
    },
    setChact2: (state, action) => {
      state.Chacts2 = action.payload.Chacts2;
    },
    setnameType: (state, action) => {
      switch (action.payload.nameTypes) {
        case 0:
          state.typename = "หน้าหลัก";
          break;
        case 1:
          state.typename = "สมาชิกผู้ชื้อ";
          break;
        case 2:
          state.typename = "สมาชิกผู้ขาย";
          break;
        case 3:
          state.typename = "ข้อมูลล็อคขาย";
          break;
        case 4:
          state.typename = "ข้อมูลประเถท";
          break;
        case 5:
          state.typename = "สัญญาเช่า ";
          break;
        case 6:
          state.typename = "เพิ่มสมาชิกผู้ดูเเลระบบ";
          break;
        case 7:
          state.typename = "ข้อมูลสัญญาเช่า";
          break;
      }
    },
  },
});
export const { setUser, setnameType, setChact, setChact2 } = authSlice.actions;
export default authSlice.reducer;
