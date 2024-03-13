import { useState } from "react";
import "../style/Graph.css";
import { JSTimeToReadable } from "../math/TimeCalc";


interface GraphProps {

}

type Month = "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun" | "Jul" | "Aug" | "Sep" | "Oct" | "Nov" | "Dec";

interface meetingData {
    startDate: number;
    endDate: number;
    label: string;
    isNOTConfirmed?: boolean;
    additionalInformation?: string;
}

const DaN = (month: Month, day: number, year: number):number => {
    return new Date(`${month} ${day}, ${year}`).getTime()
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Graph:React.FC<GraphProps> = (Props:GraphProps):JSX.Element => {

    const [data, setData] = useState<Array<meetingData>>([
        {startDate: DaN("Jul", 6, 2023), endDate: DaN("Jul", 11, 2023), label: "Erlangen"},
        {startDate: DaN("Aug", 21, 2023), endDate: DaN("Aug", 25, 2023), label: "Marseille"},
        {startDate: DaN("Oct", 28, 2023), endDate: DaN("Nov", 5, 2023), label: "Nancy-Grenoble"},
        {startDate: DaN("Dec", 23, 2023), endDate: DaN("Jan", 6, 2024), label: "Nancy-Erlangen"},
        {startDate: DaN("Feb", 3, 2024), endDate: DaN("Feb", 4, 2024), label: ""},
        {startDate: DaN("Feb", 29, 2024), endDate: DaN("Mar", 6, 2024), label: "Erlangen"},

        {startDate: DaN("Mar", 27, 2024), endDate: DaN("Apr", 4, 2024), label: "Nancy"},
        {startDate: DaN("Apr", 9, 2024), endDate: DaN("Apr", 12, 2024), label: "Nancy (MUN)"},
        {startDate: DaN("May", 8, 2024), endDate: DaN("May", 10, 2024), label: "Abiturfeier", isNOTConfirmed: true},
        {startDate: DaN("May", 18, 2024), endDate: DaN("May", 20, 2024), label: "Bergkirchweih", isNOTConfirmed: true},
        {startDate: DaN("Jun", 28, 2024), endDate: DaN("Jun", 29, 2024), label: "ABI-Ball Erlangen", isNOTConfirmed: true},
    ])

    return <div className="GraphWrapper">
        {data.map((i, idx) => {
            if (idx == 0) {
                return <div className="TimeTogether" key={idx} style={{minWidth: `${(JSTimeToReadable(i.endDate-i.startDate).days/7)*150}px`}}>{i.label} ({JSTimeToReadable(i.endDate-i.startDate).days})</div>
            } else {
                return <>
                    <div className="TimeApart" key={idx+"1"} style={{minWidth: `${(JSTimeToReadable(i.startDate-data[idx-1].endDate).days/7)*50}px`}}>{JSTimeToReadable(i.startDate-data[idx-1].endDate).days} jours</div>
                    <div className="TimeTogether" key={idx+"2"} style={{minWidth: `${(JSTimeToReadable(i.endDate-i.startDate).days/7)*150}px`}}>{i.label} ({JSTimeToReadable(i.endDate-i.startDate).days})</div>
                </>
            }
        })}
    </div>
}

export default Graph;