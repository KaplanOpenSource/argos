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

export const SingleDevicePropertiesView = ({ deviceOnTrial, setDeviceOnTrial, children }) => {
    const [isEditLocation, setIsEditLocation] = useState(false);

    const { currTrial, setLocationsToDevices } = useContext(experimentContext);
    const experiment = currTrial.experiment || {};
    const { deviceTypeName, deviceItemName } = deviceOnTrial;
    const deviceType = (experiment.deviceTypes || []).find(t => t.name === deviceTypeName);
    const deviceItem = (deviceType || []).devices.find(t => t.name === deviceItemName);
    if (!deviceItem) {
        return null;
    }

    const devLocation = deviceOnTrial.location.coordinates;

    // const { setEntityProperties, setEntityLocations, entities } = useEntities();
    // const { selection, popTopSelection } = useSelection();
    // const [changedValues, setChangedValues] = useState({});

    // const propertyKeys = deviceType.properties
    //     .filter(({ type }) => isEditLocation ? true : type !== 'location')
    //     .flatMap(({ key, type }) => type === 'location' ? [key + '_lat', key + '_lng'] : [key]);

    // const allSame = !Object.values(changedValues).some(v => v !== undefined);

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
            <AttributeItemList
                attributeTypes={deviceType.attributeTypes}
                data={deviceOnTrial}
                setData={setDeviceOnTrial}
            />
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
            <SelectDeviceButton
                deviceItem={deviceItem}
                deviceType={deviceType}
            />
            <ButtonTooltip
                tooltip="Remove location"
                onClick={() => setLocationsToDevices([{ deviceTypeName, deviceItemName }], [undefined])}
            >
                <LocationOff />
            </ButtonTooltip>
            {/* <ButtonTooltip
                key='merge'
                color='primary'
                disabled={false}
                tooltip={'Add contained entity'}
                onClick={() => {
                    if (selection.length) {
                        const newContained = popTopSelection();
                        const newContainedParent = findEntityParent(newContained);
                        if (newContainedParent) {
                            disconnectEntityParent(newContainedParent, newContained)
                        }
                        setEntityProperties(deviceItem.key, [], [...containsEntities, newContained]);
                    }
                }}
            >
                <MergeType />
            </ButtonTooltip> */}
            {children}
            {/* {parentEntity === undefined ? null :
                <Fragment key={'p'}>
                    <br />
                    parent:
                    <br />
                    <ContainedEntity
                        key={'P' + deviceItem.key}
                        childEntityItemKey={parentEntity.key}
                        disconnectEntity={() => disconnectEntityParent(parentEntity, deviceItem.key)}
                    />
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