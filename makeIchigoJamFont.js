import { Font, Glyph, Path } from "https://code4fukui.github.io/opentype-es/opentype.js";

// These are the global measurements of the typeface.
const UNITS_PER_EM = 1000;
const ASCENDER = 900;
const DESCENDER = -100;
const SCALE = 80;

// We map between the character and the internal name.
const TTF_NAME_MAP = { _: 'underscore', '.': 'period' };

// The notdefGlyph always needs to be included.
const notdefGlyph = new Glyph({
  name: '.notdef',
  advanceWidth: 650,
  path: new Path()
});

// Our glyph map can't properly encode a space character, so we make one here.
const spaceGlyph = new Glyph({
  name: 'space',
  unicode: 32,
  advanceWidth: 10 * SCALE,
  path: new Path()
});

const glyphs = [notdefGlyph, spaceGlyph];

// Loop through the glyph map and encode all glyphs.
//const glyphNames = Object.keys(GLYPH_MAP);

//const fontdata = JSON.parse(await Deno.readTextFile("ichigojam-font.json"));
const url = "https://code4fukui.github.io/font-maker/ichigojam-font.json";
const fontdata = await (await fetch(url)).json();

for (let i = 0; i < fontdata.length; i++) {
  const glyphName = String.fromCharCode(i); // glyphNames[i]; // "a";
  // Do a conversion from the character name to the correct TrueType name.
  const ttfName = TTF_NAME_MAP[glyphName] || glyphName;

  // Create a path by looping over all the points and multiplying by the SCALE.
  const path = new Path();
  //const points = GLYPH_MAP[glyphName];
  // Remember the width of the character, to set the advanceWidth.
  const w = 8;
  const f = fontdata[i];
  const o = 0;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (parseInt(f.substring(y * 2, y * 2 + 2), 16) & (1 << (7 - x))) {
        const y2 = 7 - y;
        path.moveTo(x * SCALE + o, y2 * SCALE + o);
        path.lineTo((x + 1) * SCALE - o, y2 * SCALE + o);
        path.lineTo((x + 1) * SCALE - o, (y2 + 1) * SCALE - o);
        path.lineTo(x * SCALE + o, (y2 + 1) * SCALE - o);
      }
    }
  }

  // Create the glyph. The advanceWidth is the widest part of the letter + 1.
  const glyph = new Glyph({
    name: ttfName,
    unicode: glyphName.charCodeAt(0),
    //advanceWidth: (w + 1) * SCALE,
    advanceWidth: w * SCALE,
    leftSideBearing: 0,
    xMin: 0,
    xMax: w * SCALE,
    yMin: -w * SCALE,
    yMax: (w - 1) * SCALE,
    path: path
  });
  glyphs.push(glyph);
}
console.log(glyphs);

// Create the font using measurements + glyphs defined above.
const font = new Font({
  familyName: 'IchigoJam FONT',
  styleName: 'Regular',
  unitsPerEm: UNITS_PER_EM,
  ascender: ASCENDER,
  descender: DESCENDER,
  glyphs: glyphs,
});

//font.download();
const bin = font.toArrayBuffer();
await Deno.writeFile("IchigoJam-FONT.otf", bin);

