import {BrowserRouter, Switch, Route, useHistory} from "react-router-dom";
import Login from "./components/Login/Login.js";
import MyProfile from "./components/Profile/MyProfile.js";
import UserProfile from "./components/Profile/UserProfile";
import ProjectDetails from "./components/ProjectDetails/ProjectDetails";
import Register from "./components/Register/Register";
import CreateProject from "./components/CreateProject/CreateProject"
import './App.css';
import Main from "./components/Main/Main";
import CreateApplication from "./components/CreateApplication/CreateApplication";
import {Button, Form, FormControl, Nav, Navbar} from "react-bootstrap";
import {useSelector, useDispatch} from "react-redux";
import {logOut} from "./redux/actions";


/**
 * TODO: Public/Private Route 
 */




function App() {
    console.log("I APP.JS")

    // FIX ME
    const dispatch = useDispatch();

    const onLogoutClick = () => {
        dispatch(logOut())
    }

    const user = useSelector(state => state.user)
    const isLoggedIn = useSelector(state => state.isLoggedIn)

    return (
        <BrowserRouter>
            <Navbar bg="light" variant="light">
                <Navbar.Brand>LOGO</Navbar.Brand>
                <Nav className="mr-auto">
                    { isLoggedIn &&
                    <Navbar.Text>
                        Logget inn som <a href="/myprofile">{user.username}</a>
                    </Navbar.Text>
                    }
                </Nav>
                <Form inline>
                    {!isLoggedIn ?
                        <Button variant="outline-primary" href="/login">Logg inn</Button> :
                        <Button variant="outline-primary" onClick={onLogoutClick} href="/">Logg ut</Button>
                    }
                </Form>
            </Navbar>

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
