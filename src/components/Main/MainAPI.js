export async function fetchData(pageNr) {

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        }
    }

    return await fetch(`http://localhost:8080/api/v1/public/projects/show/${pageNr}`, requestOptions)
        .then(response => { return response.json()})
}
