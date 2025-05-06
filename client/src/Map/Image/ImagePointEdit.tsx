import { Stack } from "@mui/material";
import React from "react";
import { roundDec } from "../../Utils/GeometryUtils";
import { TextFieldDebounceOutlined } from "../../Utils/TextFieldDebounce";
import { IAnchorPoint } from "./IAnchorPoint";

export const ImagePointEdit = ({
  point,
  setXy,
  setLatLng,
  label,
  disabledXy = false,
  disabledLatLng = false,
}: {
  point: IAnchorPoint,
  setXy?: ({ x, y }: { x: number, y: number }) => void,
  setLatLng?: ({ lat, lng }: { lat: number, lng: number }) => void,
  label: string,
  disabledXy?: boolean,
  disabledLatLng?: boolean
}) => {
  return (
    <Stack direction='column' spacing={1}>
      <span>{label}:</span>
      <Stack direction='row' spacing={1} alignItems={'center'}>
        <span style={{ width: 120 }}>Location in meters:</span>
        <TextFieldDebounceOutlined
          style={{ marginLeft: 0 }}
          InputProps={{ style: { height: '30px', width: '90px' } }}
          label="X"
          value={roundDec(point.lng)}
          onChange={(newVal: number) => {
            setLatLng && setLatLng({ lat: point.lat, lng: newVal });
          }}
          disabled={disabledLatLng}
        />
        <TextFieldDebounceOutlined
          InputProps={{ style: { height: '30px', width: '90px' } }}
          label="Y"
          value={roundDec(point.lat)}
          onChange={(newVal: number) => {
            setLatLng && setLatLng({ lat: newVal, lng: point.lng });
          }}
          disabled={disabledLatLng}
        />
      </Stack>
      <Stack direction='row' spacing={1} alignItems={'center'}>
        <span style={{ width: 120 }}>Location in pixels:</span>
        <TextFieldDebounceOutlined
          style={{ marginLeft: 0 }}
          InputProps={{ style: { height: '30px', width: '90px' } }}
          label="X"
          value={roundDec(point.x)}
          onChange={(newVal: number) => {
            setXy && setXy({ x: newVal, y: point.y });
          }}
          disabled={disabledXy}
        />
        <TextFieldDebounceOutlined
          InputProps={{ style: { height: '30px', width: '90px' } }}
          label="Y"
          value={roundDec(point.y)}
          onChange={(newVal: number) => {
            setXy && setXy({ x: point.x, y: newVal });
          }}
          disabled={disabledXy}
        />
      </Stack>
    </Stack>
  )
}