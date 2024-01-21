<script lang="ts" setup>
  import { type ILevel } from './../types';
  import { ref, computed } from 'vue';

  interface ICell {
    id: string,
    verticalWord?: {
      wordIndex: number,
      letterIndex: number,
    },
    horizontalWord?: {
      wordIndex: number,
      letterIndex: number,
    }
    x: number,
    y: number,
    currentValue: string,
    correctValue: string,
    wordIndex?: string
  }

  const props = defineProps<{
    level: ILevel
  }>();

  const cellWidth:number = 10;
  const strokeWidth:number = cellWidth / 30;
  const activeStrokeWidth:number = strokeWidth * 1.4;
  const fieldWidth = ref<number>(cellWidth * Math.max(...props.level.words.map(word => word.vertical ? word.xStart + 1 : word.word.length + word.xStart)) || cellWidth);
  const fieldHeight = ref<number>(cellWidth * Math.max(...props.level.words.map(word => !word.vertical ? word.yStart + 1 : word.word.length + word.yStart)) || cellWidth);
  const cells = computed<{[key:string]: ICell}>(() => {
    const result:{[key:string]: ICell} = {};

    for (let i = 0; i < props.level.words.length; i++) {
      const word = props.level.words[i];
      word.word = word.word.toUpperCase();

      for (let j = 0; j < word.word.length; j++) {
        const x:number = cellWidth * (word.xStart + (j * +!word.vertical));
        const y:number = cellWidth * (word.yStart + (j * +word.vertical));
        const key:string = x + '-' + y;
        
        if (!result[key]) {
          result[key] = {
            id: key,
            x,
            y,
            currentValue: '',
            correctValue: word.word[j],
          }
        }

        if (!j) {
          result[key].wordIndex = word.index;
        }

        if (word.vertical) {
          result[key].verticalWord = {
            wordIndex: i,
            letterIndex: j,
          }
        } else {
          result[key].horizontalWord = {
            wordIndex: i,
            letterIndex: j,
          }
        }
      }
    }

    return result;
  });

</script>

<template>
  <svg class="level-preview" :viewBox="`-${strokeWidth} -${strokeWidth} ${fieldWidth + activeStrokeWidth * 2} ${fieldHeight + activeStrokeWidth * 2}`">
    <g v-for="cell in cells" :transform="`translate(${cell.x} ${cell.y})`">
      <rect x="0" y="0" :width="cellWidth" :height="cellWidth" :stroke-width="strokeWidth" stroke="#000" fill="#fff" />
    </g>
  </svg>
</template>
