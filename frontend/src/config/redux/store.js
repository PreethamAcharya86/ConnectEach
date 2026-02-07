import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducer/authReducer/index.js';
import postReducer from './reducer/postReducer/index.js';
import teamReducer from './reducer/teamReducer/index.js';

// **Steps for state management**
// Submit action
// Handle action in reducer
// Register here -> ReducerTypea 


export const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postReducer,
        team : teamReducer
    }
}); 

