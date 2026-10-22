import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../store/features/userSlice";
import { notesFetch, selectNotes, selectNotesError, selectNotesStatus } from "../store/features/noteSlice";

/** Loads the signed-in user's entries once and exposes them with their loading state. */
export default function useNotes() {
  const dispatch = useDispatch();
  const uid = useSelector(selectUser)?.uid;
  const notes = useSelector(selectNotes);
  const status = useSelector(selectNotesStatus);
  const error = useSelector(selectNotesError);

  useEffect(() => {
    if (uid && status === "idle") dispatch(notesFetch(uid));
  }, [dispatch, uid, status]);

  const retry = useCallback(() => {
    if (uid) dispatch(notesFetch(uid));
  }, [dispatch, uid]);

  return {
    notes,
    error,
    retry,
    isLoading: status === "idle" || status === "pending",
    isError: status === "rejected",
  };
}
