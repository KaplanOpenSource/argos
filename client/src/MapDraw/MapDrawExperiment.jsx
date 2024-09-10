import { Fragment, useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { MapDrawShape } from "./MapDrawShape";

export const MapDrawExperiment = ({ }) => {
    const {
        currTrial,
        setExperiment,
    } = useContext(experimentContext);

    const { experiment } = currTrial || {};
    const shapes = experiment?.shapes || [];

    return shapes.map((shape, i) => {
        return (
            <Fragment key={i}>
                <MapDrawShape
                    data={shape}
                    setData={newData => {
                        const e = {
                            ...experiment,
                            shapes: shapes.map((x, j) => i === j ? newData : x),
                        };
                        setExperiment(e.name, e)
                    }}
                />
            </Fragment>
        )
    });
}