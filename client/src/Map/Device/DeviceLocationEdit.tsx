import React, { useState } from "react";
import { Stack, Typography } from "@mui/material";

export const DeviceLocationEdit = ({ devLocation }) => {
    const [isEditLocation, setIsEditLocation] = useState<boolean>(false);
    return (
        <>
            {
                isEditLocation
                    ? null
                    : (
                        <Stack direction='row'>
                            <Typography variant='overline'>
                                {devLocation.map(x => Math.round(x * 1e7) / 1e7).join(',')}
                            </Typography>
                            {/* <ButtonTooltip
              // tooltip={'Edit location'}
              // onClick={() => setIsEditLocation(true)}
              >
                  <Edit />
              </ButtonTooltip> */}
                        </Stack>
                    )
            }
        </>
    )
}