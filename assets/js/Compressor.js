// Compressor USER STORIES
// function should be able to take FILE and OPTIONS as arguments
// OPTIONS can include
// width
// height
// minWidth
// minHeight
// maxWidth
// maxHeight
// quality 0-1
// output file type
// callback functuion called "success"
// err callback

class Compressor {
  constructor(file, options = {}) {
    this.file = file;
    this.options = options;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.compress();
  }

  compress() {
    let {
      width,
      height,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      success,
      outputType,
      quality,
      err,
    } = this.options;
    const URL = window.URL || window.webkitURL;
    const image = new Image();
    const src = URL.createObjectURL(this.file);
    image.src = src;

    image.onload = async () => {
      const imageWidth = image.width;
      const imageHeight = image.height;

      let canvasHeight = height || imageHeight;
      let canvasWidth = width || imageWidth;

      if (maxHeight && imageHeight > maxHeight) canvasHeight = maxHeight;
      if (minHeight && imageHeight < minHeight) canvasHeight = minHeight;

      if (maxWidth && imageWidth > maxWidth) canvasWidth = maxWidth;
      if (minWidth && imageWidth < minWidth) canvasWidth = minWidth;
      this.canvas.height = canvasHeight;
      this.canvas.width = canvasWidth;
      this.ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
      this.canvas.toBlob(
        (blob) => {
          Boolean(blob) && (blob.name = this.file.name);
          if (typeof success === "function" && blob) {
            success(blob);
          } else if (typeof err === "function") {
            err(null);
          }
        },
        outputType,
        quality
      );
    };
  }
}
