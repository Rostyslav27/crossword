<script lang="ts" setup>
  import { type ILevel } from '../types';
  import { useRoute, useRouter } from 'vue-router';
  import { levels } from './../levels';
  import Level from './../components/Level.vue';

  const route = useRoute();
  const router = useRouter();

  let level:ILevel = {
    id: 1,
    name: 'test',
    words: [],
  };

  if (route.params.levelid) {
    level = levels.find(l => String(l.id) === route.params.levelid) || level;
  } else {
    router.push('/');
  }

  
</script>

<template>
  <div class="level-page">
    <Level :level="level" />
  </div>
</template>

<style lang="scss" scoped>
  
  .level-page {
    background-color: #bdbdbd;
    height: 100vh;
    height: 100svh;
  }
</style>
