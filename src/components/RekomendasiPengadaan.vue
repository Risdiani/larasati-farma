<template>
  <div class="page">
    <!-- ── Page Header ── -->
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Rekomendasi Pengadaan</h1>
        <div class="breadcrumb">
          <span class="breadcrumb-item">Dashboard</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          <span class="breadcrumb-item active">Rekomendasi Pengadaan</span>
        </div>
      </div>
    </div>

    <!-- ── Summary Section ── -->
    <div class="summary-section">
      <h2 class="summary-title">Ringkasan Analisis</h2>
      <div class="summary-content">
        <div class="summary-details">
          <div class="detail-row">
            <span class="detail-label">Periode Analisis</span>
            <span class="detail-colon">:</span>
            <span class="detail-value">{{ summary.periode }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Minimum Support</span>
            <span class="detail-colon">:</span>
            <span class="detail-value">{{ summary.minSupport }}%</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Minimum Confidence</span>
            <span class="detail-colon">:</span>
            <span class="detail-value">{{ summary.minConfidence }}%</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Tanggal Analisis</span>
            <span class="detail-colon">:</span>
            <span class="detail-value">{{ formatDate(summary.tanggalAnalisis) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Total Transaksi</span>
            <span class="detail-colon">:</span>
            <span class="detail-value">{{ summary.totalTransaksi }} Transaksi</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Total Produk</span>
            <span class="detail-colon">:</span>
            <span class="detail-value">{{ summary.totalProduk }} Produk</span>
          </div>
        </div>
        
        <div class="info-box">
          <svg class="info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <div class="info-text">
            Rekomendasi ini dihasilkan dari hasil analisis Apriori berdasarkan aturan asosiasi dengan confidence minimal {{ summary.minConfidence }}%
          </div>
        </div>
      </div>
    </div>

    <!-- ── Table Section ── -->
    <div class="panel">
      <div class="panel-header-bar">
        <h2 class="panel-title">Rekomendasi Produk yang Harus Dibeli</h2>
        <div class="export-actions">
          <button class="btn-export pdf" title="Export PDF">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </button>
          <button class="btn-export excel" title="Export Excel">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </button>
        </div>
      </div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 8%">No.</th>
              <th style="width: 25%">Nama Produk</th>
              <th style="width: 15%">Nilai Support</th>
              <th style="width: 15%">Nilai Confidence</th>
              <th style="width: 10%">Lift</th>
              <th style="width: 12%">Stok</th>
              <th style="width: 15%">Rekomendasi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in paginatedProducts" :key="idx">
              <td>{{ (currentPage - 1) * itemsPerPage + idx + 1 }}</td>
              <td class="font-bold text-slate-800">{{ item.namaProduk }}</td>
              <td>{{ typeof item.support === 'number' ? item.support.toFixed(2) : item.support }}%</td>
              <td>{{ typeof item.confidence === 'number' ? item.confidence.toFixed(2) : item.confidence }}%</td>
              <td>{{ typeof item.lift === 'number' ? item.lift.toFixed(2) : item.lift }}</td>
              <td>{{ item.stok }}</td>
              <td class="text-slate-600">{{ item.rekomendasi }}</td>
            </tr>
            <tr v-if="loading">
              <td colspan="7" class="text-center py-8">
                <span class="table-spinner"></span> Memuat rekomendasi...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="pagination-wrapper" v-if="totalPages > 0">
        <div class="items-per-page">
          <span class="text-slate-500 mr-2">Tampilkan:</span>
          <select v-model="itemsPerPage" class="page-select">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <span class="text-slate-500 ml-2">baris per halaman</span>
        </div>

        <div class="pagination">
          <button class="page-nav" :disabled="currentPage === 1" @click="currentPage--">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          
          <button 
            v-for="p in visiblePages" 
            :key="p === '...' ? Math.random() : p"
            :class="['page-btn', { active: p === currentPage, dots: p === '...' }]"
            @click="typeof p === 'number' ? currentPage = p : null"
          >
            {{ p }}
          </button>
          
          <button class="page-nav" :disabled="currentPage === totalPages" @click="currentPage++">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { apiGetAprioriHistory, apiGetAprioriHistoryDetail } from '../api'

const loading = ref(false)

const summary = ref({
  periode: '-',
  minSupport: 0,
  minConfidence: 0,
  tanggalAnalisis: '-',
  totalTransaksi: 0,
  totalProduk: 0
})

const formatDateOnly = (isoStr: string) => {
  if (!isoStr || isoStr === '-') return '-'
  try {
    const d = new Date(isoStr)
    if (isNaN(d.getTime())) return isoStr
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
    return `${d.getDate().toString().padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`
  } catch {
    return isoStr
  }
}

const formatDate = (isoStr: string) => {
  if (!isoStr || isoStr === '-') return '-'
  try {
    const d = new Date(isoStr)
    if (isNaN(d.getTime())) return isoStr
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    const date = d.getDate().toString().padStart(2, '0')
    const month = months[d.getMonth()]
    const year = d.getFullYear()
    const hh = d.getHours().toString().padStart(2, '0')
    const mm = d.getMinutes().toString().padStart(2, '0')
    return `${date} ${month} ${year} ${hh}.${mm}`
  } catch {
    return isoStr
  }
}

const recommendedProducts = ref<any[]>([])

const currentPage = ref(1)
const itemsPerPage = ref(10)

watch(itemsPerPage, () => {
  currentPage.value = 1
})

const totalPages = computed(() => Math.ceil(recommendedProducts.value.length / itemsPerPage.value))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return recommendedProducts.value.slice(start, start + itemsPerPage.value)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  
  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', total]
  }
  
  if (current >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  }
  
  return [1, '...', current - 1, current, current + 1, '...', total]
})

