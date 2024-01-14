import "../LiveStatus.css";
import {useEffect, useRef, useState} from "react";
import {France, Germany} from "./SVGs";
import {JSTimeToString} from "../math/TimeCalc"
import useRedundantStorage from "../Hooks/useRedudantStorage";

interface LiveStatusProps {
    showInfo: boolean;
}

interface Client {
    name: string;
    country: "France" | "Germany" | undefined;
}

interface OnlineClient extends Client {
    clientId: string;
    connectedSince: number;
    currentPicture?: string;
}

// interface OfflineClient extends Client {
//     lastConnected: number;
// }

const LiveStatus:React.FC<LiveStatusProps> = (Props):JSX.Element => {

    const [onlineClients, setOnlineClients] = useState<OnlineClient[]>();
    const [clientId, setClientId] = useState<string|undefined>();
    const [deviceName, setDeviceName] = useRedundantStorage<string>("device-name", "");
    const ws = useRef<WebSocket>();
    // const [offineClientHistory, setOfflineClientHistory] = useState<OfflineClient[]>();

    useEffect(() => {
        ws.current = new WebSocket("wss://celiaapi.finnkrause.com/") //wss://celiaapi.finnkrause.com/
        ws.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'onlineClients') 
            setOnlineClients(data.data)
        else if (data.type === "Identification") {
              setClientId(data.data.clientId);
              fetch("https://ipapi.finnkrause.com/").then(du => du.json()).then(d => {
                ws.current!.send(JSON.stringify({type: "Identification", data: {clientId: data.data.clientId, ip: d.query, country: d.country, name: deviceName=="undefined"?undefined:deviceName}}))
            })
          }
        else if (data.type === "ping") {
            return;
        }
          else console.log('Unknown data received:', data);
        };
        return () => ws.current?.close()
      }, []);

    const updateName = (newName: string) => {
        setDeviceName(newName);
        ws.current!.send(JSON.stringify({type: "Update", data: {name: newName}}))
    }
       
    return <div className="LiveStatus">
        {Props.showInfo && onlineClients?.map((i, idx) => <OnlineClientVRepresentation myself={clientId === i.clientId} setDeviceName={updateName} deviceName={clientId === i.clientId ? deviceName : undefined} data={i} key={idx}></OnlineClientVRepresentation>)}
    </div>
}

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

export default LiveStatus;