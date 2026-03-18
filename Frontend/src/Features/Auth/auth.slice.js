import { createSlice } from "@reduxjs/toolkit";

const authslice = createSlice({
    name: "auth",
    initialState: {
        loading: true,
        user: null,
        err: null
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setUser: (state, action) => {
            state.user = action.payload
        },
        setErr: (state, action) => {
            state.err = action.payload
        }
    }
})
export const { setLoading, setUser, setErr } = authslice.actions
export default authslice.reducer