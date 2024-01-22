<script lang="ts" setup>
  import { type ILevel } from './../types';
  import LevelItem from './LevelItem.vue';
  import { levels } from './../levels';

  defineEmits<{
    (e: 'select', level: ILevel): void
  }>();

  const levelList:ILevel[] = levels; 

</script>

<template>
  <div class="levels-list">
    <RouterLink class="levels-list__item" v-for="level in levelList" :key="level.id" :to="'/' + level.id">
      <LevelItem  :level="level" />
    </RouterLink>
  </div>
</template>

<style lang="scss" scoped>
  .levels-list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 20px;
    padding: 30px 10px 10px;
    height: 100%;

    &__item {
      text-decoration: none;
    }
  }
</style>
