<template>
  <div class="dashboard">

    <!-- ── Top Bar ── -->
    <header class="topbar">
      <div class="topbar-left">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Ringkasan aktivitas sistem pengadaan</p>
      </div>
      <div class="topbar-right">
        <div class="date-chip">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>{{ todayLabel }}</span>
        </div>
        <div class="user-chip">
          <div class="user-avatar">{{ userInitial }}</div>
          <div class="user-info">
            <span class="user-name">{{ props.fullName || props.username }}</span>
            <span class="user-role">{{ props.role }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- ── Greeting Banner ── -->
    <div class="greeting-banner">
      <div class="greeting-content">
        <div class="greeting-text">
          <span class="greeting-hello">{{ greetingTime }},</span>
          <span class="greeting-name">{{ props.fullName || props.username }} 👋</span>
        </div>
        <p class="greeting-sub">Berikut ringkasan aktivitas Toko Obat Larasati Farma hari ini.</p>
      </div>
      <div class="greeting-decoration">
        <svg width="120" height="90" viewBox="0 0 120 90" fill="none" opacity="0.12">
          <circle cx="90" cy="20" r="50" fill="#ffffff"/>
          <circle cx="20" cy="80" r="30" fill="#ffffff"/>
        </svg>
      </div>
    </div>

    <!-- ── Stat Cards ── -->
    <section class="stats-section">
      <div class="stat-card" v-for="card in statCards" :key="card.id">
        <div class="stat-icon" :style="{ background: card.iconBg }">
          <span v-html="card.icon"></span>
        </div>
        <div class="stat-body">
          <p class="stat-label">{{ card.label }}</p>
          <p class="stat-value">{{ card.value }}</p>
          <div class="stat-trend" :class="card.trendType">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline v-if="card.trendType === 'up'" points="18 15 12 9 6 15"/>
              <polyline v-else-if="card.trendType === 'down'" points="6 9 12 15 18 9"/>
              <line v-else x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span>{{ card.trend }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Chart + Quick Actions ── -->
    <div class="middle-row">

      <!-- Chart Area -->
      <div class="card chart-card">
        <div class="card-header">
          <div>
            <h2 class="card-title">Transaksi Penjualan</h2>
            <p class="card-subtitle">7 hari terakhir</p>
          </div>
          <div class="chart-legend">
            <span class="legend-dot" style="background:#2456A4;"></span>
            <span class="legend-label">Penjualan</span>
          </div>
        </div>
        <div class="chart-area">
          <!-- Decorative placeholder chart -->
          <svg width="100%" height="160" viewBox="0 0 500 160" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#2456A4" stop-opacity="0.18"/>
                <stop offset="100%" stop-color="#2456A4" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <!-- Grid lines -->
            <line x1="0" y1="40"  x2="500" y2="40"  stroke="#f0f4f8" stroke-width="1"/>
            <line x1="0" y1="80"  x2="500" y2="80"  stroke="#f0f4f8" stroke-width="1"/>
            <line x1="0" y1="120" x2="500" y2="120" stroke="#f0f4f8" stroke-width="1"/>
            <!-- Area fill -->
            <path d="M0,120 C60,100 100,60 160,70 C220,80 260,30 320,45 C380,60 420,20 500,35 L500,160 L0,160 Z"
                  fill="url(#chartGrad)"/>
            <!-- Line -->
            <path d="M0,120 C60,100 100,60 160,70 C220,80 260,30 320,45 C380,60 420,20 500,35"
                  fill="none" stroke="#2456A4" stroke-width="2.5" stroke-linejoin="round"/>
            <!-- Data points -->
            <circle cx="0"   cy="120" r="4" fill="#2456A4"/>
            <circle cx="160" cy="70"  r="4" fill="#2456A4"/>
            <circle cx="320" cy="45"  r="4" fill="#2456A4"/>
            <circle cx="500" cy="35"  r="4" fill="#2456A4"/>
          </svg>
          <div class="chart-x-labels">
            <span v-for="d in chartDays" :key="d">{{ d }}</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card quick-card">
        <div class="card-header">
          <h2 class="card-title">Akses Cepat</h2>
        </div>
        <div class="quick-grid">
          <button
            v-for="action in quickActions"
            :key="action.page"
            class="quick-btn"
            @click="$emit('navigate', action.page)"
          >
            <div class="quick-icon" :style="{ background: action.bg }">
              <span v-html="action.icon"></span>
            </div>
            <span class="quick-label">{{ action.label }}</span>
          </button>
        </div>
      </div>

    </div>

    <!-- ── Transaksi Terbaru ── -->
    <div class="card table-card">
      <div class="card-header">
        <div>
          <h2 class="card-title">Transaksi Penjualan Terbaru</h2>
          <p class="card-subtitle">5 transaksi terakhir</p>
        </div>
        <button class="btn-lihat-semua" @click="$emit('navigate', 'riwayat-transaksi')">
          Lihat Semua →
        </button>
      </div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>No. Transaksi</th>
              <th>Tanggal</th>
              <th>Total Item</th>
              <th>Total Harga</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in recentTransactions" :key="row.id">
              <td class="col-id">{{ row.id }}</td>
              <td>{{ row.date }}</td>
              <td>{{ row.items }} item</td>
              <td class="col-price">{{ row.total }}</td>
              <td>
                <span class="badge" :class="row.statusClass">{{ row.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  username: string
  fullName?: string
  role: string
}>()

defineEmits<{
  navigate: [page: string]
}>()

// ── Greeting & Date ──
const greetingTime = computed(() => {
  const h = new Date().getHours()
  if (h < 11) return 'Selamat Pagi'
  if (h < 15) return 'Selamat Siang'
  if (h < 18) return 'Selamat Sore'
  return 'Selamat Malam'
})

const todayLabel = computed(() => {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
})

const userInitial = computed(() =>
  props.username ? props.username.charAt(0).toUpperCase() : 'U'
)

// ── Chart days ──
const chartDays = computed(() => {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toLocaleDateString('id-ID', { weekday: 'short' }))
  }
  return days
})

// ── Stat Cards ──
const statCards = [
  {
    id: 'produk',
    label: 'Total Produk',
    value: '—',
    trend: 'Belum tersambung',
    trendType: 'neutral',
    iconBg: 'linear-gradient(135deg,#2456A4,#3b82f6)',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>`,
  },
  {
    id: 'transaksi',
    label: 'Transaksi Hari Ini',
    value: '—',
    trend: 'Belum tersambung',
    trendType: 'neutral',
    iconBg: 'linear-gradient(135deg,#0ea5e9,#38bdf8)',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>`,
  },
  {
    id: 'stok',
    label: 'Stok Menipis',
    value: '—',
    trend: 'Belum tersambung',
    trendType: 'neutral',
    iconBg: 'linear-gradient(135deg,#f59e0b,#fbbf24)',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>`,
  },
  {
    id: 'rekomendasi',
    label: 'Rekomendasi Aktif',
    value: '—',
    trend: 'Belum tersambung',
    trendType: 'neutral',
    iconBg: 'linear-gradient(135deg,#10b981,#34d399)',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
    </svg>`,
  },
]

// ── Quick Actions ──
const quickActions = [
  {
    label: 'Data Produk',
    page: 'data-master-produk',
    bg: 'rgba(36,86,164,0.10)',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2456A4" stroke-width="2">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>`,
  },
  {
    label: 'Manajemen Stok',
    page: 'manajemen-stok',
    bg: 'rgba(14,165,233,0.10)',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>
    </svg>`,
  },
  {
    label: 'Transaksi',
    page: 'transaksi-penjualan',
    bg: 'rgba(245,158,11,0.10)',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>`,
  },
  {
    label: 'Analisis Apriori',
    page: 'analisis-apriori',
    bg: 'rgba(16,185,129,0.10)',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
    </svg>`,
  },
  {
    label: 'Rekomendasi',
    page: 'rekomendasi-pengadaan',
    bg: 'rgba(139,92,246,0.10)',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>`,
  },
  {
    label: 'Laporan',
    page: 'laporan-penjualan',
    bg: 'rgba(239,68,68,0.10)',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14,2 14,8 20,8"/>
    </svg>`,
  },
]

// ── Recent Transactions (placeholder) ──
const recentTransactions = [
  { id: 'TRX-2026-001', date: '02 Jul 2026', items: 4, total: 'Rp 185.000', status: 'Selesai',  statusClass: 'badge-success' },
  { id: 'TRX-2026-002', date: '02 Jul 2026', items: 2, total: 'Rp  92.500', status: 'Selesai',  statusClass: 'badge-success' },
  { id: 'TRX-2026-003', date: '01 Jul 2026', items: 7, total: 'Rp 340.000', status: 'Selesai',  statusClass: 'badge-success' },
  { id: 'TRX-2026-004', date: '01 Jul 2026', items: 1, total: 'Rp  45.000', status: 'Selesai',  statusClass: 'badge-success' },
  { id: 'TRX-2026-005', date: '30 Jun 2026', items: 5, total: 'Rp 210.000', status: 'Selesai',  statusClass: 'badge-success' },
]
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 28px 32px 40px;
  min-height: 100%;
  font-family: 'Nunito Sans', sans-serif;
}

/* ── Top Bar ── */
.topbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.page-title {
  font-size: 22px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 2px;
  letter-spacing: -0.3px;
}

.page-subtitle {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.date-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 12.5px;
  color: #64748b;
  font-weight: 600;
  white-space: nowrap;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 6px 14px 6px 8px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #2456A4, #3b82f6);
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
}

.user-role {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

/* ── Greeting Banner ── */
.greeting-banner {
  background: linear-gradient(120deg, #2456A4 0%, #3b82f6 60%, #60a5fa 100%);
  border-radius: 16px;
  padding: 22px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  position: relative;
  box-shadow: 0 8px 24px rgba(36, 86, 164, 0.22);
}

.greeting-content {
  position: relative;
  z-index: 1;
}

.greeting-text {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 4px;
}

.greeting-hello {
  font-size: 18px;
  font-weight: 600;
  color: rgba(255,255,255,0.85);
}

.greeting-name {
  font-size: 22px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.3px;
}

.greeting-sub {
  font-size: 13.5px;
  color: rgba(255,255,255,0.75);
  margin: 0;
}

.greeting-decoration {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
}

/* ── Stat Cards ── */
.stats-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  background: #ffffff;
  border: 1px solid #e8edf3;
  border-radius: 14px;
  padding: 20px 20px 18px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: box-shadow 0.2s, transform 0.2s;
}

.stat-card:hover {
  box-shadow: 0 6px 20px rgba(0,0,0,0.09);
  transform: translateY(-2px);
}

.stat-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}

.stat-body {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  margin: 0 0 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 26px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 6px;
  letter-spacing: -0.5px;
  line-height: 1;
}

.stat-trend {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11.5px;
  font-weight: 700;
  border-radius: 6px;
  padding: 2px 7px;
}

.stat-trend.up      { background: #f0fdf4; color: #16a34a; }
.stat-trend.down    { background: #fef2f2; color: #dc2626; }
.stat-trend.neutral { background: #f8fafc; color: #94a3b8; }

/* ── Middle Row ── */
.middle-row {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 16px;
}

/* ── Card ── */
.card {
  background: #ffffff;
  border: 1px solid #e8edf3;
  border-radius: 14px;
  padding: 22px 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 18px;
  gap: 12px;
}

.card-title {
  font-size: 15px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 2px;
}

.card-subtitle {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
  font-weight: 600;
}

/* ── Chart ── */
.chart-legend {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
  flex-shrink: 0;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.chart-area {
  overflow: hidden;
}

.chart-x-labels {
  display: flex;
  justify-content: space-between;
  padding: 6px 4px 0;
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
}

/* ── Quick Actions ── */
.quick-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.quick-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 8px;
  border: 1.5px solid #e8edf3;
  border-radius: 12px;
  background: #fafbfc;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Nunito Sans', sans-serif;
}

.quick-btn:hover {
  border-color: #2456A4;
  background: #eff6ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(36,86,164,0.12);
}

.quick-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-label {
  font-size: 11.5px;
  font-weight: 700;
  color: #475569;
  text-align: center;
  line-height: 1.3;
}

.quick-btn:hover .quick-label {
  color: #2456A4;
}

/* ── Table ── */
.table-card {
  grid-column: 1 / -1;
}

.btn-lihat-semua {
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 700;
  color: #2456A4;
  cursor: pointer;
  font-family: 'Nunito Sans', sans-serif;
  padding: 4px 0;
  transition: color 0.2s;
  flex-shrink: 0;
}

.btn-lihat-semua:hover {
  color: #1d4ed8;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table th {
  text-align: left;
  padding: 10px 14px;
  font-size: 11.5px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1.5px solid #f0f4f8;
  white-space: nowrap;
}

.data-table td {
  padding: 13px 14px;
  color: #334155;
  font-weight: 600;
  border-bottom: 1px solid #f8fafc;
  vertical-align: middle;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr:hover td {
  background: #f8fafc;
}

.col-id {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #64748b;
}

.col-price {
  font-weight: 800;
  color: #1e293b;
}

/* ── Badge ── */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 700;
}

.badge-success { background: #f0fdf4; color: #16a34a; }
.badge-warning { background: #fffbeb; color: #d97706; }
.badge-danger  { background: #fef2f2; color: #dc2626; }
.badge-info    { background: #eff6ff; color: #2456A4; }
</style>
