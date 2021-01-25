class LabelIconBuilder {
  constructor() {
    this._canvas = document.createElement('canvas');
    this._images = [];
    this._img = null;
  }

  getIcon(image, size) {
    const ctx = this._canvas.getContext("2d");
    ctx.clearRect(0, 0, size, size);
    return new Promise((res, rej) => {
      let key = '';
      this._canvas.width = size;
      this._canvas.height = size;
      
      if (image instanceof Object) {
        key = image.url;
      } else {
        key = image
      }
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (this._images[key]) {
        this._img = this._images[key];
        ctx.drawImage(this._img, 0, 0, size, size);
        const baseUrl = this._canvas.toDataURL("image/png");
        res(baseUrl);
      } else {
        const img = new Image();
        img.style.width = size;
        img.style.height = size;
        img.onload = (function() {
          this._img = img;
          this._images[key] = img;
          ctx.drawImage(this._img, 0, 0, size, size);
          const baseUrl = this._canvas.toDataURL("image/png");
          res(baseUrl);
        }).bind(this);
        img.src = key;
      }
    })
  }

  fromText(text, icon, size) {
    console.log('执行')
    const img = new Image();
    img.src = icon;
    const ctx = this._canvas.getContext("2d");
    ctx.clearRect(0, 0, size, size);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font="20px Georgia";
    ctx.fillStyle="#FFF";
    ctx.drawImage(img, 0, 0, size, size);
    ctx.fillText(text, size/2, size/2);
    return this._canvas.toDataURL("image/png");
  }
}

export default LabelIconBuilder;
