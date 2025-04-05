class Slider {
  constructor(separator, option) {
    const { slides, width = 600, height = 500 } = option;

    this.sliderWidth = width;
    this.sliderHeight = height;
    this.slider = document.querySelector(separator);
    this.slides = slides;
    this.currentIndexSlide = 0;

    this.slider.classList.add("slider-main");
  }

  createSlide(slideImageSrc) {
    const slide = document.createElement("li");
    const slideImage = new Image();
    slide.classList.add("slider__slide");

    slideImage.src = slideImageSrc;
    slide.append(slideImage);

    return slide;
  }

  createSliderLine() {
    const lineWrapper = document.createElement("div");
    lineWrapper.classList.add("slider-wrapper");

    const line = document.createElement("ul");

    for (let i = 0; i < this.slides.length; i++) {
      const createSlide = this.createSlide(this.slides[i]);
      createSlide.id = `slider__slide-${i}`;
      line.append(createSlide);
    }

    line.classList.add("slider__line");

    this.sliderLine = line;

    lineWrapper.append(line);

    return lineWrapper;
  }

  createControls() {
    const controlContainer = document.createElement("div");
    controlContainer.classList.add("slider__controls");

    const nextBtn = document.createElement("button");
    const prevBtn = document.createElement("button");

    prevBtn.innerHTML = `<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="matrix(1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z" fill="#fff"></path> </g></svg>`;
    nextBtn.innerHTML = `<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="matrix(-1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z" fill="#fff"></path> </g></svg>`;

    prevBtn.classList.add("slider__prev-btn");
    nextBtn.classList.add("slider__next-btn");

    controlContainer.append(prevBtn);
    controlContainer.append(nextBtn);

    return controlContainer;
  }

  updateActiveClass() {
    const slides = this.sliderLine.querySelectorAll(".slider__slide");
    slides.forEach((slide) => {
      slide.classList.remove("slider__slide--active");
    });

    const currentSlide = this.sliderLine.querySelector(
      `#slider__slide-${this.currentIndexSlide}`
    );
    if (currentSlide) {
      currentSlide.classList.add("slider__slide--active");
    }
  }

  showSlide() {
    const offset = this.currentIndexSlide * 600;
    this.sliderLine.style.transform = `translateX(-${offset}px)`;
    this.updateActiveClass();
  }

  showNextSlide() {
    this.currentIndexSlide = (this.currentIndexSlide + 1) % this.slides.length;
    this.showSlide();
  }

  showPrevSlide() {
    this.currentIndexSlide =
      (this.currentIndexSlide - 1 + this.slides.length) % this.slides.length;
    this.showSlide();
  }

  clickedSlider(event) {
    const clickedElement = event.target;

    if (clickedElement.closest(".slider__prev-btn")) {
      this.showPrevSlide();
    } else if (clickedElement.closest(".slider__next-btn")) {
      this.showNextSlide();
    }
  }

  init() {
    const createSliderLine = this.createSliderLine();
    const createControls = this.createControls();

    this.slider.append(createSliderLine);
    this.slider.append(createControls);

    this.updateActiveClass();

    this.slider.addEventListener("click", () => {
      this.clickedSlider(event);
    });
  }
}

const imagesArray = [
  "./img/catOnBed.jpg",
  "./img/catOnBlanket.jpg",
  "./img/catOnBlanket2.jpg",
  "./img/catInBag.jpg",
  "./img/catOnCarpet.jpg",
  "./img/catOnFloor.jpg",
];

new Slider(".slider", {
  slides: imagesArray,
}).init();
