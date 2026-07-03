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

    <!-- ── Parameters Form ── -->
    <div class="filter-section">
      <div class="filter-controls">
        
        <!-- Periode -->
        <div class="filter-group">
          <label class="filter-label">Periode Transaksi</label>
          <div class="date-range-wrapper">
            <input type="date" v-model="startDate" class="date-input range-input" />
            <span class="range-separator">s/d</span>
            <input type="date" v-model="endDate" class="date-input range-input" />
          </div>
        </div>

        <!-- Min Support -->
        <div class="filter-group">
          <label class="filter-label">Minimum Support</label>
          <div class="input-percent-wrapper">
            <input type="number" v-model="minSupport" class="custom-input-percent" />
            <span class="percent-sign">%</span>
          </div>
        </div>

        <!-- Min Confidence -->
        <div class="filter-group">
          <label class="filter-label">Minimum Confidence</label>
          <div class="input-percent-wrapper">
            <input type="number" v-model="minConfidence" class="custom-input-percent" />
            <span class="percent-sign">%</span>
          </div>
        </div>

        <!-- Buttons -->
        <div class="filter-group actions">
          <button class="btn-primary" @click="runApriori" :disabled="loading">
            <span v-if="loading" class="btn-spinner"></span>
            <span v-else>Jalankan Analisis Apriori</span>
          </button>
          <button class="btn-danger" @click="resetForm" :disabled="loading">Reset</button>
        </div>

      </div>
      
      <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
      
      <!-- Loading Overlay/Info inside form area -->
      <div v-if="loading" class="loading-info">
        <span class="table-spinner"></span>
        <span>Sedang memproses algoritma apriori. Mohon tunggu...</span>
      </div>
    </div>

    <!-- ── Results Section ── -->
    <div v-if="hasResults && !loading" class="results-section">
      <div class="results-header">
        <h2 class="rule-title">Rule ID : {{ ruleId }}</h2>
        <div class="rule-meta">Min Support : {{ minSupport }}%</div>
        <div class="rule-meta">Min Confidence : {{ minConfidence }}%</div>
      </div>

      <!-- Itemset 1 -->
      <div class="panel">
        <div class="panel-header">Itemset 1</div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 10%">No</th>
                <th style="width: 35%">Item 1</th>
                <th style="width: 15%">Jumlah</th>
                <th style="width: 20%">Min Support</th>
                <th style="width: 20%">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in itemset1" :key="idx">
                <td>{{ idx + 1 }}</td>
                <td>{{ row.item }}</td>
                <td>{{ row.jumlah }}</td>
                <td>{{ row.support }}%</td>
                <td>
                  <span :class="row.keterangan.toLowerCase() === 'lolos' ? 'text-success' : 'text-danger'">
                    {{ row.keterangan }}
                  </span>
                </td>
              </tr>
              <tr v-if="itemset1.length === 0"><td colspan="5" class="text-center">Tidak ada data</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Itemset 2 -->
      <div class="panel">
        <div class="panel-header">Itemset 2</div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 10%">No</th>
                <th style="width: 25%">Item 1</th>
                <th style="width: 25%">Item 2</th>
                <th style="width: 10%">Jumlah</th>
                <th style="width: 15%">Min Support</th>
                <th style="width: 15%">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in itemset2" :key="idx">
                <td>{{ idx + 1 }}</td>
                <td>{{ splitItem(row.item, 0) }}</td>
                <td>{{ splitItem(row.item, 1) }}</td>
                <td>{{ row.jumlah }}</td>
                <td>{{ row.support }}%</td>
                <td>
                  <span :class="row.keterangan.toLowerCase() === 'lolos' ? 'text-success' : 'text-danger'">
                    {{ row.keterangan }}
                  </span>
                </td>
              </tr>
              <tr v-if="itemset2.length === 0"><td colspan="6" class="text-center">Tidak ada data</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Itemset 3 -->
      <div class="panel">
        <div class="panel-header">Itemset 3</div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 10%">No</th>
                <th style="width: 20%">Item 1</th>
                <th style="width: 20%">Item 2</th>
                <th style="width: 20%">Item 3</th>
                <th style="width: 10%">Jumlah</th>
                <th style="width: 10%">Min Support</th>
                <th style="width: 10%">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in itemset3" :key="idx">
                <td>{{ idx + 1 }}</td>
                <td>{{ splitItem(row.item, 0) }}</td>
                <td>{{ splitItem(row.item, 1) }}</td>
                <td>{{ splitItem(row.item, 2) }}</td>
                <td>{{ row.jumlah }}</td>
                <td>{{ row.support }}%</td>
                <td>
                  <span :class="row.keterangan.toLowerCase() === 'lolos' ? 'text-success' : 'text-danger'">
                    {{ row.keterangan }}
                  </span>
                </td>
              </tr>
              <tr v-if="itemset3.length === 0"><td colspan="7" class="text-center">Tidak ada data</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Confidence -->
      <div class="panel">
        <div class="panel-header">Rule (Confidence)</div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 5%">No</th>
                <th style="width: 20%">Antecedent</th>
                <th style="width: 20%">Consequent</th>
                <th style="width: 15%">Support A ∪ B</th>
                <th style="width: 10%">Support A</th>
                <th style="width: 15%">Nilai Confidence</th>
                <th style="width: 15%">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(rule, idx) in rules" :key="idx">
                <td>{{ idx + 1 }}</td>
                <td>{{ rule.antecedent }}</td>
                <td>{{ rule.consequent }}</td>
                <td>{{ getSupportAUB(rule.antecedent, rule.consequent) }}%</td>
                <td>{{ getSupportA(rule.antecedent) }}%</td>
                <td>{{ rule.confidence }}%</td>
                <td>
                  <span :class="rule.keterangan.toLowerCase() === 'lolos' ? 'text-success' : 'text-danger'">
                    {{ rule.keterangan }}
                  </span>
                </td>
              </tr>
              <tr v-if="rules.length === 0"><td colspan="7" class="text-center">Tidak ada data rule</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Hasil Analisa -->
      <div class="panel">
        <div class="panel-header">Hasil Analisa</div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 10%">No</th>
                <th style="width: 70%">Kesimpulan</th>
                <th style="width: 20%">Nilai Confidence</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(rule, idx) in rules.filter(r => r.keterangan.toLowerCase() === 'lolos')" :key="idx">
                <td>{{ idx + 1 }}</td>
                <td>{{ rule.antecedent }} sering dibeli bersamaan dengan {{ rule.consequent }}</td>
                <td>{{ rule.confidence }}%</td>
              </tr>
              <tr v-if="rules.filter(r => r.keterangan.toLowerCase() === 'lolos').length === 0">
                <td colspan="3" class="text-center">Tidak ada rule yang lolos confidence</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { apiGetItemset1, apiGetItemset2, apiGetItemset3, apiGetRules } from '../api'
