import { Button } from "@mui/material";
import { TreeRow } from "../App/TreeRow";
import { useContext } from "react";
import { experimentContext } from "./ExperimentProvider";

export const DeviceItem = ({ data, setData, deviceType }) => {
    const { selection, setSelection } = useContext(experimentContext);
    const selectedIndex = selection.findIndex(({ deviceTypeName, deviceItemName }) => {
        return deviceTypeName === deviceType.name && deviceItemName === data.name;
    });
    return (
        <TreeRow
            key={data.name}
            data={data}
            setData={setData}
            components={
                <>
                    <Button
                        onClick={() => {
                            if (selectedIndex === -1) {
                                setSelection([...selection, { deviceTypeName: deviceType.name, deviceItemName: data.name }]);
                            } else {
                                setSelection(selection.filter((_, i) => i !== selectedIndex));
                            }
                        }}
                    >
                        Select
                    </Button>

                </>
            }
        >
            {/* {
                (data.trialSet || []).map(e => (
                    <TrialSet
                        key={e.name}
                        name={e.name}
                        data={e.data}
                    />
                ))
            } */}
        </TreeRow>
    )
}
