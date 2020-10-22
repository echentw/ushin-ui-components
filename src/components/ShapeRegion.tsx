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

import React from "react";
import Point from "./Point";
import NewPointButton from "./NewPointButton";
import StyledRegion from "./StyledRegion";
import RegionHeader from "./RegionHeader";
import { AuthorI, PointShape } from "../dataModels/dataModels";
import { useDrop } from "react-dnd";
import { ItemTypes, DraggablePointType } from "../constants/React-Dnd";
import styled from "styled-components";

import { connect } from "react-redux";
import { AppState } from "../reducers/store";
import {
  pointCreate,
  PointCreateParams,
  pointsMove,
  PointsMoveParams,
} from "../actions/pointsActions";
import {
  setExpandedRegion,
  ExpandedRegionParams,
} from "../actions/expandedRegionActions";
import {
  setSelectedPoints,
  SetSelectedPointsParams,
  togglePoint,
  TogglePointParams,
} from "../actions/selectPointActions";
import { hoverOver, HoverOverParams } from "../actions/dragActions";

const hoverLine = () => <div>hovering here</div>;

const listItem = (args: {
  id: string;
  pointIndex: number;
  hoverIndex?: number;
  clickHandler: () => void;
  readOnlyOverride: boolean;
  isSelected: boolean;
  darkMode?: boolean;
}) => {
  {
    args.hoverIndex && hoverLine();
  }
  <Point
    key={args.id}
    pointId={args.id}
    index={args.pointIndex}
    onClick={args.clickHandler}
    readOnlyOverride={args.readOnlyOverride}
    isSelected={args.isSelected}
    darkMode={args.darkMode}
  />;
};

interface OwnProps {
  shape: PointShape;
  isExpanded: "expanded" | "minimized" | "balanced";
  readOnlyOverride: boolean;
  darkMode?: boolean;
}

interface AllProps extends OwnProps {
  author: AuthorI;
  pointIds: string[];
  pointCreate: (params: PointCreateParams) => void;
  pointsMove: (params: PointsMoveParams) => void;
  setExpandedRegion: (params: ExpandedRegionParams) => void;
  selectedPoints: string[];
  togglePoint: (params: TogglePointParams) => void;
  setSelectedPoints: (params: SetSelectedPointsParams) => void;
  hoverIndex?: number;
  hoverOver: (params: HoverOverParams) => void;
}

const ShapeRegion = (props: AllProps) => {
  const { shape, pointIds } = props;

  const [, drop] = useDrop({
    accept: ItemTypes.POINT,
    hover: (item: DraggablePointType) => {
      if (item.isReferencedPoint && item.shape !== shape) return;
      if (props.isExpanded !== "expanded") {
        props.setExpandedRegion({ region: shape });
      }

      const newIndex = pointIds.length;

      //Point wasn't already at the bottom of this region
      if (item.shape !== shape || item.index !== pointIds.length) {
        props.hoverOver({
          region: shape,
          index: newIndex,
        });

        item.index = newIndex;
        item.shape = shape;
      }
    },
  });

  const [, expandRef] = useDrop({
    accept: ItemTypes.POINT,
    hover: () => {
      if (props.isExpanded !== "expanded") {
        props.setExpandedRegion({ region: shape });
      }
    },
  });

  const createEmptyPoint = () => {
    props.pointCreate({
      point: {
        author: props.author,
        content: "",
        shape,
      },
      index: pointIds.length,
    });
  };

  const onClickRemainingSpace = () => {
    if (props.isExpanded !== "expanded" && !props.readOnlyOverride) {
      createEmptyPoint();
    }
  };

  //TODO: this logic is duplicated in FocusPoint.tsx. Move into a hook?
  const handlePointClick = (pointId: string) => (e: React.MouseEvent) => {
    if (props.isExpanded === "expanded") {
      e.stopPropagation();
    }
    if (e.ctrlKey || e.metaKey) {
      props.togglePoint({ pointId });
    } else {
      props.setSelectedPoints({ pointIds: [] });
    }
  };
  //props.selectedPoints.includes(id)}
  //handlePointClick(id)}
  //pointIds.findIndex((pId) => pId === id)}

  return (
    <StyledRegion
      borderColor={props.author.color}
      onClick={() => props.setExpandedRegion({ region: shape })}
      ref={expandRef}
    >
      <div>
        {pointIds.map((id, i) => {
          listItem({
            id,
            pointIndex: i,
            hoverIndex: props.hoverIndex,
            clickHandler: () => handlePointClick(id),
            readOnlyOverride: props.readOnlyOverride,
            isSelected: props.selectedPoints.includes(id),
            darkMode: props.darkMode,
          });
        })}
        <RegionHeader shape={shape} darkMode={props.darkMode} />
        {props.isExpanded === "expanded" && !props.readOnlyOverride && (
          <NewPointButton
            shape={shape}
            onClick={createEmptyPoint}
            darkMode={props.darkMode}
          />
        )}
        <DropTargetDiv
          ref={drop}
          isExpanded={props.isExpanded}
          onClick={onClickRemainingSpace}
        />
      </div>
    </StyledRegion>
  );
};

interface DropTargetDivProps {
  isExpanded: "expanded" | "minimized" | "balanced";
}

const DropTargetDiv = styled.div<DropTargetDivProps>`
  min-height: ${(props) => (props.isExpanded ? "50px" : 0)};
  height: 100%;
`;

const mapStateToProps = (state: AppState, ownProps: OwnProps) => {
  let hoverIndex;
  if (state.drag.context && state.drag.context.region === ownProps.shape)
    hoverIndex = state.drag.context.index;
  return {
    author: state.authors.byId[state.message.author],
    pointIds: state.message.shapes[ownProps.shape],
    selectedPoints: state.selectedPoints.pointIds,
    hoverIndex,
  };
};

const mapDispatchToProps = {
  pointCreate,
  pointsMove,
  setExpandedRegion,
  togglePoint,
  setSelectedPoints,
  hoverOver,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShapeRegion);
