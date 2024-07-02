import { useContext } from "react";
import { MapDraw } from "./MapDraw";
import { experimentContext } from "../Context/ExperimentProvider";

export const MapDrawExperiment = ({ }) => {
    const {
        currTrial,
        setExperiment,
    } = useContext(experimentContext);

    const { experiment } = currTrial || {};

    return (
        <>
            {!experiment ? null :
                <MapDraw
                    data={experiment?.shapes || []}
                    setData={shapes => setExperiment(experiment.name, { ...experiment, shapes })}
                />
            }
        </>
    )
}