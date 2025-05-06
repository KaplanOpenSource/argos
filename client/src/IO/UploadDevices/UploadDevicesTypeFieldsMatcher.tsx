import { Stack } from "@mui/material";
import { uniq } from "lodash";
import React from "react";
import { RealMapName } from "../../constants/constants";
import { SelectFieldWithName } from "./SelectFieldWithName";
import { FIELD_MAPNAME, FIELD_UNASSIGNED, LOCATION_FIELDS } from "./uploadDefs";

const UploadDevicesTypeFieldsMatcherOne = ({ oneMatch, setOneMatch, attrName, attrOptions, }: {
  oneMatch: string,
  setOneMatch: (updater: (prev: string) => string) => void,
  attrName: string,
  attrOptions: { name: string }[],
}) => {
  let message: string | undefined = undefined;
  if (oneMatch === FIELD_UNASSIGNED && LOCATION_FIELDS.includes(attrName)) {
    message = attrName === FIELD_MAPNAME
      ? "Default " + RealMapName + " will be used"
      : "Assign location fields";
  }

  return (
    <SelectFieldWithName
      attrName={attrName}
      attrOptions={attrOptions}
      oneMatch={oneMatch}
      setOneMatch={setOneMatch}
      message={message}
    />
  )
}

export const UploadDevicesTypeFieldsMatcher = ({ devicesDetails, deviceType, attrMatch, setAttrMatch, headerFields }: {
  devicesDetails: { [key: string]: any }[],
  deviceType: { attributeTypes: { name: string }[] },
  attrMatch: { [key: string]: string },
  setAttrMatch: (updater: (prev: { [key: string]: string }) => { [key: string]: string }) => void,
  headerFields: string[],
}) => {
  const fieldNamesOnDetails = uniq(devicesDetails.flatMap(x => {
    return Object.keys(x).filter(f => !headerFields.includes(f));
  }));

  const attributeTypeNames = deviceType?.attributeTypes?.map(x => x.name) || [];
  attributeTypeNames.unshift(...LOCATION_FIELDS);

  const attrOptions = fieldNamesOnDetails.map(f => ({ name: f }));
  attrOptions.push({ name: FIELD_UNASSIGNED });

  return (
    <Stack direction='column' spacing={1} sx={{ margin: 1 }}>
      {attributeTypeNames.map((attrName, i) => (
        <UploadDevicesTypeFieldsMatcherOne key={i}
          attrName={attrName}
          oneMatch={attrMatch[attrName] || FIELD_UNASSIGNED}
          setOneMatch={updater => {
            setAttrMatch(prev => ({ ...(prev || {}), [attrName]: updater((prev || {})[attrName]) }));
          }}
          attrOptions={attrOptions}
        />
      ))}
    </Stack>
  )
}