import { IAttributeType, ISelectOption, ScopeEnum } from '../types/types';
import { ValueTypeEnum } from '../types/ValueTypeEnum';

export class AttributeTypeObj implements IAttributeType {
  name: string;
  type?: ValueTypeEnum;
  scope?: ScopeEnum;
  multiple?: boolean;
  required?: boolean;
  defaultValue?: any;
  description?: string;
  options: ISelectOption[] = [];

  constructor(data: IAttributeType) {
    if (!data.name) {
      throw new Error('AttributeType name is required');
    }
    this.name = data.name;
    this.type = data.type;
    this.scope = data.scope;
    this.multiple = data.multiple;
    this.required = data.required;
    this.defaultValue = data.defaultValue;
    this.description = data.description;
    this.options = data.options || [];
  }

  toJson(): IAttributeType {
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
    return result;
  }
}
