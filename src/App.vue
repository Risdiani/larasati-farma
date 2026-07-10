<template>
  <!-- ── Auth Pages ── -->
  <template v-if="appState === 'login' || appState === 'register' || appState === 'forgot'">
    <Transition name="page" mode="out-in">
      <LoginPage
        v-if="appState === 'login'"
        key="login"
        @go-forgot="appState = 'forgot'"
        @go-register="appState = 'register'"
        @login-success="onLoginSuccess"
      />
      <RegisterPage
        v-else-if="appState === 'register'"
        key="register"
        @go-login="appState = 'login'"
      />
      <ForgotPasswordPage
        v-else-if="appState === 'forgot'"
        key="forgot"
        @go-login="appState = 'login'"
      />
    </Transition>
  </template>

  <!-- ── Authenticated App ── -->
  <AppLayout
    v-else-if="appState === 'dashboard'"
    :active-page="activePage"
    @navigate="activePage = $event"
    @logout="onLogout"
  >
    <Transition name="page" mode="out-in">
      <!-- Dashboard -->
      <DashboardPage
        v-if="activePage === 'dashboard'"
        key="dashboard"
        :username="loggedInUser.username"
        :full-name="loggedInUser.fullName"
        :role="loggedInUser.role"
        @navigate="activePage = $event"
      />

      <!-- Manajemen Pengguna -->
      <ManajemenPengguna
        v-else-if="activePage === 'manajemen-pengguna'"
        key="manajemen-pengguna"
      />

      <!-- Profil -->
      <ProfilPage
        v-else-if="activePage === 'profil'"
        key="profil"
      />

      <!-- Data Master Produk -->
      <DataMasterProduk
        v-else-if="activePage === 'data-master-produk'"
        key="data-master-produk"
      />

      <!-- Data Master Kategori -->
      <DataMasterKategori
        v-else-if="activePage === 'data-master-kategori'"
        key="data-master-kategori"
      />

      <!-- Transaksi Penjualan -->
      <TransaksiPenjualan
        v-else-if="activePage === 'transaksi-penjualan'"
        key="transaksi-penjualan"
      />

      <!-- Riwayat Transaksi Penjualan -->
      <RiwayatTransaksiPenjualan
        v-else-if="activePage === 'riwayat-transaksi'"
        key="riwayat-transaksi"
        @navigate="activePage = $event"
      />

      <!-- Proses Algoritma Apriori -->
      <ProsesApriori
        v-else-if="activePage === 'proses-apriori'"
        key="proses-apriori"
      />

      <!-- Hasil Analisa -->
      <HasilAnalisa
        v-else-if="activePage === 'hasil-analisa'"
        key="hasil-analisa"
      />

      <!-- Rekomendasi Pengadaan -->
      <RekomendasiPengadaan
        v-else-if="activePage === 'rekomendasi-pengadaan'"
        key="rekomendasi-pengadaan"
      />

      <!-- Laporan Penjualan -->
      <LaporanPenjualan
        v-else-if="activePage === 'laporan-penjualan'"
        key="laporan-penjualan"
      />

      <!-- Placeholder untuk halaman lain -->
      <div v-else key="placeholder" class="page-placeholder">
        <div class="placeholder-inner">
          <div class="placeholder-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 9h6M9 12h6M9 15h4"/>
            </svg>
          </div>
          <h2 class="placeholder-title">Halaman Sedang Dikembangkan</h2>
          <p class="placeholder-sub">Halaman <strong>{{ activePageLabel }}</strong> akan segera tersedia.</p>
          <button class="placeholder-btn" @click="activePage = 'dashboard'">← Kembali ke Dashboard</button>
        </div>
      </div>
    </Transition>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import LoginPage from './components/LoginPage.vue'
import RegisterPage from './components/RegisterPage.vue'
import ForgotPasswordPage from './components/ForgotPasswordPage.vue'
import AppLayout from './components/AppLayout.vue'
import DashboardPage from './components/DashboardPage.vue'
import ManajemenPengguna from './components/ManajemenPengguna.vue'
import ProfilPage from './components/ProfilPage.vue'
import DataMasterProduk from './components/DataMasterProduk.vue'
import DataMasterKategori from './components/DataMasterKategori.vue'
import TransaksiPenjualan from './components/TransaksiPenjualan.vue'
import RiwayatTransaksiPenjualan from './components/RiwayatTransaksiPenjualan.vue'
import ProsesApriori from './components/ProsesApriori.vue'
import HasilAnalisa from './components/HasilAnalisa.vue'
import RekomendasiPengadaan from './components/RekomendasiPengadaan.vue'
import LaporanPenjualan from './components/LaporanPenjualan.vue'
import { getToken, getUserId, apiGetUser } from './api'

// ── App State ──
type AppState = 'login' | 'register' | 'forgot' | 'dashboard'

// Cek jika ada token yang tersimpan (session sebelumnya)
const initialState: AppState = getToken() ? 'dashboard' : 'login'
const appState = ref<AppState>(initialState)
const activePage = ref<string>('dashboard')

// ── User info ──
const loggedInUser = ref({ username: 'Pengguna', fullName: 'Pengguna', role: '' })

// Fetch user detail for fullName
const fetchUserData = async () => {
  const userId = getUserId()
  if (userId) {
    try {
      const user = await apiGetUser(userId)
      loggedInUser.value = { 
        username: user.username,
        fullName: user.fullName || user.username,
        role: user.role || ''
      }
    } catch (e) {
      console.error('Gagal memuat profil pengguna', e)
    }
  }
}

onMounted(() => {
  if (appState.value === 'dashboard') {
    fetchUserData()
  }
})

// ── Page labels (untuk placeholder) ──
const pageLabels: Record<string, string> = {
  'profil': 'Profil',
  'manajemen-pengguna': 'Manajemen Pengguna',
  'data-master-produk': 'Data Master Produk',
  'data-master-kategori': 'Data Master Kategori',
  'transaksi-penjualan': 'Transaksi Penjualan',
  'riwayat-transaksi': 'Riwayat Transaksi',
  'manajemen-stok': 'Manajemen Stok',
  'analisis-apriori': 'Analisis Apriori',
  'rekomendasi-pengadaan': 'Rekomendasi Pengadaan',
  'laporan-penjualan': 'Laporan Penjualan',
}

const activePageLabel = computed(() => pageLabels[activePage.value] ?? activePage.value)

// ── Handlers ──
const onLoginSuccess = (user: { userId: number; username: string; role: string }) => {
  loggedInUser.value = { username: user.username, fullName: user.username, role: user.role }
  activePage.value = 'dashboard'
  appState.value = 'dashboard'
  fetchUserData() // Fetch to get the full name after login
}

const onLogout = () => {
  loggedInUser.value = { username: 'Pengguna', fullName: 'Pengguna', role: '' }
  activePage.value = 'dashboard'
  appState.value = 'login'
}
</script>

<style>
* { box-sizing: border-box; }

/* Page transition */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Placeholder page */
.page-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.placeholder-inner {
  text-align: center;
  max-width: 420px;
}

.placeholder-icon {
  width: 80px;
  height: 80px;
  background: #f1f5f9;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.placeholder-title {
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 8px;
  font-family: 'Nunito Sans', sans-serif;
}

.placeholder-sub {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 24px;
  font-family: 'Nunito Sans', sans-serif;
}

.placeholder-btn {
  background: #2456A4;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Nunito Sans', sans-serif;
  transition: background 0.2s;
}

.placeholder-btn:hover {
  background: #1d4ed8;
}
</style>
