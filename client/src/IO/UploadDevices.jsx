import { Upload } from "@mui/icons-material"
import { UploadButton } from "./UploadButton"
import { useTrialGeoJson } from "./TrialGeoJson";

export const UploadDevices = ({ data, experiment, setData }) => {
    const { uploadTrial } = useTrialGeoJson();

    return (
        <UploadButton
            tooltip={'Upload devices as geojson, csv, zip of csvs'}
            uploadFunc={file => uploadTrial(file, data, experiment, (newData) => setData(newData))}
            color='default'
        >
            <Upload />
        </UploadButton>
    )
}