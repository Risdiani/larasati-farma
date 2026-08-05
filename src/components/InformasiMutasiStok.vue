<template>
  <div class="page">

    <!-- ── Page Header ── -->
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Informasi Mutasi Stok</h1>
        <div class="breadcrumb">
          <span class="breadcrumb-item">Dashboard</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          <span class="breadcrumb-item active">Informasi Mutasi Stok</span>
        </div>
      </div>
      <div class="page-header-right">
        <button class="btn-icon btn-pdf" title="Export PDF">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15h6"/><path d="M9 11h6"/></svg>
        </button>
        <button class="btn-icon btn-excel" title="Export Excel">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h8"/><path d="M8 17h8"/><path d="M10 9h4"/></svg>
        </button>
      </div>
    </div>

    <!-- ── Data Table Section (List View) ── -->
    <div class="data-section" v-if="!detailMode">

      <!-- Toolbar -->
      <div class="table-toolbar">
        <div class="search-box">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" v-model="searchQuery" placeholder="Cari Produk" class="search-input" />
        </div>

        <div class="filter-box">
          <select v-model="filterTipe" class="filter-select">
            <option value="">Semua Tipe</option>
            <option value="MASUK">Masuk</option>
            <option value="KELUAR">Keluar</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Nama Produk</th>
              <th>Tipe</th>
              <th>Stok Sebelum</th>
              <th>Stok Sesudah</th>
              <th>Jumlah Mutasi</th>
              <th>Tanggal Dibuat</th>
              <th>Keterangan</th>
              <th class="col-actions">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="9" class="text-center py-8">
                <span class="table-spinner"></span>
                <span class="ml-2 text-slate-500">Memuat data mutasi stok...</span>
              </td>
            </tr>
            <tr v-else-if="errorMsg">
              <td colspan="9" class="text-center py-8 text-red-500 font-medium">
                {{ errorMsg }}
              </td>
            </tr>
            <tr v-else-if="items.length === 0">
              <td colspan="9" class="text-center py-8 text-slate-500">
                Tidak ada data mutasi stok yang sesuai.
              </td>
            </tr>
            <tr v-else v-for="(item, index) in items" :key="item.id">
              <td>{{ (currentPage * pageSize) + index + 1 }}</td>
              <td class="font-bold text-slate-800">{{ item.namaProduk }}</td>
              <td>
                <span :class="['status-badge', item.tipe === 'MASUK' ? 'badge-masuk' : 'badge-keluar']">
                  {{ item.tipe === 'MASUK' ? 'Masuk' : 'Keluar' }}
                </span>
              </td>
              <td>{{ item.stokSebelum }}</td>
              <td>{{ item.stokSesudah }}</td>
              <td>{{ item.qty }}</td>
              <td>{{ formatDate(item.createdAt) }}</td>
              <td>{{ item.keterangan || '-' }}</td>
              <td class="col-actions">
                <button class="btn-action detail" @click="openDetail(item)" title="Lihat Detail">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination-wrapper" v-if="totalPages > 0">
        <div class="items-per-page">
          <span class="text-slate-500 mr-2">Tampilkan:</span>
          <select v-model="pageSize" class="page-select">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <span class="text-slate-500 ml-2">baris per halaman</span>
        </div>

        <div class="pagination">
          <button class="page-btn" :disabled="currentPage === 0" @click="changePage(currentPage - 1)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button
            v-for="p in visiblePages"
            :key="p === '...' ? 'dots-' + Math.random() : p"
            :class="['page-btn', { active: p === currentPage + 1, dots: p === '...' }]"
            @click="typeof p === 'number' ? changePage(p - 1) : null"
          >
            {{ p }}
          </button>
          <button class="page-btn" :disabled="currentPage >= totalPages - 1" @click="changePage(currentPage + 1)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>

    </div>

    <!-- ── Detail View (per produk) ── -->
    <div class="data-section" v-else>

      <!-- Detail Header -->
      <div class="detail-header">
        <button class="btn-back" @click="closeDetail">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          Kembali
        </button>
        <div class="detail-info">
          <h2 class="detail-title">Detail Mutasi Stok — {{ detailKodeProduk }}</h2>
          <p class="detail-subtitle">{{ detailNamaProduk }}</p>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="table-toolbar">
        <div></div>
        <div class="filter-box">
          <select v-model="detailFilterTipe" class="filter-select">
            <option value="">Semua Tipe</option>
            <option value="MASUK">Masuk</option>
            <option value="KELUAR">Keluar</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Tipe</th>
              <th>Stok Sebelum</th>
              <th>Stok Sesudah</th>
              <th>Jumlah Mutasi</th>
              <th>Tanggal Dibuat</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="detailLoading">
              <td colspan="7" class="text-center py-8">
                <span class="table-spinner"></span>
                <span class="ml-2 text-slate-500">Memuat detail mutasi...</span>
              </td>
            </tr>
            <tr v-else-if="detailItems.length === 0">
              <td colspan="7" class="text-center py-8 text-slate-500">
                Tidak ada data mutasi untuk produk ini.
              </td>
            </tr>
            <tr v-else v-for="(item, index) in detailItems" :key="item.id">
              <td>{{ (detailCurrentPage * detailPageSize) + index + 1 }}</td>
              <td>
                <span :class="['status-badge', item.tipe === 'MASUK' ? 'badge-masuk' : 'badge-keluar']">
                  {{ item.tipe === 'MASUK' ? 'Masuk' : 'Keluar' }}
                </span>
              </td>
              <td>{{ item.stokSebelum }}</td>
              <td>{{ item.stokSesudah }}</td>
              <td>{{ item.qty }}</td>
              <td>{{ formatDate(item.createdAt) }}</td>
              <td>{{ item.keterangan || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Detail -->
      <div class="pagination-wrapper" v-if="detailTotalPages > 0">
        <div class="items-per-page">
          <span class="text-slate-500 mr-2">Tampilkan:</span>
          <select v-model="detailPageSize" class="page-select">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
          <span class="text-slate-500 ml-2">baris per halaman</span>
        </div>

        <div class="pagination">
          <button class="page-btn" :disabled="detailCurrentPage === 0" @click="changeDetailPage(detailCurrentPage - 1)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button
            v-for="p in detailVisiblePages"
            :key="p === '...' ? 'ddots-' + Math.random() : p"
            :class="['page-btn', { active: p === detailCurrentPage + 1, dots: p === '...' }]"
            @click="typeof p === 'number' ? changeDetailPage(p - 1) : null"
          >
            {{ p }}
          </button>
          <button class="page-btn" :disabled="detailCurrentPage >= detailTotalPages - 1" @click="changeDetailPage(detailCurrentPage + 1)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { apiGetStokMutasi, apiGetStokMutasiDetail } from '../api'
import type { StokMutasiResponse } from '../api'

// ── List View State ──
const items = ref<StokMutasiResponse[]>([])
const loading = ref(false)
const errorMsg = ref('')

const searchQuery = ref('')
const filterTipe = ref('')
const currentPage = ref(0)
const pageSize = ref(10)
const totalPages = ref(1)

const loadData = async () => {
  try {
    loading.value = true
    errorMsg.value = ''
    const res = await apiGetStokMutasi(
      currentPage.value,
      pageSize.value,
      filterTipe.value || undefined,
      searchQuery.value || undefined
    )
    items.value = res.content
    totalPages.value = res.totalPages || 1
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

// Watch filters
watch([filterTipe], () => {
  currentPage.value = 0
  loadData()
})

watch(pageSize, () => {
  currentPage.value = 0
  loadData()
})

// Debounce search
let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    currentPage.value = 0
    loadData()
  }, 400)
})

