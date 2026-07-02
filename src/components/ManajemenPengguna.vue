<template>
  <div class="page">

    <!-- ── Page Header ── -->
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Daftar Pengguna</h1>
        <div class="breadcrumb">
          <span class="breadcrumb-item">Dashboard</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          <span class="breadcrumb-item active">Manajemen Pengguna</span>
        </div>
      </div>
      <div class="page-header-right">
        <button class="btn-export" title="Export Excel">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </button>
        <button class="btn-tambah" @click="openAddModal">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Tambah Pengguna
        </button>
      </div>
    </div>

    <!-- ── Table Card ── -->
    <div class="table-card">

      <!-- Search -->
      <div class="table-toolbar">
        <div class="search-wrapper">
          <svg class="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            v-model="search"
            type="text"
            class="search-input"
            placeholder="Search"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Nama Pengguna</th>
              <th>Email</th>
              <th>Telp</th>
              <th>Role</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <!-- Loading -->
            <tr v-if="loading">
              <td colspan="7" class="td-center">
                <div class="loading-row">
                  <span class="table-spinner"></span>
                  <span>Memuat data...</span>
                </div>
              </td>
            </tr>
            <!-- Error -->
            <tr v-else-if="loadError">
              <td colspan="7" class="td-center">
                <div class="error-row">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {{ loadError }}
                  <button class="btn-retry" @click="loadUsers">Coba Lagi</button>
                </div>
              </td>
            </tr>
            <!-- Empty -->
            <tr v-else-if="filteredUsers.length === 0">
              <td colspan="7" class="td-center td-empty">Tidak ada data pengguna.</td>
            </tr>
            <!-- Data rows -->
            <tr v-else v-for="user in paginatedUsers" :key="user.id">
              <td class="col-username">{{ user.username }}</td>
              <td>{{ user.fullName || '—' }}</td>
              <td>{{ user.email || '—' }}</td>
              <td>{{ user.phone || '—' }}</td>
              <td>{{ user.role || '—' }}</td>
              <td>
                <span class="badge" :class="user.isActive ? 'badge-active' : 'badge-inactive'">
                  <span class="badge-dot"></span>
                  {{ user.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>
                <div class="action-btns">
                  <button class="btn-icon btn-edit" title="Edit" @click="openEditModal(user)">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button class="btn-icon btn-delete" title="Hapus" @click="confirmDelete(user)">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6"/><path d="M14 11v6"/>
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
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
          <select v-model="PAGE_SIZE" class="page-select">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <span class="text-slate-500 ml-2">baris per halaman</span>
        </div>

        <div class="pagination">
          <button class="page-btn nav-btn" :disabled="currentPage === 1" @click="currentPage--">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>

          <template v-for="p in pageNumbers" :key="p">
            <span v-if="p === '...'" class="page-ellipsis">...</span>
            <button v-else class="page-btn" :class="{ active: currentPage === p }" @click="currentPage = Number(p)">{{ p }}</button>
          </template>

          <button class="page-btn nav-btn" :disabled="currentPage === totalPages" @click="currentPage++">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>

    </div>

    <!-- ═══════════════════════════════════════════════
         MODAL: Tambah / Edit Pengguna
    ════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
          <div class="modal-box">

            <!-- Modal Header -->
            <div class="modal-header">
              <div>
                <h2 class="modal-title">{{ isEditMode ? 'Edit Pengguna' : 'Tambah Pengguna Baru' }}</h2>
                <p class="modal-subtitle">{{ isEditMode ? 'Perbarui informasi pengguna' : 'Isi data untuk membuat akun baru' }}</p>
              </div>
              <button class="modal-close" @click="closeModal">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <!-- Modal Form -->
            <form class="modal-form" @submit.prevent="handleSubmit">

              <!-- Row: Username + Nama Lengkap -->
              <div class="form-row-2">
                <div class="form-group">
                  <label class="form-label">Username <span class="required">*</span></label>
                  <div class="input-wrapper">
                    <input
                      id="m-username"
                      v-model="form.username"
                      type="text"
                      class="form-input"
                      placeholder="contoh: john_doe"
                    />
                    <span class="input-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                    </span>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Nama Lengkap</label>
                  <div class="input-wrapper">
                    <input
                      id="m-fullname"
                      v-model="form.fullName"
                      type="text"
                      class="form-input"
                      placeholder="contoh: John Doe"
                    />
                    <span class="input-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Row: Email + Telp -->
              <div class="form-row-2">
                <div class="form-group">
                  <label class="form-label">Email</label>
                  <div class="input-wrapper">
                    <input
                      id="m-email"
                      v-model="form.email"
                      type="email"
                      class="form-input"
                      placeholder="email@domain.com"
                    />
                    <span class="input-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </span>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">No. Telp <span class="required">*</span></label>
                  <div class="input-wrapper">
                    <input
                      id="m-phone"
                      v-model="form.phone"
                      type="tel"
                      class="form-input"
                      placeholder="+6281234567890"
                      required
                    />
                    <span class="input-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Role -->
              <div class="form-group">
                <label class="form-label">Role Pengguna <span class="required">*</span></label>
                <div class="input-wrapper">
                  <select
                    id="m-role"
                    v-model="form.roleId"
                    class="form-input form-select"
                    required
                    :disabled="rolesLoading"
                  >
                    <option :value="null" disabled>
                      {{ rolesLoading ? 'Memuat role...' : 'Pilih role...' }}
                    </option>
                    <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.name }}</option>
                  </select>
                  <span class="input-icon">
                    <svg v-if="rolesLoading" class="spin-anim" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2">
                      <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1"/>
                    </svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </span>
                </div>
              </div>

              <!-- Status (hanya mode edit) -->
              <div class="form-group" v-if="isEditMode">
                <label class="form-label">Status</label>
                <div class="toggle-wrapper">
                  <button
                    type="button"
                    class="toggle-btn"
                    :class="{ active: form.isActive }"
                    @click="form.isActive = !form.isActive"
                  >
                    <span class="toggle-thumb"></span>
                  </button>
                  <span class="toggle-label">{{ form.isActive ? 'Active' : 'Inactive' }}</span>
                </div>
              </div>

              <!-- Password (tambah = wajib, edit = opsional) -->
              <div class="form-group">
                <label class="form-label">
                  Kata Sandi
                  <span class="required" v-if="!isEditMode">*</span>
                  <span class="label-hint" v-else>(kosongkan jika tidak ingin mengubah)</span>
                </label>
                <div class="input-wrapper">
                  <input
                    id="m-password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-input"
                    :required="!isEditMode"
                    placeholder="Minimal 6 karakter"
                    autocomplete="new-password"
                  />
                  <button type="button" class="input-icon input-icon-btn" @click="showPassword = !showPassword" tabindex="-1">
                    <svg v-if="!showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Konfirmasi Password (hanya mode tambah) -->
              <div class="form-group" v-if="!isEditMode">
                <label class="form-label">Konfirmasi Kata Sandi <span class="required">*</span></label>
                <div class="input-wrapper">
                  <input
                    id="m-confirm"
                    v-model="form.confirmPassword"
                    :type="showConfirm ? 'text' : 'password'"
                    class="form-input"
                    :class="{ 'input-error': passwordMismatch }"
                    required
                    placeholder="Ulangi kata sandi"
                    autocomplete="new-password"
                  />
                  <button type="button" class="input-icon input-icon-btn" @click="showConfirm = !showConfirm" tabindex="-1">
                    <svg v-if="!showConfirm" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                </div>
                <p v-if="passwordMismatch" class="field-error">Kata sandi tidak cocok.</p>
              </div>

              <!-- Alert Error -->
              <div v-if="formError" class="form-alert alert-error">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {{ formError }}
              </div>

              <!-- Footer -->
              <div class="modal-footer">
                <button type="button" class="btn-cancel" @click="closeModal">Batal</button>
                <button type="submit" class="btn-submit" :disabled="submitting">
                  <span v-if="submitting" class="btn-spinner"></span>
                  <span v-else>{{ isEditMode ? 'Simpan Perubahan' : 'Tambah Pengguna' }}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ═══════════════════════════════════════════════
         MODAL: Konfirmasi Hapus
    ════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
          <div class="modal-box modal-sm">
            <div class="delete-icon-wrap">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </div>
            <h2 class="modal-title" style="text-align:center">Hapus Pengguna?</h2>
            <p class="modal-subtitle" style="text-align:center;margin-bottom:24px">
              Pengguna <strong>{{ deleteTarget?.username }}</strong> akan dihapus secara permanen.
            </p>
            <div v-if="deleteError" class="form-alert alert-error" style="margin-bottom:16px">{{ deleteError }}</div>
            <div class="modal-footer" style="justify-content:center">
              <button class="btn-cancel" @click="showDeleteModal = false">Batal</button>
              <button class="btn-submit btn-danger" :disabled="deleting" @click="handleDelete">
                <span v-if="deleting" class="btn-spinner"></span>
                <span v-else>Ya, Hapus</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import {
  apiGetUsers, apiRegister, apiUpdateUser, apiDeleteUser,
  apiGetRoles,
  type UserResponse, type Role,
} from '../api'

