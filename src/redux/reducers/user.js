import {LOG_IN, LOG_OUT, UPDATE_USER, LOADING} from "../actionTypes"
import {updateUser} from "../actions";

const initialState = {
    user: {},
    token: '',
    isLoggedIn: false
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function(state = initialState, action) {
    console.log("reducer action")
    console.log(action.type)
    switch (action.type) {
        case LOG_IN: {
            console.log("Got to login switch ")
            const {user, token, isLoggedIn} = action.payload;
            console.log("LigIn: User" + {...user} + "isLoggedIn: " + isLoggedIn)
            return {
                //...state,
                user: {
                    ...user
                },
                token: token,
                isLoggedIn: isLoggedIn
            };
        }
        case LOG_OUT: {
            const {isLoggedIn} = action.payload;
            return {
                //...state,
                user: {},
                token: '',
                isLoggedIn: isLoggedIn
            };
        }
        case UPDATE_USER: {
            console.log("payload")
            console.log(action.payload)
            const user  = action.payload;
            console.log("user from payload")
            console.log(user)
            return {
                user: {...user},
                isLoggedIn: true
            }
        }
        case LOADING:
            return {
                user: {},
                isLoggedIn: true
            }
        default:
            return state;
    }
}

/*export const slice = createSlice({
    name: 'user',
    initialState: {
        user: {},
        isLoggedIn: false
    },
    reducers: {
        LOG_IN (state, action): {

            //const{user, isLoggedIn} = action.payload;

        //...state,
        user: {
            ...user
        },
        isLoggedIn: action.payload[0]

}
case LOG_OUT: {
    const {isLoggedIn} = action.payload;
    return {
        //...state,
        user: {},
        isLoggedIn: isLoggedIn
    };
}

    },
    extraReducers: builder => {
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            // reduce the collection by the id property into a shape of { 1: { ...user }}
            const byId = action.payload.users.reduce((byId, user) => {
                byId[user.id] = user
                return byId
            }, {})
            state.entities = byId
            state.ids = Object.keys(byId)
        })
    }
})*/


