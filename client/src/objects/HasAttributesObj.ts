import { ScopeEnum, ScopeEnumGood, scopeToScopeGood } from '../types/ScopeEnum';
import { IHasAttributes } from '../types/types';
import { AttributeObj } from './AttributeObj';
import { AttributeTypeObj } from './AttributeTypeObj';


export class HasAttributesObj implements IHasAttributes {
  attributes: AttributeObj[] = [];
  public readonly scope: ScopeEnumGood;

  constructor(
    data: IHasAttributes,
    public readonly attributeTypes: AttributeTypeObj[],
    scopeRaw: ScopeEnum,
  ) {
    this.scope = scopeToScopeGood(scopeRaw);
    for (const attr of data.attributes || []) {
      const attrType = this.attributeTypes.find(at => at.name === attr.name && at.scope === this.scope);
      if (attrType) {
        this.attributes.push(new AttributeObj(attr, attrType, this));
      }
    }
  }

  findAttr(attrTypeName: string): AttributeObj | undefined {
    return this.attributes.find(at => at.name === attrTypeName);
  }

  findAttrType(attrTypeName: string): AttributeTypeObj | undefined {
    return this.attributeTypes.find(at => at.name === attrTypeName);
  }

  toJson(includeTrackUuid: boolean = false): IHasAttributes {
    const result: IHasAttributes = {};

    if (this.attributes.length > 0) {
      result.attributes = this.attributes.map(attr => attr.toJson(includeTrackUuid));
    }

    return result;
  }

}
