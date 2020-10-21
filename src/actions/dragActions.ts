import { Action, Actions } from "./constants";

export interface HoverOverParams {
  index: number;
  region: string;
}

export const hoverOver = (params: HoverOverParams): Action<HoverOverParams> => {
  return {
    type: Actions.hoverOver,
    params,
  };
};

export interface BeginDragParams {
  index: number;
  region: string;
  pointIds: string[];
}

export const beginDrag = (params: BeginDragParams): Action<BeginDragParams> => {
  return {
    type: Actions.beginDrag,
    params,
  };
};
