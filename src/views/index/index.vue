<script setup>
import homeImage from '@/assets/image/home.png'
</script>

<template>
  <div class="home-container">
    <img :src="homeImage" alt="首頁圖片" class="home-image" />
  </div>
</template>

<style scoped>
.home-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.home-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 讓圖片自動填滿並裁切 */
  border-radius: 0; /* 不需要圓角 */
  box-shadow: none; /* 不需要陰影 */
}


</style>
