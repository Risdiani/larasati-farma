<template>
  <div class="page">
    
    <!-- ── Page Header ── -->
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Data Master Produk</h1>
        <div class="breadcrumb">
          <span class="breadcrumb-item">Dashboard</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          <span class="breadcrumb-item active">Data Master Produk</span>
        </div>
      </div>
      <div class="page-header-right">
        <!-- Optional Excel Import (based on icon in mockup) -->
        <button class="btn-icon btn-excel" title="Import Excel">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="8" y1="13" x2="16" y2="13"/>
            <line x1="8" y1="17" x2="16" y2="17"/>
            <line x1="10" y1="9" x2="8" y2="9"/>
          </svg>
        </button>
        <button class="btn-primary" @click="openAddModal">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Tambah Produk
        </button>
      </div>
    </div>

    <!-- ── Data Table Section ── -->
    <div class="data-section">
      
      <!-- Toolbar -->
      <div class="table-toolbar">
        <div class="search-box">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" v-model="searchQuery" placeholder="Cari" class="search-input" />
        </div>
        
        <div class="filter-box">
          <select v-model="filterCategory" class="filter-select">
            <option value="">Kategori Produk</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.nama">{{ cat.nama }}</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Kode</th>
              <th>Nama Produk</th>
              <th>Kategori</th>
              <th>Satuan</th>
              <th>Harga</th>
              <th>Status</th>
              <th>Stok</th>
              <th>Tanggal Input</th>
              <th class="col-actions">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="9" class="text-center py-8">
                <span class="table-spinner"></span>
                <span class="ml-2 text-slate-500">Memuat data produk...</span>
              </td>
            </tr>
            <tr v-else-if="errorMsg">
              <td colspan="9" class="text-center py-8 text-red-500 font-medium">
                {{ errorMsg }}
              </td>
            </tr>
            <tr v-else-if="products.length === 0">
              <td colspan="9" class="text-center py-8 text-slate-500">
                Tidak ada data produk yang sesuai.
              </td>
            </tr>
            <tr v-else v-for="item in products" :key="item.id">
              <td class="font-medium text-slate-600">{{ item.kodeProduk }}</td>
              <td class="font-bold text-slate-800">{{ item.namaProduk }}</td>
              <td>{{ item.kategori || '-' }}</td>
              <td>{{ item.satuan }}</td>
              <td>Rp {{ item.harga }}</td>
              <td>
                <span :class="['status-badge', item.isActive ? 'badge-ada' : 'badge-discontinue']">
                  {{ item.isActive ? 'Ada' : 'Discontinue' }}
                </span>
              </td>
              <!-- Dummy stock representation as backend currently doesn't return stokTersedia -->
              <td>0</td> 
              <td>{{ formatDate(item.createdAt) }}</td>
              <td class="col-actions">
                <button class="btn-action edit" @click="openEditModal(item)" title="Edit">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="btn-action delete" @click="confirmDelete(item)" title="Hapus">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
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
          <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
        <button 
          v-for="p in visiblePages" 
          :key="p === '...' ? Math.random() : p"
          :class="['page-btn', { active: p === currentPage, dots: p === '...' }]"
          @click="typeof p === 'number' ? currentPage = p : null"
        >
          {{ p }}
        </button>
          <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- ── Modal Form Produk ── -->
    <div class="modal-backdrop" v-if="showModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">{{ isEditMode ? 'Edit Produk' : 'Tambah Produk Baru' }}</h2>
          <button class="modal-close" @click="closeModal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        
        <form @submit.prevent="submitForm" class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label>Kode Produk <span class="req">*</span></label>
              <input type="text" v-model="form.kodeProduk" class="form-input" required :disabled="isEditMode" />
            </div>
            <div class="form-group">
              <label>Nama Produk <span class="req">*</span></label>
              <input type="text" v-model="form.namaProduk" class="form-input" required />
            </div>
            <div class="form-group">
              <label>Kategori</label>
              <select v-model="form.kategoriId" class="form-select">
                <option :value="null">Pilih Kategori</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nama }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Satuan</label>
              <input type="text" v-model="form.satuan" class="form-input" />
            </div>
            <div class="form-group">
              <label>Harga <span class="req">*</span></label>
              <input type="number" v-model="form.harga" class="form-input" required min="0" />
            </div>
            <div class="form-group">
              <label>Status Aktif</label>
              <div class="toggle-wrapper" @click="form.isActive = !form.isActive">
                <div :class="['toggle-track', form.isActive ? 'on' : 'off']">
                  <div class="toggle-thumb"></div>
                </div>
                <span class="toggle-label">{{ form.isActive ? 'Ada' : 'Discontinue' }}</span>
              </div>
            </div>
          </div>
          
          <div v-if="modalError" class="modal-error">{{ modalError }}</div>
          
          <div class="modal-footer">
            <button type="button" class="btn-cancel" @click="closeModal" :disabled="submitting">Batal</button>
            <button type="submit" class="btn-save" :disabled="submitting">
              <span v-if="submitting" class="btn-spinner"></span>
              <span v-else>{{ isEditMode ? 'Simpan Perubahan' : 'Tambah Produk' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ── Modal Delete ── -->
    <div class="modal-backdrop" v-if="showDeleteModal">
      <div class="modal-content modal-sm">
        <div class="modal-header">
          <h2 class="modal-title">Hapus Produk</h2>
          <button class="modal-close" @click="showDeleteModal = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal-body text-center py-4">
          <p class="mb-1 text-slate-600">Apakah Anda yakin ingin menghapus produk:</p>
          <p class="font-bold text-slate-800 text-lg mb-4">{{ itemToDelete?.namaProduk }} ({{ itemToDelete?.kodeProduk }})</p>
          <div v-if="modalError" class="modal-error mb-4">{{ modalError }}</div>
        </div>
        <div class="modal-footer justify-center">
          <button class="btn-cancel" @click="showDeleteModal = false" :disabled="submitting">Batal</button>
          <button class="btn-delete-confirm" @click="executeDelete" :disabled="submitting">
            <span v-if="submitting" class="btn-spinner"></span>
            <span v-else>Ya, Hapus</span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { apiGetProducts, apiGetCategories, apiCreateProduct, apiUpdateProduct, apiDeleteProduct } from '../api'
import type { ProductResponse, CategoryResponse, ProductRequest } from '../api'

const products = ref<ProductResponse[]>([])
const categories = ref<CategoryResponse[]>([])
const loading = ref(true)
const errorMsg = ref('')

const searchQuery = ref('')
const filterCategory = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Modal states
const showModal = ref(false)
const isEditMode = ref(false)
const submitting = ref(false)
const modalError = ref('')
const currentId = ref<number | null>(null)

const showDeleteModal = ref(false)
const itemToDelete = ref<ProductResponse | null>(null)

const form = ref<ProductRequest>({
  kodeProduk: '',
  namaProduk: '',
  kategoriId: null,
  satuan: '',
  harga: 0,
  isActive: true
})

const totalPages = ref(1)

// Load initial data
const loadData = async () => {
  try {
    loading.value = true
    errorMsg.value = ''
    const [prodsRes, cats] = await Promise.all([
      apiGetProducts(currentPage.value - 1, itemsPerPage.value, searchQuery.value || undefined, filterCategory.value || undefined),
      apiGetCategories()
    ])
    products.value = prodsRes.content
    totalPages.value = prodsRes.totalPages
    categories.value = cats
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

watch([searchQuery, filterCategory, itemsPerPage], () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1
  } else {
    loadData()
  }
})

watch(currentPage, () => {
  loadData()
})



const visiblePages = computed(() => {
  const current = currentPage.value
  const last = totalPages.value
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1)
  
  if (current <= 3) return [1, 2, 3, 4, '...', last - 1, last]
  if (current >= last - 2) return [1, 2, '...', last - 3, last - 2, last - 1, last]
  
  return [1, '...', current - 1, current, current + 1, '...', last]
})

// Formatting
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const d = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
}

