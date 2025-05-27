import { ExperimentObj } from '../src/objects';
import { IExperiment } from '../src/types/types';

describe('Device Manipulation', () => {
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

  it('can add a device to a device type', () => {
    const experiment = new ExperimentObj(baseExperiment);
    const deviceType = experiment.deviceTypes[0];
    const newDevice = { name: 'DeviceA2' };
    const newDevices = [...deviceType.devices.map(d => d), newDevice];
    const changed = experiment.createChange().change(deviceType.devices, newDevices).apply();
    expect(changed.deviceTypes[0].devices.length).toBe(2);
    expect(changed.deviceTypes[0].devices[1].name).toBe('DeviceA2');
  });
}); 