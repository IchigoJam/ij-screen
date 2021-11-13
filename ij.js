import { IJScreen } from "./ij-screen.js";

let ijs;

onload = () => {
  ijs = new IJScreen();
  document.body.appendChild(ijs);
  let t = setInterval(() => {
    if (window.run) {
      window.run();
      clearInterval(t);
    }
  }, 100);
};

const cls = () => ijs?.cls();
const lc = (x, y) => ijs?.lc(x, y);
const print = (s) => ijs?.print(s);
const wait = async (n) => await ijs?.wait(n);
const btn = (n) => ijs?.btn(n);
const scr = (x, y) => ijs?.scr(x, y);
const rnd = (n) => ijs?.rnd(n);

const ij = { cls, lc, print, wait, btn, scr, rnd };

export {
  cls, lc, print, wait, btn, scr, rnd,
  ij
};
