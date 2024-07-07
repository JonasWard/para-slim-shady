import { VCFaceMetaData } from '../../geometrytypes';

export interface HalfEdgeFace {
  id: string; // unique id
  edge: string; // the id of one of the edges that is part of this face
  metaData?: VCFaceMetaData;
}
