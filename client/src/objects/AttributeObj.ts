import { IAttribute, IAttributeType } from '../types/types';

export class AttributeObj implements IAttribute {
  private attrType: IAttributeType;
  value?: any;

  constructor(data: IAttribute, attrType: IAttributeType) {
    if (!attrType) {
      throw new Error('Attribute type is required');
    }
    this.attrType = attrType;
    this.value = data.value;
  }

  get name(): string {
    return this.attrType.name || '';
  }

  toJson(): IAttribute {
    return {
      name: this.name,
      value: this.value
    };
  }
}
