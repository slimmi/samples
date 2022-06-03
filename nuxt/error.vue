<template lang="pug">
  .page__error.container
    h1 {{ getTitle }}
    p {{ error.message }}
</template>

<script>
  export default {
    props: ['error'],
    layout: 'default',
    head() {
      return {
        title: this.getTitle,
      }
    },
    computed: {
      getTitle() {
        let title = this.$i18n.t('error_occurred');

        if (this.error.statusCode === 404) {
          title = this.$i18n.t('page_not_found');
        }

        return title;
      }
    },
    mounted() {
      $nuxt.$emit('locomotive.update');
    }
  }
</script>
