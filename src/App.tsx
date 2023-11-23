import { ChangeEvent, useEffect, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import "./App.css";

interface AppProps {}

const App:React.FC<AppProps> = ():JSX.Element => {
  const dateToCountdown = new Date("Dec 23, 2023 21:55:00").getTime();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [randomURL, setRandomURL] = useState<string>("");
  const [glow, setGlow] = useState<boolean>(() => localStorage.getItem("glow") === "true");
  const [color, setColor] = useState<string>(() => {
    const lastValue = localStorage.getItem("color") || "#ffffff";
    document.documentElement.style.setProperty('--text-color', lastValue);
    return lastValue;
  });
  const [showControls, setShowControls] = useState<boolean>(false);
  const handle = useFullScreenHandle();

  const getRandomImageURL = async () => {
    const images:{JPEG: number, JPG: number} = {
      "JPEG": 27,
      "JPG": 16
    }
    const index = (new Date().getMinutes() % 2 == 0) ? "JPEG" : "JPG";

    const url = "BackgroundImages/Image (" + Math.floor(Math.random() * images[index] + 1) + ")." + index;
    console.log(index, url);
    setRandomURL(url);
  }

  const OptionButtonClicked = (callback?: (event?:ChangeEvent<unknown>) => unknown) => {
    if (callback) callback();
    setShowControls(false);
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

    return () => {};
  }, [dateToCountdown])

  return <div className="Wrapper">
    
    <div className="Controls">
      {!showControls && <button className="Button ShowControlsButton" onClick={() => setShowControls(true)}></button>}
      {showControls && <div>
        <button className="Button GlowButton" onClick={() => OptionButtonClicked(() => {
          setGlow(!glow)
          localStorage.setItem("glow", !glow+"");
        })}>BRILLER</button>
        <button className="Button" onClick={() => OptionButtonClicked(handle.enter)}>PLEIN ÉCRAN</button>
        <input className="Button ColorInput" type="color" onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setColor(e.target.value);
          localStorage.setItem("color", e.target.value);
          document.documentElement.style.setProperty('--text-color', e.target.value);
        }} value={color}></input>
        <button className="Button ExitButton" onClick={() => setShowControls(false)}>x</button>
      </div>}
    </div>

    <FullScreen handle={handle}>
      {randomURL && <div className="Background" style={{backgroundImage: `url("${randomURL}")`}}/>}
      <div className="Content" onDoubleClick={() => getRandomImageURL()}>
        <div className="Digit">
          <h2 className="Title">JOURS</h2>
          <h1 className={`Timer ${glow && "glow"}`} id="Days">{formatNumber(Math.floor(timeLeft / (1000 * 60 * 60 * 24)))}</h1>
        </div>
        <h1 className={`Timer Colon ${glow && "glow"}`}>:</h1>

        <div className="Digit">
          <h2 className="Title">HEURES</h2>
          <h1 className={`Timer ${glow && "glow"}`} id="Hours">{formatNumber(Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))}</h1>
        </div>
        <h1 className={`Timer Colon ${glow && "glow"}`}>:</h1>

        <div className="Digit">
          <h2 className="Title">MINUTES</h2>
          <h1 className={`Timer ${glow && "glow"}`} id="Minutes">{formatNumber(Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)))}</h1>
        </div>
          <h1 className={`Timer Colon ${glow && "glow"}`}>:</h1>

        <div className="Digit">
          <h2 className="Title">SECONDES</h2>
          <h1 className={`Timer ${glow && "glow"}`} id="Seconds">{formatNumber(Math.floor((timeLeft % (1000 * 60)) / 1000))}</h1>
        </div>
      </div>
    </FullScreen>
  </div>
}

export default App;