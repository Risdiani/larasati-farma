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
            <tr v-for="(item, idx) in paginatedData" :key="idx">
              <td>{{ idx + 1 }}</td>
              <td>{{ item.tanggalMulai }}</td>
              <td>{{ item.tanggalBerakhir }}</td>
              <td>{{ item.minSupport }}%</td>
              <td>{{ item.minConfidence }}%</td>
              <td>
                <div class="action-buttons">
                  <button class="btn-action view" title="Lihat Detail">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const dummyData = ref([
  { tanggalMulai: '24 Dec 2024', tanggalBerakhir: '24 Dec 2024', minSupport: 5, minConfidence: 5 },
  { tanggalMulai: '24 Dec 2024', tanggalBerakhir: '24 Dec 2024', minSupport: 10, minConfidence: 10 },
  { tanggalMulai: '24 Dec 2024', tanggalBerakhir: '24 Dec 2024', minSupport: 20, minConfidence: 20 },
])

const currentPage = ref(1)
const itemsPerPage = ref(10)

watch(itemsPerPage, () => {
  currentPage.value = 1
})

const totalPages = computed(() => Math.ceil(dummyData.value.length / itemsPerPage.value))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return dummyData.value.slice(start, start + itemsPerPage.value)
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
</style>
