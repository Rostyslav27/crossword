<template>
  <div class="main">
    <RouterView />
  </div>
</template>

<style lang="scss">

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body, html {
    margin: 0;
    min-width: 320px;
    min-height: 100vh;
    background-color: #bdbdbd;
    max-height: 100vh;
    overflow: hidden;
    font-family: 'Arial';
  }

  #app {
    height: 100vh;
    height: 100svh;
  }

  .main {
    width: 100vw;
    height: 100vh;
    height: 100svh;
    position: fixed;
    top: 0;
    left: 0;
    overflow: auto;
    max-width: 500px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
  }

</style>
