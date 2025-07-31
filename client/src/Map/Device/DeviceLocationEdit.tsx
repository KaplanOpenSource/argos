import { Edit, PlayArrow } from "@mui/icons-material";
import { Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { ButtonTooltip } from "../../Utils/ButtonTooltip";
import { locationToString } from "../../Utils/utils";
import { ICoordinates } from "../../types/types";

const NumberTextField = ({ label, value, setValue }: {
  label: string,
  value: number,
  setValue: (val: number) => void,
}) => {
  return (
    <TextField
      sx={{
        paddingTop: '5px',
        paddingBottom: '5px',
        fontSize: '12px',
        // padding: '4px',
        width: '180px',
        '& .MuiInputBase-root': {
          width: '100%',
          minWidth: '',
          fontSize: '12px', // Text size
          height: '30px',  // Overall height
        },
        '& .MuiOutlinedInput-input': {
          padding: '4px', // Inner padding
        },
      }}

      variant="outlined"
      size="small"
      InputLabelProps={{
        shrink: true
      }}
      label={label}
      type="number"
      onChange={e => {
        const n = parseFloat(e.target.value);
        if (isFinite(n)) setValue(n);
      }}
      value={Math.round(value * 1e8) / 1e8}
    />
  )
}

export const DeviceLocationEdit = ({
  location,
  setLocation,
}: {
  location: ICoordinates | undefined,
  setLocation: (loc: ICoordinates | undefined) => void,
}) => {
  const [isEditLocation, setIsEditLocation] = useState<boolean>(false);
  const fixedLocation: ICoordinates = [location?.[0] || 0, location?.[1] || 0];
  const [innerLocation, setInnerLocation] = useState<ICoordinates>(fixedLocation);

  const changeLocation = () => {
    setIsEditLocation(false);
    setLocation(innerLocation);
  }
  return isEditLocation
    ? <Stack direction='row' sx={{ marginTop: '10px' }}>
      <NumberTextField
        label={'Lat'}
        value={innerLocation[0]}
        setValue={v => setInnerLocation([v, innerLocation[1]])}
      />
      <Typography
        style={{ margin: 0, marginInline: '2px', alignContent: 'center' }}
      >
        ,
      </Typography>
      <NumberTextField
        label={'Lng'}
        value={innerLocation[1]}
        setValue={v => setInnerLocation([innerLocation[0], v])}
      />
      <ButtonTooltip
        tooltip={'Update location'}
        onClick={changeLocation}
      >
        <PlayArrow
          color="success"
        />
      </ButtonTooltip>
    </Stack>
    : <Stack direction='row'>
      <Typography variant='overline'>
        {locationToString(fixedLocation)}
      </Typography>
      <ButtonTooltip
        tooltip={'Edit location'}
        onClick={() => setIsEditLocation(true)}
      >
        <Edit />
      </ButtonTooltip>
    </Stack >
}