import {Redirect, Route} from "react-router-dom";
import {useSelector} from "react-redux";

export const PrivateRoute = props => {

    const isLoggedIn = useSelector(state => state.isLoggedIn)

    /**
     * If the user is not logged in and tries to access a private route,
     * the user is redirected to main
     * */
    if (!isLoggedIn) {
        return <Redirect to={ "/" }  />
    }

    return <Route {...props} />
}

export default PrivateRoute
