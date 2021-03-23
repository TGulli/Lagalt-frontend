export async function fetchData(pageNr, token) {

    let bearer = 'Bearer ' + token.token
    console.log(bearer)

    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': bearer,
            'Content-type': 'application/json'
        }
    }

    return await fetch(`http://localhost:8080/api/v1/public/projects/show/${pageNr}`, requestOptions)
        .then(response => { return response.json()})
}
