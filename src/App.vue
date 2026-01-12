<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
/* Reset dasar agar tidak ada margin/padding yang mengganggu */
* {
  margin: 0;
  padding: 0;
  box-box: border-box;
}

body {
  overflow: hidden; /* Mencegah scroll yang tidak diinginkan di HP */
}
</style>