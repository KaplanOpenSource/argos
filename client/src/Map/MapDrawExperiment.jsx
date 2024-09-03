import { Fragment, useContext } from "react";
import { MapDraw } from "./MapDraw";
import { experimentContext } from "../Context/ExperimentProvider";
import { Case, SwitchCase } from "../Utils/SwitchCase";
import { Circle, Polygon, Polyline } from "react-leaflet";

export const MapDrawExperiment = ({ }) => {
    const {
        currTrial,
        setExperiment,
    } = useContext(experimentContext);

    const { experiment } = currTrial || {};


    // TODO:
    // 1. implement edit button on shapes list
    // 2. on edit do something like ImagePlacementStretcher for each of the shapes below
    // 3. check that convert to geojson works
    
    return (experiment?.shapes || []).map((shape, i) => {
        return (
            <Fragment key={i}>
                <SwitchCase test={shape?.type || "Polyline"}>
                    <Case value={"Circle"}>
                        {(shape?.center?.length >= 2 && shape?.radius > 0)
                            ?
                            <Circle
                                center={shape.center}
                                radius={shape.radius}
                            />
                            : null
                        }
                    </Case>
                    <Case value={"Polyline"}>
                        {(shape?.coordinates?.length > 0)
                            ?
                            <Polyline
                                positions={shape.coordinates}
                            />
                            : null
                        }
                    </Case>
                    <Case value={"Polygon"}>
                        {(shape?.coordinates?.length > 0)
                            ?
                            <Polygon
                                positions={shape.coordinates}
                            />
                            : null
                        }
                    </Case>
                </SwitchCase>
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