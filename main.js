class Slider {
  #currentIndex = 0;

  constructor(container, option) {
    const { arrImgs, sizeSlider, margin, clickToSlide, progressDots, bgColor } =
      option;

    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;

    this.arrImgs = arrImgs;
    this.heightSlider = sizeSlider[0];
    this.widthSlider = sizeSlider[1];
    this.margin = margin;
    this.clickToSlide = clickToSlide.toUpperCase();
    this.progressDots = progressDots.toUpperCase();
    this.bgAgreement = bgColor[0].toUpperCase();
    this.bgColor = bgColor[1];

    this.isDragging = false;
    this.startPos = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;
    this.animationId = 0;
    this.currentIndex = 0;
    this.dragSpeed = 1;
    this.sliderTrack = null;
  }

  init() {
    // Устанавливаем начальное положение
    this.setPositionByIndex(0)

    // Добавляем события
    this.addEventListeners();
  }

  getImg(containerSlider) {
    const containerImg = document.createElement("div");
    containerImg.id = "container-img";

    Object.assign(containerImg.style, {
      height: this.heightSlider + "px",
      width: this.widthSlider + "px",
      display: "flex",
      overflow: "hidden",
      transition: "transform 0.3s ease",
      userSelect: "none",
    });

    for (let i = 0; i < this.arrImgs.length; i++) {
      const img = document.createElement("img");

      img.src = this.arrImgs[i];
      img.id = `imgSlider-${i}`;

      Object.assign(img.style, {
        minWidth: "100%",
        objectFit: "cover",
        borderRadius: "1em",
      });

      if (this.arrImgs.length > 1) {
        if (this.clickToSlide === "Y") {
          containerImg.style.cursor = "pointer";
        }
      }

      containerImg.append(img);
    }

    containerSlider.append(containerImg);
    this.sliderTrack = containerImg;
  }

  openImg() {
    const containerImg = document.querySelector("#container-img");
    const btnPrevSlide = document.querySelector("#btnPrevSlide");
    const btnNextSlide = document.querySelector("#btnNextSlide");
    const arrImgsLengths = this.arrImgs.length;

    this.showSlide(this.#currentIndex);

    if (this.clickToSlide === "Y") {
      containerImg.addEventListener("click", (event) => {
        // Не обрабатываем клик, если было перетаскивание
        if (this.isDragging) {
          this.isDragging = false;
          return;
        }

        const { width, x } = containerImg.getBoundingClientRect();
        const { clientX } = event;

        if (clientX - x <= width / 2) {
          this.#currentIndex =
            (this.#currentIndex - 1 + arrImgsLengths) % arrImgsLengths;
        } else {
          this.#currentIndex = (this.#currentIndex + 1) % arrImgsLengths;
        }

        this.showSlide(this.#currentIndex);
        this.setPositionByIndex(this.#currentIndex); // Добавьте эту строку
      });
    }

    btnPrevSlide.addEventListener("click", () => {
      this.#currentIndex =
        (this.#currentIndex - 1 + arrImgsLengths) % arrImgsLengths;
      this.showSlide(this.#currentIndex);
    });

    btnNextSlide.addEventListener("click", () => {
      this.#currentIndex = (this.#currentIndex + 1) % arrImgsLengths;
      this.showSlide(this.#currentIndex);
    });
  }

  addEventListeners() {
    this.container.addEventListener("mousedown", this.startDrag.bind(this));
    this.container.addEventListener("mousemove", this.drag.bind(this));
    this.container.addEventListener("mouseup", this.endDrag.bind(this));
    this.container.addEventListener("mouseleave", this.endDrag.bind(this));

    this.container.addEventListener("touchstart", this.startDrag.bind(this));
    this.container.addEventListener("touchmove", this.drag.bind(this));
    this.container.addEventListener("touchend", this.endDrag.bind(this));

    this.container.addEventListener("selectstart", (e) => e.preventDefault());
  }

  startDrag(e) {
    if (e.type === "touchstart") {
      this.startPos = e.touches[0].clientX;
    } else {
      this.startPos = e.clientX;
    }

    this.isDragging = true;
    this.container.classList.add("grabbing");

    // Запускаем анимацию
    this.animationId = requestAnimationFrame(this.animation.bind(this));
  }

  drag(e) {
    if (!this.isDragging) return;
    e.preventDefault();

    const currentPosition =
      e.type === "touchmove" ? e.touches[0].clientX : e.clientX;

    const diff = currentPosition - this.startPos;
    this.currentTranslate = this.prevTranslate + diff * this.dragSpeed;
  }

  endDrag() {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.container.classList.remove("grabbing");
    cancelAnimationFrame(this.animationId);

    // Обновляем предыдущее положение
    this.prevTranslate = this.currentTranslate;

    // Вычисляем ближайший слайд
    this.updateIndex();

    // Плавно переходим к ближайшему слайду
    this.setPositionByIndex(this.currentIndex);

    this.#currentIndex = this.currentIndex;
    this.showSlide(this.currentIndex);
  }

  animation() {
    this.setSliderPosition();

    if (this.isDragging) {
      this.animationId = requestAnimationFrame(this.animation.bind(this));
    }
  }

  setSliderPosition() {
    if (this.sliderTrack) {
      this.sliderTrack.style.transform = `translateX(${this.currentTranslate}px)`;
    }
  }

  updateIndex() {
    const item = document.querySelector("#imgSlider-0");
    if (!item) return;

    const itemWidth = item.offsetWidth + this.margin; // Используем this.margin
    const draggedSlides = Math.round(-this.currentTranslate / itemWidth);

    this.currentIndex = Math.min(
      Math.max(0, draggedSlides),
      this.arrImgs.length - 1
    );
    this.#currentIndex = this.currentIndex; // Синхронизируем private и public index
  }

  setPositionByIndex(index) {
    const item = document.querySelector("#imgSlider-0");
    const itemWidth = item.offsetWidth + 20; // + margin

    this.currentTranslate = this.prevTranslate = -index * itemWidth;

    this.currentIndex = index;
    this.setSliderPosition();
  }

  next() {
    if (this.currentIndex < this.arrImgs.length - 1) {
      this.currentIndex++;
      this.setPositionByIndex(this.currentIndex);
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.setPositionByIndex(this.currentIndex);
    }
  }

  showSlide(index) {
    const container = document.querySelector("#container-img");
    const offset = -index * 100;
    container.style.transform = `translateX(${offset}%)`;

    // Обновите индексы
    this.#currentIndex = index;
    this.currentIndex = index;

    if (this.progressDots === "Y") {
      this.activeDot(index);
    }
  }

  renderButtons(containerSlider) {
    const containerBtn = document.createElement("div");
    Object.assign(containerBtn.style, {
      display: "flex",
      gap: "14px",
      justifyContent: "center",
    });

    containerBtn.id = "container-btn";

    if (this.arrImgs.length <= 1) {
      containerBtn.style.display = "none";
    }

    const btnPrevSlide = document.createElement("button");
    const btnNextSlide = document.createElement("button");

    btnPrevSlide.innerHTML = `<svg width="36px" height="36px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="matrix(1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z" fill="#0F0F0F"></path> </g></svg>`;
    Object.assign(btnPrevSlide.style, {
      border: "none",
      borderRadius: "1em",
      backgroundColor: "#fff",
      display: "flex",
      justifyContent: "center",
      alignContent: "center",
      cursor: "pointer",
      border: "2px solid",
    });
    btnPrevSlide.id = "btnPrevSlide";

    btnNextSlide.innerHTML = `<svg width="36px" height="36px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="matrix(-1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z" fill="#0F0F0F"></path> </g></svg>`;
    Object.assign(btnNextSlide.style, {
      border: "none",
      borderRadius: "1em",
      backgroundColor: "#fff",
      display: "flex",
      justifyContent: "center",
      alignContent: "center",
      cursor: "pointer",
      border: "2px solid",
    });
    btnNextSlide.id = "btnNextSlide";

    containerBtn.append(btnPrevSlide, btnNextSlide);
    containerSlider.append(containerBtn);
  }

  renderDots(containerSlider) {
    const containerDots = document.createElement("ul");
    containerDots.id = "container-dots";
    const widthDot = "10px";
    const heightDot = "10px";

    for (let i = 0; i < this.arrImgs.length; i++) {
      const dot = document.createElement("li");

      Object.assign(dot.style, {
        listStyleType: "none",
        width: widthDot,
        height: heightDot,
        backgroundColor: "#fff",
        borderRadius: "2em",
        transition: "background-color 0.3s ease",
        transition: "width 0.3s ease",
        cursor: "pointer",
      });

      containerDots.append(dot);

      dot.addEventListener("click", () => {
        if (this.#currentIndex === i) {
          return;
        }

        this.showSlide(i);
      });
    }

    Object.assign(containerDots.style, {
      position: "absolute",
      bottom: "66px",
      left: "50%",
      transform: "translate(-50%)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      gap: "10px",
      padding: "8px 16px",
      borderRadius: "2em",
    });

    containerSlider.append(containerDots);

    this.activeDot(0);
  }

  activeDot(index) {
    const dots = document.querySelectorAll("#container-dots li");

    dots.forEach((dot, i) => {
      dot.style.backgroundColor =
        i === index ? "#fff" : "rgba(255, 255, 255, 0.5)";
      dot.style.width = i === index ? "20px" : "10px";
    });
  }

  createSlider() {
    const slider = this.container;

    if (this.progressDots === "Y") {
      slider.style.position = "relative";
    }

    if (this.bgAgreement === "Y") {
      Object.assign(slider.style, {
        backgroundColor: this.bgColor,
        borderRadius: "1em",
      });
    }

    Object.assign(slider.style, {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: "10px",
      margin: this.margin + "px",
      padding: "8px",
    });

    this.getImg(slider);
    this.renderButtons(slider);
    this.openImg();
    this.init();

    if (this.arrImgs.length <= 1) {
      return;
    }

    if (this.progressDots === "Y") {
      this.renderDots(slider);
    }
  }
}

/*
ДОКУМЕНТАЦИЯ: 
Чтобы запустить слайдер нужно написать new Slider () и вставлять в скобки значение которые рассмотрены ниже 
1-й элемент это название класса контейнера где должен быть размещён слайдер как в примере ".name"
2-й элемент это массив: нужно поочерёдно передать путь к картинкам, которые будут задействованы в слайдере, 
с помощью кавычек, как в примере ['./firstImg.png', './secondImg.jpg', ...]
3-й элемент это массив: нужно вставить высоту и ширину слайдера, как в примере [350, 200], измеряется в px
4-й элемент это значение margin всего слайдера в px, как в примере: 16,
5-й элемент это соглашение на то, что добавить перемещение на другой слайд при клике или нет, если Вам это 
не нужно впишите эту строку 'N' / 'n', если хотите то 'Y' / 'y'
6-й элемент это соглашение на то, что добавить точки прогресса в слайдер, если Вам это не нужно впишите эту 
строку 'N' / 'n', если хотите то 'Y' / 'y'
7-й элемент это массив: если вы передадите ['Y', '#color'], то у слайдера будет скруглённый задний фон с 
цветом, который вы указали, если вам это не нужно то укажите ['N', '']
*/

const imagesArray = [
  "./img/catOnBed.jpg",
  "./img/catOnBlanket.jpg",
  "./img/catOnBlanket2.jpg",
  "./img/catInBag.jpg",
  "./img/catOnCarpet.jpg",
  "./img/catOnFloor.jpg",
];

const sliderOptions = {
  arrImgs: imagesArray,
  sizeSlider: [300, 500],
  margin: 16,
  clickToSlide: "n",
  progressDots: "y",
  bgColor: ["y", "#B39F7A"],
};

new Slider(".slider", sliderOptions).createSlider();
