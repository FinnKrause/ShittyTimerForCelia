import "../style/CircularProgressbarbyLeopold.css";


interface CircularProgressbarbyLeopoldProps {
    progress: number;
}

const CircularProgressbarbyLeopold:React.FC<CircularProgressbarbyLeopoldProps> = (Props:CircularProgressbarbyLeopoldProps):JSX.Element => {


    return <>
        <div className="skill">
            <svg xmlns="http://www.w3.org/2000/svg"
                version="1.1" width="70px"
                height="70px">
                <defs>
                    <linearGradient id="GradientColor">
                        <stop offset="0%"
                        stop-color="#1ed760" />
                        <stop offset="100%"
                        stopColor="#2ebd59" />
                    </linearGradient>
                </defs>
                <circle id="circle" cx="35" cy="35" r="30"
                strokeLinecap="round" strokeDashoffset={200-200*Props.progress}/>
            </svg>
        </div>
    </>
}

export default CircularProgressbarbyLeopold;