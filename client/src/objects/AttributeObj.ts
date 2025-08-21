import { v4 as uuidv4 } from 'uuid';
import { IAttribute, IAttributeType } from '../types/types';

export class AttributeObj implements IAttribute {
  value?: any;
  trackUuid: string;

  constructor(
    data: IAttribute,
    private attrType: IAttributeType,
  ) {
    this.attrType = attrType;
    this.value = data.value;
    this.trackUuid = data.trackUuid || uuidv4();
  }

  get name(): string {
    return this.attrType.name || '';
  }

  toJson(includeTrackUuid: boolean = false): IAttribute {
    const result: IAttribute = {
      name: this.name,
      value: this.value
    };
    if (includeTrackUuid) {
      result.trackUuid = this.trackUuid;
    }
    return result;
  }
}
