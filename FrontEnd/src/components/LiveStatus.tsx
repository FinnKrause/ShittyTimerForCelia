import "../LiveStatus.css";
import {useEffect, useRef} from "react";

interface LiveStatusProps {

}

const LiveStatus:React.FC<LiveStatusProps> = ():JSX.Element => {

    const connection = useRef<WebSocket>()

    useEffect(() => {
      const socket = new WebSocket("ws://localhost:6971/")
  
      // Connection opened
      socket.addEventListener("open", () => {
        socket.send("Connection established")
      })
  
      // Listen for messages
      socket.addEventListener("message", (event) => {
        console.log("Message from server ", event.data)
      })
  
      connection.current = socket
  
      return () => {
        if (connection?.close != undefined) 
            connection.close();
      }
    }, [])
    
    
    return <div>
        <h1>Hello world</h1>
    </div>
}

export default LiveStatus;