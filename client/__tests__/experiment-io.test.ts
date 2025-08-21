import * as fs from 'fs';
import * as path from 'path';
import { ExperimentObj, LocationObj } from '../src/objects';
import { IExperiment } from '../src/types/types';

describe('Experiment I/O Tests', () => {
  test('reads exp.json, makes changes, and verifies changes', () => {
    const expPath = path.join(process.cwd(), '__tests__', 'exp.json');
    const expContent = fs.readFileSync(expPath, 'utf-8');
    const expData = JSON.parse(expContent) as IExperiment;
    const experiment = new ExperimentObj(expData);

    // Verify initial state
    expect(experiment.name).toBe('New Experiment');
    expect(experiment.version).toBe('3.0.0');
    expect(experiment.trialTypes.length).toBeGreaterThan(0);
    expect(experiment.trialTypes[0].trials.length).toBeGreaterThan(0);
    expect(experiment.trialTypes[0].trials[0].devicesOnTrial.length).toBeGreaterThan(0);

    // Change experiment name
    const newName = 'Updated Experiment';
    const changedName = experiment.createChange().change(experiment, new ExperimentObj({ ...experiment.toJson(), name: newName })).apply();
    expect(changedName.name).toBe(newName);

    // Change a device's location
    const oldLocation = experiment.trialTypes[0].trials[0].devicesOnTrial[0].location;
    expect(oldLocation).toBeDefined();
    if (!oldLocation) throw new Error('oldLocation should be defined');
    const newLocation = new LocationObj({ name: 'NewLoc', coordinates: [10, 10] });
    const changedLoc = experiment.createChange().change(oldLocation, newLocation).apply();
    expect(changedLoc.trialTypes[0].trials[0].devicesOnTrial[0].location?.name).toBe('NewLoc');

    // Change a trial's attribute
    const oldAttr = experiment.trialTypes[0].trials[0].attributes?.[0];
    if (oldAttr) {
      const changedAttr = experiment.createChange().change(oldAttr.value, 'newVal').apply();
      expect(changedAttr.trialTypes[0].trials[0].attributes?.[0].value).toBe('newVal');
    }
  });
}); 