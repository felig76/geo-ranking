import { Link } from "react-router-dom";

function LandingPage() {
    return (
        <div>
            <h1>GeoRanking</h1>
            <Link to="/play">Jugar</Link>
        </div>
    );
}

export default LandingPage;