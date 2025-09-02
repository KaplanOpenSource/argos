import { EditLocationAlt, EditLocationOutlined } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import MapIcon from '@mui/icons-material/Map';
import { Stack } from "@mui/material";
import { TreeRowOnChosen } from "../App/TreeRowOnChosen";
import { useChosenTrial, useExperimentProvider } from "../Context/useChosenTrial";
import { useShowImagePlacement } from "../Context/useShowImagePlacement";
import { useShownMap } from "../Context/useShownMap";
import { ImageOnServer } from "../IO/ImageOnServer";
import { UploadImageButton } from "../IO/UploadImageButton";
import { BooleanProperty } from "../Property/BooleanProperty";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { TextFieldDebounceOutlined } from "../Utils/TextFieldDebounce";
import { IExperiment, IImageStandalone } from "../types/types";

export const ImageStandalone = ({
  data,
  setData,
  experiment,
}: {
  data: IImageStandalone,
  setData: (newData: IImageStandalone | undefined) => any,
  experiment: IExperiment,
}) => {
  const {
    currTrial,
  } = useExperimentProvider();
  const { chosenNames } = useChosenTrial();
  const { showImagePlacement, setShowImagePlacement } = useShowImagePlacement();
  const { switchToMap } = useShownMap({});

  const isShown = chosenNames.experiment?.name === experiment.name && chosenNames.shownMap?.name === data.name;
  const isBeingEdit = showImagePlacement && isShown;

  return (
    <TreeRowOnChosen
      data={data}
      components={
        <>
          <ButtonTooltip
            tooltip="Delete image"
            onClick={() => setData(undefined)}
          >
            <DeleteIcon />
          </ButtonTooltip>
          <UploadImageButton
            imageName={data.name!}
            experimentName={experiment.name!}
            onChangeFile={(filename, height, width) => setData({
              ...data,
              filename,
              height,
              width,
              xleft: 0,
              ybottom: 0,
              xright: width,
              ytop: height,
            })}
          />
          <ButtonTooltip
            tooltip={currTrial.experiment ? "Switch to this image" : "First choose an experiment before switching to this image"}
            onClick={() => switchToMap(data.name)}
            disabled={!currTrial.experiment || (data || {}).ytop === undefined}
          >
            <MapIcon />
          </ButtonTooltip>
          <ButtonTooltip
            tooltip={"Edit image placement" + (isShown ? "" : " only when shown")}
            onClick={() => setShowImagePlacement(!showImagePlacement)}
            disabled={!isShown}
          >
            {isBeingEdit
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
            label="X Left"
            value={data.xleft}
            onChange={val => setData({ ...data, xleft: val })}
          />
          <TextFieldDebounceOutlined
            label="Y Top"
            value={data.ytop}
            onChange={val => setData({ ...data, ytop: val })}
          />
        </Stack>
        <Stack direction={'row'}>
          <TextFieldDebounceOutlined
            label="X Right"
            value={data.xright}
            onChange={val => setData({ ...data, xright: val })}
          />
          <TextFieldDebounceOutlined
            label="Y Bottom"
            value={data.ybottom}
            onChange={val => setData({ ...data, ybottom: val })}
          />
        </Stack>
        <Stack direction={'row'}>
          <BooleanProperty
            label={'Show grid'}
            data={!!data?.gridDelta}
            setData={(val) => setData({ ...data, gridDelta: val ? 10 : 0 })}
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
    </TreeRowOnChosen>
  )
}