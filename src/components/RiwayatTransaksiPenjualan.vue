<template>
  <div class="page">
    <!-- ── Page Header ── -->
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Riwayat Transaksi Penjualan</h1>
        <div class="breadcrumb">
          <span class="breadcrumb-item">Dashboard</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          <span class="breadcrumb-item">Penjualan</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          <span class="breadcrumb-item active">Riwayat Transaksi Penjualan</span>
        </div>
      </div>
    </div>

    <!-- ── Filters ── -->
    <div class="filter-section">
      <div class="filter-group">
        <label class="filter-label">Periode Transaksi</label>
        <div class="filter-controls">
          <div class="date-range-wrapper">
            <input type="date" v-model="startDate" class="date-input range-input" />
            <span class="range-separator">s/d</span>
            <input type="date" v-model="endDate" class="date-input range-input" />
          </div>
          <button class="btn-primary" @click="handleSearch">Cari Transaksi</button>
          
          <div class="divider"></div>
          
          <button class="btn-primary" @click="emit('navigate', 'transaksi-penjualan')">+ Transaksi Baru</button>

          <button class="btn-primary" @click="triggerFileInput" :disabled="uploading">
            <span v-if="uploading" class="btn-spinner"></span>
            <span v-else>Import Data Transaksi</span>
          </button>
          <input type="file" ref="fileInput" class="hidden" accept=".xlsx,.xls,.csv" @change="handleFileUpload" />
        </div>
      </div>
      <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
      <div v-if="successMsg" class="success-msg">{{ successMsg }}</div>
    </div>

    <!-- ── Table Section ── -->
    <div class="table-section">
      <div class="table-header-bar">
        <h2 class="table-title">Riwayat Transaksi Penjualan</h2>
        <div class="export-actions">
          <button class="btn-export pdf" title="Export PDF">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </button>
          <button class="btn-export excel" title="Export Excel">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </button>
        </div>
      </div>
      
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 15%">ID Transaksi</th>
              <th style="width: 15%">Tanggal</th>
              <th style="width: 20%">Sumber Data</th>
              <th style="width: 15%">Total Item</th>
              <th style="width: 20%">Total Harga</th>
              <th style="width: 15%" class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="text-center py-8">
                <span class="table-spinner"></span>
                <span class="ml-2 text-slate-500">Memuat riwayat transaksi...</span>
              </td>
            </tr>
            <tr v-else-if="paginatedData.length === 0">
              <td colspan="6" class="text-center py-8 text-slate-500">
                Tidak ada riwayat transaksi.
              </td>
            </tr>
            <tr v-else v-for="(item, index) in paginatedData" :key="index">
              <td class="text-blue-500 font-medium">{{ item.kodeTransaksi }}</td>
              <td class="text-slate-600">{{ formatDate(item.transactionDate) }}</td>
              <td class="text-slate-600">{{ item.sumberData || 'Manual' }}</td>
              <td class="text-slate-600">{{ getTotalQty(item) }}</td>
              <td class="text-slate-600 font-bold">Rp {{ formatPrice(item.totalHarga) }}</td>
              <td class="text-center">
                <button class="btn-action view" @click="openDetailModal(item)" title="Lihat Detail">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination-wrapper" v-if="!loading && paginatedData.length > 0">
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
          <button 
            class="page-nav" 
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
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

        <button 
          class="page-nav" 
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
      </div>
    </div>
    <!-- Modal Detail Transaksi -->
    <div class="modal-backdrop" v-if="showDetailModal">
      <div class="modal-content modal-lg">
        <div class="modal-header">
          <h2 class="modal-title">Detail Transaksi: <span class="text-blue-500">{{ selectedTransaction?.kodeTransaksi }}</span></h2>
          <button class="modal-close" @click="closeDetailModal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal-body p-0">
          <div class="table-container m-0 border-0 rounded-none">
            <table class="data-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Produk</th>
                  <th>Harga Satuan</th>
                  <th>Jumlah</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(detail, idx) in selectedTransaction?.details || []" :key="idx">
                  <td>{{ idx + 1 }}</td>
                  <td class="font-bold text-slate-800">{{ detail.namaProduk }}</td>
                  <td>Rp {{ formatPrice(detail.hargaSatuan) }}</td>
                  <td>{{ formatQty(detail.jumlah) }}</td>
                  <td>Rp {{ formatPrice(detail.subtotal) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="p-5 flex justify-end items-center bg-slate-50 border-t border-slate-100">
            <span class="mr-4 text-slate-500">Total Harga:</span>
            <span class="text-xl font-bold text-slate-800">Rp {{ formatPrice(selectedTransaction?.totalHarga || 0) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { apiGetTransactions, apiImportExcelTransaction } from '../api'
import type { TransactionRes } from '../api'

const emit = defineEmits<{
  (e: 'navigate', page: string): void
}>()

const paginatedData = ref<TransactionRes[]>([])
const totalPages = ref(1)
const loading = ref(true)
const uploading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

// Date filters
const startDate = ref('')
const endDate = ref('')

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)

watch(itemsPerPage, () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1
  } else {
    loadData()
  }
})

watch(currentPage, () => {
  loadData()
})

const handleSearch = () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1
  } else {
    loadData()
  }
}

