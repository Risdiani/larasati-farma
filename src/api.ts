// =============================================
// API Service - Larasati Farma
// Base URL dikonfigurasi via .env → VITE_API_BASE_URL
// =============================================

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string

// ---- Types ----

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  tokenType: string // "Bearer"
  userId: number
  username: string
  role: string
}

export interface RegisterRequest {
  username: string
  password: string
  email?: string
  fullName?: string
  phone?: string
  roleId?: number
  isActive?: boolean
}

export interface Role {
  id: number
  name: string
  createdAt: string
}

export interface BaseResponse<T> {
  status: number
  success: boolean
  message: string
  data: T
}

// ---- Token helpers ----

export const getToken = (): string | null => localStorage.getItem('token')
export const saveToken = (token: string) => localStorage.setItem('token', token)
export const removeToken = () => localStorage.removeItem('token')

export const getUserId = (): number | null => {
  const id = localStorage.getItem('userId')
  return id ? Number(id) : null
}
export const saveUserId = (id: number) => localStorage.setItem('userId', id.toString())
export const removeUserId = () => localStorage.removeItem('userId')

// ---- Auth Header (untuk request lain yang butuh token) ----

export const authHeader = (): Record<string, string> => {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ============================================================
// POST /auth/login
// Body: { username, password }
// Response: BaseResponse<LoginResponse>
// ============================================================
export const apiLogin = async (body: LoginRequest): Promise<LoginResponse> => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const json: BaseResponse<LoginResponse> = await res.json()

  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Login gagal')
  }

  // Simpan token ke localStorage
  saveToken(json.data.token)
  saveUserId(json.data.userId)

  return json.data
}

// ============================================================
// POST /auth/register
// Body: { username, password, email, fullName, phone, roleId, isActive }
// Response: BaseResponse<UserResponse>
// ============================================================
export const apiRegister = async (body: RegisterRequest): Promise<void> => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const json: BaseResponse<unknown> = await res.json()

  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Registrasi gagal')
  }
}

// ============================================================
// POST /auth/logout
// Header: Authorization: Bearer <token>
// Response: 204 No Content
// ============================================================
export const apiLogout = async (): Promise<void> => {
  const token = getToken()

  if (token) {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
  }

  // Hapus token dari localStorage
  removeToken()
  removeUserId()
}

// ============================================================
// GET /roles
// Response: BaseResponse<Role[]>
// ============================================================
export const apiGetRoles = async (): Promise<Role[]> => {
  const token = getToken()
  const res = await fetch(`${BASE_URL}/roles`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const json: BaseResponse<Role[]> = await res.json()

  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Gagal memuat daftar role')
  }

  return json.data
}

// ============================================================
// User types
// ============================================================
export interface UserResponse {
  id: number
  username: string
  email: string | null
  fullName: string | null
  phone: string | null
  role: string | null
  isActive: boolean
}

export interface UserUpdateRequest {
  username?: string
  password?: string
  email?: string
  fullName?: string
  phone?: string
  roleId?: number
  isActive?: boolean
}

// ============================================================
// GET /users  — daftar semua pengguna (butuh token)
// ============================================================
export const apiGetUsers = async (): Promise<UserResponse[]> => {
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
  })
  const json: BaseResponse<UserResponse[]> = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Gagal memuat pengguna')
  return json.data
}

// ============================================================
// GET /users/{id}  — detail pengguna (butuh token)
// ============================================================
export const apiGetUser = async (id: number): Promise<UserResponse> => {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
  })
  const json: BaseResponse<UserResponse> = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Gagal memuat pengguna')
  return json.data
}

// ============================================================
// PUT /users/{id}  — edit profil pengguna
// ============================================================
export const apiUpdateUser = async (id: number, body: UserUpdateRequest): Promise<UserResponse> => {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  })
  const json: BaseResponse<UserResponse> = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Gagal mengupdate pengguna')
  return json.data
}

// ============================================================
// DELETE /users/{id}  — hapus pengguna
// ============================================================
export const apiDeleteUser = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
  })
  const json: BaseResponse<null> = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Gagal menghapus pengguna')
}

// ============================================================
// Product Types & Endpoints
// ============================================================
export interface ProductResponse {
  id: number
  kodeProduk: string
  namaProduk: string
  kategori: string | null
  satuan: string
  harga: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductRequest {
  kodeProduk: string
  namaProduk: string
  kategoriId: number | null
  satuan: string
  harga: number
  isActive: boolean
}

export const apiGetProducts = async (): Promise<ProductResponse[]> => {
  const res = await fetch(`${BASE_URL}/products`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
  })
  const json: BaseResponse<ProductResponse[]> = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Gagal memuat produk')
  return json.data
}

export const apiGetProduct = async (id: number): Promise<ProductResponse> => {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
  })
  const json: BaseResponse<ProductResponse> = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Gagal memuat detail produk')
  return json.data
}

