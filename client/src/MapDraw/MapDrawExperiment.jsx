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


    // $$$ TODO:
    // 1. implement edit button on shapes list
    // 2. on edit do something like ImagePlacementStretcher for each of the shapes below
    // 3. check that convert to geojson works

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
    // (
    //     <>
    //         {!experiment ? null :
    //             <MapDraw
    //                 data={experiment?.shapes || []}
    //                 setData={shapes => setExperiment(experiment.name, { ...experiment, shapes })}
    //             />
    //         }
    //     </>
    // )
}