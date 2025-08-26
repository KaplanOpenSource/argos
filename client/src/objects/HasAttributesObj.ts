import { ScopeEnum } from '../types/ScopeEnum';
import { IHasAttributes } from '../types/types';
import { AttributeObj } from './AttributeObj';
import { AttributeTypeObj } from './AttributeTypeObj';


export class HasAttributesObj implements IHasAttributes {
  attributes: AttributeObj[] = [];

  constructor(
    data: IHasAttributes,
    public readonly attributeTypes: AttributeTypeObj[],
    public readonly scope: ScopeEnum
  ) {
    for (const attr of data.attributes || []) {
      const attrType = this.attributeTypes?.find(at => at.name === attr.name && at.scope === this.scope);
      if (attrType) {
        this.attributes.push(new AttributeObj(attr, attrType, this));
      }
    }
  }

  toJson(includeTrackUuid: boolean = false): IHasAttributes {
    const result: IHasAttributes = {};

    if (this.attributes.length > 0) {
      result.attributes = this.attributes.map(attr => attr.toJson(includeTrackUuid));
    }

    return result;
  }

}
