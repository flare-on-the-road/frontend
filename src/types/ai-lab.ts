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

export type DetectionLabel = "FIRE" | "SMOKE" | "CARLIGHT";

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

export const SAMPLE_RESULTS: Record<string, DetectResults> = {
  // event (6) — 고속도로 터널 차량 화재
  sample_1: {
    "rt-detr": {
      inference_ms: 24.94,
      fps: 40.1,
      detections: [
        { label: "CARLIGHT", confidence: 0.9056, bbox: [0.6697, 0.4156, 0.0948, 0.1213] },
        { label: "SMOKE",    confidence: 0.8572, bbox: [0.5438, 0.1232, 0.2250, 0.2182] },
        { label: "CARLIGHT", confidence: 0.8556, bbox: [0.7394, 0.3456, 0.0628, 0.0690] },
        { label: "CARLIGHT", confidence: 0.8364, bbox: [0.7947, 0.3167, 0.0447, 0.0530] },
        { label: "FIRE",     confidence: 0.8080, bbox: [0.5563, 0.3377, 0.0775, 0.1326] },
      ],
    },
    yolov8: {
      inference_ms: 10.50,
      fps: 95.2,
      detections: [
        { label: "CARLIGHT", confidence: 0.8978, bbox: [0.6706, 0.4136, 0.0948, 0.1268] },
        { label: "CARLIGHT", confidence: 0.6800, bbox: [0.7977, 0.3190, 0.0410, 0.0505] },
        { label: "CARLIGHT", confidence: 0.6351, bbox: [0.7384, 0.3692, 0.0633, 0.0531] },
        { label: "FIRE",     confidence: 0.6058, bbox: [0.5589, 0.3377, 0.0708, 0.0805] },
      ],
    },
    yolov11: {
      inference_ms: 11.71,
      fps: 85.4,
      detections: [
        { label: "CARLIGHT", confidence: 0.8719, bbox: [0.6691, 0.4130, 0.0985, 0.1289] },
        { label: "CARLIGHT", confidence: 0.7098, bbox: [0.7955, 0.3140, 0.0451, 0.0573] },
        { label: "CARLIGHT", confidence: 0.3700, bbox: [0.1473, 0.8080, 0.2133, 0.1850] },
        { label: "FIRE",     confidence: 0.2932, bbox: [0.5565, 0.3397, 0.0771, 0.1365] },
      ],
    },
  },
  // event (2) — 고속도로 야외 차량 연기
  sample_2: {
    "rt-detr": {
      inference_ms: 22.06,
      fps: 45.3,
      detections: [
        { label: "CARLIGHT", confidence: 0.7866, bbox: [0.4235, 0.0887, 0.0390, 0.1173] },
        { label: "SMOKE",    confidence: 0.6698, bbox: [0.1248, 0.1232, 0.3410, 0.3982] },
        { label: "CARLIGHT", confidence: 0.6342, bbox: [0.3669, 0.0947, 0.0439, 0.1072] },
        { label: "CARLIGHT", confidence: 0.6072, bbox: [0.3833, 0.0005, 0.0371, 0.0786] },
      ],
    },
    yolov8: {
      inference_ms: 9.81,
      fps: 101.9,
      detections: [
        { label: "SMOKE", confidence: 0.5422, bbox: [0.1093, 0.1438, 0.2531, 0.3886] },
      ],
    },
    yolov11: {
      inference_ms: 12.16,
      fps: 82.2,
      detections: [],
    },
  },
  // event (18) — 고속도로 터널 차량 화재 연기
  sample_3: {
    "rt-detr": {
      inference_ms: 24.13,
      fps: 41.4,
      detections: [
        { label: "CARLIGHT", confidence: 0.9058, bbox: [0.1715, 0.4720, 0.1037, 0.1580] },
        { label: "CARLIGHT", confidence: 0.8965, bbox: [0.5194, 0.3678, 0.0754, 0.0989] },
        { label: "CARLIGHT", confidence: 0.8947, bbox: [0.3747, 0.3205, 0.0609, 0.0851] },
        { label: "CARLIGHT", confidence: 0.8921, bbox: [0.5980, 0.2092, 0.0663, 0.1448] },
        { label: "FIRE",     confidence: 0.8817, bbox: [0.7554, 0.3373, 0.0944, 0.1112] },
        { label: "CARLIGHT", confidence: 0.8810, bbox: [0.5232, 0.2748, 0.0495, 0.0654] },
        { label: "CARLIGHT", confidence: 0.8438, bbox: [0.6832, 0.3337, 0.0692, 0.0661] },
        { label: "CARLIGHT", confidence: 0.8381, bbox: [0.7149, 0.4310, 0.1089, 0.1183] },
        { label: "SMOKE",    confidence: 0.7901, bbox: [0.7288, 0.0279, 0.1628, 0.3267] },
        { label: "CARLIGHT", confidence: 0.7550, bbox: [0.6912, 0.2721, 0.0435, 0.0490] },
      ],
    },
    yolov8: {
      inference_ms: 10.47,
      fps: 95.5,
      detections: [
        { label: "FIRE",     confidence: 0.8468, bbox: [0.7554, 0.3412, 0.0938, 0.1172] },
        { label: "CARLIGHT", confidence: 0.8460, bbox: [0.3758, 0.3211, 0.0608, 0.0872] },
        { label: "CARLIGHT", confidence: 0.8342, bbox: [0.1722, 0.4730, 0.1061, 0.1599] },
        { label: "CARLIGHT", confidence: 0.8283, bbox: [0.5243, 0.2737, 0.0491, 0.0682] },
        { label: "CARLIGHT", confidence: 0.8027, bbox: [0.5206, 0.3718, 0.0758, 0.0985] },
        { label: "CARLIGHT", confidence: 0.7139, bbox: [0.6923, 0.2761, 0.0392, 0.0450] },
        { label: "CARLIGHT", confidence: 0.5661, bbox: [0.5998, 0.2383, 0.0632, 0.1176] },
      ],
    },
    yolov11: {
      inference_ms: 11.87,
      fps: 84.2,
      detections: [
        { label: "CARLIGHT", confidence: 0.8718, bbox: [0.1729, 0.4775, 0.1093, 0.1597] },
        { label: "CARLIGHT", confidence: 0.8280, bbox: [0.3739, 0.3193, 0.0645, 0.0891] },
        { label: "CARLIGHT", confidence: 0.8229, bbox: [0.5196, 0.3598, 0.0823, 0.1125] },
        { label: "CARLIGHT", confidence: 0.8025, bbox: [0.5235, 0.2766, 0.0490, 0.0651] },
        { label: "CARLIGHT", confidence: 0.7712, bbox: [0.6814, 0.3305, 0.0711, 0.1058] },
        { label: "CARLIGHT", confidence: 0.7153, bbox: [0.7139, 0.3293, 0.1369, 0.2328] },
        { label: "FIRE",     confidence: 0.7022, bbox: [0.7338, 0.3279, 0.1174, 0.2345] },
        { label: "CARLIGHT", confidence: 0.3437, bbox: [0.5968, 0.2056, 0.0685, 0.1498] },
      ],
    },
  },
  // event (21) — 자동차 부품 공장 화재현장 연기
  sample_4: {
    "rt-detr": {
      inference_ms: 22.25,
      fps: 44.9,
      detections: [
        { label: "SMOKE", confidence: 0.5557, bbox: [0.0056, 0.0000, 0.9944, 0.2656] },
        { label: "SMOKE", confidence: 0.5541, bbox: [0.0099, 0.0000, 0.9901, 0.2661] },
      ],
    },
    yolov8: {
      inference_ms: 9.62,
      fps: 104.0,
      detections: [
        { label: "SMOKE", confidence: 0.5944, bbox: [0.8436, 0.0070, 0.1564, 0.2472] },
      ],
    },
    yolov11: {
      inference_ms: 11.92,
      fps: 83.9,
      detections: [
        { label: "SMOKE", confidence: 0.4086, bbox: [0.8417, 0.0055, 0.1583, 0.2549] },
      ],
    },
  },
};

export const THRESHOLD_MIN = 0.3;
export const THRESHOLD_MAX = 0.95;
export const THRESHOLD_STEP = 0.01;
export const THRESHOLD_DEFAULT = 0.3;

export const MAX_UPLOAD_SIZE_BYTES = 8 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];
