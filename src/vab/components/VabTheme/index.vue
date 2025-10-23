<template>
  <span v-if="theme.showTheme">
   <vab-icon v-if="this.theme.layout=='common'&&this.theme.themeName=='ocean'||this.theme.themeName=='purple'&&this.theme.layout!='horizontal'" style="color: #515a6e" icon="brush-2-line" @click="handleOpenTheme" />
   <vab-icon v-else icon="brush-2-line" @click="handleOpenTheme" />
  </span>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'VabTheme',
    computed: {
      ...mapGetters({
        theme: 'settings/theme',
      }),
    },
    methods: {
      handleOpenTheme() {
        this.$baseEventBus.$emit('theme')
      },
    },
  }
</script>
