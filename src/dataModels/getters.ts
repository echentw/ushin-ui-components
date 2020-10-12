import { AppState } from "../store";

function getAuthor(pointId: string, appState: AppState) {
  if (!!appState.points.byId[pointId].referencePointId) {
    const { referencePointId } = ...;
    return ...
  } else {
    appState.points.byId[pointId].author;
  }
}


function getAttribute(pointId: string, attribute: string, appState: AppState): any {
}


interface PointAuthorAttribute {
  author: string;
}

interface PointContentAttribute {
  somethingasleirhwoeifhasdfasdfjasdf: string;
}


type ReturnValue<Attribute> = Attribute extends PointAuthorAttribute ? AuthorI
  : Attribute extends PointContentAttribute ? string
  : Attribute extends PointShapeAttribute ? PointShape
  : Attribute extends PointDateAttribute ? Date;


function getAttribute<Attribute>(pointId: string, attribute: Attribute): ReturnValue<Attribute> {
}

////// -------------------------------------------------------------------------------------------------


interface Attribute {}

interface PointAuthorAttribute extends Attribute {
  author: string;
}

interface PointShapeAttribute extends Attribute {
  shape: string;
}



const author: AuthorI = getAttribute<PointAuthorAttribute>(pointId, { author: 'author' });
const shape: PointSHape = getAttribute<PointShapeAttribute>(pointId, { shape: 'shape' });



function getAttribute(pointId: string, attribute: Attribute): AuthorI { ... }
function getAttribute(pointId: string, attribute: Attribute): PointShape { ... }


function getAttribute<T>(pointId: string, attribute: Attribute): ReturnValue<T> { ... }

type ReturnValue<T> = T extends PointAuthorAttribute ? AuthorI : PointShape
