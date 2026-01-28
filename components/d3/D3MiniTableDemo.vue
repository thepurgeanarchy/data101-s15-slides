<script setup lang="ts">
const rows = [
  { program: 'A', week: 1, n_pass: 70, n_students: 100, pass_rate: 0.7, delta: null },
  { program: 'A', week: 2, n_pass: 62, n_students: 100, pass_rate: 0.62, delta: -0.08 },
  { program: 'B', week: 1, n_pass: 90, n_students: 120, pass_rate: 0.75, delta: null },
  { program: 'B', week: 2, n_pass: 88, n_students: 120, pass_rate: 0.733, delta: -0.017 },
  { program: 'C', week: 1, n_pass: 40, n_students: 50, pass_rate: 0.8, delta: null },
  { program: 'C', week: 2, n_pass: 44, n_students: 50, pass_rate: 0.88, delta: 0.08 },
]

function fmt(v: unknown) {
  if (v === null) return '—'
  if (typeof v === 'number') {
    if (Math.abs(v) < 1 && v !== 0) return v.toFixed(3).replace(/0+$/, '').replace(/\.$/, '')
    return String(v)
  }
  return String(v)
}
</script>

<template>
  <div class="card">
    <table class="w-full text-sm">
      <thead>
        <tr>
          <th class="text-left p-2">program</th>
          <th class="text-right p-2">week</th>
          <th class="text-right p-2">n_pass</th>
          <th class="text-right p-2">n_students</th>
          <th class="text-right p-2">pass_rate</th>
          <th class="text-right p-2">delta</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, i) in rows" :key="i">
          <td class="p-2">{{ r.program }}</td>
          <td class="p-2 text-right">{{ r.week }}</td>
          <td class="p-2 text-right">{{ r.n_pass }}</td>
          <td class="p-2 text-right">{{ r.n_students }}</td>
          <td class="p-2 text-right">{{ fmt(r.pass_rate) }}</td>
          <td class="p-2 text-right" :class="r.delta !== null && r.delta < 0 ? 'text-rose-300' : r.delta !== null ? 'text-emerald-300' : ''">
            {{ fmt(r.delta) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

