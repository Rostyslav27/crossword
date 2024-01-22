<script lang="ts" setup>
  import { type ILevel, type IUserAnswers } from './../types';
  import { ref, computed, nextTick } from 'vue';
  import Keyboard from './Keyboard.vue';

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
  const textFontSize:number = cellWidth * 0.62;
  const indexFontSize:number = cellWidth * 0.27;
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

  const enterValue = (value:string, stop:boolean = false) => {
    if (!cellCompleteMap.value[activeCell.value]) {
      const prevValue:string = cells.value[activeCell.value].currentValue;
      cells.value[activeCell.value].currentValue = value;
      
      userAnswers.value.answers[activeCell.value] = value;
      localStorage.setItem('answers' + props.level.id, JSON.stringify(userAnswers.value));

      checkWords();

      if (!value) {
        if (!prevValue && !stop) {
          nextTick().then(() => {
            prevCell();
            enterValue('', true);
          });
        }
      } else {
        nextTick().then(() => {
          nextCell();
        });
      }
    } else {
      if (!value) {
        nextTick().then(() => {
          prevCell();
        });
      } else {
        nextTick().then(() => {
          nextCell();
        });
      }
    }
  };

  const handleKeyboardInput = (value:string) => {
    if (activeCell.value && cells.value[activeCell.value]) {
      enterValue(value);
    }
  };

  document.addEventListener('keydown', (e:KeyboardEvent) => {
    if (activeCell.value && cells.value[activeCell.value]) {
      if (e.key === 'Backspace') {
        enterValue('');
      } else if (e.key.length === 1) {
        enterValue(e.key[e.key.length - 1].toUpperCase());
      }
    }
  });

  const nextCell = ():void => {
    if (wodrCellsMap.value[activeWord.value] && wodrCompleteMap.value.some(word => !word)) {
      [cells.value[activeCell.value].horizontalWord, cells.value[activeCell.value].verticalWord].forEach(wordRef => {
        if (wordRef && wordRef.wordIndex === activeWord.value) {
          if (wodrCompleteMap.value[activeWord.value]) {
            nextWord();
          } else if (wodrCellsMap.value[activeWord.value][wordRef.letterIndex + 1]) {
            activateCell(wodrCellsMap.value[activeWord.value][wordRef.letterIndex + 1].id);

            if (cellCompleteMap.value[activeCell.value]) {
              nextCell();
            }
          } 
        }
      });
    }
  };

  const prevCell = ():void => {
    if (wodrCellsMap.value[activeWord.value] && wodrCompleteMap.value.some(word => !word)) {
      [cells.value[activeCell.value].horizontalWord, cells.value[activeCell.value].verticalWord].forEach(wordRef => {
        if (wordRef && wordRef.wordIndex === activeWord.value) {
          if (wodrCellsMap.value[activeWord.value][wordRef.letterIndex - 1]) {
            activateCell(wodrCellsMap.value[activeWord.value][wordRef.letterIndex - 1].id);

            if (cellCompleteMap.value[activeCell.value]) {
              prevCell();
            }
          }
        }
      });
    }
  };

  const nextWord = ():void => {
    if (activeWord.value > -1) {
      let nextWordIndex:number = activeWord.value;

      const incNextWordIndex = ():void => {
        nextWordIndex++;

        if (!wodrCellsMap.value[nextWordIndex]) {
          nextWordIndex = 0;
        }

        if (wodrCompleteMap.value[nextWordIndex]) {
          incNextWordIndex();
        }
      };

      if (wodrCompleteMap.value.some(word => !word)) {
        incNextWordIndex();
      }

      const letterToActivateIndex:number = wodrCellsMap.value[nextWordIndex].findIndex(letter => !cellCompleteMap.value[letter.id]);

      if (letterToActivateIndex > -1) {
        activeCell.value = wodrCellsMap.value[nextWordIndex][letterToActivateIndex].id;
        activeWord.value = nextWordIndex;
      }
      
    }
  };

  const prevWord = ():void => {
    if (activeWord.value > -1) {
      let nextWordIndex:number = activeWord.value;

      const decNextWordIndex = ():void => {
        nextWordIndex--;

        if (!wodrCellsMap.value[nextWordIndex]) {
          nextWordIndex = wodrCellsMap.value.length - 1;
        }

        if (wodrCompleteMap.value[nextWordIndex]) {
          decNextWordIndex();
        }
      };

      if (wodrCompleteMap.value.some(word => !word)) {
        decNextWordIndex();
      }

      const letterToActivateIndex:number = wodrCellsMap.value[nextWordIndex].findIndex(letter => !cellCompleteMap.value[letter.id]);

      if (letterToActivateIndex > -1) {
        activeCell.value = wodrCellsMap.value[nextWordIndex][letterToActivateIndex].id;
        activeWord.value = nextWordIndex;
      }
    }
  };

  const getCellColor = (cell:ICell):string => {
    if (cellCompleteMap.value[cell.id]) {
      return '#fff9c3';
    } else if (activeCell.value === cell.id) {
      return '#55ff82';
    } else if ([cell.horizontalWord?.wordIndex, cell.verticalWord?.wordIndex].includes(activeWord.value)) {
      return '#c8fec6';
    } else {
      return '#fff';
    }
  };

  const useHint = () => {
    if (activeCell.value && cells.value[activeCell.value]) {
      if (confirm('Використати підказку?')) {
        enterValue(cells.value[activeCell.value].correctValue);
      }
    }
  }

  const showMessage = (message:string):void => {
    alert(message);
  };

