export interface CCTVItem {
  id: string;
  title: string;
  roadType: 'highway' | 'local';
  roadName: string;
  location: string;
  status: 'connected' | 'maintenance';
  lat: number;
  lng: number;
  image: string;
}

export interface TrafficAlert {
  id: string;
  type: 'danger' | 'accident' | 'fire' | 'control' | 'normal';
  typeName: string;
  location: string;
  title: string;
  content: string;
  timestamp: string;
  cctvId?: string;
}

export const CCTVS_DATA: CCTVItem[] = [
  {
    id: 'cctv-1',
    title: '강남대로 1구간',
    roadType: 'local',
    roadName: '강남대로',
    location: '서울특별시 강남구',
    status: 'connected',
    lat: 37.4979,
    lng: 127.0276,
    image: '/images/cctv_city.png',
  },
  {
    id: 'cctv-2',
    title: '테헤란로 삼성역',
    roadType: 'local',
    roadName: '테헤란로',
    location: '서울특별시 강남구',
    status: 'connected',
    lat: 37.5088,
    lng: 127.0631,
    image: '/images/cctv_city.png',
  },
  {
    id: 'cctv-3',
    title: '올림픽대로 잠실',
    roadType: 'highway',
    roadName: '올림픽대로',
    location: '서울특별시 송파구',
    status: 'connected',
    lat: 37.5160,
    lng: 127.1040,
    image: '/images/cctv_highway.png',
  },
  {
    id: 'cctv-4',
    title: '경부고속도로 수원IC',
    roadType: 'highway',
    roadName: '경부고속도로',
    location: '경기도 수원시',
    status: 'connected',
    lat: 37.2657,
    lng: 127.0990,
    image: '/images/cctv_highway.png',
  },
  {
    id: 'cctv-5',
    title: '부산항대교 남단',
    roadType: 'highway',
    roadName: '부산항대교',
    location: '부산광역시 영도구',
    status: 'connected',
    lat: 35.1062,
    lng: 129.0645,
    image: '/images/cctv_bridge.png',
  },
  {
    id: 'cctv-6',
    title: '강변북로 난지대교',
    roadType: 'highway',
    roadName: '강변북로',
    location: '서울특별시 마포구',
    status: 'connected',
    lat: 37.5600,
    lng: 126.8800,
    image: '/images/cctv_bridge.png',
  },
  {
    id: 'cctv-7',
    title: '대구 중앙대로',
    roadType: 'local',
    roadName: '중앙대로',
    location: '대구광역시 중구',
    status: 'maintenance',
    lat: 35.8685,
    lng: 128.5940,
    image: '/images/cctv_city.png',
  },
  {
    id: 'cctv-8',
    title: '제2자유로 일산',
    roadType: 'highway',
    roadName: '제2자유로',
    location: '경기도 고양시',
    status: 'connected',
    lat: 37.6430,
    lng: 126.7900,
    image: '/images/cctv_highway.png',
  },
];

export const ALERTS_DATA: TrafficAlert[] = [
  {
    id: 'alert-1',
    type: 'accident',
    typeName: '사고',
    location: '강남구',
    title: '강남대로 1구간 차량 3중 추돌 사고',
    content: '승용차 2대 및 화물차 1대 추돌사고 발생. 2차로 전면 차단 중이며 구조대가 출동하여 부상자 3명을 이송 중입니다. 인근 도로 정체가 심하니 우회하시기 바랍니다.',
    timestamp: '2026-06-09 14:32:15',
    cctvId: 'cctv-1',
  },
  {
    id: 'alert-2',
    type: 'control',
    typeName: '통제',
    location: '송파구',
    title: '올림픽대로 잠실역 부근 도로 통제',
    content: '잠실역 인근 교량 정밀 안전 점검으로 1차로 전면 통제 중입니다. 점검 예정 시간은 오후 4시까지이며, 점검 완료 후 순차적으로 개방될 예정입니다.',
    timestamp: '2026-06-09 13:55:00',
    cctvId: 'cctv-3',
  },
  {
    id: 'alert-3',
    type: 'danger',
    typeName: '위험',
    location: '수원시',
    title: '경부고속도로 수원IC 인근 낙하물 경고',
    content: '수원IC 진입 램프 상단 구조물 일부 낙하물이 발견되었습니다. 낙하물 제거 작업이 진행 중이며, 인근 차량은 저속 운행 및 차선 변경 시 주의하시기 바랍니다.',
    timestamp: '2026-06-09 14:10:30',
    cctvId: 'cctv-4',
  },
  {
    id: 'alert-4',
    type: 'fire',
    typeName: '화재',
    location: '영도구',
    title: '부산항대교 화물차 화재 발생',
    content: '부산항대교 영도구간에서 화물차 화재가 발생했습니다. 소방당국 8대가 출동하여 진화 작업 중이며 연기로 인해 가시거리가 매우 짧으니 감속 운행 바랍니다.',
    timestamp: '2026-06-09 12:45:20',
    cctvId: 'cctv-5',
  },
  {
    id: 'alert-5',
    type: 'danger',
    typeName: '위험',
    location: '마포구',
    title: '강변북로 난지대교 근처 폭우 경고',
    content: '기상청 폭우경보 발령으로 강변북로 난지대교 인근 도로 침수 위험이 고조되고 있습니다. 현재 수심 5cm 확인되었으며 차량 통제 가능성이 있으니 주의하십시오.',
    timestamp: '2026-06-09 14:20:00',
    cctvId: 'cctv-6',
  },
  {
    id: 'alert-6',
    type: 'control',
    typeName: '통제',
    location: '강남구',
    title: '테헤란로 삼성역 사거리 신호등 고장',
    content: '삼성역 사거리 신호체계가 일시 정지 상태입니다. 현재 교통경찰이 현장 수동 통제를 실시 중이며, 예정시간 내 신속하게 복구될 예정입니다.',
    timestamp: '2026-06-09 13:40:00',
    cctvId: 'cctv-2',
  },
  {
    id: 'alert-7',
    type: 'accident',
    typeName: '사고',
    location: '중구',
    title: '대구 중앙대로 반월당 인근 보행자 사고',
    content: '반월당 사거리에서 보행자와 오토바이 충돌사고가 발생했습니다. 현재 경찰 및 119가 출동했으며 처리로 인해 1차로 일부가 차단되어 서행 중입니다.',
    timestamp: '2026-06-09 13:10:00',
    cctvId: 'cctv-7',
  },
  {
    id: 'alert-8',
    type: 'normal',
    typeName: '정상',
    location: '고양시',
    title: '제2자유로 일산 구간 교통량 정상',
    content: '일산 구간 교통 흐름이 원활합니다. 현재 평균 속도 95km/h로 특이사항이 없습니다. 운전자분들은 안전속도 준수 및 안전거리 확보에 신경 써주시기 바랍니다.',
    timestamp: '2026-06-09 14:35:00',
    cctvId: 'cctv-8',
  },
];
