import { create } from "https://js.sabae.cc/stdcomp.js";
import { rnd } from "https://js.sabae.cc/rnd.js";

//const screen = new Array(32 * 24);

const sw = 32;
const sh = 24;

class IJScreen extends HTMLElement {
  constructor() {
    super();
    this.style.display = "grid";
    this.style.gridTemplateColumns = `repeat(${sw}, 1fr)`;
    this.style.backgroundColor = "black";
    this.style.color = "white";
    this.style.fontSize = "calc(100vw/64)";
    //this.style.border = "1px solid white";

    for (let i = 0; i < sh; i++) {
      for (let j = 0; j < sw; j++) {
        const div = create("div", this);
        div.style.width = "1em";
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
    const n = this.cursorx + this.cursory * sw;
    const div = this.querySelectorAll("div")[n];
    div.textContent = c;
    if (this.cursorx == sw - 1) {
      this.cursorx = 0;
      if (this.cursory == sh - 1) {
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
    const n = x + y * sw;
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
    div.textContent = String.fromCharCode(c);
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
};

customElements.define("ij-screen", IJScreen);

//const ij = new IJScreen();
//document.body.appendChild(ij);

export { IJScreen };
