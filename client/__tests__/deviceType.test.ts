import { ExperimentObj } from '../src/objects';
import { IExperiment } from '../src/types/types';

describe('DeviceType Manipulation', () => {
  const baseExperiment: IExperiment = {
    name: 'Base Experiment',
    deviceTypes: [
      {
        name: 'TypeA',
        devices: [{ name: 'DeviceA1' }]
      }
    ],
    trialTypes: []
  };

  it('can add a device type to the experiment', () => {
    const experiment = new ExperimentObj(baseExperiment);
    const newDeviceType = {
      name: 'TypeB',
      devices: [{ name: 'DeviceB1' }]
    };
    const newDeviceTypes = [...experiment.deviceTypes.map(dt => dt), newDeviceType];
    const changed = experiment.createChange().change(experiment.deviceTypes, newDeviceTypes).apply();
    expect(changed.deviceTypes.length).toBe(2);
    expect(changed.deviceTypes[1].name).toBe('TypeB');
    expect(changed.deviceTypes[1].devices[0].name).toBe('DeviceB1');
  });
}); 