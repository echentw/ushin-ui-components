import { Action, Actions } from "../actions/constants";
import produce from "immer";
import { PointI, PointReferenceI } from "../dataModels/dataModels";
import { getPointById, getReferencedPointId } from "../dataModels/getters";
import { AppState } from "./store";
import {
  _PointCreateParams,
  PointUpdateParams,
  PointMoveParams,
  PointsDeleteParams,
  CombinePointsParams,
  _SplitIntoTwoPointsParams,
} from "../actions/pointsActions";
import { SetFocusParams } from "../actions/messageActions";

export interface PointsState {
  byId: {
    [_id: string]: PointI | PointReferenceI;
  };
}

export const initialPointsState: PointsState = { byId: {} };

export const pointsReducer = (
  state: PointsState,
  action: Action,
  appState: AppState
): PointsState => {
  let newState = state;
  switch (action.type) {
    case Actions.pointCreate:
      newState = handlePointCreate(state, action as Action<_PointCreateParams>);
      break;
    case Actions.pointUpdate:
      newState = handlePointUpdate(state, action as Action<PointUpdateParams>);
      break;
    case Actions.pointMove:
      newState = handlePointMove(state, action as Action<PointMoveParams>);
      break;
    case Actions.pointsDelete:
      newState = handlePointsDelete(
        state,
        action as Action<PointsDeleteParams>
      );
      break;
    case Actions.combinePoints:
      newState = handleCombinePoints(
        state,
        action as Action<CombinePointsParams>,
        appState
      );
      break;
    case Actions.splitIntoTwoPoints:
      newState = handleSplitIntoTwoPoints(
        state,
        action as Action<_SplitIntoTwoPointsParams>
      );
      break;
    case Actions.setFocus:
      newState = handleSetFocus(state, action as Action<SetFocusParams>);
      break;
  }
  return newState;
};

function handlePointCreate(
  state: PointsState,
  action: Action<_PointCreateParams>
): PointsState {
  return produce(state, (draft) => {
    draft.byId[action.params.newPointId] = {
      ...action.params.point,
      _id: action.params.newPointId,
      pointDate: new Date(),
    };
  });
}

function handlePointUpdate(
  state: PointsState,
  action: Action<PointUpdateParams>
): PointsState {
  return produce(state, (draft) => {
    draft.byId[action.params.point._id] = action.params.point;
  });
}

function handlePointMove(
  state: PointsState,
  action: Action<PointMoveParams>
): PointsState {
  if (
    getPointById(action.params.pointId, state).shape === action.params.newShape
  )
    return state;
  return produce(state, (draft) => {
    draft.byId[action.params.pointId] = {
      ...state.byId[action.params.pointId],
      shape: action.params.newShape,
    };
  });
}

function handlePointsDelete(
  state: PointsState,
  action: Action<PointsDeleteParams>
): PointsState {
  return produce(state, (draft) => {
    action.params.pointIds.forEach((id) => delete draft.byId[id]);
  });
}

//TODO: reuse withinBounds and isQuoted logic in src/reducers/message
//Is it good form to access appState in src/actions/pointsActions?
//note: in src/reducers/message, state must be replaced with
//appState.points (and a similar change in this file)
function handleCombinePoints(
  state: PointsState,
  action: Action<CombinePointsParams>,
  appState: AppState
): PointsState {
  const withinBounds = (index: number): boolean => {
    return (
      index >= 0 && index < appState.message.shapes[action.params.shape].length
    );
  };

  const isQuoted = (index: number): boolean => {
    const pointId = appState.message.shapes[action.params.shape][index];
    return !!getReferencedPointId(pointId, state);
  };

  // Don't attempt to combine a point with the point below it if no point
  // exists below it.
  if (
    !withinBounds(action.params.keepIndex) ||
    !withinBounds(action.params.deleteIndex)
  ) {
    return state;
  }

  // Don't combine points with quoted points:
  if (
    isQuoted(action.params.keepIndex) ||
    isQuoted(action.params.deleteIndex)
  ) {
    return state;
  }

  const pointIdToKeep =
    appState.message.shapes[action.params.shape][action.params.keepIndex];
  const pointIdToDelete =
    appState.message.shapes[action.params.shape][action.params.deleteIndex];

  const newContent =
    action.params.keepIndex < action.params.deleteIndex
      ? getPointById(pointIdToKeep, state).content +
        getPointById(pointIdToDelete, state).content
      : getPointById(pointIdToDelete, state).content +
        getPointById(pointIdToKeep, state).content;
  return produce(state, (draft) => {
    delete draft.byId[pointIdToDelete];
    getPointById(pointIdToKeep, draft).content = newContent;
  });
}

function handleSplitIntoTwoPoints(
  state: PointsState,
  action: Action<_SplitIntoTwoPointsParams>
): PointsState {
  const topContent = getPointById(action.params.pointId, state).content.slice(
    0,
    action.params.sliceIndex
  );
  const bottomContent = getPointById(
    action.params.pointId,
    state
  ).content.slice(action.params.sliceIndex);

  return produce(state, (draft) => {
    getPointById(action.params.pointId, draft).content = topContent;
    draft.byId[action.params.newPointId] = {
      content: bottomContent,
      _id: action.params.newPointId,
      shape: getPointById(action.params.pointId, draft).shape,
      pointDate: new Date(),
    };
  });
}

function handleSetFocus(
  state: PointsState,
  action: Action<SetFocusParams>
): PointsState {
  return produce(state, (draft) => {
    //Ensures that points retain their original shape when set to
    //focus even if they've been dragged through another region
    getPointById(action.params.pointId, draft).shape =
      action.params.originalShape;
  });
}
