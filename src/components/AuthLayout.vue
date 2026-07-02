<template>
  <div class="auth-wrapper">
    <!-- Left Panel: Form -->
    <div class="auth-left">
      <!-- Logo Center Top -->
      <div class="auth-logo-top">
        <img src="/images/logo-larasati-farma.png" alt="Logo Larasati Farma" class="logo-img-small" />
      </div>

      <!-- Form Content Slot -->
      <div class="auth-form-area">
        <slot />
      </div>

      <!-- Footer -->
      <div class="auth-footer">
        <p>Copyrights © 2026 - Toko Obat Larasati Farma</p>
      </div>
    </div>

    <!-- Right Panel -->
    <div class="auth-right">
      <!-- Logo & Description Top Left -->
      <div class="auth-right-header">
        <img src="/images/logo-larasati-farma.png" alt="Logo Larasati Farma" class="logo-img-lg" />
        <p class="right-desc">{{ description }}</p>
      </div>

      <!-- Illustration Center -->
      <div class="auth-illustration">
        <img :src="illustrationSrc" :alt="illustrationAlt" class="illustration-img" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  illustrationSrc: string
  illustrationAlt: string
  description?: string
}>()
</script>

<style scoped>
.auth-wrapper {
  display: flex;
  min-height: 100vh;
  background: #ffffff;
}

/* ========== LEFT PANEL ========== */
.auth-left {
  width: 50%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 48px;
  box-sizing: border-box;
  position: relative;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.06);
}

/* Logo kecil di tengah atas */
.auth-logo-top {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 8px;
}

.logo-img-small {
  height: 52px;
  width: auto;
  object-fit: contain;
}

/* Form area di tengah */
.auth-form-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: 340px;
  padding: 24px 0;
}

/* Footer di bawah */
.auth-footer {
  text-align: center;
  padding-top: 16px;
  width: 100%;
}

.auth-footer p {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
}

/* ========== RIGHT PANEL ========== */
.auth-right {
  width: 50%;
  background: linear-gradient(to right, #E6F1FE 50%, #CBE2FD 74%);
  display: flex;
  flex-direction: column;
  padding: 40px 48px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

/* Logo besar + deskripsi di pojok kiri atas */
.auth-right-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  position: relative;
  z-index: 1;
  margin-bottom: 16px;
}

.logo-img-lg {
  height: 80px;
  width: auto;
  object-fit: contain;
}

.right-desc {
  font-size: 14px;
  color: #3b5f8a;
  line-height: 1.6;
  margin: 0;
  max-width: 320px;
}

/* Gambar ilustrasi di tengah */
.auth-illustration {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.illustration-img {
  max-width: 88%;
  max-height: 500px;
  object-fit: contain;
  filter: drop-shadow(0 8px 32px rgba(37, 99, 235, 0.10));
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}

/* ========== RESPONSIVE ========== */
@media (max-width: 900px) {
  .auth-wrapper {
    flex-direction: column;
  }
  .auth-left,
  .auth-right {
    width: 100%;
  }
  .auth-right {
    min-height: 320px;
    padding: 32px 24px;
  }
  .illustration-img {
    max-height: 240px;
  }
  .auth-form-area {
    max-width: 100%;
  }
}
</style>
