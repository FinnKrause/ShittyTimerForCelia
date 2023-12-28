import { ChangeEvent, useEffect, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import bänaudio from "./assets/Bän.wav";
import "./App.css";
import useRedundantStorage from "./Hooks/useRedudantStorage";

interface AppProps {}

const App:React.FC<AppProps> = ():JSX.Element => {
  const dateToCountdown = new Date("Feb 25, 2024 16:50:00").getTime();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [randomURL, setRandomURL] = useState<string>("");
  const [glow, setGlow] = useRedundantStorage<string>("glow", "false");
  const [color, setColor] = useRedundantStorage<string>("text-color", "#ffffff", true);
  const [fontSize, setFontSize] = useRedundantStorage<number>("font-size", 5, true, "rem");
  const [showControls, setShowControls] = useState<boolean>(false);
  const handle = useFullScreenHandle();

  const getRandomImageURL = async () => {
    const images:{JPEG: number, JPG: number} = {
      "JPEG": 27,
      "JPG": 16
    }
    const index = (new Date().getMinutes() % 2 == 0) ? "JPEG" : "JPG";

    const url = "BackgroundImages/Image (" + Math.floor(Math.random() * images[index] + 1) + ")." + index;
    setRandomURL(url);
  }

  const OptionButtonClicked = (callback?: (event?:ChangeEvent<unknown>) => unknown) => {
    if (callback) callback();
    // setShowControls(false);
  }

  const formatNumber = (num: number):string => {
    if (num <= 9) return "0"+num;
    else return num.toString();
  }

  const getTime = () => {
    return {
      jours: Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
      heures: Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)),
      secondes: Math.floor((timeLeft % (1000 * 60)) / 1000)
    }
  }

  const updateTimerInterval = () => {
    const timeLeft = dateToCountdown - new Date().getTime();
    setTimeLeft(timeLeft);

    const hour = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const min = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const sec = Math.floor((timeLeft % (1000 * 60)) / 1000);

    if (hour == 0 && min == 0 && sec == 0) {
      console.log("BÄN ALARM")
      let _counter = 0;
      const _interval = setInterval(() => {
        playSound();
        if (_counter >= 10) clearInterval(_interval);
        _counter++;
      }, 300)
    }
    else if (min == 0 && sec == 0) {
      playSound();
    }
  }

  function playSound() {
    const ourAudio = document.createElement('audio'); 
    ourAudio.style.display = "none"; 
    ourAudio.src = bänaudio; 
    ourAudio.autoplay = true;
    ourAudio.onended = function() {
      ourAudio.remove(); 
    };
    document.body.appendChild(ourAudio);
  }

  useEffect(() => {
    setInterval(updateTimerInterval, 1000);

    getRandomImageURL();
    setInterval(() => {
      getRandomImageURL();
    }, 1000*60*60);

    return () => {};
  }, [])

  return <div className="Wrapper">
    
    <div className="Controls">
      {!showControls && <button className="Button ShowControlsButton" onClick={() => setShowControls(true)}></button>}
      {showControls && <div>
        <button className="Button GlowButton" onClick={() => OptionButtonClicked(() => setGlow(glow=="true"?"false":"true"))}>BRILLER</button>

        <button className="Button" onClick={() => OptionButtonClicked(handle.enter)}>PLEIN ÉCRAN</button>
        <input className="Button ColorInput" type="color" onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setColor(e.target.value);
          localStorage.setItem("color", e.target.value);
          document.documentElement.style.setProperty('--text-color', e.target.value);
        }} value={color}></input>
        <input type="range" min={1} max={8} value={fontSize} onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setFontSize(+e.target.value)
        }}></input>
        <button className="Button ExitButton" onClick={() => setShowControls(false)}>x</button>
      </div>}
    </div>

    <FullScreen handle={handle}>
      {randomURL && <div className="Background" style={{backgroundImage: `url("${randomURL}")`}}/>}
      <div className="Content" onDoubleClick={() => getRandomImageURL()}>
        <div className="Digit">
          <h2 className="Title">JOURS</h2>
          <h1 className={`Timer ${glow==="true" && "glow"}`} id="Days">{formatNumber(getTime().jours)}</h1>
        </div>
        <h1 className={`Timer Colon ${glow==="true" && "glow"}`}>:</h1>

        <div className="Digit">
          <h2 className="Title">HEURES</h2>
          <h1 className={`Timer ${glow==="true" && "glow"}`} id="Hours">{formatNumber(getTime().heures)}</h1>
        </div>
        <h1 className={`Timer Colon ${glow==="true" && "glow"}`}>:</h1>

        <div className="Digit">
          <h2 className="Title">MINUTES</h2>
          <h1 className={`Timer ${glow==="true" && "glow"}`} id="Minutes">{formatNumber(getTime().minutes)}</h1>
        </div>
          <h1 className={`Timer Colon ${glow==="true" && "glow"}`}>:</h1>

        <div className="Digit">
          <h2 className="Title">SECONDES</h2>
          <h1 className={`Timer ${glow==="true" && "glow"}`} id="Seconds">{formatNumber(getTime().secondes)}</h1>
        </div>
      </div>
    </FullScreen>
  </div>
}

export default App;