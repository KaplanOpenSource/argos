import { IAttribute } from '../types';

export class AttributeObj implements IAttribute {
    name: string;
    value?: any;

    constructor(data: IAttribute) {
        if (!data.name) {
            throw new Error('Attribute name is required');
        }
        this.name = data.name;
        this.value = data.value;
    }

    toJson(): IAttribute {
        return {
            name: this.name,
            value: this.value
        };
    }
}
