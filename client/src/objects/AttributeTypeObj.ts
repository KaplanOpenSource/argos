import { v4 as uuidv4 } from 'uuid';
import { ScopeEnumGood, scopeToScopeGood } from '../types/ScopeEnum';
import { IAttributeType, ISelectOption } from '../types/types';
import { ValueTypeEnum } from '../types/ValueTypeEnum';

export class AttributeTypeObj implements IAttributeType {
  name: string;
  type?: ValueTypeEnum;
  scope: ScopeEnumGood;
  multiple?: boolean;
  required?: boolean;
  defaultValue?: any;
  description?: string;
  options: ISelectOption[] = [];
  trackUuid: string;

  constructor(data: IAttributeType) {
    if (!data.name) {
      throw new Error('AttributeType name is required');
    }
    this.name = data.name;
    this.type = data.type;
    this.scope = scopeToScopeGood(data.scope);
    this.multiple = data.multiple;
    this.required = data.required;
    this.defaultValue = data.defaultValue;
    this.description = data.description;
    this.options = data.options || [];
    this.trackUuid = data.trackUuid || uuidv4();
  }

  toJson(includeTrackUuid: boolean = false): IAttributeType {
    const result: IAttributeType = {
      name: this.name,
      type: this.type,
      scope: this.scope,
      multiple: this.multiple,
      required: this.required,
      defaultValue: this.defaultValue,
      description: this.description
    };
    if (this.options.length > 0) {
      result.options = this.options;
    }
    if (includeTrackUuid) {
      result.trackUuid = this.trackUuid;
    }
    return result;
  }
}
