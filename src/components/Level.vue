<script lang="ts" setup>
  import { type ILevel, type IUserAnswers } from './../types';
  import { ref, computed, nextTick } from 'vue';

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
  const textOffset: number = cellWidth / 2;
  const textFontSize:number = cellWidth * 0.65;
  const indexFontSize:number = cellWidth * 0.3;
  const fieldWidth = ref<number>(cellWidth * Math.max(...props.level.words.map(word => word.vertical ? word.xStart + 1 : word.word.length + word.xStart)) || cellWidth);
  const fieldHeight = ref<number>(cellWidth * Math.max(...props.level.words.map(word => !word.vertical ? word.yStart + 1 : word.word.length + word.yStart)) || cellWidth);
  const userAnswers = ref<IUserAnswers>({ completed: 0, answers: {} });
  const longestQuestionWordIndex:number = props.level.words.map((word, i) => [i,  word.question.length]).sort((cur, prev) => prev[1] - cur[1])?.[0]?.[0] || 0;

  userAnswers.value = (JSON.parse(localStorage.getItem('answers' + props.level.id) || '{ "completed": 0, "answers": {} }') as IUserAnswers) || { completed: 0, answers: {} };

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
            currentValue: userAnswers.value.answers[key] || '',
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

  const wodrCellsMap = computed<ICell[][]>(() => {
    const result:ICell[][] = [];
    const cellsArr:ICell[] = Object.values(cells.value);

    for (let i = 0; i < cellsArr.length; i++) {
      const cell = cellsArr[i];

      if (cell.horizontalWord) {
        if (!result[cell.horizontalWord.wordIndex]) {
          result[cell.horizontalWord.wordIndex] = [];
        }

        result[cell.horizontalWord.wordIndex][cell.horizontalWord.letterIndex] = cell;
      } 

      if (cell.verticalWord) {
        if (!result[cell.verticalWord.wordIndex]) {
          result[cell.verticalWord.wordIndex] = [];
        }

        result[cell.verticalWord.wordIndex][cell.verticalWord.letterIndex] = cell;
      } 
    }

    return result;
  }); 

  const wodrCompleteMap = ref<boolean[]>([]);
  const cellCompleteMap = ref<{[key:string]: boolean}>({});

  const checkWord = (i:number):void => {
    wodrCompleteMap.value[i] = !wodrCellsMap.value[i].some(word => word.correctValue != word.currentValue);
    
    if (wodrCompleteMap.value[i]) {
      wodrCellsMap.value[i].forEach(word => {
        cellCompleteMap.value[word.id] = true;
      })
    }
  };

  const checkWords = ():void => {
    for (let i = 0; i < wodrCellsMap.value.length; i++) {
      checkWord(i);
    }

    userAnswers.value.completed = Math.ceil(wodrCompleteMap.value.filter(el => el).length / wodrCompleteMap.value.length * 100);
    localStorage.setItem('answers' + props.level.id, JSON.stringify(userAnswers.value));
  };

  checkWords();

  const activeCell = ref<string>('');
  const activeWord = ref<number>(-1);
  const activeCellValue = ref<string>('-');
  const activeCellInput = ref<HTMLInputElement | null>(null);

  const activateCell = (cellId:string):void =>  {
    if (cells.value[cellId]) {

      const case2 = ():void => {
        if (activeCell.value === cellId) {
            let tempActiveWord:number = activeWord.value;
            
            [cells.value[cellId].horizontalWord, cells.value[cellId].verticalWord].forEach(wordRef => {
              if (wordRef && wordRef.wordIndex !== activeWord.value) {
                tempActiveWord = wordRef.wordIndex
              }
            });

            activeWord.value = tempActiveWord;
        } else if (!(cells.value[cellId].verticalWord && cells.value[cellId].horizontalWord && [cells.value[cellId].verticalWord?.wordIndex, cells.value[cellId].horizontalWord?.wordIndex].includes(activeWord.value))) {
          activeWord.value = (cells.value[cellId].horizontalWord || cells.value[cellId].verticalWord)?.wordIndex || 0;
        }
      }

      let wordCompleted = [cells.value[cellId].horizontalWord, cells.value[cellId].verticalWord].some(wordRef => wordRef && wodrCompleteMap.value[wordRef.wordIndex]);

      if (wordCompleted && cells.value[cellId].verticalWord && cells.value[cellId].horizontalWord) {
        let tempActiveWord:number = activeWord.value;

        [cells.value[cellId].horizontalWord, cells.value[cellId].verticalWord].forEach(wordRef => {
          if (wordRef && !wodrCompleteMap.value[wordRef.wordIndex]) {
            tempActiveWord = wordRef.wordIndex
          }
        });

        if (tempActiveWord != activeWord.value) {
          activeWord.value = tempActiveWord;
        } else {
          case2();
        }
      } else if (cells.value[cellId].verticalWord && cells.value[cellId].horizontalWord && activeWord.value > -1 && activeCell.value) {
        case2();
      } else {
        activeWord.value = (cells.value[cellId].horizontalWord || cells.value[cellId].verticalWord)?.wordIndex || 0;
      }
      activeCellInput.value?.focus({preventScroll: true});
    } else {
      activeWord.value = -1;
    }
    

    activeCell.value = cellId;
  };

  const enterValue = (value:string) => {

    if (!cellCompleteMap.value[activeCell.value]) {
      cells.value[activeCell.value].currentValue = value;
      
      userAnswers.value.answers[activeCell.value] = value;
      localStorage.setItem('answers' + props.level.id, JSON.stringify(userAnswers.value));

      checkWords();

      if (!value) {
        nextTick().then(() => {
          prevCell();
        });
      } else {
        nextTick().then(() => {
          nextCell();
        });
      }
    } else {
      nextTick().then(() => {
        nextCell();
      });
    }
  };

  const handleActiveCellInput = () => {
    if (activeCell.value && cells.value[activeCell.value]) {
      if (activeCellValue.value.length && activeCellValue.value != '-') {
        activeCellValue.value = activeCellValue.value[activeCellValue.value.length - 1];
        enterValue(activeCellValue.value[activeCellValue.value.length - 1].toUpperCase());
      } else {
        activeCellValue.value = '-';
        enterValue('');
      }
    }
  };

  const nextCell = ():void => {
    if (wodrCellsMap.value[activeWord.value]) {
      [cells.value[activeCell.value].horizontalWord, cells.value[activeCell.value].verticalWord].forEach(wordRef => {
        if (wordRef && wordRef.wordIndex === activeWord.value) {
          if (wodrCellsMap.value[activeWord.value][wordRef.letterIndex + 1]) {
            activateCell(wodrCellsMap.value[activeWord.value][wordRef.letterIndex + 1].id);
          } 
          // else if (wodrCellsMap.value[activeWord.value + 1] && wodrCellsMap.value[activeWord.value + 1][0]) {
          //   activateCell(wodrCellsMap.value[activeWord.value + 1][0].id);
          // }
        }
      });
    }
  };

  const prevCell = ():void => {
    if (wodrCellsMap.value[activeWord.value]) {
      [cells.value[activeCell.value].horizontalWord, cells.value[activeCell.value].verticalWord].forEach(wordRef => {
        if (wordRef && wordRef.wordIndex === activeWord.value) {
          if (wodrCellsMap.value[activeWord.value][wordRef.letterIndex - 1]) {
            activateCell(wodrCellsMap.value[activeWord.value][wordRef.letterIndex - 1].id);
          }
        }
      });
    }
  };

  const getCellColor = (cell:ICell):string => {
    if ((cell.horizontalWord && wodrCompleteMap.value[cell.horizontalWord.wordIndex]) || (cell.verticalWord && wodrCompleteMap.value[cell.verticalWord.wordIndex])) {
      return '#fff9c3';
    } else if (activeCell.value === cell.id) {
      return '#55ff82';
    } else if ([cell.horizontalWord?.wordIndex, cell.verticalWord?.wordIndex].includes(activeWord.value)) {
      return '#c8fec6';
    } else {
      return '#fff';
    }
  };

