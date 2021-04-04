export async function fetchMessages(id, userid, token) {
    return await fetch(`https://lagalt-service.herokuapp.com/api/v1/messages/project/${id}/user/${userid}`, {headers: {'Authorization': 'Bearer ' + token.token}})
        .then(response => {
            if (response) {
                return response.json()
            }
            else{
                return null;
            }
        })

}
