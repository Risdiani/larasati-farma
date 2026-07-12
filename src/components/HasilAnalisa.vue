<template>
  <div class="page">
    <!-- ── Page Header ── -->
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Proses Algoritma Apriori</h1>
        <div class="breadcrumb">
          <span class="breadcrumb-item">Dashboard</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          <span class="breadcrumb-item">Analisis Apriori</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          <span class="breadcrumb-item active">Proses Algoritma Apriori</span>
        </div>
      </div>
    </div>

    <!-- ── Filters ── -->
    <div class="filter-section">
      <div class="filter-group">
        <label class="filter-label">Periode Proses Apriori</label>
        <div class="filter-controls">
          <div class="date-range-wrapper">
            <input type="date" class="date-input range-input" />
            <span class="range-separator">s/d</span>
            <input type="date" class="date-input range-input" />
          </div>
          <button class="btn-primary">Cari Hasil Analisa</button>
        </div>
      </div>
    </div>

    <!-- ── Results Section ── -->
    <div class="panel">
      <div class="panel-header">Hasil Analisa</div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 5%">No</th>
              <th style="width: 25%">Tanggal Mulai</th>
              <th style="width: 25%">Tanggal Berakhir</th>
              <th style="width: 15%">Minimal Support</th>
              <th style="width: 20%">Minimal Confidence</th>
              <th style="width: 10%">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="text-center py-8">Memuat riwayat analisa...</td>
            </tr>
            <tr v-else-if="paginatedData.length === 0">
              <td colspan="6" class="text-center py-8">Tidak ada hasil analisa.</td>
            </tr>
            <tr v-else v-for="(item, idx) in paginatedData" :key="idx">
              <td>{{ (currentPage - 1) * itemsPerPage + idx + 1 }}</td>
              <td>{{ item.tglMulai }}</td>
              <td>{{ item.tglSelesai }}</td>
              <td>{{ item.minSupport }}%</td>
              <td>{{ item.minConfidence }}%</td>
              <td>
                <div class="action-buttons">
                  <button class="btn-action view" title="Lihat Detail" @click="openDetail(item.id)">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  </button>
                  <button class="btn-action delete" title="Hapus">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>
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
    
    <!-- Modal Detail Analisa -->
    <div class="modal-backdrop" v-if="showDetailModal">
      <div class="modal-content modal-xl">
        <div class="modal-header">
          <h2 class="modal-title">Detail Hasil Analisa <span class="text-blue-500">#{{ selectedDetail?.id }}</span></h2>
          <button class="modal-close" @click="closeDetail">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <div v-if="modalLoading" class="text-center py-8">Memuat detail...</div>
          <div v-else-if="selectedDetail">
             <div class="summary-grid mb-6">
               <div class="summary-item">
                 <span class="summary-label">Periode Analisis:</span>
                 <span class="summary-value">{{ selectedDetail.tglMulai }} s/d {{ selectedDetail.tglSelesai }}</span>
               </div>
               <div class="summary-item">
                 <span class="summary-label">Total Transaksi:</span>
                 <span class="summary-value">{{ selectedDetail.totalTransaksi }}</span>
               </div>
               <div class="summary-item">
                 <span class="summary-label">Min. Support:</span>
                 <span class="summary-value">{{ selectedDetail.minSupport }}%</span>
               </div>
               <div class="summary-item">
                 <span class="summary-label">Min. Confidence:</span>
                 <span class="summary-value">{{ selectedDetail.minConfidence }}%</span>
               </div>
             </div>
             
             <h3 class="section-title">Association Rules</h3>
             <div class="table-container mb-6">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Aturan (Antecedent -> Consequent)</th>
                      <th>Support</th>
                      <th>Confidence</th>
                      <th>Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(rule, i) in selectedDetail.associationRules" :key="i">
                      <td>{{ i + 1 }}</td>
                      <td>{{ rule.antecedent }} -> {{ rule.consequent }}</td>
                      <td>{{ rule.support.toFixed(2) }}%</td>
                      <td>{{ rule.confidence.toFixed(2) }}%</td>
                      <td>
                        <span :class="rule.lolosFilter ? 'text-success' : 'text-danger'">
                           {{ rule.lolosFilter ? 'Lolos' : 'Tidak Lolos' }}
                        </span>
                      </td>
                    </tr>
                    <tr v-if="!selectedDetail.associationRules?.length">
                       <td colspan="5" class="text-center">Tidak ada aturan.</td>
                    </tr>
                  </tbody>
                </table>
             </div>
             
             <h3 class="section-title">Frequent Itemsets</h3>
             <div class="table-container">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Level</th>
                      <th>Itemset</th>
                      <th>Support</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in selectedDetail.frequentItemsets" :key="i">
                      <td>Itemset {{ item.level }}</td>
                      <td>{{ item.item }}</td>
                      <td>{{ item.support.toFixed(2) }}%</td>
                      <td>
                        <span :class="item.keterangan === 'Lolos' ? 'text-success' : 'text-danger'">
                           {{ item.keterangan }}
                        </span>
                      </td>
                    </tr>
                    <tr v-if="!selectedDetail.frequentItemsets?.length">
                       <td colspan="4" class="text-center">Tidak ada itemset.</td>
                    </tr>
                  </tbody>
                </table>
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { apiGetAprioriHistory, apiGetAprioriHistoryDetail } from '../api'
import type { AprioriHistorySummaryRes, AprioriHistoryDetailRes } from '../api'

