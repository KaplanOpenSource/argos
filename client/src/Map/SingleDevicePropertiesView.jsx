import React, { Fragment, useContext, useState } from 'react';
import {
    Grid, Typography
} from '@mui/material';
import {
    Check,
    Close,
    Edit,
    LocationOff,
    MergeType,
} from "@mui/icons-material";
// import { useEntities } from './EntitiesContext.jsx';
// import { TextFieldEntityProperty, entitySaveForTextFields } from './TextFieldEntityProperty';
// import { useSelection } from './SelectionContext';
// import { ContainedEntity } from './ContainedEntity';
import { ButtonTooltip } from '../Utils/ButtonTooltip';
import { experimentContext } from '../Context/ExperimentProvider';
import { SelectDeviceButton } from '../Experiment/SelectDeviceButton';
import { AttributeItemList } from '../Experiment/AttributeItemList';
import { SCOPE_TRIAL } from '../Experiment/AttributeType';
import { AddContainedButton } from '../Experiment/Contained/AddContainedButton';
import { ContainedDevice } from '../Experiment/Contained/ContainedDevice';

export const SingleDevicePropertiesView = ({ deviceOnTrial, setDeviceOnTrial, children }) => {
    const [isEditLocation, setIsEditLocation] = useState(false);

    const { currTrial, setLocationsToDevices } = useContext(experimentContext);
    const experiment = currTrial.experiment || {};
    const { deviceTypeName, deviceItemName } = deviceOnTrial;
    const deviceType = (experiment.deviceTypes || []).find(t => t.name === deviceTypeName);
    const deviceItem = ((deviceType || []).devices || []).find(t => t.name === deviceItemName);

    const devLocation = deviceOnTrial.location.coordinates;
    console.log(deviceOnTrial)

    // const handleSaveEntityProperties = () => {
    //     entitySaveForTextFields({ deviceType, deviceItem, changedValues, setEntityProperties, setEntityLocations });
    //     setChangedValues({});
    //     setIsEditLocation(false);
    // }

    // const containsEntities = [deviceItem.containsEntities || []].flatMap(x => x);

    // // TODO: switch to use the EntitiesContext function
    // const findEntityParent = (containedKey) => {
    //     for (const et of entities) {
    //         for (const ei of et.items) {
    //             if (ei.containsEntities && ei.containsEntities.includes(containedKey)) {
    //                 return ei;
    //             }
    //         }
    //     }
    //     return undefined;
    // }

    // // TODO: switch to use the EntitiesContext function
    // const findEntityParentHierarchy = (containedKey) => {
    //     const parents = [];
    //     let curr = findEntityParent(containedKey);
    //     while (curr) {
    //         parents.push(curr);
    //         curr = findEntityParent(curr.key);
    //     }
    //     return parents;
    // }

    // const disconnectEntityParent = (parentEntityObj, newContainedEntityKey) => {
    //     const containsEntities = [parentEntityObj.containsEntities || []].flatMap(x => x);
    //     const newContainsEntities = containsEntities.filter(ce => ce !== newContainedEntityKey);
    //     setEntityProperties(parentEntityObj.key, [], newContainsEntities);
    // }

    // const parentHierarchy = findEntityParentHierarchy(deviceItem.key);
    // const parentEntity = parentHierarchy[0];

    // console.log(deviceType, deviceItem, deviceOnTrial)

    return (
        <>
            <Typography variant='h6'>
                {deviceItemName}
            </Typography>
            <Typography variant='p'>
                {deviceTypeName}
            </Typography>
            <br />
            {
                isEditLocation
                    ? null
                    : <>
                        <Typography variant='overline'>
                            {'at (' + devLocation.map(x => Math.round(x * 1e7) / 1e7) + ')'}
                        </Typography>
                        <ButtonTooltip tooltip={'Edit location'} onClick={() => setIsEditLocation(true)}>
                            <Edit />
                        </ButtonTooltip>
                    </>
            }
            <br />
            {deviceItem
                ? <AttributeItemList
                    attributeTypes={deviceType.attributeTypes}
                    data={deviceOnTrial}
                    setData={setDeviceOnTrial}
                    scope={SCOPE_TRIAL}
                    deviceItem={deviceItem}
                />
                : <Typography variant='body2'>
                    This device exists on trial but not on experiment, please remove.
                </Typography>
            }
            {/* <Grid container
                direction='column'
                spacing={1}
            >
                {
                    propertyKeys.map(key => (
                        <Grid item
                            key={key}
                        >
                            <TextFieldEntityProperty
                                deviceItem={deviceItem}
                                deviceType={deviceType}
                                propertyKey={key}
                                changedValue={changedValues[key]}
                                setChangedValue={newVal => {
                                    setChangedValues({ ...changedValues, [key]: newVal });
                                }}
                                parentHierarchy={parentHierarchy}
                            />
                        </Grid>
                    ))
                }
            </Grid> */}
            {deviceItem &&
                <SelectDeviceButton
                    deviceItem={deviceItem}
                    deviceType={deviceType}
                />
            }
            <ButtonTooltip
                tooltip="Remove location"
                onClick={() => setLocationsToDevices([{ deviceTypeName, deviceItemName }], [undefined])}
            >
                <LocationOff />
            </ButtonTooltip>
            {deviceItem &&
                <AddContainedButton
                    deviceItem={deviceItem}
                    deviceType={deviceType}
                    deviceOnTrial={deviceOnTrial}
                />
            }
            {children}
            {deviceOnTrial.containedIn && (
                <>
                    <br />
                    parent:
                    <br />
                    <ContainedDevice
                    // key={'P' + deviceItem.key}
                    // childEntityItemKey={parentEntity.key}
                    // disconnectEntity={() => disconnectEntityParent(parentEntity, deviceItem.key)}
                    />
                </>
            )}
            {/* {parentEntity === undefined ? null :
                <Fragment key={'p'}>
                </Fragment>
            }
            {containsEntities.length === 0 ? null :
                <Fragment key={'e'}>
                    <br />
                    contained:
                    {containsEntities.map(e => (
                        <ContainedEntity
                            key={'E' + e.key}
                            childEntityItemKey={e}
                            disconnectEntity={() => disconnectEntityParent(deviceItem, e)}
                        />
                    ))}
                </Fragment>
            } */}
        </>
    )
}