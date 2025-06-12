import { AttributeObj } from '../src/objects/AttributeObj';
import { AttributeTypeObj } from '../src/objects/AttributeTypeObj';
import { DeviceItemObj } from '../src/objects/DeviceItemObj';
import { DeviceOnTrialObj } from '../src/objects/DeviceOnTrialObj';
import { DeviceTypeObj } from '../src/objects/DeviceTypeObj';
import { ExperimentObj } from '../src/objects/ExperimentObj';
import { ImageEmbeddedObj } from '../src/objects/ImageEmbeddedObj';
import { ImageStandaloneObj } from '../src/objects/ImageStandaloneObj';
import { ShapeObj } from '../src/objects/ShapeObj';
import { TrialObj } from '../src/objects/TrialObj';
import { TrialTypeObj } from '../src/objects/TrialTypeObj';
import { IAttribute, IAttributeType, IDevice, IDeviceOnTrial, IDeviceType, IExperiment, IImageEmbedded, IImageStandalone, IShape, ITrial, ITrialType } from '../src/types/types';

describe('trackUuid functionality', () => {
  const testUuid = 'test-uuid-123';
  const testName = 'test-name';

  describe('AttributeObj', () => {
    it('should preserve existing trackUuid', () => {
      const attrType: IAttributeType = { name: 'test' };
      const data: IAttribute = { name: 'test', trackUuid: testUuid };
      const attr = new AttributeObj(data, attrType);
      expect(attr.trackUuid).toBe(testUuid);
    });

    it('should generate new trackUuid if not provided', () => {
      const attrType: IAttributeType = { name: 'test' };
      const data: IAttribute = { name: 'test' };
      const attr = new AttributeObj(data, attrType);
      expect(attr.trackUuid).toBeDefined();
      expect(attr.trackUuid).not.toBe(testUuid);
    });
  });

  describe('ShapeObj', () => {
    it('should preserve existing trackUuid', () => {
      const data: IShape = { name: testName, trackUuid: testUuid };
      const shape = new ShapeObj(data);
      expect(shape.trackUuid).toBe(testUuid);
    });

    it('should generate new trackUuid if not provided', () => {
      const data: IShape = { name: testName };
      const shape = new ShapeObj(data);
      expect(shape.trackUuid).toBeDefined();
      expect(shape.trackUuid).not.toBe(testUuid);
    });
  });

  describe('ImageEmbeddedObj', () => {
    it('should preserve existing trackUuid', () => {
      const data: IImageEmbedded = { name: testName, trackUuid: testUuid };
      const image = new ImageEmbeddedObj(data);
      expect(image.trackUuid).toBe(testUuid);
    });

    it('should generate new trackUuid if not provided', () => {
      const data: IImageEmbedded = { name: testName };
      const image = new ImageEmbeddedObj(data);
      expect(image.trackUuid).toBeDefined();
      expect(image.trackUuid).not.toBe(testUuid);
    });
  });

  describe('ImageStandaloneObj', () => {
    it('should preserve existing trackUuid', () => {
      const data: IImageStandalone = { name: testName, trackUuid: testUuid };
      const image = new ImageStandaloneObj(data);
      expect(image.trackUuid).toBe(testUuid);
    });

    it('should generate new trackUuid if not provided', () => {
      const data: IImageStandalone = { name: testName };
      const image = new ImageStandaloneObj(data);
      expect(image.trackUuid).toBeDefined();
      expect(image.trackUuid).not.toBe(testUuid);
    });
  });

  describe('DeviceTypeObj', () => {
    it('should preserve existing trackUuid', () => {
      const data: IDeviceType = { name: testName, trackUuid: testUuid };
      const deviceType = new DeviceTypeObj(data);
      expect(deviceType.trackUuid).toBe(testUuid);
    });

    it('should generate new trackUuid if not provided', () => {
      const data: IDeviceType = { name: testName };
      const deviceType = new DeviceTypeObj(data);
      expect(deviceType.trackUuid).toBeDefined();
      expect(deviceType.trackUuid).not.toBe(testUuid);
    });
  });

  describe('DeviceItemObj', () => {
    it('should preserve existing trackUuid', () => {
      const deviceType = new DeviceTypeObj({ name: 'parent' });
      const data: IDevice = { name: testName, trackUuid: testUuid };
      const deviceItem = new DeviceItemObj(data, deviceType);
      expect(deviceItem.trackUuid).toBe(testUuid);
    });

    it('should generate new trackUuid if not provided', () => {
      const deviceType = new DeviceTypeObj({ name: 'parent' });
      const data: IDevice = { name: testName };
      const deviceItem = new DeviceItemObj(data, deviceType);
      expect(deviceItem.trackUuid).toBeDefined();
      expect(deviceItem.trackUuid).not.toBe(testUuid);
    });
  });

  describe('AttributeTypeObj', () => {
    it('should preserve existing trackUuid', () => {
      const data: IAttributeType = { name: testName, trackUuid: testUuid };
      const attrType = new AttributeTypeObj(data);
      expect(attrType.trackUuid).toBe(testUuid);
    });

    it('should generate new trackUuid if not provided', () => {
      const data: IAttributeType = { name: testName };
      const attrType = new AttributeTypeObj(data);
      expect(attrType.trackUuid).toBeDefined();
      expect(attrType.trackUuid).not.toBe(testUuid);
    });
  });

  describe('ExperimentObj', () => {
    it('should preserve existing trackUuid', () => {
      const data: IExperiment = { name: testName, trackUuid: testUuid };
      const experiment = new ExperimentObj(data);
      expect(experiment.trackUuid).toBe(testUuid);
    });

    it('should generate new trackUuid if not provided', () => {
      const data: IExperiment = { name: testName };
      const experiment = new ExperimentObj(data);
      expect(experiment.trackUuid).toBeDefined();
      expect(experiment.trackUuid).not.toBe(testUuid);
    });
  });

  describe('TrialTypeObj', () => {
    it('should preserve existing trackUuid', () => {
      const data: ITrialType = { name: testName, trackUuid: testUuid };
      const trialType = new TrialTypeObj(data, []);
      expect(trialType.trackUuid).toBe(testUuid);
    });

    it('should generate new trackUuid if not provided', () => {
      const data: ITrialType = { name: testName };
      const trialType = new TrialTypeObj(data, []);
      expect(trialType.trackUuid).toBeDefined();
      expect(trialType.trackUuid).not.toBe(testUuid);
    });
  });

  describe('TrialObj', () => {
    it('should preserve existing trackUuid', () => {
      const data: ITrial = { name: testName, trackUuid: testUuid };
      const trialType = new TrialTypeObj({ name: 'parent' }, []);
      const trial = new TrialObj(data, [], trialType);
      expect(trial.trackUuid).toBe(testUuid);
    });

    it('should generate new trackUuid if not provided', () => {
      const data: ITrial = { name: testName };
      const trialType = new TrialTypeObj({ name: 'parent' }, []);
      const trial = new TrialObj(data, [], trialType);
      expect(trial.trackUuid).toBeDefined();
      expect(trial.trackUuid).not.toBe(testUuid);
    });
  });

  describe('DeviceOnTrialObj', () => {
    it('should preserve existing trackUuid', () => {
      const deviceType = new DeviceTypeObj({ name: 'parent' });
      const deviceItem = new DeviceItemObj({ name: 'item' }, deviceType);
      const trial = new TrialObj({ name: 'trial' }, [], { name: 'trialType' });
      const data: IDeviceOnTrial = {
        deviceTypeName: 'parent',
        deviceItemName: 'item',
        trackUuid: testUuid
      };
      const deviceOnTrial = new DeviceOnTrialObj(data, deviceItem, trial);
      expect(deviceOnTrial.trackUuid).toBe(testUuid);
    });

    it('should generate new trackUuid if not provided', () => {
      const deviceType = new DeviceTypeObj({ name: 'parent' });
      const deviceItem = new DeviceItemObj({ name: 'item' }, deviceType);
      const trial = new TrialObj({ name: 'trial' }, [], { name: 'trialType' });
      const data: IDeviceOnTrial = {
        deviceTypeName: 'parent',
        deviceItemName: 'item'
      };
      const deviceOnTrial = new DeviceOnTrialObj(data, deviceItem, trial);
      expect(deviceOnTrial.trackUuid).toBeDefined();
      expect(deviceOnTrial.trackUuid).not.toBe(testUuid);
    });
  });

  describe('toJson behavior', () => {
    it('should not include trackUuid in JSON output', () => {
      // Test with AttributeObj as an example
      const attrType: IAttributeType = { name: 'test' };
      const data: IAttribute = { name: 'test', trackUuid: testUuid };
      const attr = new AttributeObj(data, attrType);
      const json = attr.toJson();
      expect(json.trackUuid).toBeUndefined();
    });
  });
}); 