// ── Data ──
const users = ref<UserResponse[]>([])
const loading = ref(true)
const loadError = ref('')

const roles = ref<Role[]>([])
const rolesLoading = ref(true)

const search = ref('')
const currentPage = ref(1)
const PAGE_SIZE = ref(10)

// ── Load users ──
const loadUsers = async () => {
  loading.value = true
  loadError.value = ''
  try {
    users.value = await apiGetUsers()
  } catch (e: unknown) {
    loadError.value = e instanceof Error ? e.message : 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

// ── Load roles ──
const loadRoles = async () => {
  rolesLoading.value = true
  try {
    roles.value = await apiGetRoles()
  } finally {
    rolesLoading.value = false
  }
}

onMounted(() => { loadUsers(); loadRoles() })

// ── Filter & Pagination ──
const filteredUsers = computed(() => {
  const q = search.value.toLowerCase()
  if (!q) return users.value
  return users.value.filter(u =>
    u.username.toLowerCase().includes(q) ||
    (u.fullName ?? '').toLowerCase().includes(q) ||
    (u.email ?? '').toLowerCase().includes(q) ||
    (u.role ?? '').toLowerCase().includes(q)
  )
})

watch([search, PAGE_SIZE], () => { currentPage.value = 1 })

const totalPages = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / PAGE_SIZE.value)))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE.value
  return filteredUsers.value.slice(start, start + PAGE_SIZE.value)
})

