import LocomotiveScroll from 'locomotive-scroll';
import imagesloaded from 'imagesloaded';
import 'locomotive-scroll/dist/locomotive-scroll.css';

const LocomotivePlugin = function () {
};

LocomotivePlugin.install = Vue => {
  let callback = () => {};
  let locomotive = null;

  function imagesUpdate() {
    imagesloaded('img', instance => {
      locomotive.update();
    });
  }

  Vue.directive('locomotive', {
    inserted(el, binding, vnode) {
      locomotive = new LocomotiveScroll({
        el,
        ...binding.value,
      });

      imagesUpdate();

      locomotive.on('scroll', (e) => {
        vnode.context.$nuxt.$emit('locomotive.scroll', e);
      });

      vnode.context.$nuxt.$on('locomotive.update', () => {
        locomotive.update();
        imagesUpdate();
      });

      vnode.context.$nuxt.$on('locomotive:start', () => {
        locomotive.start();
      });

      vnode.context.$nuxt.$on('locomotive:stop', () => {
        locomotive.stop();
      });

      vnode.context.$nuxt.$on('triggerScroll', () => {
        locomotive.update();
        locomotive.scrollTo('top', {
          duration: 0,
          disableLerp: true,
        });
        imagesUpdate();
      });

      callback(locomotive);
    },
    unbind(el, binding, vnode) {
      locomotive.destroy();
      vnode.context.$nuxt.$off('locomotive.update');
      vnode.context.$nuxt.$off('locomotive:start');
      vnode.context.$nuxt.$off('locomotive:stop');
      vnode.context.$nuxt.$off('triggerScroll');
    },
  });

  Vue.prototype.$locomotive = (cb) => {
    callback = cb;

    if (locomotive) {
      callback(locomotive);
    }
  };
};

export default LocomotivePlugin;
