export type ModelKey = "rt-detr" | "yolov8" | "yolov11";

export type ModelAccentColor = "orange" | "teal" | "violet";

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
    name: "RT-DETRv2",
    fullName: "Real-Time DETRv2 (Transformer)",
    description:
      "HGNetv2-L 백본 기반 Anchor-free 트랜스포머 실시간 객체탐지 모델. Hungarian Matching으로 NMS 없이 End-to-End 탐지를 수행하며, 터널 환경 화재·연기 탐지에서 YOLO 대비 연기 미탐율 4.8배 개선.",
    map50: 95.2,
    legendMap50: 74.1,
    params: "42M",
    accentColor: "orange",
  },
  {
    key: "yolov8",
    name: "YOLOv8",
    fullName: "Ultralytics YOLOv8-l",
    description:
      "CSPDarknet 백본 기반 RT-DETRv2 대비 비교 모델. 1-stage Anchor 기반 고속 탐지 구조로 근거리 고신뢰 화염 탐지에 강점을 보이나, 터널 원거리·저화질 환경에서 연기 미탐율이 높음.",
    map50: 95.5,
    legendMap50: 71.2,
    params: "25M",
    accentColor: "violet",
  },
  {
    key: "yolov11",
    name: "YOLOv11",
    fullName: "Ultralytics YOLOv11-l",
    description:
      "C3k2 + SPPF + C2PSA 백본 기반 RT-DETRv2 대비 비교 모델. YOLOv8-l 대비 개선된 구조이나 혼동 행렬 패턴이 거의 동일하게 나타나 아키텍처 한계로 해석됨.",
    map50: 95.5,
    legendMap50: 75.6,
    params: "25M",
    accentColor: "teal",
  },
];

export type SampleImage = {
  key: string;
  name: string;
  description: string;
  /** 이미지 파일 확장자 (기본값 "jpg") */
  ext?: "jpg" | "png";
};

/** public/ai-lab/samples/ 아래 "{key}.{ext}" 파일을 참조하는 URL을 반환한다 (ext 기본값 jpg). */
export function getSampleImageUrl(key: string): string {
  const ext = SAMPLE_IMAGES.find((image) => image.key === key)?.ext ?? "jpg";
  return `/ai-lab/samples/${key}.${ext}`;
}

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    key: "sample_1",
    name: "고속도로 터널 차량 화재",
    description: "경부동탄터널 부산방향",
    ext: "png",
  },
  {
    key: "sample_2",
    name: "고속도로 야외 차량 연기",
    description: "서대전쉼터 논산방향",
  },
  {
    key: "sample_3",
    name: "고속도로 터널 차량 화재 연기",
    description: "경부동탄터널 부산방향",
    ext: "png",
  },
  {
    key: "sample_4",
    name: "자동차 부품 공장 화재현장 연기",
    description: "대전 대덕구 3공단 대형화재",
    ext: "png",
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
