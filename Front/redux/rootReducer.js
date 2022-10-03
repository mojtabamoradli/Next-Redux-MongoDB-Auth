import { combineReducers } from "redux";
import { userReducer } from "./auth/userReducer";

const rootReducer = combineReducers({ user: userReducer });

export default rootReducer;
