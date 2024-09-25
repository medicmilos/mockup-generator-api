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

export interface SingleRenderRes {
  export_label: string;
  export_path: string;
}

export interface SingleRenderReq {
  mockup_uuid: string;
  export_label?: string;
  smart_objects: {
    uuid: string;
    asset?: {
      file?: File;
      url?: string;
      fit?: string;
    };
    color?: string;
  }[];
}

export interface ICollection {
  uuid: string;
  name: string;
  mockup_count: number;
  created_at: string;
  created_at_timestamp: number;
  updated_at: string;
  updated_at_timestamp: number;
}

export interface IMockup {
  collections: { uuid: string; name: string }[];
  name: string;
  smart_objects: { uuid: string; name: string }[];
  thumbnail: string;
  uuid: string;
}
