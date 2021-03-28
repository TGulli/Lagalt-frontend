import {BrowserRouter, Switch, Route} from "react-router-dom";
import Login from "./components/Login/Login.js";
import MyProfile from "./components/Profile/MyProfile.js";
import UserProfile from "./components/Profile/UserProfile";
import ProjectDetails from "./components/ProjectDetails/ProjectDetails";
import Register from "./components/Register/Register";
import CreateProject from "./components/CreateProject/CreateProject"
import './App.css';
import Main from "./components/Main/Main";
import CreateApplication from "./components/CreateApplication/CreateApplication";
import 'bootstrap/dist/css/bootstrap.min.css';


/**
 * TODO: Public/Private Route 
 */

function App() {
    console.log("I APP.JS")
    return (
        <BrowserRouter>

            <Switch>
                <Route exact path="/" component={Main}/>
                <Route path="/login" component={Login}/>
                <Route path="/myprofile" component={MyProfile}/>
                <Route path="/userprofile/:id" component={UserProfile}/>
                <Route path="/register" component={Register}/>
                <Route path="/projectdetails/:id" component={ProjectDetails}/>
                <Route path="/project/create" component={CreateProject}/>
                <Route path="/project/application/" component={CreateApplication}/>
            </Switch>

        </BrowserRouter>
    );
}


export default App;
