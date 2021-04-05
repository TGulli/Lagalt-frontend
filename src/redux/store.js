import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers";
import storage from 'redux-persist/lib/storage'
import {persistStore, persistReducer} from "redux-persist"
import thunkMiddleware from 'redux-thunk'

/**
 * We use thunk middleware to use async functions in our
 * redux-action function upDateUser to update user from server.
 */
const composedEnhancer = applyMiddleware(thunkMiddleware)


const persistConfig = {
    key: 'root',
    storage
}
/**
 * We use redux persist to keep the global states persistent
 */
const persistedReducer = persistReducer(persistConfig, rootReducer)


/**
 * Default function that creates a persistent redux store
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
    let store = createStore(persistedReducer, composedEnhancer)
    let persistor = persistStore(store)
    return {store, persistor}
}

