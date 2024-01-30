import React, { useEffect, useState } from "react";
import "../style/MusicDisplay.css";


interface MusicDisplayProps {
    changeBackground: (newURL: string) => void
    getRandomImage: () => void
}

interface SongData {
    image: string;
    songArtist: string;
    songTitle: string;
    isPlaying: boolean;
}

const MusicDisplay:React.FC<MusicDisplayProps> = (Props):JSX.Element => {

    const [songData, setSongData] = useState<SongData|undefined>();
    const [coverAsBG, setCoverAsBG] = useState<boolean>(false);

    const updateData = () => {
        fetch("https://celiaspotipy.finnkrause.com/?cmd=relavantStuffForMeLOL", {method: "GET"}).then(res => res.json())
        .then(data => {
            if (data.songTitle == undefined) setSongData(undefined)
            else if (songData != data)setSongData(data)
        })
    }

    useEffect(() => {
        const interval = setInterval(updateData, 10000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (coverAsBG && songData) Props.changeBackground(songData?.image)
    }, [songData, coverAsBG])

    if (songData) return <>
        <div className="MusicLeft">
            <h1 className="SongTitle">{songData?.songTitle}</h1>
            <p className="SongArtist">{songData?.songArtist}</p>
        </div>
        <div className="MusicRight">
            <div className="BlackDot"></div>
            <img className={`CoverImage${!songData.isPlaying?" paused":""}`} onClick={() => {
                if (coverAsBG) Props.getRandomImage();
                setCoverAsBG(!coverAsBG)
            }} src={songData?.image}></img>
        </div>
    </>
    else return <></>
}

export default MusicDisplay;