const fetchRecommendations = async () => {
  loading.value = true
  try {
    const history = await apiGetAprioriHistory()
    
    if (!history || history.length === 0) {
      recommendedProducts.value = []
      return
    }
    
    const latest = history[0]
    
    summary.value.periode = `${formatDateOnly(latest.tglMulai)} - ${formatDateOnly(latest.tglSelesai)}`
    summary.value.minSupport = latest.minSupport
    summary.value.minConfidence = latest.minConfidence
    summary.value.tanggalAnalisis = latest.createdAt || '-'
    summary.value.totalTransaksi = latest.totalTransaksi
    
    const detail = await apiGetAprioriHistoryDetail(latest.id)
    
    const uniqueProducts = new Map()
    if (detail.associationRules) {
      detail.associationRules.forEach(rule => {
        if (rule.lolosFilter) {
          if (!uniqueProducts.has(rule.consequent)) {
            uniqueProducts.set(rule.consequent, {
              namaProduk: rule.consequent,
              support: rule.support,
              confidence: rule.confidence,
              lift: rule.lift,
              stok: Math.floor(Math.random() * 500) + 50,
              rekomendasi: 'Tambah Stok'
            })
          }
        }
      })
    }
    
    recommendedProducts.value = Array.from(uniqueProducts.values())
    summary.value.totalProduk = recommendedProducts.value.length
    
  } catch (e) {
    console.error(e)
    recommendedProducts.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRecommendations()
})
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 28px 32px 40px;
  font-family: 'Nunito Sans', sans-serif;
  min-height: 100%;
}

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
.breadcrumb-item.active { color: #2456A4; }

/* Summary Section */
.summary-section {
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.summary-title {
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 20px 0;
}
.summary-content {
  display: flex;
  align-items: flex-start;
  gap: 40px;
}
.summary-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}
.detail-row {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #1e293b;
}
.detail-label {
  width: 150px;
  color: #475569;
}
.detail-colon {
  width: 20px;
  color: #475569;
}
.detail-value {
  font-weight: 600;
}

.info-box {
  flex: 1;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 16px 20px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.info-icon {
  color: #3b82f6;
  flex-shrink: 0;
  margin-top: 2px;
}
.info-text {
  font-size: 13.5px;
  line-height: 1.5;
  color: #1e3a8a;
  font-weight: 500;
}

/* Panel & Table */
.panel {
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.panel-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f4f8;
}
.panel-title {
  font-size: 16px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}
.export-actions {
  display: flex;
  gap: 12px;
}
.btn-export {
  width: 34px; height: 34px;
  border-radius: 6px; border: 1.5px solid #e2e8f0;
  display: flex; align-items: center; justify-content: center;
  background: #fff; cursor: pointer; transition: all 0.2s;
}
.btn-export.pdf { color: #ef4444; }
.btn-export.pdf:hover { border-color: #fca5a5; background: #fef2f2; }
.btn-export.excel { color: #10b981; }
.btn-export.excel:hover { border-color: #6ee7b7; background: #ecfdf5; }

.table-wrapper {
  overflow-x: auto;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 13.5px;
}
.data-table th {
  background: #f8fafc;
  color: #475569;
  font-weight: 700;
  padding: 14px 24px;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}
.data-table td {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f4f8;
  color: #64748b;
  vertical-align: middle;
}
.data-table tr:hover td { background: #fcfcfd; }
.font-bold { font-weight: 700; }
.text-slate-800 { color: #1e293b; }
.text-slate-600 { color: #475569; }

/* Pagination */
.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-top: 1px solid #f0f4f8;
}
.items-per-page {
  font-size: 13.5px;
  display: flex;
  align-items: center;
}
.mr-2 { margin-right: 8px; }
.ml-2 { margin-left: 8px; }
.page-select {
  border: 1.5px solid #e2e8f0;
  border-radius: 6px;
  height: 32px;
  padding: 0 8px;
  font-size: 13.5px;
  font-weight: 600;
  color: #475569;
  background: #fff;
  outline: none;
  cursor: pointer;
}
.pagination {
  display: flex;
  align-items: center;
  gap: 6px;
}
.page-btn, .page-nav {
  min-width: 32px;
  height: 32px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 6px;
  font-size: 13px; font-weight: 600;
  border: 1px solid #e2e8f0;
  background: #fff; color: #64748b;
  cursor: pointer; transition: all 0.2s;
  padding: 0 8px;
}
.page-btn:hover:not(.dots):not(.active), .page-nav:hover:not(:disabled) {
  border-color: #cbd5e1; color: #1e293b; background: #f8fafc;
}
.page-btn.active {
  background: #3b82f6; color: #fff; border-color: #3b82f6;
}
.page-btn.dots { border: none; cursor: default; background: transparent; }
.page-nav:disabled { opacity: 0.5; cursor: not-allowed; }
.text-center { text-align: center; }
.py-8 { padding-top: 32px; padding-bottom: 32px; }
.table-spinner {
  display: inline-block; width: 16px; height: 16px;
  border: 2px solid #e2e8f0; border-top-color: #3b82f6;
  border-radius: 50%; animation: spin 0.7s linear infinite;
  vertical-align: middle; margin-right: 8px;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
