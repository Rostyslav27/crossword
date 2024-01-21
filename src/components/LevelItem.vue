<script lang="ts" setup>
  import { type ILevel, type IUserAnswers } from './../types';
  import LevelPreviev from './LevelPreviev.vue';

  const props = defineProps<{
    level: ILevel
  }>();

  let userAnswers:IUserAnswers = { completed: 0, answers: {} };  
  userAnswers = (JSON.parse(localStorage.getItem('answers' + props.level.id) || '{ "completed": 0, "answers": {} }') as IUserAnswers) || { completed: 0, answers: {} };
</script>

<template>
  <div class="level">
    <div class="level__preview-wrapper">
      <LevelPreviev class="level__preview" :level="level" />
    </div>
    <p class="level__completed">{{ userAnswers.completed }}%</p>
  </div>
</template>

<style lang="scss" scoped>
  .level {
    background-color: #333;
    padding: 10px 5px 5px;
    border-radius: 10px;
    aspect-ratio: 1 / 1;
    display: flex;
    flex-direction: column;
    text-decoration: none;

    &__preview-wrapper {
      flex-grow: 1;
      position: relative;
      margin-bottom: 10px;
    }

    &__preview {
      aspect-ratio: 1 / 1;
      
      position: absolute;
      width: 100%;
      height: 100%;
    }

    &__completed {
      text-decoration: none;
      margin: 0;
      width: 100%;
      text-align: center;
      color: #fff;
    }
  }
</style>
