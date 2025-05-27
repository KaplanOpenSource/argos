import { ExperimentObj } from '../src/objects';
import { IExperiment } from '../src/types/types';

describe('TrialType Manipulation', () => {
  const baseExperiment: IExperiment = {
    name: 'Base Experiment',
    deviceTypes: [
      {
        name: 'TypeA',
        devices: [{ name: 'DeviceA1' }]
      }
    ],
    trialTypes: [
      {
        name: 'TrialTypeA',
        trials: []
      }
    ]
  };

  it('can add a trial type to the experiment', () => {
    const experiment = new ExperimentObj(baseExperiment);
    const newTrialType = {
      name: 'TrialTypeB',
      trials: []
    };
    const newTrialTypes = [...experiment.trialTypes.map(tt => tt), newTrialType];
    const changed = experiment.createChange().change(experiment.trialTypes, newTrialTypes).apply();
    expect(changed.trialTypes.length).toBe(2);
    expect(changed.trialTypes[1].name).toBe('TrialTypeB');
  });
}); 