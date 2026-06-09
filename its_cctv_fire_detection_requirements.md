# ITS 기반 전국 CCTV 화재 감지 시스템 기술 요구사항

## 1. 프로젝트 개요

전국 ITS CCTV API를 활용하여 고속도로 CCTV 영상을 주기적으로 분석하고,
화재 및 연기 의심 상황을 탐지하는 AI 기반 관제 시스템 구축.

본 시스템은 모든 CCTV 영상을 실시간 스트리밍 분석하지 않고,
CCTV를 순회하며 프레임 단위로 분석하는 구조를 사용한다.

---

# 2. 시스템 목표

- ITS CCTV API 연동
- 전국 CCTV 목록 관리
- CCTV 프레임 주기적 분석
- 화재/연기 의심 상황 탐지
- 후미등/조명/안개 오탐 감소
- 이벤트 기반 관제 시스템 구축
- 위험 상황 알림 기능 제공

---

# 3. 전체 시스템 구조

```text
ITS CCTV API
↓
CCTV 목록 수집
↓
MariaDB 저장
↓
Python Worker
(CCTV 순회)
↓
프레임 캡처
↓
1차 AI 탐지
YOLO / RT-DETR
↓
위험 후보 발견
↓
2차 VLM 판단
↓
이벤트 저장
↓
Flask Backend API
↓
React / Next.js Dashboard
```

---

# 4. 기술 스택

| 영역 | 기술 |
|---|---|
| Frontend | React, Next.js |
| Backend | Flask |
| AI Server | FastAPI |
| Database | MariaDB |
| AI Detection | YOLO / RT-DETR |
| VLM | GPT-4o / Qwen-VL / Florence-2 |
| 영상 처리 | OpenCV |
| 스케줄링 | Python Worker |
| 저장소 | Local Storage / NAS |

---

# 5. CCTV 처리 구조

## 5.1 CCTV 목록 수집

ITS API를 통해:
- CCTV 이름
- CCTV 위치
- CCTV 영상 URL
- 도로 정보

수집 후 DB 저장.

---

## 5.2 Python Worker 순회 구조

Python Worker는:
1. DB에서 CCTV 목록 조회
2. CCTV URL에서 현재 프레임 1장 캡처
3. AI 모델 분석
4. 위험 후보 발견 시 이벤트 저장
5. 다음 CCTV로 이동

모든 CCTV를 분석 완료하면 다시 처음부터 반복.

---

# 6. AI 탐지 구조

## 6.1 1차 탐지 모델

YOLO 또는 RT-DETR 사용.

역할:
- fire 후보 탐지
- smoke 후보 탐지
- 이상 밝기 영역 탐지

빠른 속도로 위험 후보만 필터링.

---

## 6.2 2차 VLM 판단

VLM은:
- 실제 화재 여부 판단
- 후미등/조명/안개 구분
- 상황 설명 생성

예시:

```json
{
  "is_fire": true,
  "risk_score": 87,
  "reason": "차량 우측에서 회색 연기가 지속적으로 발생"
}
```

---

# 7. 이벤트 처리 구조

위험 상황 발생 시:
- 이벤트 DB 저장
- 스냅샷 저장
- 위험도 계산
- 관제 화면 표시

---

# 8. DB 주요 테이블

## cctv

| 컬럼 | 설명 |
|---|---|
| id | CCTV ID |
| name | CCTV 이름 |
| road_name | 도로명 |
| latitude | 위도 |
| longitude | 경도 |
| stream_url | 영상 URL |

---

## event

| 컬럼 | 설명 |
|---|---|
| id | 이벤트 ID |
| cctv_id | CCTV ID |
| event_type | fire/smoke |
| risk_score | 위험도 |
| snapshot_path | 이미지 경로 |
| vlm_reason | VLM 판단 결과 |
| created_at | 발생 시간 |

---

# 9. MVP 범위

초기 MVP 범위:
- ITS CCTV API 연동
- CCTV 목록 저장
- CCTV 순회 분석
- fire/smoke 후보 탐지
- VLM 기반 위험 판단
- 이벤트 저장
- 관제 대시보드 표시

---

# 10. Python Worker 상세 동작 구조

```text
1. DB에서 CCTV 목록 조회
2. CCTV URL로 접속
3. 현재 프레임 1장 캡처
4. YOLO / RT-DETR 1차 탐지
5. 위험 후보가 없으면 다음 CCTV 이동
6. 위험 후보 발견 시 VLM 분석 요청
7. VLM이 위험 상황이라고 판단하면 이벤트 저장
8. 모든 CCTV 순회 완료 후 다시 반복
```

---

# 11. VLM 활용 목적

VLM은 모든 CCTV를 직접 실시간 분석하는 용도가 아니라,
1차 탐지 모델이 발견한 위험 후보를 정밀 분석하는 역할을 수행한다.

예:
- 실제 화재 여부 판단
- 차량 후미등 구분
- 조명 반사 구분
- 안개/연기 구분
- 상황 설명 생성

---

# 12. 초기 MVP 개발 방향

초기에는:
- Redis 미사용
- Kafka 미사용
- 단일 Python Worker 기반
- 순차 CCTV 순회 방식

으로 단순하게 구현한다.

이후:
- CCTV 수 증가
- 처리량 증가
- 실시간성 요구 증가

시 Redis Queue, Celery, Kafka 등을 추가한다.

---

# 13. 향후 확장 방향

- Redis Queue 추가
- Kafka 기반 이벤트 스트리밍
- 다중 Worker 분산 처리
- 전국 CCTV 병렬 분석
- 실시간 알림 시스템
- 이상행동 탐지 기능
- 사고/정차/역주행 탐지
- 관리자 관제 시스템 고도화
