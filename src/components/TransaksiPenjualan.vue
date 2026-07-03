<template>
  <div class="page">
    <!-- ── Page Header ── -->
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Transaksi Penjualan</h1>
        <div class="breadcrumb">
          <span class="breadcrumb-item">Dashboard</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          <span class="breadcrumb-item">Penjualan</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          <span class="breadcrumb-item active">Transaksi Penjualan</span>
        </div>
      </div>
    </div>

    <!-- ── Transaction Content ── -->
    <div class="transaction-container">
      
      <!-- Order List Banner -->
      <div class="order-list-banner">
        <h2 class="banner-title">Order List</h2>
        <!-- <p class="banner-subtitle">Kode Transaksi : {{ kodeTransaksi }}</p> -->
      </div>

      <!-- Cari Produk Dropdown -->
      <div class="search-section">
        <h3 class="section-title">Detail Penjualan</h3>
        <div class="select-wrapper">
          <select v-model="selectedProductKode" class="product-select" @change="handleProductSelect">
            <option value="" disabled>Cari Produk</option>
            <option v-for="prod in products" :key="prod.kodeProduk" :value="prod.kodeProduk">
              {{ prod.namaProduk }} ({{ prod.kodeProduk }}) - Rp {{ formatPrice(prod.harga) }}
            </option>
          </select>
          <svg class="select-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>

      <!-- Added Products Area -->
      <div class="added-products-section">
        <div class="section-header">
          <h3 class="section-title">Produk Ditambahkan</h3>
          <button v-if="cart.length > 0" class="btn-clear" @click="clearCart">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Hapus semua
          </button>
        </div>

        <!-- Empty State -->
        <div v-if="cart.length === 0" class="empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5">
            <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <p>Belum ada produk yang ditambah</p>
        </div>

        <!-- Cart Table -->
        <div v-else class="cart-table-wrapper">
          <table class="cart-table">
            <thead>
              <tr>
                <th style="width: 30%">Nama Produk</th>
                <th style="width: 20%">ID Produk</th>
                <th style="width: 15%">Harga</th>
                <th style="width: 15%">Jumlah</th>
                <th style="width: 15%">Total</th>
                <th style="width: 5%"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in cart" :key="item.kodeProduk">
                <td>
                  <div class="product-name">{{ item.namaProduk }}</div>
                  <div class="product-stock">In Stock: {{ formatStock(0) }}</div> <!-- Dummy stock logic for now -->
                </td>
                <td>
                  <div class="product-id-box">{{ item.kodeProduk }}</div>
                </td>
                <td class="price-cell">Rp {{ formatPrice(item.harga) }}</td>
                <td>
                  <div class="qty-control">
                    <button class="qty-btn" @click="updateQty(index, -1)">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                    <span class="qty-value">{{ item.jumlah }}</span>
                    <button class="qty-btn" @click="updateQty(index, 1)">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                  </div>
                </td>
                <td class="total-cell font-bold">Rp {{ formatPrice(item.harga * item.jumlah) }}</td>
                <td class="action-cell">
                  <button class="btn-remove-item" @click="removeItem(index)" title="Hapus Produk">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="transaction-footer">
        <div class="total-bar">
          Total : Rp {{ formatPrice(grandTotal) }}
        </div>
        <div class="action-buttons">
          <button class="btn-action-footer btn-cancel" @click="clearCart" :disabled="submitting">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            Batal
          </button>
          <button class="btn-action-footer btn-save" @click="submitTransaction" :disabled="submitting || cart.length === 0">
            <span v-if="submitting" class="btn-spinner"></span>
            <template v-else>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Simpan
            </template>
          </button>
        </div>
        <div v-if="errorMsg" class="error-msg text-center mt-4">{{ errorMsg }}</div>
        <div v-if="successMsg" class="success-msg text-center mt-4">{{ successMsg }}</div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { apiGetProducts, apiCreateTransaction } from '../api'
import type { ProductResponse, TransactionReq } from '../api'

const products = ref<ProductResponse[]>([])
const selectedProductKode = ref('')
const errorMsg = ref('')
const successMsg = ref('')
const submitting = ref(false)

type CartItem = ProductResponse & { jumlah: number }
const cart = ref<CartItem[]>([])

// Auto generate TR code based on timestamp
const kodeTransaksi = ref(`TRX${Date.now().toString().slice(-6)}`)

onMounted(async () => {
  try {
    products.value = await apiGetProducts()
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : 'Gagal memuat daftar produk'
  }
})

const handleProductSelect = () => {
  if (!selectedProductKode.value) return
  
  const prod = products.value.find(p => p.kodeProduk === selectedProductKode.value)
  if (prod) {
    const existingIndex = cart.value.findIndex(item => item.kodeProduk === prod.kodeProduk)
    if (existingIndex >= 0) {
      cart.value[existingIndex].jumlah += 1
    } else {
      cart.value.push({ ...prod, jumlah: 1 })
    }
  }
  // Reset dropdown
  selectedProductKode.value = ''
}

const updateQty = (index: number, change: number) => {
  const newQty = cart.value[index].jumlah + change
  if (newQty > 0) {
    cart.value[index].jumlah = newQty
  }
}

const removeItem = (index: number) => {
  cart.value.splice(index, 1)
}

const clearCart = () => {
  cart.value = []
  errorMsg.value = ''
  successMsg.value = ''
  kodeTransaksi.value = `TRX${Date.now().toString().slice(-6)}`
}

const grandTotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.harga * item.jumlah), 0)
})

const formatPrice = (val: number) => {
  return val.toLocaleString('id-ID')
}

// Dummy stock formatter since API does not return stock right now
const formatStock = (stock: number) => {
  return stock < 10 ? `0${stock}` : stock
}

const submitTransaction = async () => {
  if (cart.value.length === 0) return
  
  try {
    submitting.value = true
    errorMsg.value = ''
    successMsg.value = ''
    
    // YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0]
    
    const payload: TransactionReq = {
      kodeTransaksi: kodeTransaksi.value,
      transactionDate: today,
      catatan: 'Transaksi Penjualan Manual',
      details: cart.value.map(item => ({
        kodeProduk: item.kodeProduk,
        jumlah: item.jumlah,
        hargaSatuan: item.harga
      }))
    }
    
    await apiCreateTransaction(payload)
    successMsg.value = 'Transaksi berhasil disimpan!'
    
    // Clear form after delay
    setTimeout(() => {
      clearCart()
    }, 2000)
    
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : 'Gagal menyimpan transaksi'
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

/* ── Content Container ── */
.transaction-container {
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* ── Order List Banner ── */
.order-list-banner {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px 20px;
}
.banner-title {
  font-size: 16px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 4px;
}
.banner-subtitle {
  font-size: 13.5px;
  color: #64748b;
  margin: 0;
}

/* ── Sections ── */
.section-title {
  font-size: 15px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 12px;
}

/* Select Box */
.select-wrapper {
  position: relative;
  width: 100%;
}
.product-select {
  width: 100%;
  appearance: none;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  height: 44px;
  padding: 0 40px 0 16px;
  font-family: inherit;
  font-size: 14px;
  color: #475569;
  background: #fff;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}
.product-select:focus { border-color: #3b82f6; }
.product-select:disabled { background: #f8fafc; cursor: not-allowed; }
.select-icon {
  position: absolute;
  right: 16px;
  top: 14px;
  color: #94a3b8;
  pointer-events: none;
}

/* Added Products Section */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.section-header .section-title { margin: 0; }
.btn-clear {
  background: none; border: none;
  color: #ef4444; font-size: 13px; font-weight: 700;
  display: flex; align-items: center; gap: 6px;
  cursor: pointer; transition: opacity 0.2s;
}
.btn-clear:hover { opacity: 0.8; }

/* Empty State */
.empty-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 200px;
  color: #94a3b8; font-size: 14px; font-weight: 600;
  gap: 12px;
}

/* Cart Table */
.cart-table-wrapper {
  overflow-x: auto;
}
.cart-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}
.cart-table th {
  font-size: 13.5px; font-weight: 800;
  color: #1e293b;
  padding: 0 12px 16px;
  border-bottom: 1px solid #e2e8f0;
}
.cart-table td {
  padding: 20px 12px;
  border-bottom: 1px dashed #e2e8f0;
  vertical-align: top;
}

.product-name {
  font-size: 14.5px; font-weight: 700; color: #1e293b;
  margin-bottom: 4px;
}
.product-stock { font-size: 12.5px; color: #94a3b8; font-weight: 600; }

.product-id-box {
  display: inline-block;
  padding: 6px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
}

.price-cell { font-size: 14px; font-weight: 600; color: #475569; padding-top: 26px !important; }

/* QTY Control */
.qty-control {
  display: inline-flex;
  align-items: center;
  background: #f1f5f9;
  border-radius: 8px;
  padding: 4px;
}
.qty-btn {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  width: 26px; height: 26px;
  display: flex; align-items: center; justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}
.qty-btn:hover { border-color: #cbd5e1; color: #1e293b; }
.qty-value {
  width: 32px;
  text-align: center;
  font-size: 14px; font-weight: 700; color: #1e293b;
}

.total-cell { font-size: 14px; color: #1e293b; padding-top: 26px !important; }
.font-bold { font-weight: 800; }

.action-cell { text-align: right; padding-top: 24px !important; }
.btn-remove-item {
  background: none; border: none; color: #cbd5e1;
  cursor: pointer; padding: 4px; transition: color 0.2s;
}
.btn-remove-item:hover { color: #ef4444; }

/* ── Footer Actions ── */
.transaction-footer {
  margin-top: 16px;
}
.total-bar {
  background: #64748b;
  color: #fff;
  text-align: center;
  font-size: 15px; font-weight: 700;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  opacity: 0.6;
}
.action-buttons {
  display: flex; gap: 12px;
}
.btn-action-footer {
  flex: 1;
  display: flex; justify-content: center; align-items: center; gap: 8px;
  height: 48px; border-radius: 8px; border: none;
  font-size: 14px; font-weight: 700; cursor: pointer;
  transition: all 0.2s;
}
.btn-action-footer:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-cancel { 
  background: #ff0000;
  color: #fff; 
}
.btn-cancel:hover { opacity: 0.9; }

.btn-save { 
  background: #3b82f6; color: #fff; 
}
.btn-save:hover:not(:disabled) { background: #2563eb; }

.error-msg { color: #ef4444; font-size: 13.5px; font-weight: 600; }
.success-msg { color: #10b981; font-size: 13.5px; font-weight: 600; }
.mt-4 { margin-top: 16px; }

/* Spinner */
.btn-spinner {
  display: inline-block; width: 18px; height: 18px;
  border: 2.5px solid rgba(255,255,255,0.4); border-top-color: #fff;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
