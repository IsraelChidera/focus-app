import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const initialState = {
  value: [],
  status: "idle",
  error: null
};

export const notesFetch = createAsyncThunk("note/notesFetch", async (user) => {
  try {
    const q = query(collection(db, "notes"), where("uid", "==", user));
    const querySnapshot = await getDocs(q);

    const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

    // const fetchedData = querySnapshot.map((doc) => ({
    //   id: doc.id,
    //   ...doc.data(),
    // }));

    return fetchedData;
  } catch (error) {
    throw error;
  }
});

export const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {},
  extraReducers: {
    [notesFetch.pending]: (state, action) => {
      state.status = "pending";
    },
    [notesFetch.fulfilled]: (state, action) => {
      state.status = "success";
      state.value = action.payload;
    },
    [notesFetch.rejected]: (state, action) => {
      state.status = "rejected";
      state.error = action.error.message;
    },
  },
});

export default noteSlice.reducer;
