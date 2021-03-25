export async function fetchMessages(id, userid) {
    return await fetch(`http://localhost:8080/api/v1/messages/project/${id}/user/${userid}`)
        .then(response => {
            if (response.status === 200) {
                return response.json()
            }
            else{
                return null;
            }
        })

}
