import React, { ChangeEvent, useEffect, useState, useRef } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import bänaudio from "./assets/Bän.wav";
import "./style/index.css";
import useRedundantStorage from "./Hooks/useRedudantStorage";
import LiveStatus from "./components/LiveStatus";
import MusicDisplay from "./components/MusicDisplay";
import {getVibrantColorFrom} from "./Hooks/getVibrantColor";

interface AppProps {}

const App:React.FC<AppProps> = ():JSX.Element => {
  const dateToCountdown = new Date("Mar 28, 2024 21:55:00").getTime();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [randomURL, setRandomURL] = useState<string>("");
  const [glow, setGlow] = useRedundantStorage<string>("glow", "false");
  const [color, setColor] = useRedundantStorage<string>("text-color", "#ffffff", true);
  const [blurAmount, setBlurAmount] = useRedundantStorage<number>("blur-amount", 10, true, "px");
  const [fontSize, setFontSize] = useRedundantStorage<number>("font-size", 5, true, "rem");
  const [showDeviceInfo, setShowDeviceInfo] = useRedundantStorage<string>("showDeviceInfo", "false");
  const [autoColor, setAutoColor] = useRedundantStorage<string>("autoColor", "false");
  const [showControls, setShowControls] = useState<boolean>(false);
  const BänAlarmRef = useRef<HTMLButtonElement>(null);
  const handle = useFullScreenHandle();

  const getRandomImageURL = async () => {
    const images:{JPEG: number, JPG: number} = {
      "JPEG": 42,
      "JPG": 36
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
      BänAlarm();
    }
    else if (min == 0 && sec == 0) {
      playSound();
    }
  }

  async function BänAlarm() {
    if (BänAlarmRef.current?.classList.contains("ToggleActive")) return;
    console.log("BÄN ALARM")
    BänAlarmRef.current?.classList.toggle("ToggleActive");
    let _counter = 0;
    const _interval = setInterval(() => {
      playSound();
      if (_counter >= 10) {
        clearInterval(_interval);
        BänAlarmRef.current?.classList.toggle("ToggleActive");
      }
      _counter++;
    }, 200)
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

  function changeBackgroundToSpotify(url: string) {
    setRandomURL(url)
  }

  useEffect(() => {
    setInterval(updateTimerInterval, 1000);

    getRandomImageURL();
    setInterval(() => {
      getRandomImageURL();
    }, 1000*60*60);

    return () => {};
  }, [])

  useEffect(() => {
    if (autoColor=="true") getVibrantColorFrom(randomURL, true).then(setColor)
  }, [randomURL, autoColor, setColor])


  return <div className="Wrapper">
    <div className="Controls">
      {!showControls && <button className="ShowControlsButton" onClick={() => setShowControls(true)}></button>}
      {showControls && <div className="ControlsRelative">
        <div className="row">
          <button className={`Button GlowButton${glow=="true"?" ToggleActive": ""}`} onClick={() => OptionButtonClicked(() => setGlow(glow=="true"?"false":"true"))}>BRILLER</button>
          <button className="Button" onClick={() => OptionButtonClicked(handle.enter)}>PLEIN ÉCRAN</button>
          <button className={`Button${showDeviceInfo=="true"?" ToggleActive": ""}`} onClick={() => OptionButtonClicked(() => setShowDeviceInfo(showDeviceInfo=="true"?"false":"true"))}>APPAREILS</button>
          <button className={`Button${autoColor=="true"?" ToggleActive": ""}`} onClick={() => OptionButtonClicked(() => setAutoColor(autoColor=="true"?"false":"true"))}>COULEUR AUTOMATIQUE</button>
        </div>
        <div className="row">
          <input className="Button ColorInput" type="color" onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setColor(e.target.value);
            localStorage.setItem("color", e.target.value);
            document.documentElement.style.setProperty('--text-color', e.target.value);
          }} value={color}></input>
          <input className="Slider" type="range" min={1} max={8} value={fontSize} onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setFontSize(+e.target.value)
          }}></input>
          <input className="Slider" type="range" min={0} max={60} value={blurAmount} onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setBlurAmount(+e.target.value)
          }}></input>
          <button className="Button" ref={BänAlarmRef} onClick={BänAlarm}>BÄN ALARM</button>
          <button className="Button ExitButton" onClick={()=>setShowControls(false)}>x</button>
        </div>
      </div>}
    </div>
 
    <FullScreen handle={handle}>
      <LiveStatus showInfo={showDeviceInfo === "true"}></LiveStatus>
      <div className="MusicDisplay">
        <MusicDisplay changeBackground={changeBackgroundToSpotify} getRandomImage={getRandomImageURL}></MusicDisplay>
      </div>
      {randomURL && <div className="Background" style={{backgroundImage: `url("${randomURL}")`}}/>}
      <div className="Content" onDoubleClick={() => {
        if (randomURL.startsWith("BackgroundImages/")) getRandomImageURL()
        }}>
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