</script>

<template>
  <div class="level">
    <div class="level__header">
      <RouterLink class="level__back" to="/">Назад</RouterLink>
    </div>
    <input class="level__input" type="text" v-model="activeCellValue" @input="handleActiveCellInput" ref="activeCellInput" >
    <div class="level__main">
      <div class="level__questions">
        <p class="level__question" :class="{'level__question--space': i === longestQuestionWordIndex, 'level__question--active': activeWord === i}" v-for="(word, i) in level.words">{{ word.question }}</p>
      </div>
      <svg class="level__field" :viewBox="`-${strokeWidth} -${strokeWidth} ${fieldWidth + activeStrokeWidth * 2} ${fieldHeight + activeStrokeWidth * 2}`">
        <rect :x="'-' + strokeWidth" :y="'-' + strokeWidth" :width="fieldWidth + activeStrokeWidth * 2" :height="fieldHeight + activeStrokeWidth * 2" fill="#bdbdbd"  @click="activateCell('')" />
        <g v-for="cell in cells" :transform="`translate(${cell.x} ${cell.y})`" @click="activateCell(cell.id)">
          <rect x="0" y="0" :width="cellWidth" :height="cellWidth" :stroke-width="strokeWidth" stroke="#000" :fill="getCellColor(cell)" />
          <text v-if="cell.currentValue" :x="textOffset" :y="textOffset + strokeWidth" :font-size="textFontSize" dominant-baseline="middle" text-anchor="middle" font-family="Arial">{{ cell.currentValue }}</text>
          <text v-if="cell.wordIndex" :x="activeStrokeWidth" :y="activeStrokeWidth" :font-size="indexFontSize" dominant-baseline="hanging" text-anchor="start" font-family="Arial">{{ cell.wordIndex }}</text>
        </g>
        <rect v-if="cells[activeCell]" :x="cells[activeCell].x" :y="cells[activeCell].y" :width="cellWidth" :height="cellWidth" :stroke-width="activeStrokeWidth" stroke="#000" fill="none" @click="activateCell(activeCell)" />
      </svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>

  .level {

    &__header {
      background-color: #000000;
      padding: 15px 5px;
    }

    &__back {
      color: #0275eb;
      background-color: transparent;
      border-radius: 0;
      border: none;
      outline: none;
      font: inherit;
      padding: 5px;
      display: block;
      text-decoration: none;
    }

    &__input {
      color: #fff;
      font-size: 1px;
      outline: none;
      border: none;
      position: absolute;
      box-shadow: none;
      opacity: 0;
    }

    &__field {
      width: 100%;
      height: auto;
    }

    &__questions {
      position: relative;
      margin-bottom: 10px;
    }

    &__question {
      position: absolute;
      opacity: 0;
      top: 0;
      left: 0;
      width: 100%;
      text-align: center;
      margin: 5px 0;

      &--space {
        position: relative;
      }

      &--active {
        opacity: 1;
      }
    }
  }

</style>
