import InfoCards from "./InfoCards";
import About from "../common/about/About";

function HomePage(props) {

    return (
        <div className="position-relative overflow-hidden text-center">
            <div className="col-md-5 p-lg-5 mx-auto mt-5" style={{height: '90vh'}}>
                <img src={require("../../assets/kss-logo.jpg").default} width={"200px"} height={"200px"} alt="" />
                <h1 className="display-4 font-weight-normal mt-3">Košarkaški savez Srbije</h1>
            </div>
            <InfoCards />
            <About />
        </div>
    )
}

export default HomePage;