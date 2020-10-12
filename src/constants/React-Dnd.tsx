import { PointI, PointShape } from "../dataModels/dataModels";

export const ItemTypes = {
  POINT: "point",
};

export interface DraggablePointType {
  type: "point";
  pointId: PointI["_id"];
  shape: PointShape;
  index?: number;
  originalShape: PointShape;
  quoted: boolean;
}
