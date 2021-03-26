import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers";
import storage from 'redux-persist/lib/storage'
import {persistStore, persistReducer} from "redux-persist"
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))



const persistConfig = {
    key: 'root',
    storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)


// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
    let store = createStore(persistedReducer, composedEnhancer)
    let persistor = persistStore(store)
    return {store, persistor}
}

