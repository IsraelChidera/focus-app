import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { getDataErrorMessage } from "../../utils/errors";

// Firestore Timestamps aren't serializable, so they're stored as epoch millis.
const toMillis = (value) => (value && typeof value.toMillis === "function" ? value.toMillis() : null);

const toNote = (snapshot) => {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    uid: data.uid,
    title: data.title || "",
    notes: data.notes || "",
    dateCreated: data.dateCreated || "",
    createdAt: toMillis(data.createdAt),
    updatedAt: toMillis(data.updatedAt),
  };
};

// Newest first; legacy entries without a timestamp go last.
const byNewest = (a, b) => (b.createdAt || 0) - (a.createdAt || 0);

const legacyDateLabel = () =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date());

export const notesFetch = createAsyncThunk(
  "note/notesFetch",
  async (uid, { rejectWithValue }) => {
    try {
      const snapshot = await getDocs(query(collection(db, "notes"), where("uid", "==", uid)));
      return snapshot.docs.map(toNote).sort(byNewest);
    } catch (error) {
      console.error("Failed to load notes:", error);
      return rejectWithValue(getDataErrorMessage(error));
    }
  },
  // Avoid duplicate requests (e.g. StrictMode double effects, two components mounting together).
  { condition: (_uid, { getState }) => getState().note.status !== "pending" }
);

export const noteFetchById = createAsyncThunk(
  "note/noteFetchById",
  async ({ id, uid }, { rejectWithValue }) => {
    try {
      const snapshot = await getDoc(doc(db, "notes", id));
      // Treat someone else's entry the same as a missing one.
      if (!snapshot.exists() || snapshot.data().uid !== uid) {
        return rejectWithValue("not-found");
      }
      return toNote(snapshot);
    } catch (error) {
      console.error("Failed to load note:", error);
      return rejectWithValue(error?.code === "permission-denied" ? "not-found" : getDataErrorMessage(error));
    }
  }
);

export const noteCreate = createAsyncThunk(
  "note/noteCreate",
  async ({ uid, title, notes }, { rejectWithValue }) => {
    try {
      // dateCreated is kept so entries stay readable by older builds of the app.
      const dateCreated = legacyDateLabel();
      const ref = await addDoc(collection(db, "notes"), {
        uid,
        title,
        notes,
        dateCreated,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      const now = Date.now();
      return { id: ref.id, uid, title, notes, dateCreated, createdAt: now, updatedAt: now };
    } catch (error) {
      console.error("Failed to create note:", error);
      return rejectWithValue(getDataErrorMessage(error));
    }
  }
);

export const noteUpdate = createAsyncThunk(
  "note/noteUpdate",
  async ({ id, title, notes }, { rejectWithValue }) => {
    try {
      await updateDoc(doc(db, "notes", id), { title, notes, updatedAt: serverTimestamp() });
      return { id, title, notes, updatedAt: Date.now() };
    } catch (error) {
      console.error("Failed to update note:", error);
      return rejectWithValue(getDataErrorMessage(error));
    }
  }
);

export const noteDelete = createAsyncThunk("note/noteDelete", async (id, { rejectWithValue }) => {
  try {
    await deleteDoc(doc(db, "notes", id));
    return id;
  } catch (error) {
    console.error("Failed to delete note:", error);
    return rejectWithValue(getDataErrorMessage(error));
  }
});

const initialState = {
  value: [],
  // idle | pending | success | rejected — describes the list fetch only.
  status: "idle",
  error: null,
};

export const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    notesReset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(notesFetch.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(notesFetch.fulfilled, (state, action) => {
        state.status = "success";
        state.value = action.payload;
      })
      .addCase(notesFetch.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload || action.error.message;
      })
      .addCase(noteFetchById.fulfilled, (state, action) => {
        const index = state.value.findIndex((note) => note.id === action.payload.id);
        if (index === -1) state.value.push(action.payload);
        else state.value[index] = action.payload;
        state.value.sort(byNewest);
      })
      .addCase(noteCreate.fulfilled, (state, action) => {
        state.value.unshift(action.payload);
      })
      .addCase(noteUpdate.fulfilled, (state, action) => {
        const note = state.value.find((item) => item.id === action.payload.id);
        if (note) Object.assign(note, action.payload);
      })
      .addCase(noteDelete.fulfilled, (state, action) => {
        state.value = state.value.filter((note) => note.id !== action.payload);
      });
  },
});

export const { notesReset } = noteSlice.actions;

export const selectNotes = (state) => state.note.value;
export const selectNotesStatus = (state) => state.note.status;
export const selectNotesError = (state) => state.note.error;
export const selectNoteById = (id) => (state) => state.note.value.find((note) => note.id === id);

export default noteSlice.reducer;
