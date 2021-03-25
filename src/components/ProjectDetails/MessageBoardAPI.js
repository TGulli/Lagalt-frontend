export async function fetchMessages(id, userid, token) {
    return await fetch(`http://localhost:8080/api/v1/messages/project/${id}/user/${userid}`, {headers: {'Authorization': 'Bearer ' + token.token}})
        .then(response => {
            if (response.status === 200) {
                return response.json()
            }
            else{
                return null;
            }
        })

}
