import { Link } from "react-router-dom";

function InfoCards(state) {
    return (
        <div className="container">
            <div className="card-deck mb-3 text-center">
                <div className="card mb-4 box-shadow">
                    <div className="card-header">
                        <h4 className="my-0 font-weight-normal">Lige</h4>
                    </div>
                    <div className="card-body">
                        <img src={require("../../assets/kls-logo.jpeg").default} width={"100px"} height={"100px"} alt="" />
                        <ul className="list-unstyled mt-3 mb-4">
                            <li>Više od 10 liga</li>
                            <li>seniorske košarke</li>
                            <li>koji se igraju</li>
                            <li>2021. godine</li>
                        </ul>
                        <Link to="/leagues" type="button" className="btn btn-lg btn-block btn-primary">Pogledajte lige</Link>
                    </div>
                </div>
                <div className="card mb-4 box-shadow">
                    <div className="card-header">
                        <h4 className="my-0 font-weight-normal">Klubovi</h4>
                    </div>
                    <div className="card-body">
                        <img src={require("../../assets/vosa-logo.png").default} width={"100px"} height={"100px"} alt="" />
                        <ul className="list-unstyled mt-3 mb-4">
                            <li>Više od 20</li>
                            <li>muških i ženskih</li>
                            <li>klubova koji igraju</li>
                            <li>u okviru takmičenja KSS</li>
                        </ul>
                        <Link to="/klubovi" type="button" className="btn btn-lg btn-block btn-primary">Pogledajte klubove</Link>
                    </div>
                </div>
                <div className="card mb-4 box-shadow">
                    <div className="card-header">
                        <h4 className="my-0 font-weight-normal">Igrači</h4>
                    </div>
                    <div className="card-body">
                        <img src={require("../../assets/jokic.jpg").default} width={"100px"} height={"100px"} alt="" />
                        <ul className="list-unstyled mt-3 mb-4">
                            <li>Košarkaši i košarkašice</li>
                            <li>koji nastupaju u okviru</li>
                            <li>takmičenja Košarkaškog</li>
                            <li>saveza Srbije</li>
                        </ul>
                        <Link to="/players" type="button" className="btn btn-lg btn-block btn-primary">Pogledajte igrače</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InfoCards;