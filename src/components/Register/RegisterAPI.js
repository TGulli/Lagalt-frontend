export async function usernameInUse(username) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        }
    }

    return await fetch(`http://localhost:8080/api/v1/public/users/username/${username}`, requestOptions)
        .then(response => { return response.json()})
}

export async function emailInUse(email) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        }
    }

    return await fetch(`http://localhost:8080/api/v1/public/users/email/${email}`, requestOptions)
        .then(response => { return response.json()})
}
