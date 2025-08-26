import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { sum } from "lodash";
import { Fragment } from "react";
import { useChosenTrial } from "../../Context/useChosenTrial";
import { DateProperty } from "../../Property/DateProperty";
import { shortenName } from "../../Utils/utils";
import { TrialObj } from "../../objects";
import { ScopeEnum } from '../../types/ScopeEnum';
import { ITrial } from "../../types/types";
import { AttributeItemOne } from "../AttributeItemList";

export const TrialsTabularView = ({ }) => {
  const { experiment, changeChosen } = useChosenTrial();

  const totalDevices = sum((experiment?.deviceTypes || []).map(x => (x?.devices || []).length));
  return (
    <TableContainer
      component={Paper}
      key="1"
      sx={{ overflowX: "visible" }}
    >
      <Table
        size="small"
        stickyHeader
      >
        {experiment?.trialTypes?.map((trialType, itt) => {
          return (
            <Fragment key={trialType.trackUuid}>
              <TableHead key={':th_' + trialType.name}>
                <TableRow
                  sx={{
                    backgroundColor: 'lightgray'
                  }}
                >
                  <TableCell key={':tt'}>
                    Trial Type
                    {/* <AttributeTypesDialogButton
                      experiment={trialType}
                      setData={val => setTrialType(val)}
                      isOfDevice={false}
                    /> */}
                  </TableCell>
                  <TableCell key={':tr'}>
                    Trial
                    {/* <AddNewTrialButton
                      trialType={trialType}
                      setTrialType={val => setTrialType(val)}
                    /> */}
                  </TableCell>
                  <TableCell key={':tcd'}>Created Date</TableCell>
                  <TableCell key={':tpos'}>Positioned Devices</TableCell>
                  {trialType?.attributeTypes?.map(attrType => {
                    return (
                      <Tooltip
                        key={attrType.name}
                        title={attrType.name}
                      >
                        <TableCell
                          key={attrType.name}
                        >
                          {shortenName(attrType.name)}
                        </TableCell>
                      </Tooltip>
                    )
                  })}
                </TableRow>
              </TableHead>
              <TableBody key={':tb_' + trialType.name}>
                {trialType?.trials?.map((trial, itr) => {
                  const placedDevices = (trial.devicesOnTrial || []).length;
                  const setTrial = (val: ITrial) => {
                    changeChosen(trial, new TrialObj(val, experiment.deviceTypes, trialType))
                  }
                  return (
                    <TableRow
                      key={trial.trackUuid}
                    >
                      <TableCell component="th" scope="row" key={':tt'}>
                        {trialType.name}
                      </TableCell>
                      <TableCell key={':tr'}>{trial.name}</TableCell>
                      <TableCell key={':tcd'}>
                        <DateProperty
                          experiment={trial.createdDate}
                          // setData={val => setData({ ...experiment, createdDate: val })}
                          label="Created Date"
                          disabled={true}
                        />
                      </TableCell>
                      <TableCell key={':tpos'}>
                        <Typography>
                          {placedDevices}/{totalDevices}
                        </Typography>
                      </TableCell>
                      {trialType?.attributeTypes?.map(attrType => {
                        return (
                          <TableCell
                            key={attrType.name}
                          >
                            <AttributeItemOne
                              attrType={attrType}
                              data={trial.toJson(true)}
                              setData={val => setTrial(val)}
                              scope={ScopeEnum.SCOPE_TRIAL}
                              reduceNames={true}
                            />
                          </TableCell>
                        )
                      })}
                    </TableRow>

                  )
                })}
              </TableBody>
            </Fragment>
          )
        })}
      </Table>
    </TableContainer>
  )
}