import {Redirect, Route} from "react-router-dom";
import {useSelector} from "react-redux";

export const PrivateRoute = props => {

    const isLoggedIn = useSelector(state => state.isLoggedIn)

    if (!isLoggedIn) {
        return <Redirect to={ "/" }  />
    }

    return <Route {...props} />
}

export default PrivateRoute
