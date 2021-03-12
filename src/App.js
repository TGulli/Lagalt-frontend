import {BrowserRouter, Switch, Route} from "react-router-dom";
import Login from "./components/Login/Login.js";
import Profile from "./components/Profile/Profile.js";
import ProjectDetails from "./components/ProjectDetails/ProjectDetails";
import Register from "./components/Register/Register";
import CreateProject from "./components/CreateProject/CreateProject"
import './App.css';
import Main from "./components/Main/Main";



function App() {
    return (
        <BrowserRouter>

            <Switch>
                <Route exact path="/" component={Main}/>
                <Route path="/login" component={Login}/>
                <Route path="/profile" component={Profile}/>
                <Route path="/register" component={Register}/>
                <Route path="/project/:id" component={ProjectDetails}/>
                <Route path="/project/create" component={CreateProject}/>
            </Switch>

        </BrowserRouter>
    );
}


export default App;
