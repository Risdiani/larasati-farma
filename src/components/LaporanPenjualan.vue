<template>
  <div class="page">
    <!-- ── Page Header ── -->
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Laporan Penjualan</h1>
        <div class="breadcrumb">
          <span class="breadcrumb-item">Dashboard</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          <span class="breadcrumb-item active">Laporan Penjualan</span>
        </div>
      </div>
    </div>

    <!-- ── Filter Periode ── -->
     <div class="filter-section">
      <div class="filter-group">
        <label class="filter-label">Periode Transaksi</label>
        <div class="filter-controls">
          <div class="date-range-wrapper">
            <input type="date" v-model="startDate" class="date-input range-input" />
            <span class="range-separator">s/d</span>
            <input type="date" v-model="endDate" class="date-input range-input" />
          </div>
          <button class="btn-primary" @click="loadData">Cari Transaksi</button>
        </div>
      </div>
    </div>

    <!-- ── Data Table ── -->
    <div class="card table-card">
      <div class="card-header">
        <h3 class="card-title mb-0">Data Transaksi</h3>
        <div class="card-actions">
          <button class="btn-icon btn-pdf" title="Export PDF">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </button>
          <button class="btn-icon btn-excel" title="Export Excel">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
          </button>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID Transaksi</th>
              <th>Tanggal</th>
              <th>Total Harga</th>
              <th>Total Item</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="5" class="text-center py-8">Memuat data transaksi...</td>
            </tr>
            <tr v-else-if="paginatedData.length === 0">
              <td colspan="5" class="text-center py-8 text-slate-500">Tidak ada data transaksi.</td>
            </tr>
            <tr v-else v-for="item in paginatedData" :key="item.id">
              <td class="text-blue">{{ item.kodeTransaksi }}</td>
              <td>{{ formatDate(item.transactionDate) }}</td>
              <td>Rp {{ formatPrice(item.totalHarga) }}</td>
              <td>{{ getTotalItems(item) }}</td>
              <td>
                <button class="btn-detail">Detail</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination" v-if="!loading && filteredTransactions.length > 0">
        <button class="page-btn nav-btn" :disabled="currentPage === 1" @click="currentPage--">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        
        <template v-for="p in visiblePages" :key="p === '...' ? Math.random() : p">
          <span v-if="p === '...'" class="page-dots">...</span>
          <button v-else :class="['page-btn', { active: p === currentPage }]" @click="currentPage = p as number">
            {{ p }}
          </button>
        </template>
        
        <button class="page-btn nav-btn" :disabled="currentPage === totalPages" @click="currentPage++">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { apiGetTransactions } from '../api'
import type { TransactionRes } from '../api'

const rawTransactions = ref<TransactionRes[]>([])
const filteredTransactions = ref<TransactionRes[]>([])
const loading = ref(true)

const startDate = ref('')
const endDate = ref('')

const currentPage = ref(1)
const itemsPerPage = ref(10)

const loadData = async () => {
  try {
    loading.value = true
    const res = await apiGetTransactions()
    rawTransactions.value = res.reverse()
    applyFilter()
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const applyFilter = () => {
  let filtered = rawTransactions.value
  
  if (startDate.value) {
    filtered = filtered.filter(item => item.transactionDate >= startDate.value)
  }
  if (endDate.value) {
    filtered = filtered.filter(item => item.transactionDate <= endDate.value)
  }
  
  filteredTransactions.value = filtered
  currentPage.value = 1
}

onMounted(() => {
  loadData()
})

const totalPages = computed(() => Math.ceil(filteredTransactions.value.length / itemsPerPage.value))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredTransactions.value.slice(start, start + itemsPerPage.value)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total]
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '...', current - 1, current, current + 1, '...', total]
})

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const d = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
}

const formatPrice = (val: number) => {
  return val.toLocaleString('id-ID')
}

const getTotalItems = (trx: TransactionRes) => {
  return trx.details.reduce((sum, d) => sum + d.jumlah, 0)
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 28px 32px 40px;
  font-family: 'Nunito Sans', sans-serif;
  min-height: 100%;
  background: #f8fafc;
}

/* ── Header ── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page-title {
  font-size: 22px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 4px;
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12.5px;
  font-weight: 600;
  color: #94a3b8;
}
.breadcrumb-item.active { color: #64748b; }

/* ── Cards ── */
.card {
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

.card-title {
  font-size: 15px;
  font-weight: 700;
  color: #334155;
  margin: 0 0 16px;
}
.mb-0 { margin-bottom: 0; }

/* ── Filter / Parameters ── */
.filter-section {
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.filter-controls {
  display: flex;
  align-items: flex-end;
  gap: 24px;
  flex-wrap: wrap;
}
.filter-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.filter-label {
  font-size: 14px;
  font-weight: 700;
  color: #475569;
}

/* Date Range */
.date-range-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  padding: 0 12px;
  height: 42px;
  transition: border-color 0.2s;
}
.date-range-wrapper:focus-within { border-color: #3b82f6; }
.range-input {
  border: none;
  background: transparent;
  font-size: 13.5px;
  font-weight: 600;
  color: #475569;
  outline: none;
  cursor: pointer;
  font-family: inherit;
}
.range-separator {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 600;
}

.btn-primary {
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0 20px;
  height: 42px;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  display: flex; align-items: center; justify-content: center;
}
.btn-primary:hover:not(:disabled) { background: #2563eb; }

/* ── Table Section ── */
.table-card {
  padding: 0;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-pdf { color: #ef4444; }
.btn-pdf:hover { background: #fef2f2; border-color: #fca5a5; }

.btn-excel { color: #10b981; }
.btn-excel:hover { background: #ecfdf5; border-color: #6ee7b7; }

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.data-table th {
  background: #f8fafc;
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  padding: 14px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.data-table td {
  padding: 16px 24px;
  font-size: 14px;
  color: #64748b;
  border-bottom: 1px solid #f1f5f9;
}

.text-blue {
  color: #3b82f6 !important;
  font-weight: 600;
}

.btn-detail {
  background: #fff;
  border: 1.5px solid #bfdbfe;
  color: #3b82f6;
  border-radius: 6px;
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-detail:hover {
  background: #eff6ff;
  border-color: #3b82f6;
}

/* ── Pagination ── */
.pagination {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 20px 24px;
}

.page-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(.active) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.page-btn.active {
  background: #3b82f6;
  color: #fff;
  border-color: #3b82f6;
}

.page-dots {
  color: #94a3b8;
  font-weight: 600;
  padding: 0 4px;
}

.nav-btn {
  color: #94a3b8;
}
.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.text-center { text-align: center; }
.py-8 { padding-top: 32px; padding-bottom: 32px; }
.text-slate-500 { color: #64748b; }
</style>
