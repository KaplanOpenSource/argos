import { useContext } from "react";
import { TypesInfoBox } from "./TypesInfoBox"
import { experimentContext } from "../Experiment/ExperimentProvider";

export const DevicePlanner = () => {
    const { currTrial } = useContext(experimentContext);
    const { experiment, trialType, trial } = currTrial;
    if (!trial) {
        return null;
    }
    console.log('experiment', experiment, '\ntrialType', trialType, '\ntrial', trial)
    const deviceTypes = experiment.deviceTypes;
    return (
        <div
            style={{
                position: 'relative',
                margin: '10px',
                zIndex: 1000
            }}
        >
            <TypesInfoBox
                entities={deviceTypes}
                shownEntityItems={[]}
                shownEntityTypes={[]}
                showTableOfType={true}
            />
        </div>
    )
}