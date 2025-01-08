import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import uppostReducer from "./uppostSlice";

const store = configureStore({
    reducer:{
        auth:authReducer,
        uppost:uppostReducer
    },
});
export default store;