const changePage = (page: number) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page
    loadData()
  }
}

// ── Detail View State ──
const detailMode = ref(false)
const detailKodeProduk = ref('')
const detailNamaProduk = ref('')
const detailItems = ref<StokMutasiResponse[]>([])
const detailLoading = ref(false)
const detailFilterTipe = ref('')
const detailCurrentPage = ref(0)
const detailPageSize = ref(10)
const detailTotalPages = ref(1)

const openDetail = (item: StokMutasiResponse) => {
  detailKodeProduk.value = item.kodeProduk
  detailNamaProduk.value = item.namaProduk
  detailCurrentPage.value = 0
  detailFilterTipe.value = ''
  detailMode.value = true
  loadDetail()
}

const closeDetail = () => {
  detailMode.value = false
}

const loadDetail = async () => {
  try {
    detailLoading.value = true
    const res = await apiGetStokMutasiDetail(
      detailKodeProduk.value,
      detailCurrentPage.value,
      detailPageSize.value,
      detailFilterTipe.value || undefined
    )
    detailItems.value = res.content
    detailTotalPages.value = res.totalPages || 1
  } catch (e: unknown) {
    console.error(e)
  } finally {
    detailLoading.value = false
  }
}

watch(detailFilterTipe, () => {
  detailCurrentPage.value = 0
  loadDetail()
})

