import {France, Germany} from "./SVGs";
import {JSTimeToString} from "../math/TimeCalc"
import { OnlineClient } from "./Interfaces";

interface OnlineClientVRepresentationProps {
    myself: boolean;
    setDeviceName: (newName: string) => void
    deviceName?: string;
    data: OnlineClient
}

const OnlineClientVRepresentation:React.FC<OnlineClientVRepresentationProps> = (Props):JSX.Element => {
    return <div className={`OnlineClientVRepresentation ${Props.myself ? "Vous" : ""}`}>
        <div className="ClientLeftSide">
            <div className="ClientGreenBall"></div>
            <input className="ClientName" onChange={(e) => {
                Props.setDeviceName(e.target.value)
            }} disabled={!Props.myself} value={(Props.deviceName !== "undefined" && Props.deviceName != "" && Props.myself)? Props.deviceName : Props.data.name}></input>
        </div>
        <div className="ClientRightSide">
            <div className="ClientDuration">{JSTimeToString(new Date().getTime() - Props.data.connectedSince)}</div>
            <div className="ClientCountry">{Props.data.country === "France" && France}</div>
            <div className="ClientCountry">{Props.data.country === "Germany" && Germany}</div>
        </div>
    </div>
}

export default OnlineClientVRepresentation;