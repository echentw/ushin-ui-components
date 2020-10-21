/*
  Copyright (C) 2020 by USHIN, Inc.

  This file is part of U4U.

  U4U is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  U4U is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with U4U.  If not, see <https://www.gnu.org/licenses/>.
*/
import { useDrag } from "react-dnd";
import { ItemTypes } from "../constants/React-Dnd";
import { getPointById, getReferencedPointId } from "../dataModels/getters";
import { AppState } from "../reducers/store";

import { useDispatch, useSelector } from "react-redux";
import { beginDrag } from "../actions/dragActions";

export const useDragPoint = (pointId: string, region: string, index: number) => {
  const point = useSelector((state: AppState) =>
    getPointById(pointId, state.points)
  );
  const isReferencedPoint = useSelector(
    (state: AppState) => !!getReferencedPointId(pointId, state.points)
  );

  const selectedPointIds = useSelector((state: AppState) => {
    const selectedPointIds = new Set(state.selectedPoints.pointIds);
    selectedPointIds.add(pointId);
    return Array.from(selectedPointIds);
  });

  const dispatch = useDispatch();

  const [{ isDragging }, drag, preview] = useDrag({
    item: {
      type: ItemTypes.POINT,
      pointId,
      shape: point.shape,
      index: index,
      originalShape: point.shape,
      isReferencedPoint,
    },
    begin: (monitor) => {
      dispatch(beginDrag({
        region: region,
        index: index,
        pointIds: selectedPointIds,
      }));
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    isDragging: (monitor) => {
      return pointId === monitor.getItem().pointId;
    },
  });
  return { isDragging, drag, preview };
};
