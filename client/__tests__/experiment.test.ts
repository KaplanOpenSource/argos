import * as fs from 'fs';
import { ExperimentObj, LocationObj } from '../src/objects';
import { IExperiment } from '../src/types/types';
import { ValueTypeEnum } from '../src/types/ValueTypeEnum';

// Mock fs module
jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('Experiment Tests', () => {
  const fullMockExperiment: IExperiment = {
    version: '1.2.3',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    description: 'A full experiment',
    name: 'Full Experiment',
    imageEmbedded: [
      {
        name: 'EmbeddedImg',
        filename: 'embed.png',
        height: 100,
        width: 200,
        gridDelta: 1,
        latsouth: 1,
        lngwest: 2,
        latnorth: 3,
        lngeast: 4
      }
    ],
    imageStandalone: [
      {
        name: 'StandaloneImg',
        filename: 'stand.png',
        height: 50,
        width: 60,
        gridDelta: 2,
        xleft: 1,
        ybottom: 2,
        xright: 3,
        ytop: 4
      }
    ],
    deviceTypes: [
      {
        name: 'TypeA',
        devices: [
          { name: 'DeviceA1' },
          { name: 'DeviceA2' }
        ],
        attributeTypes: [
          { name: 'Attr1', type: 'String' as ValueTypeEnum }
        ]
      }
    ],
    trialTypes: [
      {
        name: 'TrialTypeA',
        attributeTypes: [
          { name: 'TrialAttr', type: 'String' as ValueTypeEnum }
        ],
        trials: [
          {
            name: 'Trial1',
            devicesOnTrial: [
              {
                deviceTypeName: 'TypeA',
                deviceItemName: 'DeviceA1',
                location: { name: 'Loc1', coordinates: [1, 2] },
                attributes: [{ name: 'Attr1', value: 42 }]
              }
            ],
            attributes: [{ name: 'TrialAttr', value: 'val' }]
          }
        ]
      }
    ],
    shapes: [
      {
        name: 'Shape1',
        coordinates: [[1, 2], [3, 4]],
        center: [2, 3],
        radius: 5
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedFs.readFileSync.mockReturnValue(JSON.stringify(fullMockExperiment));
  });

  test('constructs with all fields', () => {
    const experiment = new ExperimentObj(fullMockExperiment);
    expect(experiment.version).toBe('1.2.3');
    expect(experiment.startDate).toBe('2024-01-01');
    expect(experiment.endDate).toBe('2024-12-31');
    expect(experiment.description).toBe('A full experiment');
    expect(experiment.name).toBe('Full Experiment');
    expect(experiment.imageEmbedded.length).toBe(1);
    expect(experiment.imageStandalone.length).toBe(1);
    expect(experiment.deviceTypes.length).toBe(1);
    expect(experiment.trialTypes.length).toBe(1);
    expect(experiment.shapes.length).toBe(1);
  });

  test('constructs with missing/empty fields', () => {
    const minimal: IExperiment = { name: 'Minimal' };
    const experiment = new ExperimentObj(minimal);
    expect(experiment.name).toBe('Minimal');
    expect(experiment.imageEmbedded.length).toBe(0);
    expect(experiment.imageStandalone.length).toBe(0);
    expect(experiment.deviceTypes.length).toBe(0);
    expect(experiment.trialTypes.length).toBe(0);
    expect(experiment.shapes.length).toBe(0);
  });

  test('getTrialTypeCount, getTrialCount, getDeviceCount', () => {
    const experiment = new ExperimentObj(fullMockExperiment);
    expect(experiment.getTrialTypeCount()).toBe(1);
    expect(experiment.getTrialCount()).toBe(1);
    expect(experiment.getDeviceCount()).toBe(2);
  });

  test('toJson serializes all fields', () => {
    const experiment = new ExperimentObj(fullMockExperiment);
    const json = experiment.toJson();
    expect(json).toMatchObject(fullMockExperiment);
  });

  test('serialization/deserialization roundtrip', () => {
    const experiment = new ExperimentObj(fullMockExperiment);
    const json = experiment.toJson();
    const roundtrip = new ExperimentObj(json);
    expect(roundtrip).toBeInstanceOf(ExperimentObj);
    expect(roundtrip.name).toBe(experiment.name);
    expect(roundtrip.getTrialTypeCount()).toBe(experiment.getTrialTypeCount());
    expect(roundtrip.getTrialCount()).toBe(experiment.getTrialCount());
    expect(roundtrip.getDeviceCount()).toBe(experiment.getDeviceCount());
  });

  test('createChange produces a modified clone and keeps original unchanged', () => {
    const experiment = new ExperimentObj(fullMockExperiment);
    const oldLocation = experiment.trialTypes[0].trials[0].devicesOnTrial[0].location;
    expect(oldLocation).toBeDefined();
    if (!oldLocation) throw new Error('oldLocation should be defined');
    const newLocation = new LocationObj({ name: 'ChangedLoc', coordinates: [9, 9] });
    const changed = experiment.createChange().change(oldLocation, newLocation).apply();
    expect(changed.trialTypes[0].trials[0].devicesOnTrial[0].location?.name).toBe('ChangedLoc');
    // Original remains unchanged
    expect(experiment.trialTypes[0].trials[0].devicesOnTrial[0].location?.name).toBe('Loc1');
  });

  test('throws if name is missing', () => {
    expect(() => new ExperimentObj({} as any)).toThrow('Experiment name is required');
  });
}); 