import { ExperimentObj } from '../src/objects';
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
}); 