// Actions
const openAddModal = () => {
  isEditMode.value = false
  currentId.value = null
  form.value = {
    kodeProduk: '',
    namaProduk: '',
    kategoriId: null,
    satuan: '',
    harga: 0,
    isActive: true
  }
  modalError.value = ''
  showModal.value = true
}

const openEditModal = (item: ProductResponse) => {
  isEditMode.value = true
  currentId.value = item.id
  
  // Find category ID based on name since backend returns name
  let catId = null
  if (item.kategori) {
    const found = categories.value.find(c => c.nama === item.kategori)
    if (found) catId = found.id
  }

  form.value = {
    kodeProduk: item.kodeProduk,
    namaProduk: item.namaProduk,
    kategoriId: catId,
    satuan: item.satuan,
    harga: item.harga,
    isActive: item.isActive
  }
  modalError.value = ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const submitForm = async () => {
  try {
    submitting.value = true
    modalError.value = ''
    
    if (isEditMode.value && currentId.value) {
      await apiUpdateProduct(currentId.value, form.value)
    } else {
      await apiCreateProduct(form.value)
    }
    
    closeModal()
    await loadData()
  } catch (e: unknown) {
    modalError.value = e instanceof Error ? e.message : 'Terjadi kesalahan'
  } finally {
    submitting.value = false
  }
}

const confirmDelete = (item: ProductResponse) => {
  itemToDelete.value = item
  modalError.value = ''
  showDeleteModal.value = true
}

const executeDelete = async () => {
  if (!itemToDelete.value) return
  
  try {
    submitting.value = true
    modalError.value = ''
    await apiDeleteProduct(itemToDelete.value.id)
    showDeleteModal.value = false
    await loadData()
  } catch (e: unknown) {
    modalError.value = e instanceof Error ? e.message : 'Gagal menghapus'
  } finally {
    submitting.value = false
  }
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
.btn-excel {
  background: #dcfce7;
  color: #16a34a;
}
.btn-excel:hover { background: #bbf7d0; }
.btn-primary {
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0 20px;
  font-size: 13.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover { background: #2563eb; }

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
.badge-ada { background: #dcfce7; color: #16a34a; }
.badge-discontinue { background: #f1f5f9; color: #64748b; }

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
.btn-action.delete:hover { border-color: #fca5a5; color: #ef4444; background: #fef2f2; }

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

/* ── Modals ── */
.modal-backdrop {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
  backdrop-filter: blur(2px);
}
.modal-content {
  background: #fff;
  border-radius: 16px;
  width: 90%; max-width: 600px;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
  overflow: hidden;
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-sm { max-width: 400px; }
.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f4f8;
}
.modal-title { font-size: 18px; font-weight: 800; color: #1e293b; margin: 0; }
.modal-close {
  background: none; border: none; color: #94a3b8; cursor: pointer;
  padding: 4px; border-radius: 4px;
}
.modal-close:hover { background: #f1f5f9; color: #475569; }
.modal-body { padding: 24px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 13px; font-weight: 700; color: #475569; }
.req { color: #ef4444; }
.form-input, .form-select {
  height: 40px; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 0 12px;
  font-family: inherit; font-size: 14px; color: #1e293b;
  outline: none; transition: border-color 0.2s;
}
.form-input:focus, .form-select:focus { border-color: #3b82f6; }
.form-input:disabled { background: #f8fafc; color: #94a3b8; cursor: not-allowed; }

.toggle-wrapper {
  display: flex; align-items: center; gap: 10px; cursor: pointer;
  height: 40px;
}
.toggle-track {
  width: 44px; height: 24px; border-radius: 12px; background: #e2e8f0;
  position: relative; transition: background 0.3s;
}
.toggle-track.on { background: #10b981; }
.toggle-thumb {
  width: 20px; height: 20px; border-radius: 50%; background: #fff;
  position: absolute; top: 2px; left: 2px; transition: transform 0.3s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.toggle-track.on .toggle-thumb { transform: translateX(20px); }
.toggle-label { font-size: 14px; font-weight: 600; color: #475569; }

.modal-footer {
  padding: 16px 24px; border-top: 1px solid #f0f4f8; background: #f8fafc;
  display: flex; justify-content: flex-end; gap: 12px;
}
.justify-center { justify-content: center; }
.modal-error { color: #ef4444; font-size: 13px; font-weight: 600; margin-top: 16px; }

.btn-cancel {
  background: #fff; border: 1.5px solid #e2e8f0; border-radius: 8px;
  padding: 0 20px; height: 40px; font-weight: 700; color: #64748b;
  cursor: pointer; transition: all 0.2s;
}
.btn-cancel:hover { background: #f8fafc; color: #1e293b; border-color: #cbd5e1; }
.btn-save, .btn-delete-confirm {
  background: #3b82f6; color: #fff; border: none; border-radius: 8px;
  padding: 0 24px; height: 40px; font-weight: 700;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  min-width: 120px; transition: background 0.2s;
}
.btn-save:hover { background: #2563eb; }
.btn-delete-confirm { background: #ef4444; }
.btn-delete-confirm:hover { background: #dc2626; }

.table-spinner, .btn-spinner {
  display: inline-block; width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
.table-spinner { border-color: #e2e8f0; border-top-color: #3b82f6; width: 20px; height: 20px; }

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

/* Helpers */
.text-center { text-align: center; }
.py-8 { padding-top: 32px; padding-bottom: 32px; }
.py-4 { padding-top: 16px; padding-bottom: 16px; }
.mb-1 { margin-bottom: 4px; }
.mb-4 { margin-bottom: 16px; }
.ml-2 { margin-left: 8px; }
.font-medium { font-weight: 500; }
.font-bold { font-weight: 700; }
.text-slate-500 { color: #64748b; }
.text-slate-600 { color: #475569; }
.text-slate-800 { color: #1e293b; }
.text-red-500 { color: #ef4444; }
.text-lg { font-size: 16px; }
</style>
