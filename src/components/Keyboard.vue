<script lang="ts" setup>

  const emit = defineEmits<{
    (e: 'enter', value: string): void
  }>();

  const keys:string[] = [
    'Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 
    'Ф', 'І', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Є', 
    'Ї', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю'
  ];


</script>

<template>
  <div class="keyboard">
    <button v-for="key in keys" class="keyboard__key" @click="emit('enter', key)">{{ key }}</button>
    <button class="keyboard__key keyboard__key--big" @click="emit('enter', '')">
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 0 24 24" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><g data-name="Layer 2"><g data-name="backspace"><path d="M20.14 4h-9.77a3 3 0 0 0-2 .78l-.1.11-6 7.48a1 1 0 0 0 .11 1.37l6 5.48a3 3 0 0 0 2 .78h9.77A1.84 1.84 0 0 0 22 18.18V5.82A1.84 1.84 0 0 0 20.14 4zM20 18h-9.63a1 1 0 0 1-.67-.26l-5.33-4.85 5.38-6.67a1 1 0 0 1 .62-.22H20z" fill="#fff" opacity="1" data-original="#fff"></path><path d="M11.29 14.71a1 1 0 0 0 1.42 0l1.29-1.3 1.29 1.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42L15.41 12l1.3-1.29a1 1 0 0 0-1.42-1.42L14 10.59l-1.29-1.3a1 1 0 0 0-1.42 1.42l1.3 1.29-1.3 1.29a1 1 0 0 0 0 1.42z" fill="#fff" opacity="1" data-original="#fff"></path></g></g></g></svg>
    </button>
  </div>
</template>

<style lang="scss" scoped>
  .keyboard {
    background-color: #000;
    padding: 4px;
    display: grid;
    grid-template-columns: repeat(11, 1fr);
    grid-gap: 3px;
    touch-action: manipulation;
    user-select: none;

    &__key {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      border: none;
      padding: 0;
      font-size: 1.1em;
      background-color: #6a7077;
      color: #fff;
      touch-action: manipulation;

      &:active {
        background-color: #50555a;
      }

      &--big {
        background-color: #a1a8af;
      }

      svg {
        height: 1.5em;
        width: auto;
      }
    }
  }
</style>
