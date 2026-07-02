<template>
  <div class="page">
    
    <!-- ── Page Header ── -->
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Edit Profil</h1>
        <div class="breadcrumb">
          <span class="breadcrumb-item">Dashboard</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          <span class="breadcrumb-item active">Profil</span>
        </div>
      </div>
      <div class="page-header-right">
        <button class="btn-cancel" @click="resetForm" :disabled="saving">Batal</button>
        <button class="btn-save" @click="saveProfile" :disabled="saving">
          <span v-if="saving" class="btn-spinner"></span>
          <span v-else>Simpan Profil</span>
        </button>
      </div>
    </div>

    <!-- ── Profile Card ── -->
    <div class="profile-card">
      
      <!-- Photo Section -->
      <div class="photo-section">
        <div class="photo-placeholder">
          <!-- Placeholder avatar if no actual image logic is implemented yet -->
          <svg class="photo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <button class="btn-upload">Ubah Foto Profil</button>
      </div>

      <!-- Information Section -->
      <div class="info-section">
        <div class="info-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2456A4" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <h3 class="info-title">Informasi Pengguna</h3>
        </div>

        <div v-if="loading" class="loading-state">
          <span class="table-spinner"></span>
          Memuat data profil...
        </div>

        <div v-else-if="errorMsg" class="error-state">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {{ errorMsg }}
        </div>

        <div v-else class="info-form">
          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">Username</label>
              <input type="text" v-model="form.username" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Fullname</label>
              <input type="text" v-model="form.fullName" class="form-input" />
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">No Telp</label>
              <input type="tel" v-model="form.phone" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" v-model="form.email" class="form-input" />
            </div>
          </div>

          <div v-if="successMsg" class="alert-success">
            Profil berhasil diperbarui!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiGetUser, apiUpdateUser, getUserId } from '../api'

const loading = ref(true)
const saving = ref(false)
const errorMsg = ref('')
const successMsg = ref(false)

const form = ref({
  username: '',
  fullName: '',
  phone: '',
  email: ''
})

const originalData = ref({
  username: '',
  fullName: '',
  phone: '',
  email: ''
})

const loadProfile = async () => {
  const userId = getUserId()
  if (!userId) {
    errorMsg.value = 'Tidak dapat menemukan ID Pengguna.'
    loading.value = false
    return
  }

  try {
    loading.value = true
    const user = await apiGetUser(userId)
    originalData.value = {
      username: user.username,
      fullName: user.fullName || '',
      phone: user.phone || '',
      email: user.email || ''
    }
    resetForm()
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : 'Gagal memuat profil'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProfile()
})

const resetForm = () => {
  form.value = { ...originalData.value }
  successMsg.value = false
}

const saveProfile = async () => {
  const userId = getUserId()
  if (!userId) return

  try {
    saving.value = true
    successMsg.value = false
    errorMsg.value = ''

    await apiUpdateUser(userId, {
      username: form.value.username || undefined,
      fullName: form.value.fullName || undefined,
      phone: form.value.phone || undefined,
      email: form.value.email || undefined
      // Kita tidak mengirimkan password atau roleId karena ini hanya edit profil biasa
    })

    // Update original data state
    originalData.value = { ...form.value }
    successMsg.value = true
    setTimeout(() => { successMsg.value = false }, 3000)
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : 'Gagal menyimpan profil'
  } finally {
    saving.value = false
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

/* ── Page Header ── */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.page-title {
  font-size: 22px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 4px;
  letter-spacing: -0.3px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 4px;
}

.breadcrumb-item {
  font-size: 12.5px;
  color: #94a3b8;
  font-weight: 600;
}

.breadcrumb-item.active {
  color: #2456A4;
}

.page-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-cancel {
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 9px 24px;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-cancel:hover:not(:disabled) { background: #dc2626; }
.btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-save {
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 9px 24px;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 140px;
  transition: background 0.2s;
}

.btn-save:hover:not(:disabled) { background: #2563eb; }
.btn-save:disabled { opacity: 0.7; cursor: not-allowed; }

/* ── Profile Card ── */
.profile-card {
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

/* Photo Section */
.photo-section {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 30px;
  border-bottom: 1px solid #f0f4f8;
  background: #fafbfc;
}

.photo-placeholder {
  width: 140px;
  height: 140px;
  background: #f1f5f9;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.photo-icon {
  width: 60px;
  height: 60px;
}

.btn-upload {
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 9px 18px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-upload:hover { background: #2563eb; }

/* Info Section */
.info-section {
  padding: 24px 30px 40px;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f4f8;
}

.info-title {
  font-size: 15px;
  font-weight: 800;
  color: #334155;
  margin: 0;
}

.info-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 800px;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 13px;
  font-weight: 700;
  color: #475569;
}

.required { color: #ef4444; }

.form-input {
  width: 100%;
  height: 42px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  padding: 0 14px;
  font-size: 14px;
  font-family: 'Nunito Sans', sans-serif;
  color: #1e293b;
  background: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input:disabled {
  background: #f8fafc;
  color: #94a3b8;
  cursor: not-allowed;
}

.loading-state {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #64748b;
  font-size: 14px;
  padding: 20px 0;
}

.error-state {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ef4444;
  background: #fef2f2;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
}

.alert-success {
  background: #dcfce7;
  color: #16a34a;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  margin-top: 10px;
}

.table-spinner {
  width: 18px; height: 18px;
  border: 2.5px solid #e2e8f0;
  border-top-color: #2456A4;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.btn-spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Responsiveness */
@media (max-width: 768px) {
  .form-row-2 { grid-template-columns: 1fr; gap: 16px; }
  .photo-section { flex-direction: column; align-items: flex-start; gap: 16px; padding: 20px; }
  .info-section { padding: 20px; }
}
</style>
