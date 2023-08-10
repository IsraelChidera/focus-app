import { createSlice } from "@reduxjs/toolkit";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const initialState = {
  value: [],
};

export const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    setAllUserNotes: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setAllUserNotes } = noteSlice.actions;

export const getAllUserNotes =  (dispatch) => {
  try {
    const q = query(collection(db, "notes"), where("uid", "==", user));
    const querySnapshot = getDocs(q);
    const fetchedData = [];
    querySnapshot.forEach((doc) => {
        fetchedData = state.value.push({ id: doc.id, ...doc.data() });      
    });

    dispatch(setAllUserNotes(fetchedData));

    // setData(fetchedData);
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
};

export default noteSlice.reducer;
