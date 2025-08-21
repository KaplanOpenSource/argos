export enum ValueTypeEnum {
  VALUE_TYPE_STRING = "String",
  VALUE_TYPE_NUMBER = "Number",
  VALUE_TYPE_DATE = "Date",
  VALUE_TYPE_DATE_TIME = "DateTime",
  VALUE_TYPE_BOOLEAN = "Boolean",
  VALUE_TYPE_SELECT = "Select"
}

export const valueTypes = Object.values(ValueTypeEnum);
export const VALUE_TYPE_DEFAULT = ValueTypeEnum.VALUE_TYPE_STRING; 