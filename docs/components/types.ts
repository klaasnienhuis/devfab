export interface Material {
  name: string;
  channels: {
    AlbedoPBR: {
      color: number[];
    };
  };
}

export interface API {
  init: (token: string, options: any) => void;
  addEventListener: (event: string, callback: any) => void;
  setAnnotationCameraTransition: (arg0: boolean, arg1: boolean) => void;
  setAnnotationsTexture: (settings: any) => void;
  getAnnotationList: (callback: any) => void;
  getMaterialList: (callback: any) => void;
  getNodeMap: (callback: { error: any; nodemap: Node[] }) => void;
  setMaterial: (material: Material) => void;
  addTexture: (settings: any, callback: any) => void;
  setEnableCameraConstraints: (arg0: boolean, arg1: any) => void;
  setCameraLookAt: (
    eye: number[],
    target: number[],
    duration: number,
    callback: any,
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
}

export interface Annotation {
  eye: number[];
  target: number[];
}

export interface Node {
  name: string;
  type: string;
  instanceID: number;
}
