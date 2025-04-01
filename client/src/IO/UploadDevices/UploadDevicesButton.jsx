import { HourglassBottom, Upload } from "@mui/icons-material"
import { useContext, useState } from "react";
import { ButtonFile } from "../../Utils/ButtonFile";
import { ErrorsDialog } from "../ErrorsDialog";
import { obtainDevicesFromFile } from "./obtainDevicesFromFile";
import { UploadDevicesFieldsDialog } from "./UploadDevicesFieldsDialog";
import { useExperimentProvider } from "../../Context/ExperimentProvider";

export const UploadDevicesButton = ({
    trial,
    setTrialData,
    trialType,
    experiment,
}) => {
    const [working, setWorking] = useState(false);
    const [errors, setErrors] = useState(undefined);
    const [devicesToUpload, setDevicesToUpload] = useState([]);
    const { setCurrTrial } = useExperimentProvider();

    const handleChangeFile = async (files) => {
        setWorking(true);
        try {
            if (!files || !files.length) {
                throw "empty file";
            }

            const alldevs = [];
            for (const file of files) {
                const devices = await obtainDevicesFromFile(file);
                alldevs.push(...devices);
            }
            setDevicesToUpload(alldevs);
        } catch (error) {
            setErrors([error?.message || error]);
        }
        setWorking(false);
    };

    return (
        <>
            <ButtonFile
                color='default'
                accept=".json,.geojson,.csv,.zip"
                tooltip={'Upload devices as geojson, csv, zip of csvs'}
                onChange={handleChangeFile}
                onClickCapture={() => {
                    setCurrTrial({ experimentName: experiment.name, trialTypeName: trialType.name, trialName: trial.name })
                }}
                disabled={working}
            >
                {working
                    ? <HourglassBottom />
                    : <Upload />
                }
            </ButtonFile>
            <ErrorsDialog
                isOpen={errors?.length}
                errors={errors}
                onClose={() => setErrors(undefined)}
            />
            {errors?.length || !devicesToUpload?.length ? null :
                <UploadDevicesFieldsDialog
                    devicesToUpload={devicesToUpload}
                    setDevicesToUpload={setDevicesToUpload}
                    data={trial}
                    setData={setTrialData}
                    experiment={experiment}
                />
            }
        </>
    )
}