# LagAlt - Frontend

This project is the frontend part of the lagalt web page, which is connected to a backend server with a REST API. The front end part is made with React and Javascript, and are using bootstrap for a nice look.

## Team members
- Camilla Felin
- Thea Thodesen
- Bjørnar Pedersen
- Thomas Gulli

## Heroku page

https://lagalt2021.herokuapp.com/

## About the lagalt web page
The lagalt page shows a list of projects, that users has created.
A project can be a Music, Film, Game development or Web development project. If a user want to create a project, the user must log in. Either with facebook, Google or create a custom user for this page.
Each project can have members, and all members of a project can see a message board in the project, and also a live chat that correspondence immediately.
If a user want to be a member of another project, the user must send a request to the owner of the project.
A user and a project can be edited after creating. Users and projects can also bee deleted.


## Functionality

### Main page
The main page shows the projects stored in the database. The main page shows name, owner, category, tags, and status for all projects.
The user can search for a project at the top, and also filter the projects based on category. When clicking on a project, it redirects to the Project details page.

The main page also have a create project button for creating new projectsm and a login/ logout button in the top right corner.
If logged in, the user can click on its username for seeing the user page.

If a user is logged in, it is a banner on the project picture for all the project that the user does not own self.
The banner is red, if it is not qualified, red if qualified and yellow if some qualified. If a user is qualified or not, is based on how many tags the user and the project has in common.

### Login page

The login page has three different supported solutions for logging in to the system. Facebook, Google or log in with a custom user for the project only.
If the user using facebook or Google, it sends the accesstoken from Facebook/ Google to the backend, and the backend finds/ creates a user based on the information form Facebook/ Google.
If a user already exist with the email, it will log in with the existing user. If not, the backend will make a new user in our system based on the information from Facebook/ Google.

If a user want to create an account for this project only, it has to register the user at the register page. 
Then the user get an email, with an authentication link that has to be verified before log in. 
If the user has wrong password/ username, the ip address will be blocked for 1 minute.

### Register page

The register page, is a page for register a new user. If some data is not filled out, the user will get message about that, and can not create a user before all the fields are field out correctly. 


### Project detail page

The project detail page shows information about the project.

If the user is logged in, and is a collaborator or the owner, it can see the massage board and the chat.
If the user is the owner of the project, the user can edit the project, and apply or deny collaborator requests to the project.
If the user is not a collaborator or the owner, but logged in, the user can ask to be a collaborator for the project.

### Create new project page
This page is only available if logged in. Then a user can create a new project here.

## Technologies

- React
- Redux
- SockJsClient

## Motivation

This project was made as a case assignment during the Experis Academy Java Fullstack course.

## Folder structure tree

```bash
src
    +---components
    |   +---CreateApplication
    |   +---CreateProject
    |   +---Login
    |   |   \---Facebook
    |   +---Main
    |   +---Profile
    |   +---ProjectDetails
    |   +---Register
    |   \---shared
    +---features
    +---hoc
    +---redux
    |   \---reducers
    \---resources
```

## Credits

Thanks to our mentor Steven James Delton for great guidance and discussions.
