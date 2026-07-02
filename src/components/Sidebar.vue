<template>
  <aside class="sidebar">
    <!-- ── Logo ── -->
    <div class="sidebar-logo">
      <img src="/images/logo-larasati-farma.png" alt="Logo Larasati Farma" class="logo-img-small" />
    </div>

    <!-- ── Navigation ── -->
    <nav class="sidebar-nav">
      <ul class="nav-list">

        <!-- Dashboard -->
        <li class="nav-item" :class="{ active: activePage === 'dashboard' }" @click="setPage('dashboard')">
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </span>
          <span class="nav-label">Dashboard</span>
        </li>

        <!-- Profil -->
        <li class="nav-item" :class="{ active: activePage === 'profil' }" @click="setPage('profil')">
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
              <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2z"/>
              <path d="M12 14c-7 0-9 3.134-9 4v1h18v-1c0-.866-2-4-9-4z"/>
            </svg>
          </span>
          <span class="nav-label">Profil</span>
        </li>

        <!-- Manajemen Pengguna -->
        <li class="nav-item" :class="{ active: activePage === 'manajemen-pengguna' }" @click="setPage('manajemen-pengguna')">
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </span>
          <span class="nav-label">Manajemen Pengguna</span>
        </li>

        <!-- Data Master Produk -->
        <li class="nav-item" :class="{ active: activePage === 'data-master-produk' }" @click="setPage('data-master-produk')">
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </span>
          <span class="nav-label">Data Master Produk</span>
        </li>

        <!-- Data Master Kategori -->
        <li class="nav-item" :class="{ active: activePage === 'data-master-kategori' }" @click="setPage('data-master-kategori')">
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </span>
          <span class="nav-label">Data Master Kategori</span>
        </li>

        <!-- Penjualan (Multilevel) -->
        <li
          class="nav-item nav-item-parent"
          :class="{ active: isPenjualanActive, open: penjualanOpen }"
          @click="togglePenjualan"
        >
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </span>
          <span class="nav-label">Penjualan</span>
          <span class="nav-chevron">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </span>
        </li>

        <!-- Penjualan Sub-menu -->
        <Transition name="submenu">
          <ul v-show="penjualanOpen" class="nav-submenu">
            <li
              class="nav-subitem"
              :class="{ active: activePage === 'transaksi-penjualan' }"
              @click.stop="setPage('transaksi-penjualan')"
            >
              <span class="subitem-dot"></span>
              <span class="nav-label">Transaksi Penjualan</span>
            </li>
            <li
              class="nav-subitem"
              :class="{ active: activePage === 'riwayat-transaksi' }"
              @click.stop="setPage('riwayat-transaksi')"
            >
              <span class="subitem-dot"></span>
              <span class="nav-label">Riwayat Transaksi Penjualan</span>
            </li>
          </ul>
        </Transition>

        <!-- Manajemen Stok -->
        <li class="nav-item" :class="{ active: activePage === 'manajemen-stok' }" @click="setPage('manajemen-stok')">
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
          </span>
          <span class="nav-label">Manajemen Stok</span>
        </li>

        <!-- Analisis Apriori (Multilevel) -->
        <li
          class="nav-item nav-item-parent"
          :class="{ active: isAprioriActive, open: aprioriOpen }"
          @click="toggleApriori"
        >
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
            </svg>
          </span>
          <span class="nav-label">Analisis Apriori</span>
          <span class="nav-chevron">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </span>
        </li>

        <!-- Analisis Apriori Sub-menu -->
        <Transition name="submenu">
          <ul v-show="aprioriOpen" class="nav-submenu">
            <li
              class="nav-subitem"
              :class="{ active: activePage === 'proses-apriori' }"
              @click.stop="setPage('proses-apriori')"
            >
              <span class="subitem-dot"></span>
              <span class="nav-label">Proses Algoritma Apriori</span>
            </li>
            <li
              class="nav-subitem"
              :class="{ active: activePage === 'hasil-analisa' }"
              @click.stop="setPage('hasil-analisa')"
            >
              <span class="subitem-dot"></span>
              <span class="nav-label">Hasil Analisa</span>
            </li>
          </ul>
        </Transition>

        <!-- Rekomendasi Pengadaan -->
        <li class="nav-item" :class="{ active: activePage === 'rekomendasi-pengadaan' }" @click="setPage('rekomendasi-pengadaan')">
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </span>
          <span class="nav-label">Rekomendasi Pengadaan</span>
        </li>

        <!-- Laporan Penjualan -->
        <li class="nav-item" :class="{ active: activePage === 'laporan-penjualan' }" @click="setPage('laporan-penjualan')">
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
          </span>
          <span class="nav-label">Laporan Penjualan</span>
        </li>

      </ul>
    </nav>

    <!-- ── Logout Button ── -->
    <div class="sidebar-footer">
      <button class="btn-logout" :disabled="loggingOut" @click="handleLogout">
        <span v-if="loggingOut" class="logout-spinner"></span>
        <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16,17 21,12 16,7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        <span>{{ loggingOut ? 'Keluar...' : 'Keluar' }}</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { apiLogout } from '../api'

const props = defineProps<{
  activePage: string
}>()

const emit = defineEmits<{
  navigate: [page: string]
  logout: []
}>()