</script>

<template>
  <div class="level">
    <div class="level__header">
      <RouterLink class="level__back" to="/">
        <svg class="level__back-arrow" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 492.004 492.004" style="enable-background:new 0 0 512 512" xml:space="preserve"><g><path d="M382.678 226.804 163.73 7.86C158.666 2.792 151.906 0 144.698 0s-13.968 2.792-19.032 7.86l-16.124 16.12c-10.492 10.504-10.492 27.576 0 38.064L293.398 245.9l-184.06 184.06c-5.064 5.068-7.86 11.824-7.86 19.028 0 7.212 2.796 13.968 7.86 19.04l16.124 16.116c5.068 5.068 11.824 7.86 19.032 7.86s13.968-2.792 19.032-7.86L382.678 265c5.076-5.084 7.864-11.872 7.848-19.088.016-7.244-2.772-14.028-7.848-19.108z" fill="#0275eb" opacity="1" data-original="#0275eb"></path></g></svg>
        Назад
      </RouterLink>
      <button v-if="activeCell && !cellCompleteMap[activeCell]" class="level__hint" @click="useHint">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 24 24" style="enable-background:new 0 0 512 512" xml:space="preserve"><g><path fill="#ffc107" d="m23.363 8.584-7.378-1.127L12.678.413c-.247-.526-1.11-.526-1.357 0L8.015 7.457.637 8.584a.75.75 0 0 0-.423 1.265l5.36 5.494-1.267 7.767a.75.75 0 0 0 1.103.777L12 20.245l6.59 3.643a.75.75 0 0 0 1.103-.777l-1.267-7.767 5.36-5.494a.75.75 0 0 0-.423-1.266z" opacity="1" data-original="#ffc107"></path></g></svg>
      </button>
    </div>
    <div class="level__main">
      <svg class="level__field" :viewBox="`-${strokeWidth} -${strokeWidth} ${fieldWidth + activeStrokeWidth * 2} ${fieldHeight + activeStrokeWidth * 2}`">
        <rect :x="'-' + strokeWidth" :y="'-' + strokeWidth" :width="fieldWidth + activeStrokeWidth * 2" :height="fieldHeight + activeStrokeWidth * 2" fill="#bdbdbd"  @click="activateCell('')" />
        <g v-for="cell in cells" :transform="`translate(${cell.x} ${cell.y})`" @click="activateCell(cell.id)">
          <rect x="0" y="0" :width="cellWidth" :height="cellWidth" :stroke-width="strokeWidth" stroke="#000" :fill="getCellColor(cell)" />
          <text v-if="cell.currentValue" :x="textOffset" :y="textOffset + activeStrokeWidth" :font-size="textFontSize" dominant-baseline="middle" text-anchor="middle" font-family="Arial">{{ cell.currentValue }}</text>
          <text v-if="cell.wordIndex" :x="activeStrokeWidth" :y="activeStrokeWidth" :font-size="indexFontSize" dominant-baseline="hanging" text-anchor="start" font-family="Arial">{{ cell.wordIndex }}</text>
        </g>
        <rect v-if="cells[activeCell]" :x="cells[activeCell].x" :y="cells[activeCell].y" :width="cellWidth" :height="cellWidth" :stroke-width="activeStrokeWidth" stroke="#000" fill="none" @click="activateCell(activeCell)" />
      </svg>
    </div>
    <div class="level__questions" :class="{'level__questions--visible': cells[activeCell]}">
      <button class="level__toggle-word level__toggle-word--prev" @click="prevWord()">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 492.004 492.004" style="enable-background:new 0 0 512 512" xml:space="preserve"><g><path d="M382.678 226.804 163.73 7.86C158.666 2.792 151.906 0 144.698 0s-13.968 2.792-19.032 7.86l-16.124 16.12c-10.492 10.504-10.492 27.576 0 38.064L293.398 245.9l-184.06 184.06c-5.064 5.068-7.86 11.824-7.86 19.028 0 7.212 2.796 13.968 7.86 19.04l16.124 16.116c5.068 5.068 11.824 7.86 19.032 7.86s13.968-2.792 19.032-7.86L382.678 265c5.076-5.084 7.864-11.872 7.848-19.088.016-7.244-2.772-14.028-7.848-19.108z" fill="#0275eb" opacity="1" data-original="#0275eb"></path></g></svg>
      </button>
      <p class="level__question" :class="{'level__question--space': i === longestQuestionWordIndex, 'level__question--active': activeWord === i}" v-for="(word, i) in level.words" :title="word.question" @click="showMessage(word.question)">{{ word.question }}</p>
      <button class="level__toggle-word level__toggle-word--next" @click="nextWord()">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 492.004 492.004" style="enable-background:new 0 0 512 512" xml:space="preserve"><g><path d="M382.678 226.804 163.73 7.86C158.666 2.792 151.906 0 144.698 0s-13.968 2.792-19.032 7.86l-16.124 16.12c-10.492 10.504-10.492 27.576 0 38.064L293.398 245.9l-184.06 184.06c-5.064 5.068-7.86 11.824-7.86 19.028 0 7.212 2.796 13.968 7.86 19.04l16.124 16.116c5.068 5.068 11.824 7.86 19.032 7.86s13.968-2.792 19.032-7.86L382.678 265c5.076-5.084 7.864-11.872 7.848-19.088.016-7.244-2.772-14.028-7.848-19.108z" fill="#0275eb" opacity="1" data-original="#0275eb"></path></g></svg>
      </button>
    </div>
    <Keyboard class="level__keyboard" @enter="handleKeyboardInput" />
  </div>
