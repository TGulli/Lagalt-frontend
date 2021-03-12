function MainProjectListOwners({owners}) {

    return (
        <div>
            {owners && owners.map((owner, index) => (
            <p key={index}>Owner: {owner}</p>
            ))}
        </div>
    );
}
export default MainProjectListOwners;
