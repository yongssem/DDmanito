import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { APP_URL, APP_VERSION, FIRST_DEPLOYED_ON, RELEASES } from '../src/lib/releases.js'
const readJson = (file) => JSON.parse(fs.readFileSync(new URL(file, import.meta.url), 'utf8'))

test('공유 주소와 설치 시작 주소는 학생 정보·교실 토큰을 포함하지 않는다', () => {
  assert.equal(APP_URL, 'https://d-dmanito.vercel.app/')
  const manifest = readJson('../public/manifest.webmanifest')
  assert.equal(manifest.start_url, '/')
  assert.equal(manifest.scope, '/')
  assert.equal(manifest.display, 'standalone')
  assert.ok(manifest.icons.some((icon) => icon.sizes === '192x192'))
  assert.ok(manifest.icons.some((icon) => icon.sizes === '512x512'))
  assert.equal(FIRST_DEPLOYED_ON, '2026-11-02')
  assert.equal(RELEASES[0].version, APP_VERSION)
  assert.equal(RELEASES[0].status, 'preview')
})

test('sprite-gen 좌표와 타이밍이 아틀라스 경계 안에서 이어진다', () => {
  const motions = readJson('../src/assets/mumu-motions.json')
  assert.equal(motions.idle.frames.length, 24)
  assert.equal(motions.walk.frames.length, 4)
  for (const motion of Object.values(motions)) {
    assert.equal(motion.frames.length, motion.durations.length)
    assert.ok(motion.durations.every((duration) => duration > 0))
    assert.ok(motion.loop)
    assert.ok(fs.existsSync(new URL('../public' + motion.src, import.meta.url)))
    for (const frame of motion.frames) assert.ok(frame.x >= 0 && frame.y >= 0 && frame.x + frame.w <= motion.sheetWidth && frame.y + frame.h <= motion.sheetHeight)
  }
})