export const apiCreateProduct = async (body: ProductRequest): Promise<ProductResponse> => {
  const res = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  })
  const json: BaseResponse<ProductResponse> = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Gagal menambah produk')
  return json.data
}

export const apiUpdateProduct = async (id: number, body: ProductRequest): Promise<ProductResponse> => {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  })
  const json: BaseResponse<ProductResponse> = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Gagal mengupdate produk')
  return json.data
}

export const apiDeleteProduct = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
  })
  const json: BaseResponse<null> = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Gagal menghapus produk')
}

// ============================================================
// Category (Kategori) Types & Endpoints
// ============================================================
export interface CategoryResponse {
  id: number
  nama: string
  penanda: string | null
  keterangan: string | null
  createdAt: string
}

export interface CategoryRequest {
  nama: string
  penanda: string
  keterangan: string
}

export const apiGetCategories = async (): Promise<CategoryResponse[]> => {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
  })
  const json: BaseResponse<CategoryResponse[]> = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Gagal memuat kategori')
  return json.data
}

export const apiGetCategory = async (id: number): Promise<CategoryResponse> => {
  const res = await fetch(`${BASE_URL}/categories/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
  })
  const json: BaseResponse<CategoryResponse> = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Gagal memuat detail kategori')
  return json.data
}

export const apiCreateCategory = async (body: CategoryRequest): Promise<CategoryResponse> => {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  })
  const json: BaseResponse<CategoryResponse> = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Gagal menambah kategori')
  return json.data
}

export const apiUpdateCategory = async (id: number, body: CategoryRequest): Promise<CategoryResponse> => {
  const res = await fetch(`${BASE_URL}/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  })
  const json: BaseResponse<CategoryResponse> = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Gagal mengupdate kategori')
  return json.data
}

export const apiDeleteCategory = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
  })
  const json: BaseResponse<null> = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Gagal menghapus kategori')
}

// ============================================================
// Transaction Types & Endpoints
// ============================================================
export interface TransactionDetailReq {
  id?: number
  kodeProduk: string
  jumlah: number
  hargaSatuan: number
}

export interface TransactionReq {
  kodeTransaksi: string
  transactionDate: string // YYYY-MM-DD
  catatan: string
  details: TransactionDetailReq[]
}

export interface TransactionDetailRes {
  id: number
  produkId: number
  kodeProduk: string
  namaProduk: string
  jumlah: number
  hargaSatuan: number
  subtotal: number
  createdAt: string
}

export interface TransactionRes {
  id: number
  kodeTransaksi: string
  transactionDate: string
  totalHarga: number
  sumberData: string
  importedBy: string
  catatan: string
  createdAt: string
  updatedAt: string
  details: TransactionDetailRes[]
}

export const apiCreateTransaction = async (body: TransactionReq): Promise<TransactionRes> => {
  const res = await fetch(`${BASE_URL}/transactions/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  })
  const json: BaseResponse<TransactionRes> = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Gagal membuat transaksi')
  return json.data
}

export const apiGetTransactions = async (): Promise<TransactionRes[]> => {
  const res = await fetch(`${BASE_URL}/transactions`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
  })
  const json: BaseResponse<TransactionRes[]> = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Gagal memuat transaksi')
  return json.data
}

export const apiImportExcelTransaction = async (file: File): Promise<void> => {
  const formData = new FormData()
  formData.append('file', file)
  
  const token = getToken()
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}/transactions/import-excel`, {
    method: 'POST',
    headers, // Do not set Content-Type, let browser set it with multipart boundary
    body: formData,
  })
  
  const json: BaseResponse<null> = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Gagal mengimpor data transaksi')
}

// ============================================================
// Apriori Analysis Types & Endpoints
// ============================================================
export interface AprioriReq {
  minSupport: number
  minConfidence: number
  startDate: string // dd/MM/yyyy
  endDate: string   // dd/MM/yyyy
}

export interface AprioriItemsetRes {
  item: string
  jumlah: number
  support: number
  keterangan: string
}

export interface AprioriRuleRes {
  antecedent: string
  consequent: string
  confidence: number
  keterangan: string
}

export const apiGetItemset1 = async (body: AprioriReq): Promise<AprioriItemsetRes[]> => {
  const res = await fetch(`${BASE_URL}/apriori/itemset1`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Gagal menghitung Itemset 1')
  return json.data
}

export const apiGetItemset2 = async (body: AprioriReq): Promise<AprioriItemsetRes[]> => {
  const res = await fetch(`${BASE_URL}/apriori/itemset2`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Gagal menghitung Itemset 2')
  return json.data
}

export const apiGetItemset3 = async (body: AprioriReq): Promise<AprioriItemsetRes[]> => {
  const res = await fetch(`${BASE_URL}/apriori/itemset3`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Gagal menghitung Itemset 3')
  return json.data
}

export const apiGetRules = async (body: AprioriReq): Promise<AprioriRuleRes[]> => {
  const res = await fetch(`${BASE_URL}/apriori/rules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Gagal memproses Rule Apriori')
  return json.data
}
