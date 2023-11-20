import { useEffect, useState } from "react";
import "./App.css";

interface AppProps {

}

const App:React.FC<AppProps> = ():JSX.Element => {
  const dateToCountdown = new Date("Dec 23, 2023 21:55:00").getTime();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [randomURL, setRandomURL] = useState<string>("");

  const getRandomImageURL = () => {
    const url = "/BackgroundImages/Image (" + Math.floor(Math.random() * 16 + 1) + ")." + (Math.floor((Math.random()*1000)) < 0.5 ? "JPEG" : "JPG");
    console.log(url);
    setRandomURL(url);
  }

  const formatNumber = (num: number):string => {
    if (num <= 9) return "0"+num;
    else return num.toString();
  }

  useEffect(() => {
    console.log("UseEffect run!")
    setInterval(() => {
      setTimeLeft(dateToCountdown - new Date().getTime());
    }, 1000);

    getRandomImageURL();
    setInterval(() => {
      getRandomImageURL();
    }, 1000*60*60);
    
  }, [])
  
  return <div className="Wrapper">
    {randomURL && <div className="Background" style={{backgroundImage: `url("${randomURL}")`}}/>}
    <div className="Content" onClick={() => getRandomImageURL()}>

      <div className="Digit">
        <h2 className="Title">JOURS</h2>
        <h1 className="Timer" id="Days">{formatNumber(Math.floor(timeLeft / (1000 * 60 * 60 * 24)))}</h1>
      </div>
      <h1 className="Timer Colon">:</h1>

      <div className="Digit">
        <h2 className="Title">HEURES</h2>
        <h1 className="Timer" id="Hours">{formatNumber(Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))}</h1>
      </div>
      <h1 className="Timer Colon">:</h1>

      <div className="Digit">
        <h2 className="Title">MINUTES</h2>
        <h1 className="Timer" id="Minutes">{formatNumber(Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)))}</h1>
      </div>
        <h1 className="Timer Colon">:</h1>

      <div className="Digit">
        <h2 className="Title">SECONDES</h2>
        <h1 className="Timer" id="Seconds">{formatNumber(Math.floor((timeLeft % (1000 * 60)) / 1000))}</h1>
      </div>

    </div>
  </div>
}

export default App;