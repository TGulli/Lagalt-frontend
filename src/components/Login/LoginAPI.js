export async function checkToken(token) {

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded', }
    }

    return await fetch(`http://localhost:8080/api/v1/login/google/${token}`, requestOptions)
        .then(response => { return response.json()})
}
