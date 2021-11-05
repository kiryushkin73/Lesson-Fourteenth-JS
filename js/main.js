class Slider {
  constructor(selector) {
    this.selector = selector;
    this.timer = null;
  }

  init() {
    this.slider = document.querySelector(this.selector);
    this.wrapper = this.slider.querySelector('.slider__wrapper');
    this.arrowLeft = this.slider.querySelector('.slider__arrow-left');
    this.arrowrRight = this.slider.querySelector('.slider__arrow-right');
    this.toSlideButton = this.slider.querySelector('.slider__toSlide');
    this.bindEvents();
    this.direction = 0;
  }
  bindEvents() {
    this.slider.addEventListener('click', () => this.nextSlide());
    this.toSlideButton.addEventListener('click', (event) => {
      this.toSlideItem = event.target.dataset.numberSlide;
      this.toSlide();
    });
    this.autoSlide();
  }

  animationPlay() {
    let slider = this.slider.getBoundingClientRect().x + this.slider.clientTop;
    let wrapper = this.wrapper.getBoundingClientRect().x;
    return slider !== wrapper;
  }

  toSlide() {
    if (this.animationPlay()) return;
    this.currentSlide = this.wrapper.children[0].dataset.numberSlide;
    this.iteration = Math.abs(
      parseInt(this.currentSlide) - parseInt(this.toSlideItem)
    );
    if (this.currentSlide <= this.toSlideItem)
      this.sliderRight(Slider.SLIDE_TIME / this.iteration);
    if (this.currentSlide >= this.toSlideItem)
      this.sliderLeft(Slider.SLIDE_TIME / this.iteration);
    this.interval = setInterval(() => {
      if (this.animationPlay()) return;
      if (this.currentSlide <= this.toSlideItem)
        this.sliderRight(Slider.SLIDE_TIME / this.iteration);
      if (this.currentSlide >= this.toSlideItem)
        this.sliderLeft(Slider.SLIDE_TIME / this.iteration);
    }, Slider.SLIDE_TIME / (this.iteration + 1));
  }

  autoSlide() {
    let positionFieldX = this.slider.getBoundingClientRect().left;
    let positionFieldY = this.slider.getBoundingClientRect().top;
    let widthField = parseInt(window.getComputedStyle(this.slider).width);
    let heightField = parseInt(window.getComputedStyle(this.slider).height);
    document.onmousemove = (event) => {
      if (
        event.target.parentNode !== this.wrapper.querySelector('.slider__slide')
      ) {
        this.direction = 0;
        return;
      }
      if (
        event.clientY > positionFieldY &&
        event.clientY < positionFieldY + heightField
      ) {
        if (
          event.clientX > positionFieldX &&
          event.clientX < positionFieldX + widthField * 0.25
        ) {
          this.direction = -1;
        } else if (
          event.clientX > positionFieldX + widthField * 0.75 &&
          event.clientX < positionFieldX + widthField
        ) {
          this.direction = 1;
        }
      } else this.direction = 0;
    };

    this.intervalAuto = setInterval(() => {
      if (this.animationPlay()) return;
      if (this.direction === 1) {
        this.toSlideItem = null;
        this.sliderRight(Slider.SLIDE_TIME);
      }
      if (this.direction === -1) {
        this.toSlideItem = null;
        this.sliderLeft(Slider.SLIDE_TIME);
      }
    }, Slider.SLIDE_TIME_AUTO + Slider.SLIDE_TIME);
    if (this.direction === 0 || this.animationPlay())
      clearInterval(this.intervalAuto);
  }

  nextSlide() {
    if (this.animationPlay()) return; //проверка идет ли анимация
    if (event.target === this.arrowrRight) {
      this.toSlideItem = null;
      this.sliderRight(Slider.SLIDE_TIME);
    }
    if (event.target === this.arrowLeft) {
      this.toSlideItem = null;
      this.sliderLeft(Slider.SLIDE_TIME);
    }
  }

  sliderRight(sliderTime) {
    this.currentSlide = this.wrapper.children[0].dataset.numberSlide;
    if (this.toSlideItem === this.currentSlide) {
      clearInterval(this.interval);
      this.currentSlide = 100;
      return;
    }
    let animationStartTime = 0;
    requestAnimationFrame(function animation(t) {
      let wrapper = document.querySelector('.slider__wrapper');
      if (!animationStartTime) animationStartTime = t;
      let animationTime = t - animationStartTime;
      let currentPosition = (animationTime / sliderTime) * -100;
      wrapper.style.marginLeft = currentPosition + '%';
      if (currentPosition <= -100) {
        wrapper.append(wrapper.children[0]); //после остановки перекидываем слайды
        wrapper.style.marginLeft = ''; //чтоб становилось ровно
        return;
      }
      requestAnimationFrame(animation);
    });
  }

  sliderLeft(sliderTime) {
    this.currentSlide = this.wrapper.children[0].dataset.numberSlide;
    if (this.toSlideItem === this.currentSlide) {
      clearInterval(this.interval);
      this.currentSlide = 100;
      return;
    }

    let wrapper = document.querySelector('.slider__wrapper');
    wrapper.prepend(wrapper.children[4]); //после остановки перекидываем слайды
    let currentPosition = -100;
    let animationStartTime = 0;
    requestAnimationFrame(function animation(t) {
      if (!animationStartTime) animationStartTime = t;
      let animationTime = t - animationStartTime;
      currentPosition = -100 + (animationTime / sliderTime) * 100;

      wrapper.style.marginLeft = currentPosition + '%';
      if (currentPosition >= 0) {
        wrapper.style.marginLeft = ''; //чтоб становилось ровно
        return;
      }
      requestAnimationFrame(animation);
    });
  }
}
Slider.FRAME_TIME = 16;
Slider.SLIDE_TIME = 1000;
Slider.SLIDE_TIME_AUTO = 1200;

document.addEventListener('DOMContentLoaded', function () {
  let content = document.querySelector('.content');
  content.style.display = 'none';

  let load = document.querySelector('.preloader');
  let deg = 0;
  let t = setInterval(function () {
    deg++;
    load.style.transform = 'rotate(' + deg + 'deg)';
  }, 15);
  window.onload = function () {
    let preloader = document.querySelector('.preloader');
    preloader.style.display = 'none';
    let content = document.querySelector('.content');
    content.style.display = 'block';

    let slider = new Slider('.slider');
    slider.init();
  };
});
