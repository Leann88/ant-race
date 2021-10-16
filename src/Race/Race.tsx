
import { useAntsQuery } from "./hooks/useAntsQuery";

export const Race = () => {

    const { loading, error, ants } = useAntsQuery();

    if (loading) {
        return <div>loading</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return ants.map(({ name, weight }: { name: string, weight: string }) => (
        <div key={name}>
            <p>
                {name}: {weight}
            </p>
        </div>
    ));
};