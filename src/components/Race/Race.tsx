
import { Box, Button, CircularProgress, AppBar, Toolbar, CssBaseline, Paper, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useAntsQuery } from "../../hooks/useAntsQuery";
import { Racer } from "../../types";
import { generateAntWinLikelihoodCalculator } from "../../utils/generateAntWinLikelihoodCalculator";
import { generateRandomColor } from "../../utils/generateRandomColor";
import { Ant } from "../Ant";

export const Race = () => {
    const [ants, setAnts] = useState<Racer[]>([]);
    const [calculating, setCalculating] = useState<boolean>(false);
    const [calculated, setCalculated] = useState<boolean>(false);
    const { loading, error, data } = useAntsQuery();

    useMemo(() => {
        const antArr: Racer[] = data?.ants?.map((ant: Racer) => (
            {
                name: ant.name,
                length: ant.length,
                color: ant.color,
                weight: ant.weight,
                likelihoodOfWinning: null,
                progressBarColor: generateRandomColor(),
            }
        )) || [];

        setAnts(antArr)
    }, [data])


    if (loading) {
        return <CircularProgress />
    }

    if (error) {
        return <div>{error}</div>;
    }

    const calculateStats = () => {
        setCalculating(true);
        let calculatedCount = 0;

        ants.forEach((_, index: number) => {
            const callback = (likelihoodOfWinning: number) => {

                const newArr = [...ants];

                newArr[index].likelihoodOfWinning = likelihoodOfWinning;
                setAnts(newArr);

                calculatedCount++;

                if (calculatedCount === ants.length) {
                    setCalculated(true);
                    setCalculating(false);
                }
            };

            generateAntWinLikelihoodCalculator()(callback);
        });
    }

    const sortedAnts = () => {
        const sortedAntsArr = [...ants];
        return sortedAntsArr.sort((a: Racer, b: Racer) => {
            if (a.likelihoodOfWinning === null)
                return 1;

            if (b.likelihoodOfWinning === null)
                return -1;

            return b.likelihoodOfWinning - a.likelihoodOfWinning
        });
    }

    const reset = () => {
        const newArr = [...ants];
        newArr.forEach((ant) => ant.likelihoodOfWinning = null);

        setAnts(newArr);
        setCalculating(false);
        setCalculated(false);

    }

    const renderButton = () => {
        if (calculated)
            return (
                <Button
                    size="large"
                    sx={{ borderColor: 'white', color: 'white' }}
                    variant="outlined" onClick={reset}>
                    Reset Race
                </Button>
            );

        return (
            <Button
                size="large"
                disabled={calculating}
                sx={{ borderColor: 'white', color: 'white' }}
                variant="outlined"
                onClick={calculateStats}>
                {calculating ? "Calculating..." : "Start race"}
            </Button>
        );
    }

    const renderAnts = () => {
        return sortedAnts().map((ant: Racer) => {
            let status = `Likelihood of winning: ${ant.likelihoodOfWinning}`;

            if (calculating && !ant.likelihoodOfWinning)
                status = 'In progress';

            if (!calculated && !calculating)
                status = "Not yet run";

            return <Ant details={ant} status={status} />
        });
    }

    const getRaceStatus = () => {
        if (calculating)
            return "In progress";

        if (calculated)
            return "All calculated";

        return "Not yet run";
    }

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="fixed">
                    <Toolbar>
                        <Typography variant="h5" gutterBottom component="div" sx={{ flexGrow: 1, alignSelf: 'flex-end' }}>
                            Ant Race
                        </Typography>
                        {renderButton()}
                    </Toolbar>
                </AppBar>
            </Box>
            <Toolbar />
            <CssBaseline />
            <Paper square sx={{ pb: '50px' }}>
                <div className="message">{getRaceStatus()}</div>
                <div className="ant-racers">
                    {renderAnts()}
                </div>
            </Paper>
        </div>
    )
};
