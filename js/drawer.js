import {gsap} from 'gsap';

class Drawer {
  ANIMATION_TIMER = 400;
  CLASS_OPENED = 'drawer--opened';
  HAMBURGER_OPENED = 'hamburger--opened';

  drawer = null;
  burger = null;
  elements = [];
  children = [];
  links = [];

  animation = null;
  motion = null;

  constructor(drawer, burger) {
    this.drawer = drawer;
    this.burger = burger;
    this.elements = Array.from(document.querySelectorAll('[drawer-motion]'));
    this.links = this.drawer.querySelectorAll('a');

    // Get Children
    this.elements.forEach(element => this.children.push(element.firstChild));

    this.animation = null;
    this.motion = gsap.timeline({paused: true});

    this.createMotion();
    this.setEvents();
  }

  setEvents() {
    this.burger.addEventListener('click', () => this.toggle());
    this.links.forEach(link => link.addEventListener('click', () => this.toggle()))
  }

  createMotion() {
    this.elements
      .forEach(
        (element, index) => {
          const duration = 0.25;
          const position = duration + index * 0.05;

          this.motion.fromTo(
            element,
            {
              '--drawer-motion-progress': '100%',
            },
            {
              '--drawer-motion-progress': '0%',
              duration: duration,
            },
            position
          );
        }
      );
  }

  toggle() {
    clearTimeout(this.animation);

    this.isOpened = document.body.classList.toggle(this.CLASS_OPENED);

    this.burger.classList.toggle(this.HAMBURGER_OPENED, this.isOpened);

    if (!this.isOpened) {
      this.motion.reverse();
    } else {
      this.animation = setTimeout(() => {
        this.motion.restart();
      }, this.ANIMATION_TIMER);
    }
  }
}

export default Drawer;
