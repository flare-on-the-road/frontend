export type Cctv = {
  id: string;
  name: string;
  roadName: string;
  streamUrl: string;
  format: string;
  type: string;
  lat: number;
  lng: number;
};

export type CctvListResponse = {
  items: Cctv[];
  total: number;
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
};
