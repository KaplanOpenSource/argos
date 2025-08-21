import { ExperimentObj, TrialObj } from '../src/objects';
import { IExperiment } from '../src/types/types';
import { ValueTypeEnum } from '../src/types/ValueTypeEnum';

describe('Trial Manipulation', () => {
  const baseExperiment: IExperiment = {
    name: 'Base Experiment',
    deviceTypes: [
      {
        name: 'TypeA',
        devices: [{ name: 'DeviceA1' }],
        attributeTypes: [
          { name: 'Attr1', type: 'String' as ValueTypeEnum },
          { name: 'Attr2', type: 'String' as ValueTypeEnum }
        ]
      }
    ],
    trialTypes: [
      {
        name: 'TrialTypeA',
        attributeTypes: [
          { name: 'TrialAttr', type: 'String' as ValueTypeEnum },
          { name: 'TrialAttr2', type: 'String' as ValueTypeEnum }
        ],
        trials: [
          {
            name: 'Trial1',
            devicesOnTrial: [
              {
                deviceTypeName: 'TypeA',
                deviceItemName: 'DeviceA1',
                attributes: [{ name: 'Attr1', value: 1 }]
              }
            ],
            attributes: [{ name: 'TrialAttr', value: 'val' }]
          }
        ]
      }
    ]
  };

  it('can add a trial to a trial type', () => {
    const experiment = new ExperimentObj(baseExperiment);
    const trialType = experiment.trialTypes[0];
    const newTrial = {
      name: 'Trial2',
      devicesOnTrial: [
        {
          deviceTypeName: 'TypeA',
          deviceItemName: 'DeviceA1',
          attributes: [{ name: 'Attr2', value: 2 }]
        }
      ],
      attributes: [{ name: 'TrialAttr2', value: 'val2' }]
    };
    const newTrials = [...trialType.trials.map(t => t), newTrial];
    const changed = experiment.createChange().change(trialType.trials, newTrials).apply();
    expect(changed.trialTypes[0].trials.length).toBe(2);
    expect(changed.trialTypes[0].trials[1].name).toBe('Trial2');
  });

  it('omits invalid attributes instead of throwing errors', () => {
    const experiment = new ExperimentObj(baseExperiment);
    const trialType = experiment.trialTypes[0];
    const trialWithInvalidAttr = new TrialObj({
      name: 'TrialWithInvalidAttr',
      attributes: [
        { name: 'TrialAttr', value: 'valid' },
        { name: 'InvalidAttr', value: 'invalid' }
      ]
    }, experiment.deviceTypes, trialType);
    const newTrials = [...trialType.trials, trialWithInvalidAttr];
    const changed = experiment.createChange().change(trialType.trials, newTrials).apply();
    const addedTrial = changed.trialTypes[0].trials[1];
    expect(addedTrial.attributes).toHaveLength(1);
    expect(addedTrial.attributes[0].name).toBe('TrialAttr');
    expect(addedTrial.attributes[0].value).toBe('valid');
  });

  it('omits devices with invalid device type or item names', () => {
    const experiment = new ExperimentObj(baseExperiment);
    const trialType = experiment.trialTypes[0];
    const trialWithInvalidDevices = new TrialObj({
      name: 'TrialWithInvalidDevices',
      devicesOnTrial: [
        {
          deviceTypeName: 'TypeA',
          deviceItemName: 'DeviceA1',  // valid
          attributes: [{ name: 'Attr1', value: 1 }]
        },
        {
          deviceTypeName: 'InvalidType',  // invalid type
          deviceItemName: 'DeviceA1',
          attributes: [{ name: 'Attr1', value: 2 }]
        },
        {
          deviceTypeName: 'TypeA',
          deviceItemName: 'InvalidDevice',  // invalid item
          attributes: [{ name: 'Attr1', value: 3 }]
        }
      ]
    }, experiment.deviceTypes, trialType);
    const newTrials = [...trialType.trials, trialWithInvalidDevices];
    const changed = experiment.createChange().change(trialType.trials, newTrials).apply();
    const addedTrial = changed.trialTypes[0].trials[1];
    expect(addedTrial.devicesOnTrial).toHaveLength(1);
    expect(addedTrial.devicesOnTrial[0].deviceTypeName).toBe('TypeA');
    expect(addedTrial.devicesOnTrial[0].deviceItemName).toBe('DeviceA1');
    expect(addedTrial.devicesOnTrial[0].attributes[0].value).toBe(1);
  });
}); 