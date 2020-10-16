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
import styled from "styled-components";

import { connect } from "react-redux";
import { AppState } from "../reducers/store";

import { ParkedItemI } from "../reducers/parkedItems";
import Point from "./Point";

const ParkingSpace = (props: {
  darkMode: boolean,
  items: ParkedItemI[],
  selectedPoints: string[];
}) => {

  const pointElements = props.items.map((item: ParkedItemI, index: number) => {
    return (
      <Point
        key={item.id}
        pointId={item.id}
        index={index}
        // TODO: readOnlyOverride
        readOnly={false}
        // we won't need this very soon
        isExpanded={"expanded"}
        // TODO: move this into mapStateToProps for point
        isSelected={props.selectedPoints.includes(item.id)}
        darkMode={props.darkMode}
      />
    );
  });

  return (
    <StyledParkingSpace darkMode={props.darkMode}>
      { pointElements }
    </StyledParkingSpace>
  );
};

interface StyledProps {
  darkMode: boolean;
}

const StyledParkingSpace = styled.div<StyledProps>`
  position: relative;
  height: 100%;
  width: 100%;
  background-color: ${(props) => (props.darkMode ? "#000" : "#fff")};
`;

const mapStateToProps = (state: AppState) => ({
  items: state.parkedItems.items,
  selectedPoints: state.selectedPoints.pointIds,
});

const mapActionsToProps = {
};


export default connect(mapStateToProps, mapActionsToProps)(ParkingSpace);
