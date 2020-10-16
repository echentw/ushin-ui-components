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
//TODO: how to confirm that focus point exists in the array of points
//contained in the semscreen?
import { AuthorsState } from "../reducers/authors";
import { MessageState } from "../reducers/message";
import { PointsState } from "../reducers/points";
import { ParkedItemType, ParkedItemsState } from "../reducers/parkedItems";

export const authors: AuthorsState = {
  byId: {
    author1: { _id: "author1", name: "KindWoman", color: "#7d3989" },
    author2: { _id: "author2", name: "BreatheOutBreatheIn", color: "#209924" },
  },
};

export const points: PointsState = {
  byId: {
    pointId1: {
      content: "Online Deliberation",
      _id: "pointId1",
      shape: "topics",
      pointDate: new Date(),
    },
    pointId2: {
      content:
        "Build an open, collaborative, compassionate system to share information and make decisions",
      _id: "pointId2",
      shape: "actions",
      pointDate: new Date(),
    },
    pointId3: {
      content:
        "Create a frontend which can ride on federated and distributed backends.",
      _id: "pointId3",
      shape: "actions",
      pointDate: new Date(),
    },
    pointId4: {
      content: "Get plenty of sleep :)",
      _id: "pointId4",
      shape: "actions",
      pointDate: new Date(),
    },
    pointId5: {
      content:
        "Make a p2p deliberation app that runs in node, web browser, and hopefully React Native",
      _id: "pointId5",
      shape: "actions",
      pointDate: new Date(),
    },
    pointId6: {
      content: "Graph database!",
      _id: "pointId6",
      shape: "topics",
      pointDate: new Date(),
    },
    pointId7: {
      content:
        "Brainstorm and implement other components, including a list view of messages",
      _id: "pointId7",
      shape: "actions",
      pointDate: new Date(),
    },
    pointId8: {
      content:
        "This is a point",
      _id: "pointId8",
      shape: "actions",
      pointDate: new Date(),
    },
    REFERENCE_TO_pointId3: {
      _id: "REFERENCE_TO_pointId3",
      referencePointId: "pointId3",
      referenceMessageId: "messageId0",
      referenceAuthorId: "author2",
    },
    ANOTHER_REFERENCE_TO_pointId3: {
      _id: "ANOTHER_REFERENCE_TO_pointId3",
      referencePointId: "pointId3",
      referenceMessageId: "messageId0",
      referenceAuthorId: "author2",
    },
  },
};

export const messages: MessageState[] = [
  {
    _id: "messageId1",
    author: "author1",
    shapes: {
      facts: [],
      thoughts: [],
      feelings: [],
      needs: [],
      topics: ["pointId6"],
      actions: [
        "pointId2",
        "REFERENCE_TO_pointId3",
        "pointId4",
        "pointId7",
        "pointId5",
      ],
      people: [],
    },
    focus: "pointId1",
    main: "pointId5",
    createdAt: new Date(),
  },
];

export const parkedItems: ParkedItemsState = {
  items: [
    { id: "pointId8", type: ParkedItemType.Point },
    { id: "ANOTHER_REFERENCE_TO_pointId3", type: ParkedItemType.Point },
  ],
};
