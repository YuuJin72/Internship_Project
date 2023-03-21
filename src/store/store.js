import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./user";
import idReducer from "./signup/signid";
import pwReducer from "./signup/signpw";
import emailReducer from "./signup/signemail";
import nicknameReducer from "./signup/signnickname";
import pwcReducer from "./signup/signpwc";
import memberReducer from "./member";
import searchReducer from "./search";
import studyRoomHostReducer from "./studyRoomHost";
import studyNavReducer from "./studyNav";
import getNicknameReducer from "./getnickname";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  user: userReducer,
  member: memberReducer,
  id: idReducer,
  pw: pwReducer,
  pwc: pwcReducer,
  email: emailReducer,
  nickname: nicknameReducer,
  search: searchReducer,
  studyroomhost: studyRoomHostReducer,
  studynavnumber: studyNavReducer,
  getnickname: getNicknameReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
