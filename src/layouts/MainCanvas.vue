<script setup>

import Navigation from "../widget/Navigation.vue"
import { useRoute } from "vue-router"

const route = useRoute()

</script>

<template>
  <div class="main_layout_holder">
    <Navigation  v-if="route.name !== 'Details'"/>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>

.main_layout_holder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

</style>
