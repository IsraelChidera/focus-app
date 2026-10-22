import { createSlice } from "@reduxjs/toolkit";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { notesReset } from "./noteSlice";

// Only plain data goes into the store; the Firebase User object is not serializable.
export const toSerializableUser = (user) =>
  user ? { uid: user.uid, email: user.email, displayName: user.displayName } : null;

const initialState = {
  value: null,
  // "loading" until Firebase reports the first auth state, so a page refresh
  // doesn't bounce signed-in users back to the login screen.
  status: "loading",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.value = action.payload;
      state.status = "ready";
    },
  },
});

export const { setCurrentUser } = userSlice.actions;

/** Subscribes to Firebase auth. Returns the unsubscribe function. */
export const listenToAuthChanges = () => (dispatch, getState) => {
  if (!auth) {
    dispatch(setCurrentUser(null));
    return () => {};
  }

  return onAuthStateChanged(
    auth,
    (user) => {
      const previousUid = getState().user.value?.uid;
      if (previousUid && previousUid !== user?.uid) {
        dispatch(notesReset());
      }
      dispatch(setCurrentUser(toSerializableUser(user)));
    },
    (error) => {
      console.error("Auth listener failed:", error);
      dispatch(setCurrentUser(null));
    }
  );
};

export const selectUser = (state) => state.user.value;
export const selectAuthStatus = (state) => state.user.status;

export default userSlice.reducer;
