
/**
 * Post request to the API to verify the google token
 * */
export async function checkToken(token) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded', }
    }

    return await fetch(`https://lagalt-service.herokuapp.com/api/v1/public/login/google/${token}`, requestOptions)
        .then(response => { return response.json()})
}
