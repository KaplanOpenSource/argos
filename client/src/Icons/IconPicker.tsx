import * as fa_all from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, ImageList, ImageListItem, Paper, Popover, Stack, Tooltip, Typography } from "@mui/material";
import { Fragment, useState } from "react";
import { TextFieldDebounceOutlined } from "../Utils/TextFieldDebounce";
import { toTitleCase } from "../Utils/utils";
import { iconsCategories } from "./iconsCategories";

export const MARKER_DEFAULT_ICON = fa_all.faMapMarkerAlt;

export const IconDeviceByName = ({ iconName, ...props }) => {
  return <FontAwesomeIcon
    icon={iconName ? fa_all['fa' + iconName] : MARKER_DEFAULT_ICON}
    {...props}
  />;
}

export const IconPicker = ({ data, setData }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterText, setFilterText] = useState('');

  return (
    <Box sx={{ position: 'relative' }}>
      <Tooltip title="Pick Icon" placement="top">
        <Paper
          sx={{ border: 1, width: 30, height: 30, alignContent: 'center', textAlign: 'center' }}
          onClick={(e) => {
            e.stopPropagation();
            setAnchorEl(anchorEl ? null : e.currentTarget);
          }}
        >
          <IconDeviceByName
            iconName={data}
          />
        </Paper>
      </Tooltip>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={e => {
          e.stopPropagation();
          setAnchorEl();
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
        transformOrigin={{ vertical: 'top', horizontal: 'left', }}
        sx={{ zIndex: 1000 }}
      >
        <Paper
          sx={{
            border: 1,
            padding: 0.5,
            overflowY: 'hidden'
          }}
          onClick={e => e.stopPropagation()}
        >
          <Stack
            direction='row'
            alignItems='stretch'
            justifyContent='space-between'
          >
            <Typography variant="h5">Choose Icon</Typography>
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='center'
            >
              <Typography>Filter:</Typography>
              <TextFieldDebounceOutlined
                style={{
                  width: '100px',
                  // height: '20px',
                }}
                size='small'
                value={filterText}
                onChange={val => setFilterText(val)}
                debounceMs={100}
                tooltipTitle='Filter icons'
              />
            </Stack>
          </Stack>
          <Box sx={{
            height: 30 * 12,
            overflowY: 'auto'
          }}>
            {
              Object.entries(iconsCategories).map(([cat, { icons, label }]) => {
                icons = icons.map(x => toTitleCase(x));
                icons = icons.filter(x => fa_all['fa' + x]);
                if (filterText.length > 0) {
                  icons = icons.filter(x => x.toLowerCase().includes(filterText));
                }
                return icons.length === 0 ? null : (
                  <Fragment key={cat}>
                    <Typography>
                      {label}
                    </Typography>
                    <ImageList
                      sx={{
                        // height: 30 * 12,
                        margin: 0
                      }}
                      cols={12}
                    >
                      {icons.map(name => (
                        <ImageListItem key={name}>
                          <Tooltip
                            title={name}
                          >
                            <Paper
                              sx={{ border: 1, width: 30, height: 30, alignContent: 'center', textAlign: 'center' }}
                              onClick={() => {
                                setData(name);
                                setAnchorEl();
                              }}
                            >
                              <FontAwesomeIcon
                                key={name}
                                icon={fa_all['fa' + name]}
                                color={name === data ? "black" : "grey"}
                              />
                            </Paper>
                          </Tooltip>
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </Fragment>
                )
              })
            }
          </Box>
        </Paper>
      </Popover>
    </Box>
  )
}
