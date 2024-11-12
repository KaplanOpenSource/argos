export const IGNORE_FIELDS = ['type', 'name'];
export const ATTR_UNASSIGNED = '* unassigned *';

export interface DevicesFromFile {
    type: string;
    name: string;
    MapName: string;
    Latitude: string;
    Longitude: string;
    attributes: any;
}
