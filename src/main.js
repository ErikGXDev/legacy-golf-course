import "./style.css";
import kaboom from "kaplay";
import { addGolfBall } from "./player";
import { loadAssets } from "./assets";
import { playLevel, addTile } from "./level";

kaboom({
  background: [174, 226, 255],
});

volume(0.5);

loadAssets();

scene("level", (level) => {
  console.log(level);
  onKeyPress("r", () => {
    go("level", level);
  });
  playLevel(level);
});

scene("complete", () => {
  add([
    text("Thank you for completing", {
      size: 24,
      align: "center",
      letterSpacing: -2,
    }),
    pos(width() / 2, height() / 2 - 220),
    anchor("center"),
    color(107, 201, 108),
  ]);
  add([
    sprite("splash"),
    pos(width() / 2, height() / 2 - 90),
    anchor("center"),
    scale(1.5),
  ]);
  add([
    text("You needed " + totalStrokes + " total strokes!", {
      size: 28,
      align: "center",
      letterSpacing: -2,
    }),
    pos(width() / 2, height() / 2 + 50),
    color(252, 239, 141),
    anchor("center"),
    z(10010),
    "topui",
  ]);
  add([
    text("Like the repl and\nfollow ErikoXDev for\nmore games and apps!", {
      size: 24,
      align: "center",
      letterSpacing: -2,
    }),
    pos(width() / 2, height() / 2 + 150),
    anchor("center"),
    color(107, 201, 108),
  ]);
});

scene("newTab", () => {
  //unused
  add([
    text(
      "Hey! Click here to play\nthis game in a new tab.\nYou'll have a\nbetter experience!",
      { size: 32, align: "center", letterSpacing: -5 }
    ),
    pos(width() / 2, height() / 2),
    anchor("center"),
    color(107, 201, 108),
  ]);
  onClick(() => {
    window.open("https://GolfCourse.ErikoXDev.repl.co", "_blank");
  });
});

scene("mainMenu", () => {
  if (window.self !== window.top) {
    let newt = add([
      text(
        "Click here to open\nthe game in a new tab for\na better experience",
        { align: "center", letterSpacing: -2, size: 24 }
      ),
      pos(width() / 2, height() - 100),
      color(107, 201, 108),
      anchor("center"),
      area(),
      "newtab",
    ]);
    onClick("newtab", (a) => {
      window.open("https://GolfCourse.ErikoXDev.repl.co", "_blank");
    });
  } else {
    add([sprite("level1"), anchor("left"), pos(100, height() / 2)]);
    add([sprite("level2"), anchor("right"), pos(width() + 100, height() / 2)]);
    add([
      text("Press the yellow\nbutton to play!", {
        align: "center",
        letterSpacing: -2,
        size: 32,
      }),
      pos(width() / 2, height() / 2 + 150),
      color(252, 239, 141),
      anchor("center"),
    ]);
  }

  add([sprite("splash"), pos(width() / 2, 110), anchor("center"), scale(1.5)]);
  let b = add([
    sprite("playb"),
    pos(width() / 2, height() / 2),
    anchor("center"),
    scale(2.2),
    color(255, 255, 255),
    area(),
    "btn",
  ]);
  b.onClick(() => {
    play("goal");
    setCursor("default");
    go("level", 0);
  });
  onHover("btn", (n) => {
    play("hover");
    n.color = Color.fromArray([230, 230, 230]);
    setCursor("pointer");
  });
  onHoverEnd("btn", (n) => {
    setCursor("default");
    n.color = Color.fromArray([255, 255, 255]);
  });
});

go("mainMenu");
