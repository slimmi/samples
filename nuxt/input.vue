<template lang="pug">
  ValidationProvider(
    :name="name"
    :rules="rules"
    v-slot="{ invalid, errors }"
  )
    .input(
      :class="{ 'input--invalid': invalid, 'input--checkbox': isCheckbox }"
    )
      textarea.input__field(
        v-if="type === 'textarea'"
        :id="id"
        :name="id"
        :placeholder="placeholder"
        :required="!!isRequired"
        rows="3"
        v-model="currentValue"
      )
      template(
        v-else-if="isCheckbox"
      )
        input(
          :id="id"
          :name="id"
          type="checkbox"
          :required="!!isRequired"
          v-model="currentValue"
        )
        label.input__label(
          :for="id"
        ) {{ label }}
      input.input__field(
        v-else
        :id="id"
        :name="id"
        :type="type"
        :placeholder="placeholder"
        :required="!!isRequired"
        v-model="currentValue"
      )
      label.input__error(
        v-if="!isCheckbox"
        :for="id"
      ) {{ errors[0] }}
</template>

<script>
  import {ValidationProvider} from 'vee-validate/dist/vee-validate.full';

  export default {
    components: {
      ValidationProvider,
    },
    props: [
      'id',
      'type',
      'rules',
      'name',
      'label',
      'value',
      'isRequired',
      'isChecked',
    ],
    watch: {
      currentValue(value) {
        // Allows us to use v-model on our input
        this.$emit('input', value);
      },
      value(value) {
        this.currentValue = value;
      },
    },
    data() {
      return {
        currentValue: '',
      }
    },
    computed: {
      isCheckbox() {
        return this.type === 'checkbox';
      },
      placeholder() {
        return `${this.name ? this.name : ''}${this.name && this.isRequired ? ' *': ''}`;
      },
    },
    mounted() {
      this.currentValue = this.value;
    }
  }
</script>

<style lang="scss" scoped>
  .input {
    margin: 0 0 35px;
    position: relative;

    &__field {
      background: transparent;
      border: none;
      border-bottom: 1px solid var(--input-field-border);
      border-radius: 0;
      color: var(--input-field-color);
      margin: 0;
      outline: none;
      padding-bottom: 35px;
      resize: none;
      transition: transition(color), transition(border);
      vertical-align: middle;
      width: 100%;
      @include font(3);

      &::-webkit-scrollbar-track {
        background: var(--input-field-scrollbar);
      }

      &::placeholder {
        color: var(--input-field-placeholder);
      }

      &:focus {
        --input-field-border: var(--input-field-border-focus);
      }

      @include media-breakpoint-down(sm) {
        padding-bottom: 20px;
      }
    }

    &__error {
      bottom: var(--font-small-size);
      color: var(--input-error-color);
      left: 0;
      max-height: var(--font-small-size);
      opacity: var(--input-error-opacity, 0);
      position: absolute;
      transition: transition(opacity);
      @include font(small);

      @include media-breakpoint-down(sm) {
        bottom: 7px;
      }
    }

    &--invalid {
      --input-error-opacity: 1;
      --input-checkbox-border: var(--input-error-color);
    }

    &--checkbox {
      .input__label {
        align-items: center;
        cursor: pointer;
        display: flex;
        min-height: var(--input-checkbox-size);
        padding-left: calc(var(--input-checkbox-size) + var(--input-checkbox-space));
        position: relative;

        &:before,
        &:after {
          content: '';
          height: var(--input-checkbox-size);
          left: 0;
          position: absolute;
          top: 0;
          width: var(--input-checkbox-size);
        }

        &:before {
          border: 1px solid var(--input-checkbox-border, #d3d3d3);
          transition: transition(border);
        }

        &:after {
          background: url(~assets/images/check-mark.svg) 50% 50%/contain no-repeat;
          opacity: var(--input-checkbox-checked, 0);
          transition: transition(opacity);
        }
      }

      input {
        left: -100vw;
        position: absolute;

        &:checked + label {
          --input-checkbox-border: transparent;
          --input-checkbox-checked: 1;
        }
      }
    }
  }
</style>
