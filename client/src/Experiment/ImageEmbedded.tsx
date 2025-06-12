import { EditLocationAlt, EditLocationOutlined, OpenInFull } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Stack } from "@mui/material";
import { useContext } from "react";
import { TreeRow } from "../App/TreeRow";
import { useExperimentProvider } from "../Context/ExperimentProvider";
import { useShowImagePlacement } from "../Context/useShowImagePlacement";
import { ImageOnServer } from "../IO/ImageOnServer";
import { UploadImageButton } from "../IO/UploadImageButton";
import { ActionsOnMapContext } from "../Map/ActionsOnMapContext";
import { BooleanProperty } from "../Property/BooleanProperty";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { TextFieldDebounceOutlined } from "../Utils/TextFieldDebounce";
import { IExperiment, IImageEmbedded } from "../types/types";

export const ImageEmbedded = ({
  data,
  setData,
  experiment,
}: {
  data: IImageEmbedded,
  setData: (newData: IImageEmbedded | undefined) => any,
  experiment: IExperiment,
}) => {
  const { addActionOnMap, mapBounds } = useContext(ActionsOnMapContext)!;
  const {
    currTrial,
  } = useExperimentProvider();
  const { showImagePlacement, setShowImagePlacement } = useShowImagePlacement();

  const hasBounds = data?.latnorth && data?.lngwest && data?.latsouth && data?.lngeast;

  return (
    <TreeRow
      data={data}
      setData={setData}
      components={
        <>
          <ButtonTooltip
            tooltip="Delete image"
            onClick={() => setData(undefined)}
          >
            <DeleteIcon />
          </ButtonTooltip>
          <UploadImageButton
            imageName={data.name}
            experimentName={experiment.name}
            onChangeFile={(filename, height, width) => {
              console.log(mapBounds);
              if (!mapBounds) {
                alert('unknown map bounds');
                return;
              }
              const lngsize = (mapBounds.getEast() - mapBounds.getWest()) / 2;
              const latsize = width > 0 ? lngsize / width * height : 0;
              const lngwest = mapBounds.getCenter().lng + lngsize / 2;
              const lngeast = mapBounds.getCenter().lng - lngsize / 2;
              const latnorth = mapBounds.getCenter().lat + latsize / 2;
              const latsouth = mapBounds.getCenter().lat - latsize / 2;
              setData({
                ...data,
                filename,
                height,
                width,
                latnorth,
                lngwest,
                latsouth,
                lngeast,
              });
            }}
          />
          <ButtonTooltip
            tooltip={"Fit image to screen" + (hasBounds ? "" : ", disabled when no bounds")}
            onClick={() => addActionOnMap((mapObject) => {
              if (hasBounds) {
                mapObject.fitBounds([[data.latnorth!, data.lngwest!], [data.latsouth!, data.lngeast!]]);
              }
            })}
            disabled={!hasBounds}
          >
            <OpenInFull />
          </ButtonTooltip>
          <ButtonTooltip
            tooltip="Edit image placement"
            onClick={() => setShowImagePlacement(!showImagePlacement)}
          >
            {(showImagePlacement && currTrial.experimentName === experiment.name)
              ? <EditLocationAlt />
              : <EditLocationOutlined />
            }
          </ButtonTooltip>
          <ImageOnServer
            showSize={false}
            maxHeight={40}
            data={data}
            experiment={experiment}
            style={{ borderRadius: 10 }}
          />
        </>
      }
    >
      <Stack direction={'column'}>
        <Stack direction={'row'}>
          <TextFieldDebounceOutlined
            label="Lng West"
            value={data.lngwest}
            onChange={val => setData({ ...data, lngwest: val })}
          />
          <TextFieldDebounceOutlined
            label="Lat North"
            value={data.latnorth}
            onChange={val => setData({ ...data, latnorth: val })}
          />
        </Stack>
        <Stack direction={'row'}>
          <TextFieldDebounceOutlined
            label="Lng East"
            value={data.lngeast}
            onChange={val => setData({ ...data, lngeast: val })}
          />
          <TextFieldDebounceOutlined
            label="Lat South"
            value={data.latsouth}
            onChange={val => setData({ ...data, latsouth: val })}
          />
        </Stack>
        <Stack direction={'row'}>
          <BooleanProperty
            label={'Show grid'}
            data={!!data?.gridDelta}
            setData={(val) => setData({ ...data, gridDelta: val ? 0.001 : 0 })}
          />
          <TextFieldDebounceOutlined
            label="Grid Delta"
            value={data.gridDelta}
            onChange={val => setData({ ...data, gridDelta: parseFloat(val) })}
            type='number'
            sx={{ width: 150 }}
          />
        </Stack>
        <ImageOnServer
          data={data}
          experiment={experiment}
        />
      </Stack>
    </TreeRow>
  )
}