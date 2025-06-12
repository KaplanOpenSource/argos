export enum ValueTypeEnum {
  VALUE_TYPE_STRING = "String",
  VALUE_TYPE_NUMBER = "Number",
  VALUE_TYPE_DATE = "Date",
  VALUE_TYPE_DATE_TIME = "DateTime",
  VALUE_TYPE_BOOLEAN = "Boolean",
  VALUE_TYPE_SELECT = "Select"
}

export const valueTypes = [
  ValueTypeEnum.VALUE_TYPE_STRING,
  ValueTypeEnum.VALUE_TYPE_NUMBER,
  ValueTypeEnum.VALUE_TYPE_BOOLEAN,
  ValueTypeEnum.VALUE_TYPE_DATE,
  ValueTypeEnum.VALUE_TYPE_DATE_TIME,
  ValueTypeEnum.VALUE_TYPE_SELECT,
];

export const DEFAULT_VALUE_TYPE = ValueTypeEnum.VALUE_TYPE_STRING; 