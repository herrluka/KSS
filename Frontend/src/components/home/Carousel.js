import Carousel from 'react-bootstrap/Carousel'

function ImagesCarousel() {
    return (
        <Carousel >
            <Carousel.Item style={{maxHeight:'100vh'}}>
                <img
                    className="d-block w-100"
                    src={require("../../assets/kokoskov.jpg").default}
                    alt="First slide"
                />
                <Carousel.Caption>
                    <h3>Igor Kokoškov novi trener reprezentacije</h3>
                    <p>Bivši NBA trener Igor Kokoškov preuzeo je ulogu selektora košarkaške reprezentacije Srbije</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item style={{maxHeight:'100vh'}}>
                <img
                    className="d-block w-100"
                    src={require("../../assets/jokic-reprezentacija.jpg").default}
                    alt="Third slide"
                />

                <Carousel.Caption>
                    <h3>Prvi put Srbin MVP?</h3>
                    <p>Nikola Jokić važi za glavnog kandidata za titulu MVP-a NBA lige.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item style={{maxHeight:'100vh'}}>
                <img
                    className="d-block w-100"
                    src={require("../../assets/vaso.jpg").default}
                    alt="Second slide"
                />

                <Carousel.Caption>
                    <h3>Još jedan Srbin MVP!</h3>
                    <p>Igrač Efesa Vasilije Micić proglašen za najkorisnijeg igrača Evrolige.</p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    )}

export default ImagesCarousel;