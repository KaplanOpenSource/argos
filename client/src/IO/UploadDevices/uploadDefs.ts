export const FIELD_UNASSIGNED = '* unassigned *';
export const FIELD_TYPE = 'type';
export const FIELD_NAME = 'name';
export const FIELD_MAPNAME = 'MapName';
export const FIELD_LATITUDE = 'Latitude';
export const FIELD_LONGITUDE = 'Longitude';
export const IGNORE_FIELDS = [FIELD_TYPE, FIELD_TYPE];
export const LOCATION_FIELDS = [FIELD_LATITUDE, FIELD_LONGITUDE, FIELD_MAPNAME];

export interface DevicesFromFile {
    type: string;
    name: string;
    attributes: any;
}