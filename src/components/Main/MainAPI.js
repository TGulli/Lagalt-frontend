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
