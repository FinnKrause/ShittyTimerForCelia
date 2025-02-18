import {France, Germany} from "./SVGs";
import {JSTimeToString, JSTimeToStringRoughEstimate} from "../math/TimeCalc"
import { OfflineClient } from "./Interfaces";

interface OfflineClientVRepresentationProps {
    data: OfflineClient
}

const OfflineClientVRepresentation:React.FC<OfflineClientVRepresentationProps> = (Props):JSX.Element => {
    return <div className={`OnlineClientVRepresentation Offline`}>
        <div className="ClientLeftSide">
            <div className="ClientRedBall"></div>
            <div className="ClientName">{Props.data.name}</div>
        </div>
        <div className="ClientRightSide">
            <div className="ClientDuration">{JSTimeToString(Props.data.duration)} il y a </div>
            <div className="ClientDuration">{JSTimeToStringRoughEstimate(new Date().getTime() - Props.data.connectedLast)}</div>
            {Props.data.country==="France" && <div className="ClientCountry">{Props.data.country === "France" && France}</div>}
            {Props.data.country==="Germany" && <div className="ClientCountry">{Props.data.country === "Germany" && Germany}</div>}
        </div>
    </div>
}

export default OfflineClientVRepresentation;