<template>
  <div class="cms-editions-edition">
    <div class="description">
      <edition-badge :name="edition.name" block big></edition-badge>
      <p class="edition-description">{{ editionDescription }}</p>
      <div class="price">
        <template v-if="edition.price && edition.price > 0">
          {{ edition.price | currency }}
        </template>
        <template v-else>
          {{ 'Free' | t('app') }}
        </template>
      </div>

      <p
        v-if="edition.price && edition.price > 0"
        class="-mt-8 py-6 text-grey-dark"
      >
        {{ 'Price includes 1 year of updates.' | t('app') }}<br />
        {{
          '{renewalPrice}/year per site for updates after that.'
            | t('app', {
              renewalPrice: $options.filters.currency(edition.renewalPrice),
            })
        }}
      </p>

      <ul>
        <li v-for="(feature, key) in features" :key="key">
          <icon icon="check" />
          {{ feature.name }}

          <info-hud v-if="feature.description">
            {{ feature.description }}
          </info-hud>
        </li>
      </ul>
    </div>

    <div class="cms-edition-actions">
      <status-badge :edition="editionIndex"></status-badge>

      <buy-btn
        :edition="editionIndex"
        :edition-handle="edition.handle"
      ></buy-btn>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import InfoHud from '../InfoHud';
  import StatusBadge from './StatusBadge';
  import BuyBtn from './BuyBtn';
  import EditionBadge from '../EditionBadge';

  export default {
    props: ['edition'],

    components: {
      InfoHud,
      StatusBadge,
      BuyBtn,
      EditionBadge,
    },

    computed: {
      ...mapGetters({
        getCmsEditionFeatures: 'craft/getCmsEditionFeatures',
        getCmsEditionIndex: 'craft/getCmsEditionIndex',
      }),

      editionDescription() {
        switch (this.edition.handle) {
          case 'solo':
            return this.$options.filters.t(
              'For when you’re building a website for yourself or a friend.',
              'app'
            );
          case 'pro':
            return this.$options.filters.t(
              'For when you’re building something professionally for a client or team.',
              'app'
            );
          default:
            return null;
        }
      },

      editionIndex() {
        return this.getCmsEditionIndex(this.edition.handle);
      },

      features() {
        return this.getCmsEditionFeatures(this.edition.handle);
      },
    },
  };
</script>

<style lang="scss">
  .cms-editions-edition {
    @apply .border .border-grey-light .border-solid .p-8 .rounded .text-center .flex .flex-col;

    .description {
      @apply .flex-1;

      .edition-name {
        @apply .border-b .border-grey-light .border-solid .text-grey-dark .inline-block .py-1 .uppercase .text-lg .font-bold;
      }

      .edition-description {
        @apply .text-lg .my-6 .leading-normal;
      }

      .price {
        @apply .text-3xl .font-bold .my-8;
      }

      ul {
        @apply .text-left .mb-8;

        li {
          @apply .py-2 .border-b .border-grey-lighter .border-solid;

          &:first-child {
            @apply .border-t;
          }
        }
      }
    }

    .cms-edition-actions {
      position: relative;
      .c-spinner {
        position: absolute;
        bottom: -30px;
        left: 50%;
        margin-left: -11px;
      }

      .c-btn {
        @apply .mt-3;
      }
    }
  }
</style>