const historyData = ref<AprioriHistorySummaryRes[]>([])
const loading = ref(false)
const errorMsg = ref('')

const loadData = async () => {
  try {
    loading.value = true
    errorMsg.value = ''
    const res = await apiGetAprioriHistory()
    historyData.value = res
  } catch(e) {
    errorMsg.value = e instanceof Error ? e.message : 'Gagal memuat history'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

const currentPage = ref(1)
const itemsPerPage = ref(10)

watch(itemsPerPage, () => {
  currentPage.value = 1
})

const totalPages = computed(() => Math.ceil(historyData.value.length / itemsPerPage.value))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return historyData.value.slice(start, start + itemsPerPage.value)
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

// Modal Logic
const showDetailModal = ref(false)
const selectedDetail = ref<AprioriHistoryDetailRes | null>(null)
const modalLoading = ref(false)

const openDetail = async (id: number) => {
  try {
    modalLoading.value = true
    showDetailModal.value = true
    selectedDetail.value = null
    const res = await apiGetAprioriHistoryDetail(id)
    selectedDetail.value = res
  } catch(e) {
    console.error(e)
  } finally {
    modalLoading.value = false
  }
}

const closeDetail = () => {
  showDetailModal.value = false
  selectedDetail.value = null
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

/* Filter Section */
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
  gap: 16px;
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
.btn-primary:hover { background: #2563eb; }

/* Panel / Table */
.panel {
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.panel-header {
  background: #fff;
  padding: 20px 24px;
  font-size: 16px;
  font-weight: 800;
  color: #1e293b;
  border-bottom: 1px solid #f0f4f8;
}

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

.action-buttons {
  display: flex;
  gap: 8px;
}
.btn-action {
  width: 32px; height: 32px;
  border-radius: 6px;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.2s;
  color: #64748b;
}
.btn-action:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
  color: #1e293b;
}

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

/* Modal and Detail Styles */
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex; align-items: center; justify-content: center;
}
.modal-content {
  background: #fff;
  border-radius: 16px;
  width: 95%; max-width: 800px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  overflow: hidden;
  display: flex; flex-direction: column; max-height: 90vh;
}
.modal-xl { max-width: 900px; }
.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f4f8;
  display: flex; justify-content: space-between; align-items: center;
}
.modal-title { font-size: 18px; font-weight: 800; color: #1e293b; margin: 0; }
.modal-close {
  background: transparent; border: none; color: #64748b;
  cursor: pointer; padding: 4px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
}
.modal-close:hover { background: #f1f5f9; color: #0f172a; }
.modal-body { 
  padding: 24px;
  overflow-y: auto;
}
.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}
.summary-item {
  display: flex; flex-direction: column; gap: 4px;
}
.summary-label {
  font-size: 12px; color: #64748b; font-weight: 600;
}
.summary-value {
  font-size: 14px; font-weight: 700; color: #1e293b;
}
.section-title {
  font-size: 16px; font-weight: 800; color: #1e293b; margin: 0 0 12px;
}
.mb-6 { margin-bottom: 24px; }
.table-container {
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}
.text-success { color: #10b981; font-weight: 600; }
.text-danger { color: #ef4444; font-weight: 600; }
.text-blue-500 { color: #3b82f6; }
</style>
