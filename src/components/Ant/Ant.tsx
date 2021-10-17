
import ProgressBar from "@ramonak/react-progress-bar";
import { Avatar, Card, CardHeader, Typography } from "@mui/material";
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
        <Card>
            <CardHeader
                avatar={
                    <Avatar src={antSVG} className={`${color.toLowerCase()}`} sx={{ width: 45, height: 45 }} variant="square" />
                }
                title={name}
                subheader={
                    <>
                        <Typography variant="caption" display="block">
                            Length: {length}
                        </Typography>
                        <Typography variant="caption" display="block">
                            Weight: {weight}
                        </Typography>
                        <Typography variant="subtitle2" display="block">
                            {status}
                        </Typography>
                        <ProgressBar completed={Math.ceil((likelihoodOfWinning || 0) * 100)} bgColor={progressBarColor} />
                    </>
                }
            />
        </Card>
    )
}