
import { AppBar, Box, Button, CircularProgress, LinearProgress, Toolbar, Typography } from "@mui/material";
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
                ...ant,
                likelihoodOfWinning: null,
                progressBarColor: generateRandomColor(),
            }
        )) || [];

        setAnts(antArr)
    }, [data])


    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
                <CircularProgress />
            </Box>
        )
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

    const renderButton = () =>
        <Button
            size="large"
            disabled={calculating}
            sx={{ borderColor: 'white', color: 'white' }}
            variant="outlined"
            onClick={calculated ? reset : calculateStats}>
            {calculated ? "Reset Race" : calculating ? "Calculating..." : "Start race"}
        </Button>

    const renderAnts = () => {
        return sortedAnts().map((ant: Racer, index: number) => {
            let status = `Likelihood of winning: ${ant.likelihoodOfWinning}`;

            if (calculating && !ant.likelihoodOfWinning)
                status = 'In progress';

            if (!calculated && !calculating)
                status = "Not yet run";

            return <Ant key={index} details={ant} status={status} />
        });
    }

    const getRaceStatus = () => {
        if (calculating)
            return (
                <Box>
                    <Typography variant="h5" component="div">
                        Race in progress
                    </Typography>
                    <LinearProgress color="secondary" />
                </Box>
            );


        return (
            <Typography variant="h5" component="div">
                {calculated ?
                    `Race has finished! ${sortedAnts()[0].name} is the most likely winner` :
                    "Race has not yet run, click Start Race!"
                }
            </Typography>
        );
    }

    return (
        <div>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h5" gutterBottom component="div" sx={{ flexGrow: 1, alignSelf: 'flex-end' }}>
                        Ant Race
                    </Typography>
                    {renderButton()}
                </Toolbar>
            </AppBar>
            <Toolbar />
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
                {getRaceStatus()}
            </Box>
            {renderAnts()}
        </div>
    )
};
