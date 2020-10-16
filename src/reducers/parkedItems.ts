import { Action, Actions } from "../actions/constants";
import { AppState } from "./store";


export enum ParkedItemType {
  Point = 'point',
}

export interface ParkedItemI {
  id: string;
  type: ParkedItemType;
}

const item: ParkedItemI = {
  id: 'blah',
  type: ParkedItemType.Point,
};


export interface ParkedItemsState {
  items: ParkedItemI[];
}

export const initialParkedItemsState: ParkedItemsState = {
  items: [],
};

export const parkedItemsReducer = (state: ParkedItemsState, action: Action, appState: AppState): ParkedItemsState => {
  return state;
}
