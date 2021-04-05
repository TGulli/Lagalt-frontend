/**
 * Function that fetches all the tags from the server,
 * and returns the response.
 * */
export async function getUniqueTags(token) {
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'Authorization': ('Bearer ' + token.token)},
    };
    return await fetch('https://lagalt-service.herokuapp.com/api/v1/alltags', requestOptions)
        .then(response => { return response.json()})
}
