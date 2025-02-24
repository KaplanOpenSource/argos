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
import { MARKER_DEFAULT_ICON } from "../Icons/IconPicker";
import html2canvas from 'html2canvas';
import { isEqual } from "lodash";
import { SCOPE_TRIAL } from "../Experiment/AttributeType";

const IconToBlob = ({ iconName, obtainIcon }) => {
    const divRef = useRef(null);
    const iconRef = useRef(null);
    useEffect(() => {
        (async () => {
            if (divRef?.current && iconRef?.current) {
                const canvas = await html2canvas(divRef.current, {
                    logging: false,
                    scale: 10,
                    backgroundColor: 'transparent',
                });
                const dataURL = canvas.toDataURL('image/png')
                const binaryData = atob(dataURL.split(',')[1])
                const arrayBuffer = new ArrayBuffer(binaryData.length)
                const uint8Array = new Uint8Array(arrayBuffer)
                for (let i = 0; i < binaryData.length; i++) {
                    uint8Array[i] = binaryData.charCodeAt(i)
                }
                const imageBlob = new Blob([uint8Array], { type: 'image/png' });

                const svgString = iconRef.current.outerHTML;
                obtainIcon({ imageBlob, svgString });
            }
        })();
    }, [iconName, divRef?.current, iconRef?.current]);

    return (
        <div
            ref={divRef}
        >
            <FontAwesomeIcon
                icon={iconName ? fa_all['fa' + iconName] : MARKER_DEFAULT_ICON}
                ref={iconRef}
            />
        </div>
    )
}

const fillDefaults = (experiment) => {
    const ret = structuredClone(experiment);
    for (const deviceType of ret.deviceTypes || []) {
        for (const attrType of deviceType?.attributeTypes) {
            if (!attrType.scope) {
                attrType.scope = SCOPE_TRIAL;
            }
        }
    }
    return ret;
}

export const DownloadExperimentButton = ({ experiment }) => {
    const { downloadImageAsBlob } = useDownloadImage();
    const [working, setWorking] = useState(false);
    const [iconBlobs, setIconBlobs] = useState({});

    const icons = experiment.deviceTypes?.filter(d => d.icon).map(d => d.icon) || [];

    const downloadExperimentAsZip = useCallback(async (experiment) => {
        const zip = JSZip();
        const cleaned = cleanUuids(experiment);
        const filled = fillDefaults(cleaned);
        zip.file(`data.json`, JSON.stringify(filled));
        const images = (experiment.imageStandalone || []).concat((experiment.imageEmbedded || []));
        for (const img of images) {
            if (img.filename) {
                const image = await downloadImageAsBlob(experiment.name, img.filename);
                const ext = img.filename.split('.').pop();
                const filename = `images/${img.name}.${ext}`;
                zip.file(filename, image, { binary: true });
            }
        }

        for (const [iconName, { imageBlob, svgString }] of Object.entries(iconBlobs)) {
            zip.file(`icons/${iconName}.png`, imageBlob, { binary: true });
            zip.file(`icons/${iconName}.svg`, svgString);
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
                            obtainIcon={({ imageBlob, svgString }) => {
                                setIconBlobs(prev => ({ ...prev, [name]: { imageBlob, svgString } }));
                            }}
                        />
                    ))}
                </Box>
            }
        </>
    )
}