<template>
  <div class="loaders"></div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.loaders {
  width: 20px;
  height: 20px;
  position: relative;
}

.loaders::before {
  content: "";
  box-sizing: border-box;
  position: absolute;
  left: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border-top: 3px solid #fff;
  border-right: 3px solid transparent;
  animation: spinner8217 0.8s linear infinite;
}

@keyframes spinner8217 {
  to {
    transform: rotate(360deg);
  }
}
</style>
