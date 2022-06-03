<template lang="pug">
  .stories
    .page__title.container
      h1 {{ $t('stories') }}
    .stories__message(v-html="$t('stories_sub_title')")
    .stories__container
      Story(
        v-for="story of getStories"
        :key="story.id"
        :code="story.id"
        :image="story.Media_file"
        :title="story.Name[$i18n.locale]"
        :description="story.Short_description[$i18n.locale]"
        :date="story.Placing_date"
      )
    .container
      hr
      NuxtLink.link-more.link-more--top(to="/projects") {{ $t('our_projects') }}
</template>

<script>
  export default {
    async asyncData({ app }) {
      let stories = null;

      try {
        stories = await app.$strapi.find('stories-page');
      } catch (e) {
        $nuxt.error({ statusCode: 500 });
      }

      if (!stories) {
        $nuxt.error({ statusCode: 404 });
      }

      return {
        stories,
      };
    },
    computed: {
      getStories() {
        return this.stories.Stories;
      }
    },
  }
</script>

<style lang="scss" scoped>
  .stories {
    &__container {
      --story-width: #{column(7)};
      margin-bottom: var(--global-space);
      padding-left: column(4);
      padding-right: column(4);

      @include media-breakpoint-down(lg) {
        --story-width: #{column(9)};
        padding-left: column(2);
        padding-right: column(2);
      }

      @include media-breakpoint-down(md) {
        --story-width: #{column(10)};
        padding-left: column(1);
        padding-right: column(1);
      }

      @include media-breakpoint-down(xs) {
        padding-left: 0;
        padding-right: 0;
      }

      .story {
        &:nth-child(3n-1),
        &:nth-child(3n) {
          margin-left: auto;
        }

        @include media-breakpoint-down(xs) {
          --story-annotation-left: #{column(1)};
          max-width: column(20);

          &:nth-child(3n-1),
          &:nth-child(3n) {
            --story-annotation-left: 0;
            --story-annotation-right: #{column(1)};
          }
        }
      }
    }

    &__message {
      left: column(13);
      position: absolute;
      width: column(7);
      @include font(3);

      @include media-breakpoint-down(lg) {
        width: column(9);
      }

      @include media-breakpoint-down(md) {
        width: column(10);
      }

      @include media-breakpoint-down(xs) {
        display: none;
      }
    }
  }
</style>
