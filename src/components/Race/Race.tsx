
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
                likelihoodOfWinning: 0,
                progressBarColor: generateRandomColor(),
            }
        )) || [];

        setAnts(antArr)
    }, [data])


    if (loading) {
        return <div>loading</div>;
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

    const mostLikelyWinner = () => {
        ants.sort((a: Racer, b: Racer) => b.likelihoodOfWinning - a.likelihoodOfWinning);
        return ants[0]?.name;
    }

    const reset = () => {
        const newArr = [...ants];
        newArr.forEach((ant) => ant.likelihoodOfWinning = 0);

        setAnts(newArr);
        setCalculating(false);
        setCalculated(false);

    }

    const renderButton = () => {
        if (!calculating && !calculated)
            return <button className="start-button" onClick={calculateStats}>Start a Race</button>;
        if (calculated)
            return <button className="reset-button" onClick={reset}>Reset Race</button>;
    }

    const renderAnts = () => {
        return ants.map((ant: Racer, index: number) => {
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
            <div>
                <h1 className="title">Ant Race</h1>
                <div className="message">{getRaceStatus()}</div>
                <div className="ant-racers">
                    {renderAnts()}
                </div>
            </div>
            {renderButton()}
            <div>
                {calculated && mostLikelyWinner()}
            </div>
        </div>
    )
};
