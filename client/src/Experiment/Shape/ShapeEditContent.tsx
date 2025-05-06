import { Add, Delete } from "@mui/icons-material";
import { Stack } from "@mui/material";
import { ButtonTooltip } from "../../Utils/ButtonTooltip";
import { Case, SwitchCase } from "../../Utils/SwitchCase";
import { TextFieldDebounceOutlined } from "../../Utils/TextFieldDebounce";
import { DrawShapeButton } from "./DrawShapeButton";
import { ShapeColorPicker } from "./ShapeColorPicker";
import { ShapeTypeSelect } from "./ShapeTypeSelect";

export const ShapeEditContent = ({ data, setData }) => {

  const setCoordinates = (newCoords) => {
    setData({ ...data, coordinates: newCoords });
  }
  const setOneCoord = (newCoord, index = undefined) => {
    const old = (data?.coordinates || []);
    if (newCoord === undefined) {
      setCoordinates(old.filter((_, j) => j !== index));
    } else if (index === undefined) {
      setCoordinates([...old, newCoord]);
    } else {
      setCoordinates(old.map((x, i) => i === index ? newCoord : x));
    }
  }

  return (
    <Stack direction='row' spacing={1} alignItems={'center'}>
      <Stack direction='column' spacing={1} alignItems={'center'}>
        <Stack direction='row' spacing={1} alignItems={'center'} alignSelf={'start'}>
          <DrawShapeButton
            data={data}
            setData={setData}
          />
          <ShapeTypeSelect
            type={data.type}
            setType={type => setData({ ...data, type })}
          />
          <ShapeColorPicker
            data={data}
            setData={setData}
          />
          {data.type === "Circle" ? null : <>
            <ButtonTooltip
              tooltip="Add coordinate"
              onClick={() => setData({ ...data, coordinates: [...(data.coordinates || []), [0, 0]] })}
            >
              <Add />
            </ButtonTooltip>
          </>}
        </Stack>
        <SwitchCase test={data.type || "Polyline"}>
          <Case value={"Circle"}>
            <Stack direction='row' spacing={1} alignItems={'center'}>
              <TextFieldDebounceOutlined
                key="Radius"
                label="Radius"
                value={data.radius || 0}
                type='number'
                onChange={v => setData({ ...data, radius: parseFloat(v) })}
              />
              <TextFieldDebounceOutlined
                key="Center X"
                label="Center X"
                value={(data?.center || [])[0] || 0}
                type='number'
                onChange={v => setData({ ...data, center: [parseFloat(v), data?.center?.at(1) || 0] })}
              />
              <TextFieldDebounceOutlined
                key="Center Y"
                label="Center Y"
                value={(data?.center || [])[1] || 0}
                type='number'
                onChange={v => setData({ ...data, center: [data?.center?.at(0) || 0, parseFloat(v)] })}
              />
            </Stack>
          </Case>
          <Case isDefault={true}>
            <Stack direction='column'>
              {data?.coordinates?.map((coords, i) => {
                const x = (coords || [])[0] || 0;
                const y = (coords || [])[1] || 0;
                return (
                  <Stack direction='row' key={i} alignItems={'center'}>
                    <TextFieldDebounceOutlined
                      key="X"
                      label="X"
                      value={x}
                      type='number'
                      onChange={v => setOneCoord([parseFloat(v), y], i)}
                    />
                    <TextFieldDebounceOutlined
                      key="Y"
                      label="Y"
                      value={y}
                      type='number'
                      onChange={v => setOneCoord([x, parseFloat(v)], i)}
                    />
                    <ButtonTooltip
                      tooltip="Delete coordinate"
                      onClick={() => setOneCoord(undefined, i)}
                    >
                      <Delete />
                    </ButtonTooltip>
                  </Stack>
                )
              })}
            </Stack>
          </Case>
        </SwitchCase>
      </Stack>
    </Stack>
  )
}