import type { AprioriItemsetRes, AprioriRuleRes } from '../api'

const startDate = ref('')
const endDate = ref('')
const minSupport = ref('0')
const minConfidence = ref('0')

const loading = ref(false)
const hasResults = ref(false)
const errorMsg = ref('')

const ruleId = ref('')

const itemset1 = ref<AprioriItemsetRes[]>([])
const itemset2 = ref<AprioriItemsetRes[]>([])
const itemset3 = ref<AprioriItemsetRes[]>([])
const rules = ref<AprioriRuleRes[]>([])

const formatDateToDDMMYYYY = (isoDate: string) => {
  if (!isoDate) return ''
  const [yyyy, mm, dd] = isoDate.split('-')
  return `${dd}/${mm}/${yyyy}`
}

const runApriori = async () => {
  if (!startDate.value || !endDate.value) {
    errorMsg.value = 'Silakan pilih rentang tanggal periode transaksi terlebih dahulu.'
    return
  }
  
  errorMsg.value = ''
  loading.value = true
  hasResults.value = false
  
  const payload = {
    minSupport: Number(minSupport.value),
    minConfidence: Number(minConfidence.value),
    startDate: formatDateToDDMMYYYY(startDate.value),
    endDate: formatDateToDDMMYYYY(endDate.value)
  }

  try {
    // Run them sequentially or parallel. Running sequential ensures we don't spam backend too hard.
    // In Apriori, sometimes itemset2 depends on itemset1 being calculated.
    // But since the backend gives separate endpoints, we just call them.
    itemset1.value = await apiGetItemset1(payload)
    itemset2.value = await apiGetItemset2(payload)
    itemset3.value = await apiGetItemset3(payload)
    rules.value = await apiGetRules(payload)
    
    ruleId.value = Math.floor(Math.random() * 100).toString()
    hasResults.value = true
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : 'Terjadi kesalahan saat memproses apriori.'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  startDate.value = ''
  endDate.value = ''
  minSupport.value = '0'
  minConfidence.value = '0'
  hasResults.value = false
  itemset1.value = []
  itemset2.value = []
  itemset3.value = []
  rules.value = []
  errorMsg.value = ''
}

const splitItem = (itemStr: string, index: number) => {
  if (!itemStr) return '-'
  const parts = itemStr.split(',').map(s => s.trim())
  return parts[index] || '-'
}

const getSupportA = (antecedent: string) => {
  if (!antecedent) return '-'
  const items = antecedent.split(',').map(s => s.trim())
  
  if (items.length === 1) {
    const found = itemset1.value.find(i => i.item === antecedent)
    return found ? found.support : '-'
  } else if (items.length === 2) {
    const found = itemset2.value.find(i => {
      const set = i.item.split(',').map(s => s.trim())
      return set.includes(items[0]) && set.includes(items[1]) && set.length === 2
    })
    return found ? found.support : '-'
  }
  return '-'
}

const getSupportAUB = (antecedent: string, consequent: string) => {
  if (!antecedent || !consequent) return '-'
  const itemsA = antecedent.split(',').map(s => s.trim())
  const itemsB = consequent.split(',').map(s => s.trim())
  const allItems = [...itemsA, ...itemsB]
  
  if (allItems.length === 2) {
    const found = itemset2.value.find(i => {
      const set = i.item.split(',').map(s => s.trim())
      return allItems.every(item => set.includes(item)) && set.length === 2
    })
    return found ? found.support : '-'
  } else if (allItems.length === 3) {
    const found = itemset3.value.find(i => {
      const set = i.item.split(',').map(s => s.trim())
      return allItems.every(item => set.includes(item)) && set.length === 3
    })
    return found ? found.support : '-'
  }
  return '-'
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

/* ── Filter / Parameters ── */
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
  gap: 24px;
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

/* Date Range */
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

/* Input Percent */
.input-percent-wrapper {
  position: relative;
  width: 140px;
}
.custom-input-percent {
  width: 100%;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  height: 42px;
  padding: 0 35px 0 16px;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 600;
  color: #475569;
  background: #fff;
  outline: none;
  transition: border-color 0.2s;
}
.custom-input-percent:focus { border-color: #3b82f6; }
/* Remove arrows from number input */
.custom-input-percent::-webkit-outer-spin-button,
.custom-input-percent::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}
.custom-input-percent[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}
.percent-sign {
  position: absolute;
  right: 14px;
  top: 10px;
  color: #64748b;
  font-weight: 700;
  font-size: 14px;
  pointer-events: none;
}

/* Actions */
.actions {
  flex-direction: row;
  gap: 12px;
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
.btn-primary:hover:not(:disabled) { background: #2563eb; }
.btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

.btn-danger {
  background: #ff0000;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0 20px;
  height: 42px;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
  display: flex; align-items: center; justify-content: center;
}
.btn-danger:hover:not(:disabled) { opacity: 0.9; }
.btn-danger:disabled { opacity: 0.7; cursor: not-allowed; }

.error-msg { color: #ef4444; font-size: 13.5px; font-weight: 600; margin-top: 16px; }

.loading-info {
  margin-top: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #3b82f6;
  font-size: 14px;
  font-weight: 700;
}
.btn-spinner {
  display: inline-block; width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
.table-spinner {
  display: inline-block; width: 20px; height: 20px;
  border: 2px solid #bfdbfe; border-top-color: #3b82f6;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Results Section ── */
.results-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.results-header {
  margin-top: 8px;
}
.rule-title {
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 4px;
}
.rule-meta {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

/* Panel */
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

/* Table */
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

.text-success { color: #06b6d4; font-weight: 700; } /* Cyan to match mockup "Lolos" */
.text-danger { color: #ff0000; font-weight: 700; } /* Red for "Tidak Lolos" */
.text-center { text-align: center; }

</style>
