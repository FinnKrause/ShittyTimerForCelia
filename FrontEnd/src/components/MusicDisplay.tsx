import React, { useEffect, useState } from "react";
import "../style/MusicDisplay.css";
import CircularProgressbarbyLeopold from "./CircularProgressbarbyLeopold";


interface MusicDisplayProps {
    changeBackground: (newURL: string) => void
    getRandomImage: () => void
}

interface SongData {
    image: string;
    songArtist: string;
    songTitle: string;
    isPlaying: boolean;
    currentTrackProgress: number;
    trackDuration: number;
}

const MusicDisplay:React.FC<MusicDisplayProps> = (Props):JSX.Element => {

    const [songData, setSongData] = useState<SongData|undefined>();
    const [currentTrackProgess, setCurrentTrackProgress] = useState<{duration: number, progress: number}>({duration:0, progress: 0}); 
    const [coverAsBG, setCoverAsBG] = useState<boolean>(false);

    const updateData = () => {
        fetch("https://celiaspotipy.finnkrause.com/?cmd=relavantStuffForMeLOL", {method: "GET"}).then(res => res.json())
        .then(data => {
            if (data.songTitle == undefined) setSongData(undefined)
            else if (songData != data) {
                setSongData(data)
                setCurrentTrackProgress({duration: data.trackDuration, progress: data.currentTrackProgress})
            }
        })
    }

    useEffect(() => {
        const updateDataInterval = setInterval(updateData, 10000)
        return () => {
            clearInterval(updateDataInterval)
        }
    }, [])

    useEffect(() => {
        if (coverAsBG && songData) Props.changeBackground(songData?.image)
    }, [songData, coverAsBG])

    useEffect(() => {
        console.log(Math.round((currentTrackProgess.progress/currentTrackProgess.duration)*100)+"%")
        // document.body.style.setProperty("--song-progress", Math.round((songData?.trackDuration/currentTrackProgess.duration)*100)+"%")
    }, [currentTrackProgess]);

    if (songData) return <>
        <div className="MusicLeft">
            <h1 className="SongTitle">{songData?.songTitle}</h1>
            <p className="SongArtist">{songData?.songArtist}</p>
            <div className="ProgressBar"></div>
        </div>
        <div className="MusicRight">
            <div className="ProgressBar" onClick={() => {
                if (coverAsBG) Props.getRandomImage();
                setCoverAsBG(!coverAsBG)
            }}>
                <CircularProgressbarbyLeopold progress={(songData.currentTrackProgress/songData.trackDuration)}>
                </CircularProgressbarbyLeopold>
            </div>
            <img className={`CoverImage${!songData.isPlaying?" paused":""}`} onClick={() => {
                if (coverAsBG) Props.getRandomImage();
                setCoverAsBG(!coverAsBG)
            }} src={songData?.image}></img>
        </div>
    </>
    else return <></>
}

export default MusicDisplay;