const penjualanPages = ['transaksi-penjualan', 'riwayat-transaksi']
const aprioriPages = ['proses-apriori', 'hasil-analisa']
const loggingOut = ref(false)

// penjualanOpen: local UI toggle, auto-open jika halaman aktif ada di sub-menu
const penjualanOpen = ref<boolean>(
  penjualanPages.includes(props.activePage)
)
const isPenjualanActive = computed(() =>
  penjualanPages.includes(props.activePage)
)
const togglePenjualan = () => {
  penjualanOpen.value = !penjualanOpen.value
}

// aprioriOpen
const aprioriOpen = ref<boolean>(
  aprioriPages.includes(props.activePage)
)
const isAprioriActive = computed(() =>
  aprioriPages.includes(props.activePage)
)
const toggleApriori = () => {
  aprioriOpen.value = !aprioriOpen.value
}

const setPage = (page: string) => {
  emit('navigate', page)
  if (penjualanPages.includes(page)) {
    penjualanOpen.value = true
  }
  if (aprioriPages.includes(page)) {
    aprioriOpen.value = true
  }
}

const handleLogout = async () => {
  loggingOut.value = true
  await apiLogout()
  loggingOut.value = false
  emit('logout')
}
</script>

<style scoped>
/* ── Sidebar Container ── */
.sidebar {
  width: 240px;
  min-width: 240px;
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid #e8edf3;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 12px rgba(36, 86, 164, 0.06);
  position: relative;
  overflow: hidden;
}

/* ── Logo ── */
.sidebar-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 18px 16px;
  border-bottom: 1px solid #f0f4f8;
}

.logo-img-small {
  max-width: 170px;
  height: auto;
  object-fit: contain;
}

/* ── Nav ── */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 10px 10px 0;
  scrollbar-width: thin;
  scrollbar-color: #e2e8f0 transparent;
}

.nav-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* ── Nav Item ── */
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease;
  position: relative;
  color: #64748b;
  user-select: none;
}

.nav-item:hover {
  background: #f1f5f9;
  color: #334155;
}

.nav-item.active {
  background: #2456A4;
  color: #ffffff;
}

.nav-item.active .nav-icon svg {
  stroke: #ffffff;
}

/* Parent item open + not active (sub-page not selected yet) */
.nav-item-parent.open:not(.active) {
  background: #eff6ff;
  color: #2456A4;
}

.nav-item-parent.open:not(.active) .nav-icon svg {
  stroke: #2456A4;
}

.nav-item-parent.open:not(.active) .nav-chevron svg {
  stroke: #2456A4;
}

/* When penjualan parent is active (a child is selected) */
.nav-item-parent.active {
  background: #2456A4;
  color: #ffffff;
}

.nav-item-parent.active .nav-icon svg {
  stroke: #ffffff;
}

.nav-item-parent.active .nav-chevron svg {
  stroke: #ffffff;
}

/* ── Nav Icon ── */
.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.nav-icon svg {
  transition: stroke 0.18s ease;
}

/* ── Nav Label ── */
.nav-label {
  font-size: 13px;
  font-weight: 600;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'Nunito Sans', sans-serif;
}

/* ── Chevron ── */
.nav-chevron {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease;
  color: #94a3b8;
  flex-shrink: 0;
}

.nav-item-parent.open .nav-chevron {
  transform: rotate(180deg);
}

/* ── Submenu ── */
.nav-submenu {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 2px 0 4px 0;
  overflow: hidden;
}

.nav-subitem {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px 8px 42px;
  border-radius: 8px;
  cursor: pointer;
  color: #64748b;
  font-size: 12.5px;
  font-weight: 600;
  font-family: 'Nunito Sans', sans-serif;
  transition: background 0.18s ease, color 0.18s ease;
  user-select: none;
}

.nav-subitem:hover {
  background: #f1f5f9;
  color: #334155;
}

.nav-subitem.active {
  color: #2456A4;
  background: #eff6ff;
}

.nav-subitem.active .subitem-dot {
  background: #2456A4;
  width: 7px;
  height: 7px;
}

/* ── Dot for subitem ── */
.subitem-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #cbd5e1;
  flex-shrink: 0;
  transition: background 0.18s ease, width 0.18s ease, height 0.18s ease;
}

/* ── Submenu Transition ── */
.submenu-enter-active,
.submenu-leave-active {
  transition: max-height 0.28s ease, opacity 0.22s ease;
  max-height: 200px;
}

.submenu-enter-from,
.submenu-leave-to {
  max-height: 0;
  opacity: 0;
}

/* ── Footer / Logout ── */
.sidebar-footer {
  padding: 14px 10px 18px;
  border-top: 1px solid #f0f4f8;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  background: #eff6ff;
  color: #2456A4;
  font-size: 13px;
  font-weight: 700;
  font-family: 'Nunito Sans', sans-serif;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;
}

.btn-logout:hover {
  background: #2456A4;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(36, 86, 164, 0.28);
}

.btn-logout svg {
  transition: stroke 0.18s ease;
}

.btn-logout:hover svg {
  stroke: #ffffff;
}

.btn-logout:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.logout-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(36, 86, 164, 0.3);
  border-top-color: #2456A4;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
