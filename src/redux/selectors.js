
export const getUserState = store => store.user;

export const getUser = store =>
    getUserState(store) ? getUserState(store).user: {};

export const getIsLoggedIn = store =>
    getUserState(store) ? getUserState(store).isLoggedIn: false;