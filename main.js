class Slider {
  constructor(
    container,
    arrImgs,
    sizeSlider,
    margin,
    clickToSlide,
    progressDots,
    bgColor
  ) {
    this.container = container;
    this.arrImgs = arrImgs;
    this.heightSlider = sizeSlider[0];
    this.widthSlider = sizeSlider[1];
    this.margin = margin;
    this.clickToSlide = clickToSlide.toUpperCase();
    this.progressDots = progressDots.toUpperCase();
    this.bgAgreement = bgColor[0].toUpperCase();
    this.bgColor = bgColor[1];
  }

  getImg(containerSlider) {
    const containerImg = document.createElement("div");
    containerImg.id = "container-img";

    for (let i = 0; i < this.arrImgs.length; i++) {
      const img = document.createElement("img");

      img.src = this.arrImgs[i];
      img.id = `imgSlider-${i}`;

      Object.assign(img.style, {
        height: this.heightSlider + "px",
        width: this.widthSlider + "px",
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
    this.hideImg();
  }

  hideImg() {
    const arrImgsLengths = this.arrImgs.length;

    for (let i = 0; i < arrImgsLengths; i++) {
      const img = document.querySelector(`#imgSlider-${i}`);
      img.style.display = "none";
    }
  }

  openImg() {
    const containerImg = document.querySelector("#container-img");
    const btnPrevSlide = document.querySelector("#btnPrevSlide");
    const btnNextSlide = document.querySelector("#btnNextSlide");
    const arrImgsLengths = this.arrImgs.length;

    let currentIndex = 0;

    this.showSlide(currentIndex);

    if (this.clickToSlide === "Y") {
      if (this.arrImgs.length <= 1) return;
      containerImg.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % arrImgsLengths;
        this.showSlide(currentIndex);
      });
    }

    btnPrevSlide.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + arrImgsLengths) % arrImgsLengths;
      this.showSlide(currentIndex);
    });

    btnNextSlide.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % arrImgsLengths;
      this.showSlide(currentIndex);
    });
  }

  showSlide(index) {
    for (let i = 0; i < this.arrImgs.length; i++) {
      const img = document.querySelector(`#imgSlider-${i}`);
      img.style.display = "none";
    }

    const currentImg = document.querySelector(`#imgSlider-${index}`);
    currentImg.style.display = "block";

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

    for (let i = 0; i < this.arrImgs.length; i++) {
      const dot = document.createElement("li");

      Object.assign(dot.style, {
        listStyleType: "none",
        width: 8 + "px",
        height: 8 + "px",
        backgroundColor: "#fff",
        borderRadius: "2em",
        transition: "background-color 0.3s ease",
      });

      containerDots.append(dot);
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
    });
  }

  createSlider() {
    const slider = document.querySelector(`${this.container}`);

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
    this.hideImg();
    this.openImg();

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

new Slider(
  ".slider",
  [
    "./img/catOnBed.jpg",
    "./img/catOnBlanket.jpg",
    "./img/catOnBlanket2.jpg",
    "./img/catInBag.jpg",
    "./img/catOnCarpet.jpg",
    "./img/catOnFloor.jpg",
  ],
  [300, 500],
  16,
  "y",
  "y",
  ["y", "#B39F7A"]
).createSlider();
