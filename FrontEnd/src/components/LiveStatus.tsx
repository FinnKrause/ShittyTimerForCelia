import "../LiveStatus.css";
import {useEffect, useState} from "react";
import {France, Germany} from "./SVGs";
import {JSTimeToString} from "../math/TimeCalc"

interface LiveStatusProps {
    showInfo: boolean;
}

interface Client {
    name: string;
    country: "France" | "Germany" | undefined;
}

interface OnlineClient extends Client {
    connectedSince: number;
    currentPicture?: string;
}

// interface OfflineClient extends Client {
//     lastConnected: number;
// }

const LiveStatus:React.FC<LiveStatusProps> = (Props):JSX.Element => {

    const [onlineClients, setOnlineClients] = useState<OnlineClient[]>();
    // const [offineClientHistory, setOfflineClientHistory] = useState<OfflineClient[]>();

    useEffect(() => {
        const ws = new WebSocket("wss://celiaapi.finnkrause.com/")
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'onlineClients') 
            setOnlineClients(data.data)
          else console.log('Unknown data received:', data);
        };
        return () => ws.close()
      }, []);
    
    
    return <div className="LiveStatus">
        {Props.showInfo && onlineClients?.map((i, idx) => <OnlineClientVRepresentation data={i} key={idx}></OnlineClientVRepresentation>)}
    </div>
}

interface OnlineClientVRepresentationProps {
    data: OnlineClient
}

const OnlineClientVRepresentation:React.FC<OnlineClientVRepresentationProps> = (Props):JSX.Element => {
    return <div className="OnlineClientVRepresentation">
        <div className="ClientLeftSide">
            <div className="ClientGreenBall"></div>
            <div className="ClientName">{Props.data.name}</div>
        </div>
        <div className="ClientRightSide">
            <div className="ClientDuration">{JSTimeToString(new Date().getTime() - Props.data.connectedSince)}</div>
            <div className="ClientCountry">{Props.data.country === "France" ? France : Germany}</div>
        </div>
    </div>
}

export default LiveStatus;