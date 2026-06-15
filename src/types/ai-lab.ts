export type ModelKey = "rt-detr" | "yolov8" | "yolov11";

export type ModelAccentColor = "orange" | "teal";

export type ModelInfo = {
  key: ModelKey;
  name: string;
  fullName: string;
  description: string;
  map50: number;
  /** 하단 범례용 mAP (별도 검증셋 기준, 상세 표의 mAP50과 다를 수 있음) */
  legendMap50: number;
  params: string;
  accentColor: ModelAccentColor;
};

export const AI_LAB_MODELS: ModelInfo[] = [
  {
    key: "rt-detr",
    name: "RT-DETR",
    fullName: "Real-Time DETR (Transformer)",
    description:
      "Anchor-free 트랜스포머 기반 실시간 객체탐지 모델. 복잡한 배경에서 안정적인 화재/연기 탐지.",
    map50: 89.2,
    legendMap50: 74.1,
    params: "42M",
    accentColor: "orange",
  },
  {
    key: "yolov8",
    name: "YOLOv8",
    fullName: "Ultralytics YOLOv8-m",
    description:
      "경량화 1-stage 탐지 모델. 빠른 추론 속도와 균형 잡힌 정확도로 엣지 환경에 적합.",
    map50: 87.8,
    legendMap50: 71.2,
    params: "25M",
    accentColor: "orange",
  },
  {
    key: "yolov11",
    name: "YOLOv11",
    fullName: "Ultralytics YOLOv11-m",
    description:
      "YOLO 최신 세대 모델. 향상된 백본 구조로 소형 화재 패턴에 대한 탐지율 개선.",
    map50: 90.1,
    legendMap50: 75.6,
    params: "20M",
    accentColor: "teal",
  },
];

export type SampleImage = {
  key: string;
  name: string;
  description: string;
};

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    key: "sample_highway_fire",
    name: "고속도로 차량 화재",
    description: "경부고속도로 부산방향 31...",
  },
  {
    key: "sample_tunnel_smoke",
    name: "터널 입구 연기 발생",
    description: "중부내륙선 상생 178K 터널",
  },
  {
    key: "sample_urban_fire",
    name: "도심 가로변 소형 화재",
    description: "서울외곽순환 선본 IC 인근",
  },
  {
    key: "sample_field_smoke",
    name: "농촌 도로 들불 연기",
    description: "국도 32호선 예산방면",
  },
  {
    key: "sample_night_fire",
    name: "야간 도로 화재",
    description: "서해안고속도로 목포방면 ...",
  },
  {
    key: "sample_tunnel_fire",
    name: "터널 내부 차량 화재",
    description: "동해선 강릉방면 22K 터널",
  },
];

export type DetectionLabel = "FIRE" | "SMOKE";

export type Detection = {
  label: DetectionLabel;
  confidence: number;
  /** [x, y, w, h] - 이미지 전체 크기 기준 정규화 비율값 (0~1) */
  bbox: [number, number, number, number];
};

export type ModelResult = {
  inference_ms: number;
  fps: number;
  detections: Detection[];
};

export type DetectResults = Record<ModelKey, ModelResult>;

export type DetectResponse = {
  results: DetectResults;
};

export const THRESHOLD_MIN = 0.3;
export const THRESHOLD_MAX = 0.95;
export const THRESHOLD_STEP = 0.01;
export const THRESHOLD_DEFAULT = 0.3;

export const MAX_UPLOAD_SIZE_BYTES = 8 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];
