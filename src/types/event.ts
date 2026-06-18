export type Event = {
  id: number;
  cctvId: string;
  cctvName: string;
  locationName: string;
  detectedAt: string | null;
  riskScore: number;
  riskCandidate: boolean;
  isFire: boolean | null;
  vlmReason: string | null;
  detectedClasses: string[];
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
