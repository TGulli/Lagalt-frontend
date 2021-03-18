import { createStore } from "redux";
import rootReducer from "./reducers";
import storage from 'redux-persist/lib/storage'
import {persistStore, persistReducer} from "redux-persist"

const persistConfig = {
    key: 'root',
    storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
    let store = createStore(persistedReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
    let persistor = persistStore(store)
    return {store, persistor}
}

