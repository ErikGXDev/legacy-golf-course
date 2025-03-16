import { addTile } from "./level.js";

window.camVel = 0;
window.camZoom = 1;
window.totalStrokes = 0;

function addGolfBall(x, y, whenHole) {
  var strokes = 0;
  camPos(vec2(0, 0));

  var golfBall = add([
    sprite("ball"),
    pos(x, y),
    area(),
    body(),
    z(100),
    scale(1),
    opacity(1),
    anchor("center"),
    "player",
  ]);

  var arrows = add([
    sprite("arrows"),
    pos(x, y),
    opacity(0),
    z(100),
    follow(golfBall),
    anchor("bot"),
  ]);

  var golfBallDrag = false;

  onMouseDown(() => {
    if (golfBall.isHovering() && getMagnitute(ballVel) < 0.5) {
      setCursor("pointer");
      golfBallDrag = true;
      arrows.opacity = 1;
    }
  });

  camVel = vec2(0, 0);
  const speed = 250;
  var lStrength = 1;
  wait(1, () => {
    lStrength = 0.25;
  });

  var isWin = false;

  onUpdate(() => {
    if (golfBallDrag == true) {
      arrows.angle = trueMousePos().angle(arrows.pos) - 90;
      let dist = trueMousePos().dist(golfBall.pos);
      if (dist > 100) {
        arrows.play("3");
      } else if (dist > 50) {
        arrows.play("2");
      } else {
        arrows.play("1");
      }
    }

    camPos(
      vec2(
        lerp(camPos().x, camVel.x, lStrength),
        lerp(camPos().y, camVel.y, lStrength)
      )
    );

    if (!golfBall.isColliding(get("bound")[0])) {
      golfBall.pos = oldBallPos;
    } else if (getMagnitute(ballVel) < 0.5) {
      ballVel = vec2(0, 0);
      oldBallPos = golfBall.pos;
    }

    if (isWin) return;

    if (isKeyDown("w")) {
      camVel = camVel.add(vec2(0, -speed * dt()));
    }
    if (isKeyDown("s")) {
      camVel = camVel.add(vec2(0, speed * dt()));
    }
    if (isKeyDown("a")) {
      camVel = camVel.add(vec2(-speed * dt(), 0));
    }
    if (isKeyDown("d")) {
      camVel = camVel.add(vec2(speed * dt(), 0));
    }
  });

  var oldBallPos = golfBall.pos;
  var ballVel = vec2(0, 0);
  var mag = 100;
  var threshhold = 28;
  onMouseRelease(() => {
    setCursor("default");
    if (golfBallDrag == true && !isWin) {
      play("blip");
      strokes++;
      totalStrokes++;
      ballVel = golfBall.pos.sub(trueMousePos()).scale(0.25);
      let vx = ballVel.x;
      let vy = ballVel.y;
      let n = getMagnitute(ballVel);
      let f = Math.min(n, threshhold) / n;
      ballVel = vec2(f * vx, f * vy);

      let n_ = getMagnitute(ballVel);
      console.log(ballVel, n, n_);
      ballPhysics();
    }
    golfBallDrag = false;
    arrows.opacity = 0;
  });

  golfBall.onCollide("wall", (wall, col) => {
    console.log("Colloded");

    if (col.isBottom() || col.isTop()) {
      ballVel = vec2(ballVel.x, -ballVel.y);
    } else if (col.isLeft() || col.isRight()) {
      ballVel = vec2(-ballVel.x, ballVel.y);
    }
  });

  golfBall.onCollide("cbutton", (button, col) => {
    if (button.pressed == true) return;
    button.play("press");
    play("hover");
    button.pressed = true;
    get(button.colorcode + "wall").map((wall) => {
      addTile("g", wall.pos.x, wall.pos.y);
      wait(0.1, () => {
        wall.destroy();
      });
    });
  });

  golfBall.onCollide("hole", (hole, col) => {
    isWin = true;
    golfBall.pos = hole.pos;
    golfBall.fadeOut(0.7);
    makeBallSmol(hole);
    lStrength = 0.01;
    forceCamVel(hole.pos);
    let boom = add([
      sprite("boom"),
      pos(camPos()),
      anchor("center"),
      z(10000),
      "topui",
      scale(1.8),
    ]);
    play("goal");
    let strokeStr = "Level " + (globalIndex + 1) + "\n" + strokes + " stroke";
    if (strokes != 1) {
      strokeStr += "s";
    }
    let strokeText = add([
      text(strokeStr, { align: "center", letterSpacing: -2, size: 48 }),
      pos(camPos()),
      color(252, 239, 141),
      anchor("center"),
      z(10010),
      "topui",
    ]);
    onUpdate("topui", (b) => {
      b.pos = camPos();
    });
    wait(3.5, () => {
      whenHole();
    });
  });

  function ballPhysics() {
    mag = getMagnitute(ballVel);
    if (mag > 0.05) {
      ballVel = ballVel.scale(0.95);
      golfBall.moveBy(ballVel);
      wait(0.023, () => {
        if (!isWin) ballPhysics();
      });
    } else {
      mag = 0;
      return;
    }
  }

  function makeBallSmol(hole) {
    let ballScale = golfBall.scale;
    if (!(ballScale.x < 0.25 && ballScale.y < 0.25)) {
      wait(0.05, () => {
        golfBall.scale = vec2(ballScale.x * 0.95, ballScale.y * 0.95);
        makeBallSmol(hole);
      });
    }
  }
}

function forceCamVel(_camVel) {
  camVel = _camVel;
}

function trueMousePos() {
  return toWorld(mousePos());
}

function getMagnitute(vel) {
  return Math.sqrt(vel.x * vel.x + vel.y * vel.y);
}

export { addGolfBall, trueMousePos, forceCamVel };
