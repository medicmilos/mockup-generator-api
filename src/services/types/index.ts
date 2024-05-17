export interface UnknownModel {
  [key: string]: any;
}

export interface DataModelArray<MODEL = UnknownModel | any> {
  data: MODEL[];
  message: string;
  success: boolean;
}

export interface DataModel<MODEL = UnknownModel | any> {
  data: MODEL;
  message: string;
  success: boolean;
}

export interface SmartObject {
  name: string;
  uuid: string;
}

export interface IMockup {
  name: string;
  smart_objects: SmartObject[];
  uuid: string;
  thumbnail?: string;
}
