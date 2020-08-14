<template>
  <div class="drag-loader">
    <div>
      <svg width="70" height="70">
        <circle cy="35" cx="35" r="35" fill="lightgrey" />
        <circle cy="15" cx="35" r="10" fill="black" />
      </svg>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.drag-loader {
  position: absolute;
  top: 0px;
  left: 50%;
  margin-left: -35px;
}
</style>