const loadData = async () => {
  try {
    loading.value = true
    errorMsg.value = ''
    successMsg.value = ''
    
    const pageIndex = currentPage.value - 1
    const res = await apiGetTransactions(pageIndex, itemsPerPage.value, startDate.value || undefined, endDate.value || undefined)
    
    totalPages.value = res.totalPages
    totalPages.value = res.totalPages
    paginatedData.value = res.content || []
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

// Modal Detail Logic
const showDetailModal = ref(false)
const selectedTransaction = ref<TransactionRes | null>(null)

const openDetailModal = (item: TransactionRes) => {
  selectedTransaction.value = item
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedTransaction.value = null
}

const getTotalQty = (item: TransactionRes) => {
  if (!item.details) return 0
  return item.details.reduce((sum, d) => sum + d.jumlah, 0)
}

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  
  const file = target.files[0]
  try {
    uploading.value = true
    errorMsg.value = ''
    successMsg.value = ''
    
    await apiImportExcelTransaction(file)
    
    successMsg.value = 'Berhasil mengimpor data transaksi!'
    await loadData()
    
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : 'Gagal mengimpor data'
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

// Pagination logic

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

// Formatting
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const d = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
}

const formatPrice = (val: number) => {
  return val.toLocaleString('id-ID')
}

const formatQty = (qty: number) => {
  return qty
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
.breadcrumb-item.active { color: #2456A4; }

/* ── Filter Section ── */
.filter-section {
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.filter-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.filter-label {
  font-size: 14px;
  font-weight: 700;
  color: #475569;
}
.filter-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.date-range-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  padding: 0 12px;
  height: 42px;
}
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
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.divider {
  width: 1px;
  height: 30px;
  background: #e2e8f0;
  margin: 0 8px;
}
.hidden { display: none; }
.error-msg { color: #ef4444; font-size: 13.5px; font-weight: 600; margin-top: 12px; }
.success-msg { color: #10b981; font-size: 13.5px; font-weight: 600; margin-top: 12px; }

/* ── Table Section ── */
.table-section {
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.table-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f4f8;
}
.table-title {
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

.table-container {
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

.text-blue-500 { color: #3b82f6; }
.font-medium { font-weight: 500; }
.font-bold { font-weight: 700; }
.text-slate-800 { color: #1e293b; }
.text-slate-600 { color: #475569; }

.product-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.product-icon {
  width: 32px; height: 32px;
  background: #f1f5f9;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}

/* ── Pagination ── */
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
.page-btn.dots { border: none; cursor: default; }
.page-nav:disabled { opacity: 0.5; cursor: not-allowed; }

/* Helpers */
.text-center { text-align: center; }
.py-8 { padding-top: 32px; padding-bottom: 32px; }
.ml-2 { margin-left: 8px; }
.btn-spinner {
  display: inline-block; width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
.table-spinner {
  display: inline-block; width: 20px; height: 20px;
  border: 2px solid #e2e8f0; border-top-color: #3b82f6;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Modal Styles */
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
  width: 90%; max-width: 500px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}
.modal-lg { max-width: 700px; }
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
.p-0 { padding: 0 !important; }
.m-0 { margin: 0 !important; }
.border-0 { border: none !important; }
.rounded-none { border-radius: 0 !important; }
.flex { display: flex; }
.justify-end { justify-content: flex-end; }
.items-center { align-items: center; }
.bg-slate-50 { background-color: #f8fafc; }
.border-t { border-top: 1px solid #f0f4f8; }
.p-5 { padding: 20px; }
.text-xl { font-size: 20px; }
.btn-action.view { background: #eff6ff; color: #3b82f6; }
.btn-action.view:hover { background: #dbeafe; }
.btn-action {
  width: 32px; height: 32px;
  border-radius: 6px; border: none;
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.2s; margin: 0 2px;
}
</style>