const pageNumbers = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | string)[] = [1]
  if (cur > 3) pages.push('...')
  for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i)
  if (cur < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

// ── Modal State ──
const showModal = ref(false)
const isEditMode = ref(false)
const editTargetId = ref<number | null>(null)
const showPassword = ref(false)
const showConfirm = ref(false)
const submitting = ref(false)
const formError = ref('')

const defaultForm = () => ({
  username: '',
  fullName: '',
  email: '',
  phone: '',
  roleId: null as number | null,
  password: '',
  confirmPassword: '',
  isActive: true,
})

const form = ref(defaultForm())

const passwordMismatch = computed(() =>
  !isEditMode.value &&
  form.value.confirmPassword !== '' &&
  form.value.password !== form.value.confirmPassword
)

// ── Open Add Modal ──
const openAddModal = () => {
  isEditMode.value = false
  editTargetId.value = null
  form.value = defaultForm()
  formError.value = ''
  showPassword.value = false
  showConfirm.value = false
  showModal.value = true
}

// ── Open Edit Modal ──
const openEditModal = (user: UserResponse) => {
  isEditMode.value = true
  editTargetId.value = user.id
  form.value = {
    username: user.username,
    fullName: user.fullName ?? '',
    email: user.email ?? '',
    phone: user.phone ?? '',
    roleId: null, // role dari backend adalah string name, biarkan user pilih ulang
    password: '',
    confirmPassword: '',
    isActive: user.isActive,
  }
  // Coba match role name ke id
  if (user.role) {
    const matched = roles.value.find(r => r.name === user.role)
    if (matched) form.value.roleId = matched.id
  }
  formError.value = ''
  showPassword.value = false
  showConfirm.value = false
  showModal.value = true
}

const closeModal = () => { showModal.value = false }

// ── Submit ──
const handleSubmit = async () => {
  if (passwordMismatch.value) {
    formError.value = 'Kata sandi tidak cocok.'
    return
  }
  formError.value = ''
  submitting.value = true
  try {
    if (isEditMode.value && editTargetId.value) {
      const payload: Record<string, unknown> = {
        fullName: form.value.fullName || undefined,
        email: form.value.email || undefined,
        phone: form.value.phone || undefined,
        roleId: form.value.roleId ?? undefined,
        isActive: form.value.isActive,
      }
      if (form.value.password) payload.password = form.value.password
      await apiUpdateUser(editTargetId.value, payload)
    } else {
      await apiRegister({
        username: form.value.username,
        fullName: form.value.fullName || undefined,
        email: form.value.email || undefined,
        phone: form.value.phone || undefined,
        roleId: form.value.roleId ?? undefined,
        password: form.value.password,
        isActive: true,
      })
    }
    closeModal()
    await loadUsers()
  } catch (e: unknown) {
    formError.value = e instanceof Error ? e.message : 'Terjadi kesalahan'
  } finally {
    submitting.value = false
  }
}

// ── Delete ──
const showDeleteModal = ref(false)
const deleteTarget = ref<UserResponse | null>(null)
const deleting = ref(false)
const deleteError = ref('')

const confirmDelete = (user: UserResponse) => {
  deleteTarget.value = user
  deleteError.value = ''
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!deleteTarget.value) return
  deleting.value = true
  deleteError.value = ''
  try {
    await apiDeleteUser(deleteTarget.value.id)
    showDeleteModal.value = false
    await loadUsers()
  } catch (e: unknown) {
    deleteError.value = e instanceof Error ? e.message : 'Gagal menghapus pengguna'
  } finally {
    deleting.value = false
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
  gap: 10px;
}

.btn-export {
  width: 38px;
  height: 38px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.18s;
}

.btn-export:hover {
  background: #f8fafc;
  border-color: #2456A4;
  color: #2456A4;
}

.btn-tambah {
  display: flex;
  align-items: center;
  gap: 7px;
  background: #2456A4;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 9px 18px;
  font-size: 13.5px;
  font-weight: 700;
  font-family: 'Nunito Sans', sans-serif;
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s;
}

.btn-tambah:hover {
  background: #1d4ed8;
  box-shadow: 0 4px 14px rgba(36,86,164,0.3);
}

/* ── Table Card ── */
.table-card {
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.table-toolbar {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f4f8;
}

.search-wrapper {
  position: relative;
  width: 260px;
}

.search-icon {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-input {
  width: 100%;
  height: 36px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  padding: 0 12px 0 34px;
  font-size: 13.5px;
  font-family: 'Nunito Sans', sans-serif;
  color: #334155;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  border-color: #2456A4;
  box-shadow: 0 0 0 3px rgba(36,86,164,0.08);
}

/* ── Data Table ── */
.table-wrapper { overflow-x: auto; }

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}

.data-table th {
  text-align: left;
  padding: 11px 16px;
  font-size: 12px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1.5px solid #f0f4f8;
  white-space: nowrap;
  background: #fafbfc;
}

.data-table td {
  padding: 13px 16px;
  color: #334155;
  font-weight: 600;
  border-bottom: 1px solid #f8fafc;
  vertical-align: middle;
}

.data-table tbody tr:last-child td { border-bottom: none; }
.data-table tbody tr:hover td { background: #fafbfc; }

.col-username {
  font-family: 'Courier New', monospace;
  font-size: 12.5px;
  color: #64748b;
  font-weight: 700;
}

.td-center { text-align: center; color: #94a3b8; padding: 32px !important; }
.td-empty { font-size: 14px; }

.loading-row, .error-row {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  color: #64748b;
}

.table-spinner {
  width: 16px; height: 16px;
  border: 2px solid #e2e8f0;
  border-top-color: #2456A4;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

.btn-retry {
  background: none;
  border: 1px solid #ef4444;
  color: #ef4444;
  border-radius: 6px;
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Nunito Sans', sans-serif;
}

/* ── Badge ── */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}

.badge-active  { background: #dcfce7; color: #16a34a; }
.badge-inactive { background: #f1f5f9; color: #94a3b8; }

.badge-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: currentColor;
  display: inline-block;
}

/* ── Action Buttons ── */
.action-btns { display: flex; gap: 6px; align-items: center; }

.btn-icon {
  width: 30px; height: 30px;
  border-radius: 7px;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.18s;
  color: #64748b;
}

.btn-edit:hover  { border-color: #2456A4; color: #2456A4; background: #eff6ff; }
.btn-delete:hover { border-color: #ef4444; color: #ef4444; background: #fef2f2; }

/* ── Pagination ── */
.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid #f0f4f8;
  background: #fff;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
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
  min-width: 32px; height: 32px;
  border: 1.5px solid #e2e8f0;
  border-radius: 7px;
  background: #fff;
  font-size: 13px;
  font-weight: 700;
  font-family: 'Nunito Sans', sans-serif;
  color: #64748b;
  cursor: pointer;
  padding: 0 6px;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.18s;
}

.page-btn:hover:not(:disabled) { border-color: #2456A4; color: #2456A4; background: #eff6ff; }
.page-btn.active { background: #2456A4; color: #fff; border-color: #2456A4; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.nav-btn { color: #94a3b8; }

.page-ellipsis {
  min-width: 32px;
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
}

/* ═══ Modal ═══ */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.modal-box {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}

.modal-sm { max-width: 400px; padding: 32px; }

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px 28px 0;
  gap: 16px;
}

.modal-title {
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 3px;
}

.modal-subtitle {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
}

.modal-close {
  width: 32px; height: 32px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  color: #64748b;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: all 0.18s;
}

.modal-close:hover { background: #fef2f2; border-color: #ef4444; color: #ef4444; }

.modal-form { padding: 20px 28px 28px; display: flex; flex-direction: column; gap: 14px; }

.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

.form-group { display: flex; flex-direction: column; gap: 5px; }

.form-label {
  font-size: 12.5px;
  font-weight: 700;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 4px;
}

.label-hint { font-size: 11px; color: #94a3b8; font-weight: 400; }

.required { color: #ef4444; }

.input-wrapper { position: relative; }

.form-input {
  width: 100%;
  height: 40px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  padding: 0 38px 0 12px;
  font-size: 13.5px;
  font-family: 'Nunito Sans', sans-serif;
  color: #1e293b;
  background: #fff;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  appearance: none;
}

.form-input:focus { border-color: #2456A4; box-shadow: 0 0 0 3px rgba(36,86,164,0.1); }
.form-input:disabled { background: #f8fafc; color: #94a3b8; cursor: not-allowed; }
.form-input.input-error { border-color: #ef4444; }

.form-select { cursor: pointer; }

.input-icon {
  position: absolute;
  right: 11px; top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  display: flex; align-items: center;
  pointer-events: none;
}

.input-icon-btn {
  background: none; border: none; cursor: pointer;
  pointer-events: all; padding: 0; color: #9ca3af;
  transition: color 0.2s;
}

.input-icon-btn:hover { color: #2456A4; }

.field-error { font-size: 11.5px; color: #ef4444; margin: 0; }

/* Toggle */
.toggle-wrapper { display: flex; align-items: center; gap: 10px; }

.toggle-btn {
  width: 42px; height: 24px;
  background: #e2e8f0;
  border: none; border-radius: 12px;
  cursor: pointer;
  position: relative;
  transition: background 0.2s;
  flex-shrink: 0;
}

.toggle-btn.active { background: #2456A4; }

.toggle-thumb {
  position: absolute;
  top: 3px; left: 3px;
  width: 18px; height: 18px;
  background: #fff;
  border-radius: 50%;
  transition: left 0.2s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}

.toggle-btn.active .toggle-thumb { left: 21px; }

.toggle-label { font-size: 13px; font-weight: 700; color: #334155; }

/* Form Alert */
.form-alert {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px; font-weight: 600;
}

.alert-error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

/* Modal Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 4px;
}

.btn-cancel {
  height: 38px; padding: 0 18px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  color: #64748b;
  font-size: 13.5px; font-weight: 700;
  font-family: 'Nunito Sans', sans-serif;
  cursor: pointer;
  transition: all 0.18s;
}

.btn-cancel:hover { border-color: #94a3b8; background: #f8fafc; }

.btn-submit {
  height: 38px; padding: 0 22px;
  background: #2456A4;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13.5px; font-weight: 700;
  font-family: 'Nunito Sans', sans-serif;
  cursor: pointer;
  display: flex; align-items: center; gap: 8px;
  transition: background 0.18s, box-shadow 0.18s;
}

.btn-submit:hover:not(:disabled) { background: #1d4ed8; box-shadow: 0 4px 14px rgba(36,86,164,0.3); }
.btn-submit:disabled { background: #93c5fd; cursor: not-allowed; }

.btn-danger { background: #ef4444 !important; }
.btn-danger:hover:not(:disabled) { background: #dc2626 !important; box-shadow: 0 4px 14px rgba(239,68,68,0.3) !important; }

/* Delete Modal */
.delete-icon-wrap {
  width: 64px; height: 64px;
  background: #fef2f2;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px;
}

/* Spinners */
.btn-spinner {
  width: 15px; height: 15px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

.spin-anim { animation: spin 0.8s linear infinite; }

@keyframes spin { to { transform: rotate(360deg); } }

/* Modal Transition */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .modal-box,
.modal-leave-active .modal-box {
  transition: transform 0.2s ease;
}
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-box { transform: scale(0.95) translateY(16px); }
.modal-leave-to .modal-box { transform: scale(0.95) translateY(16px); }
</style>
