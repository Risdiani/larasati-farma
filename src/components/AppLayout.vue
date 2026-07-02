<template>
  <div class="app-layout">
    <Sidebar
      :active-page="activePage"
      @navigate="handleNavigate"
      @logout="handleLogout"
    />
    <main class="app-main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'

defineProps<{
  activePage: string
}>()

const emit = defineEmits<{
  navigate: [page: string]
  logout: []
}>()

const handleNavigate = (page: string) => emit('navigate', page)
const handleLogout = () => emit('logout')
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: #f1f5f9;
}

.app-main {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
</style>
