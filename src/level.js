import { addGolfBall, forceCamVel } from "./player";
import levels from "./levels.json";

const blocks = ["g", "h", "w", "s", "B", "R", "b", "r"];
const solids = ["w", "B", "R"];
const bushSpawner = ["w", "a"];
const button = ["b", "r"];
const colorWalls = ["B", "R"];

/*
===== BLOCKS =====
g = grass/ground
w = wall
h = hole
s = spawn
B = blue wall
R = red wall
b = blue button
r = red button
a = air (bush)
=================
*/

window.globalIndex = 0;

var highQual = true;

function randomInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomSmallOffset() {
  return randomInterval(0, 16);
}

function makeLevel(index, whenHole) {
  globalIndex = index;
  let levelInfo = levels[index];
  console.log("Making Level", levelInfo);

  var spawn = vec2(0, 0);

  let level = levelInfo[0];
  let hint = levelInfo[1] || "";
  let hintObject = add([
    text(hint, { align: "center", letterSpacing: -2, size: 24 }),
    pos(0, 0),
    z(1000),
    anchor("top"),
    "gbtn",
    area(),
    {
      nobutton: true,
      _click: () => {},
      _update: () => {
        hintObject.pos = camP.add(vec2(0, -height() / 2 + 25));
      },
    },
  ]);
  let camerab = add([
    sprite("camerab"),
    pos(0, 0),
    z(1000),
    scale(2.5),
    color(255, 255),
    anchor("center"),
    area(),
    "gbtn",
    {
      _click: () => {
        forceCamVel(get("player")[0].pos);
      },
      _update: () => {
        camerab.pos = camP.add(vec2(-width() / 2 + 100, height() / 2 - 62));

        if (camerab.isHovering()) {
          camerab.color = Color.fromArray([230, 230, 230]);
          setCursor("pointer");
        } else {
          camerab.color = Color.fromArray([255, 255, 255]);
          setCursor("default");
        }
      },
    },
  ]);
  let quality = add([
    sprite("quality"),
    pos(0, 0),
    z(1000),
    scale(2.5),
    color(255, 255),
    anchor("center"),
    area(),
    "gbtn",
    {
      _click: () => {
        highQual = !highQual;
        quality.play(highQual.toString());
      },
      _update: () => {
        quality.pos = camP.add(vec2(width() / 2 - 100, height() / 2 - 62));

        if (quality.isHovering()) {
          quality.color = Color.fromArray([230, 230, 230]);
          setCursor("pointer");
        } else {
          quality.color = Color.fromArray([255, 255, 255]);
          setCursor("default");
        }
      },
    },
  ]);
  let resetb = add([
    sprite("resetb"),
    pos(0, 0),
    z(1000),
    scale(2.5),
    color(255, 255),
    anchor("center"),
    area(),
    "gbtn",
    {
      noclicksound: true,
      _click: () => {
        go("level", index);
      },
      _update: () => {
        resetb.pos = camP.add(vec2(-width() / 2 + 280, height() / 2 - 62));

        if (resetb.isHovering()) {
          resetb.color = Color.fromArray([230, 230, 230]);
          setCursor("pointer");
        } else {
          resetb.color = Color.fromArray([255, 255, 255]);
          setCursor("default");
        }
      },
    },
  ]);
  quality.play(highQual.toString());
  onUpdate("gbtn", (b) => {
    window.camP = camPos();
    b._update();
  });
  onClick("gbtn", (b) => {
    if (b.nobutton) {
      return;
    }
    if (!b.noclicksound) {
      play("blip");
    }

    b._click();
  });
  onHover("gbtn", (b) => {
    if (b.nobutton) {
      return;
    }
    play("hover");
  });
  for (let i = 0; i < level.length; i++) {
    for (let j = 0; j < level[i].length; j++) {
      let tile = level[i][j];
      if (bushSpawner.includes(tile) && highQual) {
        let offX = randomSmallOffset();
        let offY = randomSmallOffset();
        add([
          sprite("colorballmat"),
          z(-300),
          scale(2.4),
          pos(j * 64 + offX, i * 64 + offY),
          anchor("center"),
          color(31, 16, 42),
        ]);
        add([
          sprite("colorballmat"),
          color(255, 255, 255),
          scale(2.25),
          z(-100),
          pos(j * 64 + offX, i * 64 + offY),
          anchor("center"),
        ]);
      }
      if (tile == "a") break;
      let spawnP = addTile(tile, j * 64, i * 64);

      if (spawnP.x != 0 && spawnP.y != 0) {
        console.log(spawnP);
        spawn = spawnP;
      }
    }
  }

  addGolfBall(spawn.x, spawn.y, whenHole);

  let cWidth = level[0].length;
  let cHeight = level.length;

  forceCamVel(vec2((cWidth / 2) * 64, (cHeight / 2) * 64 - 32));

  add([
    pos(-32, -32),
    area(),
    z(-10000),
    rect(cWidth * 64, cHeight * 64),
    opacity(0),
    "bound",
  ]);
}

function addTile(tileName, x, y) {
  let isSpecial = false;

  let tag = ".";
  let data = {};

  if (colorWalls.includes(tileName)) {
    tag = tileName + "wall";
    data = { colorcode: tileName };
  }

  if (button.includes(tileName)) {
    tag = "cbutton";
    data = { colorcode: tileName.toUpperCase(), pressed: false };
  }

  if (!blocks.includes(tileName)) {
    return vec2(0, 0);
  }

  if (tileName == "s") {
    isSpecial = true;
    tileName = "g";
  }

  let tile = add([
    sprite(tileName),
    pos(x, y),
    anchor("center"),
    scale(1.01),
    z(0),

    tag,
    data,
  ]);

  if (button.includes(tileName)) {
    tile.use(area());
  }

  if (solids.includes(tileName)) {
    tile.use(z(50));
    tile.use(area());
    tile.use(body({ isStatic: true }));
    tile.use("wall");
  }

  if (tileName == "h") {
    tile.use(area({ scale: vec2(0.01, 0.01) }));
    tile.use("hole");
  }

  if (tileName == "w") {
    add([
      rect(66, 64),
      z(25),
      anchor("center"),
      pos(x, y),
      color(0, 0, 0),
      opacity(0.5),
    ]);
    add([
      rect(64, 66),
      z(25),
      anchor("center"),
      pos(x, y),
      color(0, 0, 0),
      opacity(0.5),
    ]);
  }

  if (isSpecial) {
    return vec2(x, y);
  } else {
    return vec2(0, 0);
  }
}

function playLevel(index) {
  if (levels[index] == undefined) {
    go("complete");
  } else {
    makeLevel(index, () => {
      go("level", index + 1);
    });
  }
}

export { playLevel, addTile };
