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
                    data={experiment?.drawings || {}}
                    setData={drawings => setExperiment(experiment.name, { ...experiment, drawings })}
                />
            }
        </>
    )
}