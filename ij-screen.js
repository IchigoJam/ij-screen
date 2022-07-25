import { create } from "https://js.sabae.cc/stdcomp.js";
import { rnd } from "https://js.sabae.cc/rnd.js";
import { css } from "https://js.sabae.cc/css.js";

//const screen = new Array(32 * 24);

const sw = 32;
const sh = 24;

class IJScreen extends HTMLElement {
  constructor() {
    super();
    css("./ichigojam-font.css");
    this.style.display = "inline-grid";
    this.style.gridTemplateColumns = `repeat(${sw}, 1fr)`;
    this.style.backgroundColor = "black";
    this.style.color = "white";
    this.style.fontFamily = "ichigojam";
    this.style.fontSize = "calc(100vw/40)";
    //this.style.border = "1px solid white";

    for (let i = 0; i < sh; i++) {
      for (let j = 0; j < sw; j++) {
        const div = create("div", this);
        div.style.width = "1em";
        div.style.height = "1em";
      }
    }
    this.cursorx = 0;
    this.cursory = 0;

    this.keyright = false;
    this.keyleft = false;
    document.body.onkeydown = (e) => {
      if (e.key == "ArrowRight") {
        this.keyright = true;
      } else if (e.key == "ArrowLeft") {
        this.keyleft = true;
      }
    };
    document.body.onkeyup = (e) => {
      if (e.key == "ArrowRight") {
        this.keyright = false;
      } else if (e.key == "ArrowLeft") {
        this.keyleft = false;
      }
    };
    this.ana0 = 0;
    this.ana2 = 0;
    const fit = (n) => {
      if (n < 0) {
        n = 0;
      } else if (n > 1) {
        n = 1;
      }
      return (n * 1023) >> 0;
    };
    this.onmousemove = (e) => {
      this.ana0 = fit((e.clientX - this.offsetLeft) / this.clientWidth);
      this.ana2 = fit((e.clientY - this.offsetTop) / this.clientHeight);
    };
    this.cls();
  }
  lc(x, y) {
    this.cursorx = x;
    this.cursory = y;
  }
  putc(c) {
    if (c == "\n") {
      this.cursorx = 0;
      if (this.cursory == sh - 1) {
        this.scrollUp();
      } else {
        this.cursory++;
      }
      return;
    }
    const limit = (n, min, max) => {
      if (n < min) {
        return min;
      } else if (n > max) {
        return max;
      }
      return n >> 0;
    };
    const x = limit(this.cursorx, 0, sw - 1);
    const y = limit(this.cursory, 0, sh - 1);
    const n = x + y * sw;
    const div = this.querySelectorAll("div")[n];
    div.textContent = c;
    if (x == sw - 1) {
      this.cursorx = 0;
      if (y == sh - 1) {
        this.scrollUp();
      } else {
        this.cursory++;
      }
    } else {
      this.cursorx++;
    }
  }
  rnd(n) {
    return rnd(n);
  }
  print(s) {
    for (const c of s) {
      this.putc(c);
    }
    this.putc("\n");
  }
  cls() {
    this.querySelectorAll("div").forEach(d => d.textContent = "");
  }
  scr(x, y) {
    if (x < 0 || x >= sw || y < 0 || y >= sh) {
      return 0;
    }
    const n = (x >> 0) + (y >> 0) * sw;
    if (n < 0 || n >= sw * sh) {
      return 0;
    }
    const div = this.querySelectorAll("div")[n];
    const c = div.textContent;
    if (c == null || c == "" || c == "　") {
      return 0;
    }
    return c.charCodeAt(0);
  }
  _putc(x, y, c) {
    const n = x + y * sw;
    const div = this.querySelectorAll("div")[n];
    div.textContent = c == 0 ? "" : String.fromCharCode(c);
  }
  scrollUp() {
    for (let i = 0; i < sh - 1; i++) {
      for (let j = 0; j < sw; j++) {
        this._putc(j, i, this.scr(j, i + 1));
      }
    }
    for (let j = 0; j < sw; j++) {
      this._putc(j, 23, 0);
    }
  }
  async wait(n) {
    return new Promise(resolve => setTimeout(resolve, 1000 / 60 * n));
  }
  btn(code) {
    if (code == 28) {
      return this.keyleft;
    } else if (code == 29) {
      return this.keyright;
    }
  }
  ana(n = 0) {
    if (n == 0) {
      return this.ana0;
    } else if (n == 2) {
      return this.ana2;
    }
    return 0;
  }
};

customElements.define("ij-screen", IJScreen);

//const ij = new IJScreen();
//document.body.appendChild(ij);

export { IJScreen };
