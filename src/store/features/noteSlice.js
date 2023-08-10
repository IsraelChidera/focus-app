import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    value: []
}

export const noteSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        fetchAllUserNotes: () => {
            
        }
    }
})