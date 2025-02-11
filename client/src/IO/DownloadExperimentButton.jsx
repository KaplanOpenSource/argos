import { Download, HourglassBottom } from "@mui/icons-material"
import { ButtonTooltip } from "../Utils/ButtonTooltip"
import JSZip from "jszip";
import { cleanUuids } from "../Context/TrackUuidUtils";
import { shapesToGeoJSON } from "./ShapesToGeoJson";
import { saveAs } from 'file-saver';
import { useDownloadImage } from "./useDownloadImage";
import { useCallback, useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as fa_all from "@fortawesome/free-solid-svg-icons";
import { MARKER_DEFAULT_ICON } from "../Experiment/IconPicker";
import html2canvas from 'html2canvas';
import { isEqual } from "lodash";

const IconToBlob = ({ iconName, obtainBlob }) => {
    const iconRef = useRef(null);
    useEffect(() => {
        (async () => {
            if (iconRef?.current) {
                const canvas = await html2canvas(iconRef.current, { logging: false });
                const dataURL = canvas.toDataURL('image/png')
                const binaryData = atob(dataURL.split(',')[1])
                const arrayBuffer = new ArrayBuffer(binaryData.length)
                const uint8Array = new Uint8Array(arrayBuffer)
                for (let i = 0; i < binaryData.length; i++) {
                    uint8Array[i] = binaryData.charCodeAt(i)
                }
                const blob = new Blob([uint8Array], { type: 'image/png' });
                obtainBlob(blob);
            }
        })();
    }, [iconName, iconRef?.current]);

    return (
        <div
            ref={iconRef}
        >
            <FontAwesomeIcon
                icon={iconName ? fa_all['fa' + iconName] : MARKER_DEFAULT_ICON}
            />
        </div>
    )
}

export const DownloadExperimentButton = ({ experiment }) => {
    const { downloadImageAsBlob } = useDownloadImage();
    const [working, setWorking] = useState(false);
    const [iconBlobs, setIconBlobs] = useState({});

    const icons = experiment.deviceTypes?.filter(d => d.icon).map(d => d.icon) || [];

    const downloadExperimentAsZip = useCallback(async (experiment) => {
        const zip = JSZip();
        const cleaned = cleanUuids(experiment);
        zip.file(`data.json`, JSON.stringify(cleaned));
        const images = (experiment.imageStandalone || []).concat((experiment.imageEmbedded || []));
        for (const img of images) {
            if (img.filename) {
                const image = await downloadImageAsBlob(experiment.name, img.filename);
                const ext = img.filename.split('.').pop();
                const filename = `images/${img.name}.${ext}`;
                zip.file(filename, image, { binary: true });
            }
        }

        for (const [iconName, iconBlob] of Object.entries(iconBlobs)) {
            const filename = `icons/${iconName}.png`;
            zip.file(filename, iconBlob, { binary: true });
        }

        if (experiment.shapes) {
            const shapesGeoJson = shapesToGeoJSON(experiment.shapes);
            zip.file(`shapes.geojson`, JSON.stringify(shapesGeoJson));
        }

        const zipblob = await zip.generateAsync({ type: "blob" });
        saveAs(zipblob, `experiment_${experiment.name}.zip`);
    }, [iconBlobs]);

    useEffect(() => {
        (async () => {
            if (working) {
                const iconsNeeded = new Set(icons);
                const iconsLoaded = new Set(Object.keys(iconBlobs));
                if (isEqual(iconsNeeded, iconsLoaded)) {
                    await downloadExperimentAsZip(experiment);
                    setWorking(false);
                }
            }
        })();
    }, [working, iconBlobs, icons]);

    return (
        <>
            <ButtonTooltip
                tooltip={"Download experiment"}
                onClick={async () => {
                    setIconBlobs({});
                    setWorking(true);
                }}
                disabled={working}
            >
                {working
                    ? <HourglassBottom />
                    : <Download />
                }
            </ButtonTooltip>
            {!working ? null :
                <Box
                    sx={{ position: 'absolute', top: -10000 }}
                >
                    {icons.map(name => (
                        <IconToBlob
                            key={name}
                            iconName={name}
                            obtainBlob={(blob) => setIconBlobs(prev => ({ ...prev, [name]: blob }))}
                        />
                    ))}
                </Box>
            }
        </>
    )
}