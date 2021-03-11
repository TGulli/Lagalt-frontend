import {BrowserRouter, Switch, Route} from "react-router-dom";
import Login from "./components/Login/Login.js";
import Register from "./components/Register/Register";
import CreateProject from "./components/CreateProject/CreateProject"
import './App.css';



function App() {
    return (
        <BrowserRouter>

            <Switch>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
                <Route path="/project/create" component={CreateProject}/>
            </Switch>

        </BrowserRouter>
    );
}


export default App;
