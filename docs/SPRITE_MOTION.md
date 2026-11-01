# 무무 캐릭터 모션 출처와 처리

원본 2×2 스프라이트는 기존 image_gen 제작물이다. 원본은 1.0.0 Git 이력에 보존했다.

처리 도구: [sprite-gen](https://github.com/aldegad/sprite-gen) 3.14.0, commit `4df1523038a598419e7f3c110cb02e4f9aa60413`.
외부 이미지·영상 모델을 호출하지 않고 기존 이미지용 로컬 유틸리티를 사용했다.

1. `slice-sheet --chroma-key none --grid 2x2 --cell-width 256 --cell-height 256 --baseline-y 232 --target-height 192 --fit contain`으로 원본 4포즈의 크기·발 위치를 정렬했다.
2. 중립 포즈 24장을 준비하고 `breathe --mode pixel --depth .05 --depth-x .025 --breaths 1`로 호흡을 만들었다.
3. `unpack-atlas`, `compose-atlas`, `compose-gif`, `inspect-motion`으로 묶고 확인했다. 대기는 12fps, 걷기는 6fps이며 반복한다.
4. 엔진 manifest의 frame_layout 좌표·시간을 `src/assets/mumu-motions.json`에 옮겼다. 런타임은 이 정보를 직접 소비한다.

대기는 24개 고유 프레임(약 1.992초), 걷기는 기존의 4개 고유 포즈(약 0.668초)다. 새 걷기 포즈를 생성한 것은 아니다. 발 바닥은 각 상태에서 일정하며 프레임 가장자리 잘림은 없었다. `inspect-motion`의 stride_verified는 false이고 최종 판정은 needs-review다. 물리적으로 정확한 보행으로 검증한 결과가 아니다.

대기 PNG는 lossless WebP보다 작아 PNG를 유지했다. 걷기 WebP는 표시되는 RGBA 픽셀과 투명도를 비교했다. 랜딩의 이동은 한 방향으로 진행하고 되돌아갈 때는 사라졌다가 다시 시작한다. 가방 방향을 뒤집지 않는다. 움직임 줄이기 설정과 비활성 탭에서는 프레임 타이머를 멈춘다.