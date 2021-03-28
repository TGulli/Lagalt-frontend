function NavBar() {

    return (
        <div>
            <div key={index}>
                <p>{skills}</p>
                <button type="button" onClick={removeElement}>X</button>
            </div>

        </div>
    );
}
export default NavBar;
