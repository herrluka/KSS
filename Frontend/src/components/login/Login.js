import './Login.css';

function Login() {
    return (
        <div className="form-signin-container text-center h-75">
            <form className="form-signin">
                <img className="mb-4" src={require("../../assets/kss-logo.jpg").default} alt=""
                     width="100" height="100" />
                <h1 className="h3 mb-3 font-weight-normal">Ulogujte se</h1>
                <label htmlFor="text" className="sr-only">Korisničko ime</label>
                <input type="text" id="inputEmail" className="form-control" placeholder="Korisničko ime" required
                       autoFocus />
                <label htmlFor="inputPassword" className="sr-only">Lozinka</label>
                <input type="password" id="inputPassword" className="form-control" placeholder="Lozinka"
                       required />
                    <div className="checkbox mb-3 float-left">
                        <label>
                            <input type="checkbox" value="remember-me" /> Zapamti me
                        </label>
                    </div>
                    <button className="btn btn-lg btn-primary btn-block" type="submit">Ulogujte se</button>
            </form>
        </div>
    )
}

export default Login;