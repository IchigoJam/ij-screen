import { IJScreen } from "./ij-screen.js";

let ij;

onload = () => {
  ij = new IJScreen();
  document.body.appendChild(ij);
  let t = setInterval(() => {
    if (window.run) {
      window.run();
      clearInterval(t);
    }
  }, 100);
};

const cls = () => ij?.cls();
const lc = (x, y) => ij?.lc(x, y);
const print = (s) => ij?.print(s);
const wait = async (n) => await ij?.wait(n);
const btn = (n) => ij?.btn(n);
const scr = (x, y) => ij?.scr(x, y);
const rnd = (n) => ij?.rnd(n);

export {
  cls, lc, print, wait, btn, scr, rnd,
};