</template>

<style lang="scss" scoped>

  .level {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: 100svh;
    touch-action: manipulation;

    &__header {
      background-color: #000;
      padding: 10px 15px;
      display: flex;
      align-items: center;
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
      display: flex;
      align-items: center;
    }

    &__back-arrow {
      width: 15px;
      height: auto;
      transform: rotateY(180deg);
      margin-right: 8px;
    }

    &__hint {
      width: 24px;
      height: 24px;
      padding: 0;
      margin-left: auto;
      border: none;
      border-radius: 0;
      background-color: transparent;
      box-shadow: none;
      outline: none;

      svg {
        width: 100%;
        height: 100%;
      }
    }

    &__main {
      flex-grow: 3;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__field {
      width: calc(100% - 20px);
      height: calc(100% - 20px);
      position: absolute;
    }

    &__questions {
      position: relative;
      margin-top: auto;
      background-color: #333;
      padding: 5px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      visibility: hidden;
      height: 58px;

      &--visible {
        visibility: visible;
      }
    }

    &__question {
      position: absolute;
      opacity: 0;
      width: calc(100% - 70px);
      text-align: center;
      margin: 0 auto;
      font-size: 0.9em;
      color: #fff;
      max-height: 100%;
      overflow: auto;
      text-overflow: ellipsis;
      scrollbar-width: none;

      &--space {
        position: relative;
      }

      &--active {
        opacity: 1;
        z-index: 10;
      }

      &::-webkit-scrollbar {
        width: 0;
      }
    }

    &__toggle-word {
      width: 24px;
      height: 100%;
      padding: 0;
      border: none;
      border-radius: 0;
      background-color: transparent;
      box-shadow: none;
      outline: none;

      &--prev {
        transform: rotateY(180deg);
      }

      svg {
        width: 100%;
        height: auto;
      }
    }

    &__keyboard {
      flex-grow: 1;
      min-height: 150px;
      max-height: 190px;
    }
  }

</style>
