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
    for (const attrType of this.attributeTypes) {
      if (attrType.scope === this.scope) {
        const attr = data.attributes?.find(a => a.name === attrType.name);
        if (attr) {
          this.attributes.push(new AttributeObj(attr, attrType, this));
        }
      }
    }
  }

  findAttr(attrTypeName: string): AttributeObj | undefined {
    return this.attributes.find(at => at.name === attrTypeName);
  }

  findAttrType(attrTypeName: string): AttributeTypeObj | undefined {
    return this.attributeTypes.find(at => at.name === attrTypeName);
  }

  setAttribute(attrType: AttributeTypeObj, newValue: any) {
    if (newValue == null) { // == checks undefined or null
      this.attributes = this.attributes.filter(x => x.name !== attrType.name);
    } else {
      const i = this.attributes.findIndex(x => x.name === attrType.name);
      if (i === -1) {
        this.attributes.push(new AttributeObj({ name: attrType.name, value: newValue }, attrType, this));
      } else {
        this.attributes[i].value = newValue;
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
