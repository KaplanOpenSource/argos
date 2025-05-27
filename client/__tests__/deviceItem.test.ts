import { AttributeTypeObj, DeviceItemObj, DeviceTypeObj } from '../src/objects';
import { IDevice } from '../src/types/types';
import { ValueTypeEnum } from '../src/types/ValueTypeEnum';

describe('DeviceItemObj', () => {
  const mockDeviceType = new DeviceTypeObj({
    name: 'TestDeviceType',
    attributeTypes: [
      new AttributeTypeObj({
        name: 'color',
        type: ValueTypeEnum.VALUE_TYPE_STRING,
        required: true
      }),
      new AttributeTypeObj({
        name: 'size',
        type: ValueTypeEnum.VALUE_TYPE_NUMBER,
        required: false
      })
    ]
  });

  it('should create a device with required name', () => {
    const deviceData: IDevice = {
      name: 'TestDevice'
    };
    const device = new DeviceItemObj(deviceData, mockDeviceType);
    expect(device.name).toBe('TestDevice');
    expect(device.deviceType).toBe(mockDeviceType);
    expect(device.attributes).toEqual([]);
  });

  it('should throw error when name is missing', () => {
    const deviceData: IDevice = {
      name: ''
    };
    expect(() => new DeviceItemObj(deviceData, mockDeviceType)).toThrow('Device name is required');
  });

  it('should create device with valid attributes', () => {
    const deviceData: IDevice = {
      name: 'TestDevice',
      attributes: [
        { name: 'color', value: 'red' },
        { name: 'size', value: 10 }
      ]
    };
    const device = new DeviceItemObj(deviceData, mockDeviceType);
    expect(device.attributes).toHaveLength(2);
    expect(device.attributes[0].name).toBe('color');
    expect(device.attributes[0].value).toBe('red');
    expect(device.attributes[1].name).toBe('size');
    expect(device.attributes[1].value).toBe(10);
  });

  it('should throw error when attribute type is not found', () => {
    const deviceData: IDevice = {
      name: 'TestDevice',
      attributes: [
        { name: 'invalidAttr', value: 'test' }
      ]
    };
    expect(() => new DeviceItemObj(deviceData, mockDeviceType))
      .toThrow('Attribute type invalidAttr not found in device type TestDeviceType');
  });

  it('should convert to JSON correctly', () => {
    const deviceData: IDevice = {
      name: 'TestDevice',
      attributes: [
        { name: 'color', value: 'red' }
      ]
    };
    const device = new DeviceItemObj(deviceData, mockDeviceType);
    const json = device.toJson();
    expect(json).toEqual({
      name: 'TestDevice',
      attributes: [
        { name: 'color', value: 'red' }
      ]
    });
  });

  it('should convert to JSON without attributes when empty', () => {
    const deviceData: IDevice = {
      name: 'TestDevice'
    };
    const device = new DeviceItemObj(deviceData, mockDeviceType);
    const json = device.toJson();
    expect(json).toEqual({
      name: 'TestDevice'
    });
  });
}); 