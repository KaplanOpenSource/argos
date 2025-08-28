import { DynamicFeed, PlayArrow } from "@mui/icons-material";
import { Box, Popover, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { assignUuids } from "../Context/TrackUuidUtils";
import { isScopeEqual, ScopeEnum } from "../types/ScopeEnum";
import { IDevice, IDeviceType } from "../types/types";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { TextFieldDebounce } from "../Utils/TextFieldDebounce";
import { AttributeItem } from "./AttributeItem";

export const AddMultipleDevices = ({
  deviceType,
  addDevices,
}: {
  deviceType: IDeviceType,
  addDevices: (newDevices: IDevice[]) => void,
}) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [instances, setInstances] = useState(10);
  const [prefix, setPrefix] = useState(deviceType.name + "_");
  const [digits, setDigits] = useState(3);
  const [suffix, setSuffix] = useState("");
  const [initDevice, setInitDevice] = useState<IDevice>({});

  const open = Boolean(anchorEl);

  const createNewDevices = () => {
    const newDevices: IDevice[] = [];
    for (let i = 1; i <= instances; ++i) {
      const name = prefix + ('' + i).padStart(digits, '0') + suffix;
      newDevices.push({ ...initDevice, name });
    }
    addDevices(assignUuids(newDevices));
    setAnchorEl(null);
  }

  useEffect(() => {
    setPrefix(deviceType.name + "_");
  }, [deviceType]);

  return (
    <>
      <ButtonTooltip
        tooltip={"Add multiple devices"}
        color={open ? "primary" : "default"}
        onClick={(e) => {
          e.stopPropagation();
          setAnchorEl(e.currentTarget);
        }}
      >
        <DynamicFeed />
      </ButtonTooltip>
      <Popover
        // id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Stack
          sx={{ padding: '5px', borderColor: 'black', border: 2 }}
        >
          <Box>

            <TextFieldDebounce
              sx={{
                width: 120,
              }}
              variant='outlined'
              label="New devices"
              type="number"
              size='small'
              InputLabelProps={{ shrink: true }}
              onChange={val => setInstances(val)}
              value={instances}
            />
            <TextFieldDebounce
              sx={{
                width: 150,
              }}
              variant='outlined'
              label="Name prefix"
              size='small'
              InputLabelProps={{ shrink: true }}
              onChange={val => setPrefix(val)}
              value={prefix}
            />
            <TextFieldDebounce
              sx={{
                width: 100,
              }}
              variant='outlined'
              label="Digits"
              type="number"
              size='small'
              InputLabelProps={{ shrink: true }}
              onChange={val => setDigits(val)}
              value={digits}
            />
            <TextFieldDebounce
              sx={{
                width: 150,
              }}
              variant='outlined'
              label="Name suffix"
              size='small'
              InputLabelProps={{ shrink: true }}
              onChange={val => setSuffix(val)}
              value={suffix}
            />
          </Box>
          <Box>
            {(deviceType.attributeTypes || [])
              .filter(attrType => isScopeEqual(attrType.scope, ScopeEnum.SCOPE_EXPERIMENT))
              .map(attrType => {
                return (
                  <AttributeItem
                    key={attrType.name}
                    attrType={attrType}
                    container={initDevice}
                    setContainer={setInitDevice}
                  />
                )
              })}
          </Box>
          <Box>
            <ButtonTooltip
              tooltip="Create"
              onClick={(e) => {
                e.stopPropagation();
                createNewDevices();
              }}
              color="primary"
            >
              Create
              <PlayArrow />
            </ButtonTooltip>
          </Box>
        </Stack>
      </Popover>
    </>
  )
}