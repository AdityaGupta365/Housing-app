import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance.js";



export const loginUser=createAsyncThunk('user/login',async(credentials)=>{
    const res= await axios.post('api/auth/login',credentials);
    return res.data;
})

const userSlice=createSlice({
    name:'user',
    initialState:{
        userInfo:null,
        loading:false,
        error:null,

    },
    reducers:{
        logout:(state)=>{
            state.userInfo=null;
            localStorage.removeItem('token');
        }
    },
    extraReducers:(builder)=>{
        builder
            .addCase(loginUser.pending,(state)=>{
                state.loading=true;
            })
            .addCase(loginUser.fulfilled,(state,action)=>{
                state.loading=false;
                state.userInfo=action.payload.user;
                localStorage.setItem('token',action.payload.token);
            })
            .addCase(loginUser.rejected,(state,action)=>{
                state.loading=true;
                state.error=action.error.message;
            });
            
    },
});
export const {logout}=userSlice.actions;

export default userSlice.reducer;