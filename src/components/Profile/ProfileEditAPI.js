export async function getUniqueTags() {
    return await fetch('http://localhost:8080/api/v1/alltags')
        .then(response => { return response.json()})
}
