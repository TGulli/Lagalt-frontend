export async function fetchMessages(id, userid, token) {


    /**
     * Fetches the messages of a project from the API. If there is no messages the function returns null
     * */
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