watch(detailPageSize, () => {
  detailCurrentPage.value = 0
  loadDetail()
})

const changeDetailPage = (page: number) => {
  if (page >= 0 && page < detailTotalPages.value) {
    detailCurrentPage.value = page
    loadDetail()
  }
}

// ── Formatting ──
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const d = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
}

// ── Pagination Logic ──
const buildVisiblePages = (current: number, total: number) => {
  const c = current + 1 // 1-indexed
  if (total <= 7) {
    const pages: (number | string)[] = []
    for (let i = 1; i <= total; i++) pages.push(i)
    return pages
  }
  if (c <= 3) return [1, 2, 3, 4, '...', total - 1, total]
  if (c >= total - 2) return [1, 2, '...', total - 3, total - 2, total - 1, total]
  return [1, '...', c - 1, c, c + 1, '...', total]
}

const visiblePages = computed(() => buildVisiblePages(currentPage.value, totalPages.value))
const detailVisiblePages = computed(() => buildVisiblePages(detailCurrentPage.value, detailTotalPages.value))
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
.page-header-right {
  display: flex;
  gap: 12px;
}
.btn-icon {
  width: 40px; height: 40px;
  border-radius: 8px;
  border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-pdf {
  background: #fee2e2;
  color: #ef4444;
}
.btn-pdf:hover { background: #fecaca; }
.btn-excel {
  background: #dcfce7;
  color: #16a34a;
}
.btn-excel:hover { background: #bbf7d0; }

/* ── Data Section ── */
.data-section {
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f4f8;
}

.search-box {
  position: relative;
  width: 280px;
}
.search-icon {
  position: absolute;
  left: 12px; top: 10px;
  color: #94a3b8;
}
.search-input {
  width: 100%;
  height: 36px;
  padding: 0 12px 0 36px;
  border: 1.5px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}
.search-input:focus { border-color: #3b82f6; }

.filter-box {
  width: 200px;
}
.filter-select {
  width: 100%;
  height: 36px;
  border: 1.5px solid #e2e8f0;
  border-radius: 6px;
  padding: 0 12px;
  font-size: 13px;
  font-family: inherit;
  color: #475569;
  outline: none;
  cursor: pointer;
}

/* ── Table ── */
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
  padding: 14px 20px;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}
.data-table td {
  padding: 14px 20px;
  border-bottom: 1px solid #f0f4f8;
  color: #64748b;
  vertical-align: middle;
}
.data-table tr:hover td {
  background: #fcfcfd;
}
.data-table .col-actions {
  text-align: right;
  white-space: nowrap;
}

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}
.badge-masuk { background: #dcfce7; color: #16a34a; }
.badge-keluar { background: #fee2e2; color: #ef4444; }

.btn-action {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  width: 32px; height: 32px;
  display: inline-flex; align-items: center; justify-content: center;
  color: #64748b;
  cursor: pointer;
  margin-left: 6px;
  transition: all 0.2s;
}
.btn-action:hover { border-color: #cbd5e1; color: #1e293b; }
.btn-action.detail:hover { border-color: #3b82f6; color: #3b82f6; background: #eff6ff; }

/* ── Detail Header ── */
.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 20px 0;
}
.btn-back {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-back:hover { background: #f1f5f9; border-color: #cbd5e1; color: #1e293b; }
.detail-title {
  font-size: 16px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 2px;
}
.detail-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  font-weight: 600;
}

/* ── Pagination ── */
.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
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
.page-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid transparent;
  background: transparent;
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
}
.page-btn:hover:not(.dots):not(:disabled) {
  background: #f1f5f9;
}
.page-btn.active {
  background: #3b82f6;
  color: #fff;
}
.page-btn.dots { cursor: default; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.table-spinner {
  display: inline-block; width: 20px; height: 20px;
  border: 2px solid #e2e8f0; border-top-color: #3b82f6;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Helpers */
.text-center { text-align: center; }
.py-8 { padding-top: 32px; padding-bottom: 32px; }
.font-medium { font-weight: 500; }
.font-bold { font-weight: 700; }
.text-slate-500 { color: #64748b; }
.text-slate-800 { color: #1e293b; }
.text-red-500 { color: #ef4444; }
</style>
