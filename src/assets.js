function loadAssets() {
  loadSound("blip", "sounds/blip.wav");
  loadSound("goal", "sounds/goal.wav");
  loadSound("hover", "sounds/hover.wav");
  loadSound("melody", "sounds/melody.wav");

  loadSprite("ball", "sprites/ball.png");
  loadSprite("splash", "sprites/splash.png");
  loadSprite("boom", "sprites/boom.png");
  loadSprite("level1", "sprites/level1.png");
  loadSprite("level2", "sprites/level2.png");
  loadSprite("colorballmat", "sprites/colorballmat.png");

  loadBitmapFont("happy", "/sprites/happy_32x40.png", 32, 40);

  loadSpriteAtlas("sprites/uisheet.png", {
    playb: {
      x: 0,
      y: 0,
      width: 64,
      height: 32,
    },
    camerab: {
      x: 0,
      y: 32,
      width: 64,
      height: 32,
    },
    resetb: {
      x: 0,
      y: 64,
      width: 64,
      height: 32,
    },
    quality: {
      x: 64,
      y: 0,
      width: 64,
      height: 64,
      sliceY: 2,
      anims: {
        false: {
          from: 0,
          to: 0,
        },
        true: {
          from: 1,
          to: 1,
        },
      },
    },
  });

  loadSpriteAtlas("sprites/arrows.png", {
    arrows: {
      x: 0,
      y: 0,
      width: 72,
      height: 66,
      sliceX: 3,
      anims: {
        1: {
          from: 0,
          to: 0,
        },
        2: {
          from: 1,
          to: 1,
        },
        3: {
          from: 2,
          to: 2,
        },
      },
    },
  });

  loadSpriteAtlas("sprites/tilesheet.png", {
    g: {
      x: 0,
      y: 0,
      width: 64,
      height: 64,
    },
    h: {
      x: 0,
      y: 64,
      width: 64,
      height: 64,
    },
    w: {
      x: 0,
      y: 128,
      width: 64,
      height: 64,
    },
    b: {
      x: 64,
      y: 0,
      width: 64,
      height: 128,
      sliceY: 2,
      anims: {
        press: {
          from: 0,
          to: 1,
        },
      },
    },
    r: {
      x: 128,
      y: 0,
      width: 64,
      height: 128,
      sliceY: 2,
      anims: {
        press: {
          from: 0,
          to: 1,
        },
      },
    },
    B: {
      x: 64,
      y: 128,
      width: 64,
      height: 64,
    },
    R: {
      x: 128,
      y: 128,
      width: 64,
      height: 64,
    },
  });

  console.log("LOADED ASSETS");
}

export { loadAssets };
