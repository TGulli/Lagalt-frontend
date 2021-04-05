/**
 * Function that fetches projects based on page
 */
export async function fetchData(pageNr) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        }
    }
    return await fetch(`https://lagalt-service.herokuapp.com/api/v1/public/projects/show/${pageNr}`, requestOptions)
        .then(response => { return response.json()})
}


/**
 * Function that fetches projects if the user is logged in based on page.
 * The difference with this fetch method versus the non logged in one
 * is that this filters the projects based on the users previous interactions,
 * so that the least interacted/newest projects is shown first.
 */
export async function fetchLoginData(pageNr, token) {

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + token.token
        }
    }
    return await fetch(`https://lagalt-service.herokuapp.com/api/v1/projects/show/${pageNr}`, requestOptions)
        .then(response => { return response.json()})
}