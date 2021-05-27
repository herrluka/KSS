import InfoCards from "./InfoCards";
import About from "../common/about/About";
import ImagesCarousel from "./Carousel";

function HomePage(props) {

    return (
        <div className="position-relative overflow-hidden text-center">
            <div className="flag-parallax row">
                <div className="col-md-6"/>
                <div className="col-md-6 p-lg-5 my-5" style={{minHeight: '50vh'}}>
                    <h1 className="display-2 text-white font-weight-bold mt-3" >Košarkaški savez Srbije</h1>
                    <img src={require("../../assets/kss-logo.jpg").default} width={"200px"} height={"200px"} style={{borderRadius: '50%'}} alt="" />
                </div>
            </div>
            <InfoCards />
            <div className="national-team-parallax"/>
            <div className="bg-dark py-5">
                <h1 className="display-2 font-weight-bold text-white py-3">Bodrimo reprezentaciju!</h1>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-xl-6 col-sm-12 col-xs-12">
                            <img className="mb-4" src={require("../../assets/eurobasket.jpg").default} width="80px" height="80px"/>
                            <p className="text-white h4 m-0">Košarkaška reprezentacija Srbije učestvuje na svetskim i Evropskim takmičenjima već decenijama. Poslednje učešće reprezentacije bilo je 2017. godine gde je Srbija osvojila četvrto mesto. Na svetskom prvenstvu održanom 2019. godine u Kini, reprezentacije nije uspela da se kvalifikuje u završnu fazu takmičenja.</p>
                        </div>
                        <div className="col-lg-6 col-xl-6 col-sm-12 col-xs-12">
                            <img className="mb-4" src={require("../../assets/worldcup.png").default} width="140px" height="80px"/>
                            <p className="text-white h4 m-0">Zbog pandemije virusa korona, Olimpijske igre koje je trebalo da budu održane 2020. godine u Tokiju su odložene za 2021. godinu. Reprezentacija Srbije je obezbedila učešće u najvećem sportskom događaju na svetu. Svi se radujemo početku takmičenja i vatrenom navijanju za naše Orlove! </p>
                        </div>
                    </div>
                </div>
            </div>
            <ImagesCarousel />
            <About />
        </div>
    )
}

export default HomePage;