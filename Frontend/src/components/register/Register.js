function Register() {
    return (
        <div className="form-signin-container text-center h-75">
            <form className="form-signin">
                <img className="mb-4" src={require("../../assets/kss-logo.jpg").default} alt=""
                     width="100" height="100" />
                <h1 className="h3 mb-3 font-weight-normal">Registrujte korisnika</h1>
                <label htmlFor="text" className="sr-only">Ime</label>
                <input type="text" id="inputName" className="form-control" placeholder="Ime" required
                       autoFocus />
                <label htmlFor="text" className="sr-only">Prezime</label>
                <input type="text" id="inputSurname" className="form-control" placeholder="Prezime" required />
                <label htmlFor="text" className="sr-only">Korisničko ime</label>
                <input type="text" id="inputUsername" className="form-control" placeholder="Korisničko ime" required />
                <label htmlFor="inputPassword" className="sr-only">Lozinka</label>
                <input type="password" id="inputPassword" className="form-control m-0" placeholder="Lozinka"
                       required />
                <label htmlFor="inputPassword" className="sr-only">Ponovite lozinku</label>
                <input type="password" id="inputRepeatPassword" className="form-control m-0" placeholder="Ponovite lozinku"
                       required />
                <select id="selectRole" className="form-control mb-2" >
                    <option value={"admin"}>Aministrator</option>
                    <option value={"deleat"}>Delegat</option>
                </select>
                <button className="btn btn-lg btn-primary btn-block" type="submit">Registruj</button>
            </form>
        </div>
    )
}

export default Register;