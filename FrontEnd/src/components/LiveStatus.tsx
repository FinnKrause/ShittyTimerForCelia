import "../style/LiveStatus.css";
import {useEffect, useRef, useState} from "react";
import useRedundantStorage from "../Hooks/useRedudantStorage";
import { OfflineClient, OnlineClient } from "./Interfaces";
import OnlineClientVRepresentation from "./OnlineClientVRepresentation";
import OfflineClientVRepresentation from "./OfflineClientVRepresentation";

interface LiveStatusProps {
    showInfo: boolean;
}

const LiveStatus:React.FC<LiveStatusProps> = (Props):JSX.Element => {

    const [onlineClients, setOnlineClients] = useState<OnlineClient[]>([]);
    const [offlineClients, setOfflineClients] = useState<OfflineClient[]|undefined>();
    const [clientId, setClientId] = useState<string|undefined>();
    const [deviceName, setDeviceName] = useRedundantStorage<string|undefined>("device-name", undefined);
    const ws = useRef<WebSocket>();
    // const [offineClientHistory, setOfflineClientHistory] = useState<OfflineClient[]>();

    useEffect(() => {
        ws.current = new WebSocket("wss://celiaapi.finnkrause.com/") //wss://celiaapi.finnkrause.com/
        ws.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'onlineClients') 
            setOnlineClients(data.data)
        else if (data.type === "offlineClients") {
            // console.log(data.data)
            setOfflineClients(data.data)
        }
        else if (data.type === "Identification") {
              setClientId(data.data.clientId);
              fetch("https://ipapi.finnkrause.com/").then(du => du.json()).then(d => {
                ws.current!.send(JSON.stringify({type: "Identification", data: {clientId: data.data.clientId, ip: d.query, country: d.country, name: deviceName}}))
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
       
    if (Props.showInfo) return <div className="LiveStatusWrapper">
      <div className="LiveStatus">
          {onlineClients?.map((i, idx) => <OnlineClientVRepresentation myself={clientId === i.clientId} setDeviceName={updateName} deviceName={clientId === i.clientId ? deviceName : undefined} data={i} key={idx}></OnlineClientVRepresentation>)}
          {offlineClients && offlineClients?.map((i, idx) => <OfflineClientVRepresentation data={i} key={idx}></OfflineClientVRepresentation>)}
      </div>
    </div>
    else return <></>
}


export default LiveStatus;