import { HourglassBottom, Upload } from "@mui/icons-material"
import { useState } from "react";
import { ButtonFile } from "../Utils/ButtonFile";
import { ErrorsDialog } from "./ErrorsDialog";
import { obtainDevicesFromFile } from "./obtainDevicesFromFile";
import { UploadDevicesFieldsDialog } from "./UploadDevicesFieldsDialog";

export const UploadDevicesButton = ({ data, experiment, setData }) => {
    const [working, setWorking] = useState(false);
    const [errors, setErrors] = useState(undefined);
    const [devices, setDevices] = useState([]);

    const handleChangeFile = async (files) => {
        setWorking(true);
        try {
            if (!files || !files.length) {
                throw "empty file";
            }

            setDevices([]);
            for (const file of files) {
                await obtainDevicesFromFile(file, (devs) => {
                    setDevices(prev => [...prev, ...devs])
                });
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
            {errors?.length || !devices?.length ? null :
                <UploadDevicesFieldsDialog
                    devices={devices}
                    setDevices={setDevices}
                    data={data}
                    setData={setData}
                    experiment={experiment}
                />
            }
        </>
    )
}