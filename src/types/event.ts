export type Detection = {
  label: string;
  confidence: number;
  bbox: number[];
};

export type VlmResult = {
  class_name: string;
  is_false_positive: boolean;
  reason: string;
};

export type Event = {
  id: number;
  cctvId: string;
  cctvName: string;
  locationName: string;
  detectedAt: string | null;
  isFire: boolean | null;
  vlmResults: VlmResult[];
  detections: Detection[];
  snapshotKey: string | null;
  snapshotUrl: string | null;
  createdAt: string | null;
};

export type EventListResponse = {
  events: Event[];
  pagination: {
    current_page: number;
    size: number;
    total_count: number;
    total_pages: number;
  };
};

export type FireAlertResponse = {
  events: Event[];
  latestId: number | null;
};

export type ListEventsParams = {
  page?: number;
  size?: number;
  cctvId?: string;
  isFire?: boolean;
  dateFrom?: string;
  dateTo?: string;
};
