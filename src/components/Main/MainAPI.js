export async function fetchData(pageNr) {
    return await fetch(`http://localhost:8080/api/v1/projects/show/${pageNr}`)
        .then(response => { return response.json()})
}
