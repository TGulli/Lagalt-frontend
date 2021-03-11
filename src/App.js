import {BrowserRouter, Switch, Route} from "react-router-dom";
import Login from "./components/Login/Login.js";
import Register from "./components/Register/Register";
import './App.css';



function App() {
    return (
        <BrowserRouter>

            <Switch>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
            </Switch>

        </BrowserRouter>
    );
}


export default App;
