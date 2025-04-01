import { Fragment, useContext } from "react";
import { useExperimentProvider } from "../Context/ExperimentProvider";
import { MapDrawShape } from "./MapDrawShape";

export const MapDrawExperiment = ({ }) => {
    const {
        currTrial,
        setExperiment,
    } = useExperimentProvider();

    const { experiment } = currTrial || {};
    const shapes = experiment?.shapes || [];

    const setShape = (newData, i) => {
        const e = {
            ...experiment,
            shapes: shapes.map((x, j) => i === j ? newData : x),
        };
        setExperiment(e.name, e)
    }

    return shapes.map((shape, i) => {
        return (
            <Fragment key={i}>
                <MapDrawShape
                    data={shape}
                    setData={newData => setShape(newData, i)}
                />
            </Fragment>
        )
    });
}