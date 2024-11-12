import { HourglassBottom, Upload } from "@mui/icons-material"
import { useState } from "react";
import { ButtonFile } from "../Utils/ButtonFile";
import { ErrorsDialog } from "./ErrorsDialog";
import { obtainDevicesFromFile } from "./obtainDevicesFromFile";
import { UploadDevicesFieldsDialog } from "./UploadDevicesFieldsDialog";

export const UploadDevicesButton = ({ data, experiment, setData }) => {
    const [working, setWorking] = useState(false);
    const [errors, setErrors] = useState(undefined);
    const [devicesToUpload, setDevicesToUpload] = useState([]);

    const handleChangeFile = async (files) => {
        setWorking(true);
        try {
            if (!files || !files.length) {
                throw "empty file";
            }

            setDevicesToUpload([]);
            for (const file of files) {
                const devices = await obtainDevicesFromFile(file);
                setDevicesToUpload(prev => [...prev, ...devices])
            }
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
                    data={data}
                    setData={setData}
                    experiment={experiment}
                />
            }
        </>
    )
}