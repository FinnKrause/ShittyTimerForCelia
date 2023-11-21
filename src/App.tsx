import { useEffect, useState } from "react";
import "./App.css";

interface AppProps {

}

const App:React.FC<AppProps> = ():JSX.Element => {
  const dateToCountdown = new Date("Dec 23, 2023 21:55:00").getTime();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [randomURL, setRandomURL] = useState<string>("");
  const [glow, setGlow] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(false);
  // const [averageColor, setAverageColor] = useState<{r:number, g: number, b: number}>({r:0, b: 0, g: 0});

  const getRandomImageURL = async () => {
    const url = "BackgroundImages/Image (" + Math.floor(Math.random() * 16 + 1) + ")." + (Math.floor((Math.random()*1000)) < 0.5 ? "JPEG" : "JPG");
    console.log(url);
    setRandomURL(url);

    // console.log(window.location.href+url)
    // urlContentToDataUri(window.location.href+url).then((res:any) => {
      
    //   const imgEl = document.createElement("img");
    //   imgEl.src = res;

    //   setAverageColor(getAverageRGB(imgEl));
    //   console.log("THIS IS THE NEW COLOR: " + Object.values(averageColor))
    // }).catch(console.log)

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

  // const getAverageRGB = (imgEl:HTMLImageElement):{r:number, g: number, b: number} => {
  //   const blockSize = 5, // only visit every 5 pixels
  //       defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
  //       canvas = document.createElement('canvas'),
  //       context = canvas.getContext && canvas.getContext('2d');
  //   let data, width, height, i = -4, length
  //   const rgb = {r:0,g:0,b:0};
  //   let count = 0;

  //   if (!context) {
  //       return defaultRGB;
  //   }

  //   height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
  //   width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

  //   context.drawImage(imgEl, 0, 0);

  //   try {
  //       data = context.getImageData(0, 0, width, height);
  //   } catch(e) {
  //       console.error("Could not read image data")
  //       return defaultRGB;
  //   }

  //   length = data.data.length;

  //   while ( (i += blockSize * 4) < length ) {
  //       ++count;
  //       rgb.r += data.data[i];
  //       rgb.g += data.data[i+1];
  //       rgb.b += data.data[i+2];
  //   }
  //   rgb.r = ~~(rgb.r/count);
  //   rgb.g = ~~(rgb.g/count);
  //   rgb.b = ~~(rgb.b/count);
  //   console.log(rgb);
  //   return rgb;
  // }
  
  // const urlContentToDataUri = (url:string) => {
  //   return fetch(url)
  //           .then( response => response.blob() )
  //           .then( blob => new Promise( callback =>{
  //               const reader = new FileReader() ;
  //               reader.onload = function(){ callback(this.result) } ;
  //               reader.readAsDataURL(blob) ;
  //           }) ) ;
  // }

  return <div className="Wrapper">
    {randomURL && <div className="Background" style={{backgroundImage: `url("${randomURL}")`}}/>}
    
    <div className="Controls">
      {!showControls && <button className="Button ShowControlsButton" onClick={() => setShowControls(true)}></button>}
      {showControls && <div>
        <button className="Button GlowButton" onClick={() => {
          setGlow(!glow);
          setShowControls(false);
        }}>GLOW</button>

      </div>}
    </div>

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
  </div>
}

export default App;