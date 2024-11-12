<template>
  <div class="bg-red ellipsis">123</div>
  <button @click="add">点及</button>
</template>
<script setup lang="ts">
import { FEllipsis, useFDialog } from "@/components/es";

const s = useFDialog();
function add() {
  s.success({
    content: '"成功"',
  });
}
</script>
<style></style>
