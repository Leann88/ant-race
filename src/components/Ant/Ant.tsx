
import ProgressBar from "@ramonak/react-progress-bar";
import { Racer } from "../../types";
import antSVG from '../../assets/ant.svg';
import './Ant.css';

interface Props {
    details: Racer;
    status: string;
}

export const Ant = ({ details, status }: Props) => {
    const { name, length, weight, likelihoodOfWinning, color, progressBarColor } = details;



    return (
        <div className="container">
            <div className="ant-details">
                <img className={`image ${color.toLowerCase()}`} src={antSVG} alt="test"></img>
                <ul>
                    <li>{name}</li>
                    <li>Length: {length}</li>
                    <li>Weight: {weight}</li>
                    <li>{status}</li>
                </ul>
            </div>
            <ProgressBar completed={Math.ceil(likelihoodOfWinning * 100)} bgColor={progressBarColor} />
        </div>
    )
}