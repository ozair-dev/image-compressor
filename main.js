const originalImage = document.querySelector(".app__original-image");
const originalImageInfo = document.querySelector(
  ".app__original-image > .app__image-info"
);
const compressedImage = document.querySelector(".app__compressed-image");
const resizeButton = document.querySelector(
  ".app__compressed-image__resize-button"
);
const compressedImageInfo = document.querySelector(
  ".app__compressed-image > .app__image-info"
);
const downloadButton = document.querySelector(
  ".app__compressed-image__download-button"
);

const numberInputs = document.querySelectorAll('input[type="number"]');
const fileInput = document.querySelector('input[type="file"]');

// To get the type of file to be outputed
const outputFileInput = document.querySelector(".app__output-file-type-input");

const rangeElem = document.querySelector(".app__range-input");
const rangeButton = document.querySelector(".app__range-input__button");

const showMoreButton = document.querySelector(".app__more-inputs-button");
const moreInputsDiv = document.querySelector(".app__more-inputs-div");

const optionsInputs = [...numberInputs, outputFileInput];

const URL = window.URL || window.webkitURL;

const options = { quality: 1, outputType: "image/jpeg" };

let file;

fileInput.onchange = function (e) {
  file = e.target.files[0];
  changeOriginalImage();
};

// To resize the compressed image
resizeButton.onmousedown = () => (resizeButton.dataset.clicked = true);
originalImage.onmouseup = () => (resizeButton.dataset.clicked = false);
originalImage.onmouseleave = () => (resizeButton.dataset.clicked = false);
originalImage.onclick = handleResize;
originalImage.onmousemove = (e) => {
  if (JSON.parse(resizeButton.dataset.clicked)) {
    handleResize(e);
  }
};

optionsInputs.forEach(
  (input) =>
    (input.onblur = function () {
      const value = this.value;

      // To only run if the input is changed.
      if (options[this.name] !== (value || undefined)) {
        if (!value) delete options[this.name];
        else options[this.name] = value;

        if (file) {
          compressImage();
        }
      }
    })
);

showMoreButton.onclick = () => {
  moreInputsDiv.classList.toggle("show");
};
rangeElem.onmousedown = () => (rangeElem.dataset.clicked = true);
rangeElem.onmouseup = () => (rangeElem.dataset.clicked = false);
rangeElem.onmouseleave = () => (rangeElem.dataset.clicked = false);
rangeElem.onmousemove = handleRangeInputMouseMove;
function handleRangeInputMouseMove(e) {
  if (JSON.parse(rangeElem.dataset.clicked)) handleRangeClick(e);
}
rangeElem.onclick = handleRangeClick;

function handleRangeClick(e) {
  const rangeElemRect = rangeElem.getBoundingClientRect();
  const x = e.pageX - rangeElemRect.left;
  const quality = x / rangeElemRect.width;
  if (quality >= 0 && quality <= 1) {
    rangeButton.style.left = x + "px";
    options.quality = parseFloat(quality.toFixed(2));
    if (file) {
      compressImage();
    }
  }
}

function compressImage() {
  new Compressor(file, {
    ...options,
    success(blob) {
      compressedImage.style.backgroundImage = `url(${URL.createObjectURL(
        blob
      )})`;
      downloadButton.href = URL.createObjectURL(blob);
      downloadButton.download = blob.name;
      setInfo(compressedImageInfo, blob);
      URL.revokeObjectURL(blob);
    },
  });
}

function handleResize(e) {
  const rect = originalImage.getBoundingClientRect();
  const x = rect.right - e.pageX;
  const width = (100 * x) / rect.width;
  if (width >= 25 && width <= 100) {
    compressedImage.style.width = width + "%";
  }
}

function changeOriginalImage() {
  if (!originalImage.classList.contains("show"))
    originalImage.classList.add("show");
  originalImage.style.backgroundImage = `url("${URL.createObjectURL(file)}")`;
  compressImage();
  setInfo(originalImageInfo, file);
}

function setInfo(elem, file) {
  let image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = () => {
    const html = `
      <p>Name: ${file.name}</p>
      <p>Width: ${image.width}</p>
      <p>Height: ${image.height}</p>
      <p>File Size: ${(file.size / 1024).toFixed(3)} KB</p>

    `;
    elem.innerHTML = html;
  };
}

// This function runs on page load to set default image
(function () {
  const image = document.querySelector(".dummy-image");
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0, image.width, image.height);
  document.body.appendChild(canvas);
  canvas.toBlob(
    (blob) => {
      blob.name = "Lanzarote, Spain";
      file = blob;
      changeOriginalImage();
      URL.revokeObjectURL(blob);
    },
    "image/png",
    1
  );
})();
