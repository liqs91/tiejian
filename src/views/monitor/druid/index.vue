<template>
  <!--  <iframe :src="url" />-->
  <div class="iframe-container">
    <iframe
      frameborder="0"
      :src="url"
    />
  </div>
</template>
<script>
  export default {
    name: 'Druid',
    components: {},
    data() {
      return {
        url: process.env.VUE_APP_BASE_API + '/druid/login.html',
      }
    },
  }
</script>
<style lang="scss" scoped>
  .iframe-container {
    iframe {
      width: 100%;
      height: $base-keep-alive-height;
    }
  }
</style>
