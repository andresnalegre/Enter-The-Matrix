class MatrixRain {
    constructor(canvasId, fontSize = 16, speed = 50, density = 0.975) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext("2d");
      this.fontSize = fontSize;
      this.speed = speed;
      this.density = density;
      this.characters = this.generateCharacters();
      this.characterWidth = 0;
      this.columns = [];
      this.initCanvas();
      this.startAnimation();
    }

    generateCharacters() {
      const range = (start, end, step = 1) => Array.from({ length: Math.floor((end - start) / step) + 1 }, (_, i) => start + i * step);
      const charRange = (start, end) => range(start.charCodeAt(0), end.charCodeAt(0)).map((code) => String.fromCharCode(code));

      return [].concat(
        "!?@#$%^&*()<>{}[]ίϊΐόάέύϋΰήώ".split(""),
        "0-9A-Za-zぁ-んァ-ンА-Яа-яΑ-Ωα-ω".match(/.{1,3}/g).map(seq => [seq.charAt(0), seq.charAt(2)]).reduce((acc, seq) => acc.concat(charRange(...seq)))
      );
    }

    initCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.ctx.font = `bold ${this.fontSize}px 'Courier New'`;
      this.characterWidth = Math.floor(
        this.characters.reduce((acc, ch) => acc + this.ctx.measureText(ch).width, 0) / this.characters.length
      );
      this.columns = Array(Math.floor(this.canvas.width / this.characterWidth)).fill(1);
      window.addEventListener("resize", () => this.resizeCanvas());
    }

    resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.columns = Array(Math.floor(this.canvas.width / this.characterWidth)).fill(1);
    }

    drawRain() {
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = "#0F0";

      this.columns.forEach((yPos, colIdx) => {
        const char = this.characters[Math.floor(Math.random() * this.characters.length)];
        const xPos = colIdx * this.characterWidth;
        this.ctx.fillText(char, xPos, yPos * this.fontSize);

        if (yPos * this.fontSize > this.canvas.height && Math.random() > this.density) {
          this.columns[colIdx] = 0;
        }
        this.columns[colIdx]++;
      });
    }

    startAnimation() {
      this.intervalId = setInterval(() => this.drawRain(), this.speed);
    }

    typeText(text) {
      const overlayCanvas = document.createElement("canvas");
      overlayCanvas.width = this.canvas.width;
      overlayCanvas.height = this.canvas.height;
      const overlayCtx = overlayCanvas.getContext("2d");

      overlayCtx.font = "bold 48px 'Courier New'";
      overlayCtx.fillStyle = "rgba(255, 255, 255, 1)";
      overlayCtx.textAlign = "center";
      overlayCtx.textBaseline = "middle";
      overlayCanvas.style.position = "absolute";
      overlayCanvas.style.top = "0";
      overlayCanvas.style.left = "0";
      document.body.appendChild(overlayCanvas);

      let currentText = "";
      let index = 0;

      const typeLetter = () => {
        if (index < text.length) {
          currentText += text[index];
          overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
          overlayCtx.fillText(currentText, overlayCanvas.width / 2, overlayCanvas.height / 2);
          index++;

          const randomDelay = Math.floor(Math.random() * 150) + 100;
          setTimeout(typeLetter, randomDelay);
        }
      };

      typeLetter();
    }
}
