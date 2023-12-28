export interface Material {
  channels: {
    [key: string]: MaterialChannel;
  };
  cullFace: string;
  id: string;
  name: string;
  reflection: number;
  shadeless: boolean;
  stateSetID: number;
  version: number;
}

export interface API {
  init: (token: string, options: any) => void;
  addEventListener: (event: string, callback: () => void) => void;
  setAnnotationCameraTransition: (arg0: boolean, arg1: boolean) => void;
  setAnnotationsTexture: (settings: any) => void;
  getAnnotationList: (
    callback: (error: Error, annotationlist: Annotation[]) => void,
  ) => void;
  hideAnnotation: (
    index: number,
    callback: (error: Error, index: number) => void,
  ) => void;
  getMaterialList: (
    callback: (error: Error, materiallist: Material[]) => void,
  ) => void;
  getNodeMap: (callback: { error: any; nodemap: Node[] }) => void;
  setMaterial: (material: Material, callback: () => void) => void;
  addTexture: (
    src: string,
    callback: (error: Error, uid: string) => void,
  ) => void;
  setEnableCameraConstraints: (
    arg0: boolean,
    arg1: any,
    callback: () => void,
  ) => void;
  setCameraLookAt: (
    eye: number[],
    target: number[],
    duration: number,
    callback: (error: Error) => void,
  ) => void;
  setCameraLookAtEndAnimationCallback: (callback: any) => void;
  setCameraConstraints: (settings: any, callback: any) => void;
  show: (id: number) => void;
  hide: (id: number) => void;
  setBackground: (settings: any, callback: any) => void;
  translate: (
    id: number,
    position: number[],
    settings: any,
    callback: any,
  ) => void;
  setUserInteraction: (enable: boolean) => void;
}

export interface Annotation {
  name: string;
  eye: number[];
  target: number[];
  content: {
    raw: string;
    rendered: string;
  };
}

export interface Node {
  name: string;
  type: string;
  instanceID: number;
}

export interface Texture {
  uid: string;
  internalFormat: string;
  magFilter: string;
  minFilter: string;
  wrapS: string;
  wrapT: string;
  textureTarget: string;
  texCoordUnit: number;
}

export interface MaterialChannel {
  enable: boolean;
  factor: number;
  texture?: any;
  textureuid?: string;
  textureurl?: string;
  color?: number[];
  tint?: number[];
  refractionColor?: number[];
  UVTransforms?: any;
  [key: string]: any;
}
