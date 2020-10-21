import { Action, Actions } from "../actions/constants";
import { AppState } from "./store";

import { BeginDragParams, HoverOverParams } from "../actions/dragActions";

export interface DragState {
  context: {
    index: number;
    region: string;
    pointIds: string[];
  } | null;
}

export const initialDragState: DragState = {
  context: null,
};

export const dragReducer = (state: DragState, action: Action, appState: AppState): DragState => {
  let newState = state;
  switch (action.type) {
    case Actions.beginDrag:
      newState = handleBeginDrag(state, action as Action<BeginDragParams>);
      break
    case Actions.hoverOver:
      newState = handleHoverOver(state, action as Action<HoverOverParams>);
      break
  }

  console.log(newState);

  return newState;
};

function handleBeginDrag(state: DragState, action: Action<BeginDragParams>): DragState {
  return {
    context: action.params,
  };
}

function handleHoverOver(state: DragState, action: Action<HoverOverParams>): DragState {
  if (state.context === null) {
    return state;
  }
  return {
    context: {
      ...state.context,
      index: action.params.index,
      region: action.params.region,
    },
  };
}
