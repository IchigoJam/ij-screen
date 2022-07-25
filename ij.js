import { IJScreen } from "./ij-screen.js";

const ijs = new IJScreen();
document.body.appendChild(ijs);

const cls = () => ijs?.cls();
const lc = (x, y) => ijs?.lc(x, y);
const print = (s) => ijs?.print(s);
const wait = async (n) => await ijs?.wait(n);
const btn = (n) => ijs?.btn(n);
const scr = (x, y) => ijs?.scr(x, y);
const rnd = (n) => ijs?.rnd(n);
const ana = (n) => ijs?.ana(n);

const ij = { cls, lc, print, wait, btn, scr, rnd, ana };

let t = setInterval(() => {
  if (window.run) {
    window.run();
    clearInterval(t);
  }
}, 100);

export {
  cls, lc, print, wait, btn, scr, rnd, ana,
  ij
};
