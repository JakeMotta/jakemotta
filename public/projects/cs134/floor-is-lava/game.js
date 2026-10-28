/*
 * The Floor is Lava, Jake's CS 134 final (SJSU, November 2017), ported to the browser in 2026.
 *
 * The original is Java on JOGL (OpenGL), which can't run in a page, and its source is lost. This is a line-for-line
 * translation of its compiled classes (TheFloorIsLava.jar, read back from the bytecode), drawn on a canvas with the
 * game's own sprites, converted from its .tga files. The names below follow the Java ones (Main, Hero, Block, Item,
 * Lava, Background, Camera) so the two can be compared, and the original's quirks are kept on purpose: blocks that
 * hang in the air, the score that only ever goes up, the depth numbers missing their minus signs.
 * The game's music and pop sound are left out. See docs/projects/floor-is-lava.md.
 */
(function () {
    'use strict';

    var WIDTH = 640, HEIGHT = 960;
    var TICK = 1000 / 60; // one game step per frame, as in the original's loop with vsync

    var canvas, ctx;
    var img = {};

    /* ---------- Main's statics ---------- */

    var spriteSize = [64, 64]; // shared, and overwritten by drawText as in the original
    var camera, hero, background, lava, images;
    var worldWidth, worldHeight;
    var gameTimer = 0, gameSpeed = 100, blockVSP = 4, lavaVSP = 4, playerScore = 0, playerScoreLast = 0, level = 1;
    var isGameOver = true;
    var blockArray = [], itemArray = [];
    var pressedRight = 0, pressedLeft = 0, pressedUp = 0, pressedSpace = 0;
    // main()'s locals
    var frame = 0, spawnX = 0, spawnRoll = 0, alertUntil = 0, lavaFrame = 0, spawnEvery = 100;

    var keys = {};

    function idiv(a, b) { return (a / b) | 0; }
    function getRandom(n) { return (Math.random() * n) | 0; }

    function drawSprite(image, x, y, w, h) {
        if (image) ctx.drawImage(image, x - camera.x, y - camera.y, w, h);
    }

    function collide(a, b) {
        if (a.x > b.x + b.width) return false;
        if (a.x + a.width < b.x) return false;
        if (a.y > b.y + b.height) return false;
        if (a.y + a.height < b.y) return false;
        return true;
    }

    var GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?:!';
    var GLYPH_FILES = { '?': 'question', ':': 'colon', '!': 'exclamation' };

    function drawText(text, x, y, size, big) {
        if (!big) {
            size[0] = 12;
            size[1] = 17;
        }
        for (var i = 0; i < text.length; i++) {
            var c = text.charAt(i);
            if (GLYPHS.indexOf(c) < 0) continue; // spaces and minus signs leave a gap
            drawSprite(img['Font/' + (GLYPH_FILES[c] || c)], x + size[0] * i, y, size[0], size[1]);
        }
    }

    /* ---------- Images ---------- */

    function Images() {
        this.image = null; // shared by every lookup: an hp the switch doesn't know returns whatever was last
    }
    Images.prototype.getLavaImage = function () {
        return (this.image = img['Lava/lava']);
    };
    Images.prototype.getLavaTopImage = function (n) {
        return (this.image = img['Lava/lava-top' + (n + 1)]);
    };
    var BLOCK_STEPS = { 100: '', 99: 1, 90: 2, 80: 3, 70: 4, 60: 5, 50: 6, 40: 7, 30: 8, 20: 9, 10: 10 };
    Images.prototype.getBlockImage = function (hp) {
        if (hp in BLOCK_STEPS) this.image = img[hp === 100 ? 'Blocks/block1' : 'Blocks/bd' + BLOCK_STEPS[hp]];
        return this.image;
    };
    Images.prototype.getDarkBlockImage = function (hp) {
        if (hp in BLOCK_STEPS) this.image = img[hp === 100 ? 'Blocks/block2' : 'Blocks/dbd' + BLOCK_STEPS[hp]];
        return this.image;
    };

    /* ---------- Camera ---------- */

    function Camera(w, h) {
        this.x = 0;
        this.y = worldHeight - 960;
        this.width = w;
        this.height = h;
    }
    Camera.prototype.update = function (h) {
        if (h.y <= this.y + hero.goal) this.y -= 128;
        if (h.y > this.y + hero.goal) this.y += 128;
        if (this.y > worldHeight - this.height - 1) this.y = worldHeight - this.height;
        if (this.y < 0) this.y = 0;
        if (this.x > worldWidth - this.width - 1) this.x = worldWidth - this.width;
        if (this.x < 0) this.x = 0;
    };

    /* ---------- Background: the wall, and the red alerts over where a block will drop ---------- */

    function Background() {
        this.width = 64;
        this.height = 64;
        this.worldWidth = this.width * 10;
        this.worldHeight = this.height * 156;
        this.myBackground = [];
        for (var r = 0; r < 156; r++) this.myBackground.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
    Background.prototype.reset = function () {
        for (var r = 0; r < 156; r++) for (var c = 0; c < 10; c++) this.myBackground[r][c] = 0;
    };
    Background.prototype.addAlert = function (col) {
        this.myBackground[idiv(camera.y, 64) + 1][col] = 1;
    };
    Background.prototype.removeAlert = function (col) {
        this.myBackground[idiv(camera.y, 64) + 1][col] = 0;
    };
    Background.prototype.update = function () {
        var startYTile = Math.abs(Math.floor(idiv(camera.y, this.height)));
        var end = Math.min(startYTile + 16, 156);
        for (var r = startYTile; r < end; r++) {
            for (var c = 0; c < 10; c++) {
                var image = this.myBackground[r][c] === 1 && r === startYTile + 1 ? img['Background/ohno'] : img['Background/bg1'];
                drawSprite(image, c * this.width, r * this.height, this.width, this.height);
            }
        }
    };

    /* ---------- Lava ---------- */

    function Lava(y) {
        this.width = 128;
        this.height = 128;
        this.myY = y;
        this.vsp = lavaVSP;
    }
    Lava.prototype.update = function (n) {
        this.vsp = lavaVSP;
        if (gameTimer % gameSpeed === 0) this.myY -= this.vsp;
        for (var r = 0; r < 15; r++) {
            for (var c = 0; c < 5; c++) {
                var image = r === 0 ? images.getLavaTopImage(n) : images.getLavaImage();
                drawSprite(image, c * this.width, this.myY + r * this.height, this.width, this.height);
            }
        }
    };

    /* ---------- Sprites ---------- */

    function Sprite(self, x, y, size) {
        self.x = x;
        self.y = y;
        self.width = size[0];
        self.height = size[1];
        self.image = null;
        self.isAlive = true;
    }
    function draw(self) {
        drawSprite(self.image, self.x, self.y, self.width, self.height);
    }

    // An invisible box the others use to test what's next to them
    function Dummy(x, y) {
        Sprite(this, x, y, spriteSize);
        this.width = 64;
        this.height = 64;
    }

    function Block(x, y, type, id) {
        Sprite(this, x, y, spriteSize);
        this.shouldFall = true;
        this.hp = 100;
        this.vsp = blockVSP;
        this.remove = false;
        this.onGroundTimer = 0;
        this.miningTimer = 0;
        this.width = 64;
        this.height = 64;
        this.type = type;
        this.myID = id;
        this.floorDummy = new Dummy(0, 0);
        this.currentImage = type === 0 ? images.getBlockImage(this.hp) : images.getDarkBlockImage(this.hp);
    }
    Block.prototype.update = function () {
        if (this.hp <= 0) this.isAlive = false;
        if (this.shouldFall) this.y += this.vsp;
        else this.onGroundTimer++;
        this.vsp = blockVSP;
        this.checkMined();
        if (this.type === 0) this.image = images.getBlockImage(this.hp);
        else if (this.type === 1) this.image = images.getDarkBlockImage(this.hp);
        draw(this);
    };
    Block.prototype.checkMined = function () {
        if (collide(hero.dummy, this)) {
            if (!hero.isMining || hero.inventoryFull || hero.direction !== hero.blockLocation) return;
            this.miningTimer++;
            if (this.miningTimer % 10 !== 0) return;
            if (this.hp === 100) this.hp = 99;
            else if (this.hp === 99) this.hp -= 9;
            else this.hp -= 10;
            this.miningTimer = 0;
        } else {
            this.miningTimer = 0;
            this.hp = 100;
        }
    };
    // Shared by blocks and items: stop on anything that isn't yourself; dark blocks fall again once nothing holds them
    function checkBelow(self) {
        if (self.y >= worldHeight - self.height) self.shouldFall = false;
        var fd = self.floorDummy;
        fd.width = 58;
        fd.height = 60;
        fd.x = self.x + 4;
        fd.y = self.y + 4;
        for (var i = 0; i < blockArray.length; i++) {
            if (!collide(fd, blockArray[i])) continue;
            if (blockArray[i].myID !== self.myID) {
                self.shouldFall = false;
                break;
            }
            if (self.type !== 0) self.shouldFall = true;
        }
        if (self.y >= worldHeight) self.remove = true;
    }
    Block.prototype.checkBelow = function () {
        checkBelow(this);
    };

    // What a mined block leaves behind: type 0 an apple, 1 a block, 2 a dark block
    function Item(x, y, type, id) {
        Sprite(this, x, y, spriteSize);
        this.shouldFall = true;
        this.vsp = blockVSP;
        this.remove = false;
        this.onGroundTimer = 0;
        this.isCollected = false;
        this.lifeSpan = 500;
        this.width = 64;
        this.height = 64;
        this.type = type;
        this.myID = id;
        this.floorDummy = new Dummy(0, 0);
    }
    var ITEM_IMAGES = ['Items/apple', 'Blocks/block1_icon', 'Blocks/block2_icon'];
    Item.prototype.update = function () {
        if (this.isCollected) this.isAlive = false;
        if (this.shouldFall) this.y += this.vsp;
        else this.onGroundTimer++;
        this.vsp = blockVSP;
        if (collide(hero.myDummy, this)) this.isCollected = true;
        this.lifeSpan--;
        if (this.lifeSpan <= 0) this.isAlive = false;
        if (ITEM_IMAGES[this.type]) this.image = img[ITEM_IMAGES[this.type]];
        draw(this);
    };
    Item.prototype.checkBelow = function () {
        checkBelow(this);
    };

    /* ---------- Hero: the miner ---------- */

    var heroImg = {};

    function Hero(x, y) {
        Sprite(this, x, y, spriteSize);
        this.inventory = [-1, -1, -1];
        this.fps = 6;
        this.keyDown = null;
        this.blockLocation = 'down';
        this.isMining = false;
        this.ctrlDown = false;
        this.inventoryFull = false;
        this.mineCounter = 0;
        this.jumpCounter = 0;
        this.textTimer = 0;
        this.gravityInc = 20;
        this.gravityTimer = 0;
        this.inventorySpace = 3;
        this.hp = 100;
        this.blockHitTimer = 0;
        this.goal = 480;
        this.vsp = blockVSP;
        this.direction = 'down';
        this.width = 64;
        this.height = 64;
        this.isGrounded = false;
        this.canJump = false;
        this.shouldMove = false;
        this.size = spriteSize;
        this.dummy = new Dummy(0, 0);
        this.floorDummy = new Dummy(0, 0);
        this.myDummy = new Dummy(0, 0);
        heroImg.current = heroImg.walk.down;
    }
    Hero.prototype.reset = function () {
        this.keyDown = null;
        this.blockLocation = 'down';
        this.isMining = false;
        this.ctrlDown = false;
        this.inventoryFull = false;
        this.mineCounter = 0;
        this.jumpCounter = 0;
        this.textTimer = 0;
        this.gravityInc = 20;
        this.inventorySpace = 3;
        this.hp = 100;
        this.blockHitTimer = 0;
        this.isAlive = true;
        this.vsp = blockVSP;
        this.direction = 'down';
        this.width = 64;
        this.height = 64;
        this.isGrounded = false;
        heroImg.current = heroImg.walk.down;
        this.x = 512;
        this.y = worldHeight - 256 + this.vsp;
        for (var i = 0; i < this.inventory.length; i++) this.inventory[i] = -1;
    };
    Hero.prototype.update = function () {
        if (this.hp <= 0) this.isAlive = false;
        this.vsp = blockVSP;
        this.checkMining();
        this.checkInventory();
        this.checkPlayerSpeech();
        this.checkLava();
        this.blockHit();
        if (!this.isGrounded) this.gravity();
        else {
            this.gravityInc = 20;
            this.gravityTimer = 0;
        }
        if (this.shouldMove && heroImg.walk[this.direction]) heroImg.current = heroImg.walk[this.direction];
        this.shouldMove = false;
        this.keyDown = null;
        this.isMining = false;
        this.image = heroImg.current;
        draw(this);
    };
    // Standing in a falling block hurts
    Hero.prototype.blockHit = function () {
        if (!this.checkCenter()) {
            this.blockHitTimer++;
            if (this.blockHitTimer % 50 === 0) this.hp -= 10;
        } else {
            this.blockHitTimer = 0;
        }
    };
    // Touching the lava hurts and throws him three blocks up
    Hero.prototype.checkLava = function () {
        if (this.y > lava.myY - 10) {
            heroImg.current = heroImg.death;
            this.shouldMove = false;
            this.y -= 64 * 3;
            this.hp -= 20;
        }
    };
    Hero.prototype.checkPlayerSpeech = function () {
        var text = '', offset = 0;
        if (this.inventoryFull) {
            this.size[0] = 8;
            this.size[1] = 13;
            text = 'I CANT CARRY ANYMORE!';
            offset = idiv(text.length * this.size[0], 2);
            this.textTimer++;
        }
        if (this.textTimer < 200) drawText(text, this.x - idiv(offset, 2), this.y - 32, this.size, true);
    };
    Hero.prototype.giveItem = function (type) {
        if (type === 0) {
            if (this.hp + 20 <= 100) this.hp += 20;
            return;
        }
        if (type !== 1 && type !== 2) return;
        for (var i = 0; i < this.inventory.length; i++) {
            if (this.inventory[i] === -1) {
                this.inventory[i] = type - 1;
                this.inventorySpace--;
                return;
            }
        }
    };
    Hero.prototype.checkInventory = function () {
        for (var i = 0; i < this.inventory.length; i++) {
            if (this.inventory[i] === -1) {
                this.inventoryFull = false;
                this.textTimer = 0;
                return;
            }
            this.inventoryFull = true;
        }
    };
    Hero.prototype.checkMining = function () {
        if (!this.isMining) return;
        if (this.direction === 'left') this.checkLeft();
        if (this.direction === 'right') this.checkRight();
        if (this.direction === 'up') this.checkAbove();
        if (this.direction === 'down') this.checkBelow();
    };
    Hero.prototype.gravity = function () {
        this.gravityTimer++;
        if (this.gravityTimer % this.gravityInc !== 0) return;
        this.y += 64;
        this.gravityTimer = 0;
        if (this.gravityInc > 6) this.gravityInc -= 4;
    };
    Hero.prototype.checkCollision = function () {
        var fd = this.floorDummy;
        fd.width = 60;
        fd.height = 60;
        fd.x = this.x + 2;
        fd.y = this.y + this.height - 2;
        for (var i = 0; i < blockArray.length; i++) {
            if (collide(fd, blockArray[i])) {
                this.isGrounded = true;
                this.canJump = true;
                return;
            }
            this.isGrounded = false;
            this.canJump = false;
            this.jumpCounter = 0;
        }
    };
    // True when nothing overlaps his middle
    Hero.prototype.checkCenter = function () {
        var d = this.myDummy;
        d.width = 32;
        d.height = 32;
        d.x = this.x + 16;
        d.y = this.y + 16;
        for (var i = 0; i < blockArray.length; i++) if (collide(d, blockArray[i])) return false;
        return true;
    };
    // checkLeft, checkRight, checkAbove and checkBelow: true when that side is free, and the mining box is left there
    Hero.prototype.probe = function (x, y, w, h, side) {
        var d = this.dummy;
        d.width = w;
        d.height = h;
        d.x = x;
        d.y = y;
        for (var i = 0; i < blockArray.length; i++) {
            if (collide(d, blockArray[i])) {
                this.blockLocation = side;
                return false;
            }
        }
        return true;
    };
    Hero.prototype.checkLeft = function () {
        return this.probe(this.x - this.width + 4, this.y + 2, 58, 58, 'left');
    };
    Hero.prototype.checkRight = function () {
        return this.probe(this.x + this.width + 4, this.y + 2, 58, 58, 'right');
    };
    Hero.prototype.checkAbove = function () {
        if (this.checkCenter()) return this.probe(this.x + 16, this.y - 62, 32, 62, 'up');
        return this.probe(this.x + 16, this.y + 16, 32, 32, 'up');
    };
    Hero.prototype.checkBelow = function () {
        return this.probe(this.x + 2, this.y + this.height - 2, 58, 58, 'down');
    };
    Hero.prototype.onKey = function (key) {
        this.keyDown = key;
        if (key === 'up' || key === 'down' || key === 'left' || key === 'right') {
            this.direction = key;
            this.shouldMove = true;
        } else {
            this.shouldMove = false;
        }
        if (this.ctrlDown) {
            // Turning in place. Any other key held with Ctrl turns him to face down, as in the original
            this.direction = key === 'left' || key === 'right' || key === 'up' ? key : 'down';
        } else {
            if (key === 'up' && this.canJump && this.checkAbove() && this.checkCenter()) {
                this.jumpCounter++;
                if (this.jumpCounter <= 1 && this.y > 0) this.y -= 64;
            }
            if (key === 'left' && this.checkLeft() && this.checkCenter() && this.x > 0) this.x -= 64;
            if (key === 'right' && this.checkRight() && this.checkCenter() && this.x < worldWidth - this.width) this.x += 64;
        }
        if (key === 'space' || key === 'down') this.placeBlockBelow();
        if (key === 'z') {
            this.isMining = true;
            if (this.mineCounter >= this.fps * 3 - 2) this.mineCounter = -1;
            else this.mineCounter++;
            if (this.mineCounter % this.fps === 0) heroImg.current = heroImg.mine[this.direction][idiv(this.mineCounter, this.fps)];
        } else {
            this.isMining = false;
        }
    };
    // Puts a carried block down where he's facing: beside him, or under him in mid-jump
    Hero.prototype.placeBlockBelow = function () {
        for (var i = 0; i < this.inventory.length; i++) {
            if (this.inventory[i] === -1) continue;
            var id = getRandom(1000) * 11;
            if (this.direction === 'left' && this.checkLeft() && this.x > 0) {
                blockArray.push(new Block(this.x - this.width, this.y - 4, this.inventory[i] === 0 ? 0 : 1, id));
                this.inventory[i] = -1;
                this.inventorySpace++;
            }
            if (this.direction === 'right' && this.checkRight() && this.x < worldWidth - this.width) {
                blockArray.push(new Block(this.x + this.width, this.y - 4, this.inventory[i] === 0 ? 0 : 1, id));
                this.inventory[i] = -1;
                this.inventorySpace++;
            }
            if (this.direction === 'down' && this.checkBelow()) {
                blockArray.push(new Block(this.x, this.y + this.height - 4, this.inventory[i] === 0 ? 0 : 1, id));
                this.inventory[i] = -1;
                this.inventorySpace++;
            }
        }
    };

    /* ---------- The loop: one pass of Main's while loop per step ---------- */

    function held(code) {
        return !!keys[code];
    }

    function step() {
        if (!hero.isAlive) isGameOver = true;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        if (!isGameOver) {
            if (frame === 1) {
                // The floor: three rows of blocks
                for (var row = 1; row <= 3; row++) for (var col = 0; col < 10; col++) blockArray.push(new Block(col * 64, worldHeight - 64 * row, 0, (row + col) * 7));
            }
            camera.update(hero);
            background.update();

            if (frame % spawnEvery === 0) {
                spawnX = getRandom(10) * 64;
                spawnRoll = getRandom(100);
                background.addAlert(idiv(spawnX, 64));
                blockArray.push(new Block(spawnX, camera.y - 128, spawnRoll < 60 ? 0 : 1, idiv(frame, 10)));
                alertUntil = frame + 25;
            }
            if (frame >= alertUntil) background.removeAlert(idiv(spawnX, 64));

            var i, b;
            for (i = 0; i < itemArray.length; i++) {
                var item = itemArray[i];
                if (item.isAlive) {
                    if (item.remove) itemArray.splice(i, 1);
                    else item.update();
                } else {
                    if (item.lifeSpan > 0) hero.giveItem(item.type);
                    itemArray.splice(i, 1);
                }
            }
            for (i = 0; i < blockArray.length; i++) {
                b = blockArray[i];
                if (b.isAlive) {
                    if (b.remove) blockArray.splice(i, 1);
                    else b.update();
                } else {
                    // A mined block drops an apple one time in seven, otherwise itself
                    if (b.myID % 7 === 0) itemArray.push(new Item(b.x, b.y, 0, b.myID));
                    else {
                        if (b.type === 0) itemArray.push(new Item(b.x, b.y, 1, b.myID));
                        if (b.type === 1) itemArray.push(new Item(b.x, b.y, 2, b.myID));
                    }
                    blockArray.splice(i, 1);
                }
            }

            hero.update();
            lava.update(lavaFrame);

            drawText('SCORE:' + playerScoreLast, 10, camera.y + 25, spriteSize, false);
            drawText('CAN CARRY:' + hero.inventorySpace, 10, camera.y + 100, spriteSize, false);
            drawText('HEALTH:' + hero.hp, 10, camera.y + 75, spriteSize, false);
            // How deep each row is, down the right edge
            for (i = 0; i < 14; i++) drawText(String(idiv(camera.y, 64) - (idiv(worldHeight, 64) - i - 1)), 575, camera.y + 67 + i * 64, spriteSize, false);
        } else {
            camera.y = worldHeight - 960;
            lava.myY = worldHeight - 160;
            lavaVSP = 4;
            spawnEvery = 100;
            level = 1;
            background.reset();
            hero.reset();
            playerScore = 0;
            // The original clears these the way it does, about half a list per step
            for (i = 0; i < blockArray.length; i++) blockArray.splice(i, 1);
            for (i = 0; i < itemArray.length; i++) itemArray.splice(i, 1);
            var size = [56, 76];
            drawText('GAME OVER', 68, camera.y + 300, size, true);
            drawText('PRESS ENTER TO RETRY', 200, camera.y + 400, size, false);
            size[0] = 28;
            size[1] = 38;
            var x = playerScoreLast < 10 ? 222 : playerScoreLast > 0 && playerScoreLast < 100 ? 208 : 194;
            drawText('SCORE:' + playerScoreLast, x, camera.y + 500, size, true);
            frame = 0;
        }

        hero.checkCollision();
        hero.checkCenter();
        for (i = 0; i < itemArray.length; i++) itemArray[i].checkBelow();
        for (i = 0; i < blockArray.length; i++) blockArray[i].checkBelow();

        // Up, Left, Right and Space act once per press; Down and Z repeat while held
        if (held('ArrowUp')) {
            if (++pressedUp === 1) hero.onKey('up');
        } else pressedUp = 0;
        if (held('ArrowDown')) hero.onKey('down');
        if (held('ArrowLeft')) {
            if (++pressedLeft === 1) hero.onKey('left');
        } else pressedLeft = 0;
        if (held('ArrowRight')) {
            if (++pressedRight === 1) hero.onKey('right');
        } else pressedRight = 0;
        if (held('KeyZ')) hero.onKey('z');
        if (held('Space')) {
            if (++pressedSpace === 1) hero.onKey('space');
        } else pressedSpace = 0;
        hero.ctrlDown = held('Control');
        if (held('Enter') && isGameOver) isGameOver = false;

        frame++;
        gameTimer = frame;
        if (frame % 5 === 0) lavaFrame = lavaFrame < 12 ? lavaFrame + 1 : 0;
        if (playerScore > playerScoreLast) playerScoreLast = playerScore;
        playerScore = -1 * (idiv(hero.y, 64) - 155);
        // Every 1000 steps the lava rises faster and blocks come more often
        if (gameTimer % 1000 === 0) {
            lavaVSP++;
            level++;
            if (spawnEvery > 50) spawnEvery -= level * 2;
        }
    }

    /* ---------- Setup ---------- */

    var SPRITES = ['Background/bg1', 'Background/ohno', 'Blocks/block1', 'Blocks/block2', 'Blocks/block1_icon', 'Blocks/block2_icon', 'Items/apple', 'Lava/lava'];
    var n;
    for (n = 1; n <= 10; n++) SPRITES.push('Blocks/bd' + n, 'Blocks/dbd' + n);
    for (n = 1; n <= 13; n++) SPRITES.push('Lava/lava-top' + n);
    ['wl3', 'wr3', 'wu3', 'wd3', 'ml1', 'ml2', 'ml3', 'mr1', 'mr2', 'mr3', 'mu1', 'mu2', 'mu3', 'md1', 'md2', 'md3', 'death'].forEach(function (name) {
        SPRITES.push('Hero/' + name);
    });
    GLYPHS.split('').forEach(function (c) {
        SPRITES.push('Font/' + (GLYPH_FILES[c] || c));
    });

    function loadSprites(base) {
        return Promise.all(
            SPRITES.map(function (name) {
                return new Promise(function (resolve, reject) {
                    var image = new Image();
                    image.onload = function () {
                        img[name] = image;
                        resolve();
                    };
                    image.onerror = function () {
                        reject(new Error('could not load ' + name));
                    };
                    image.src = base + name + '.png';
                });
            })
        );
    }

    var KEY_CODES = { ArrowUp: 1, ArrowDown: 1, ArrowLeft: 1, ArrowRight: 1, KeyZ: 1, Space: 1, Enter: 1, ControlLeft: 'Control', ControlRight: 'Control' };

    // A key let go before the next step has seen it still counts as held for that one step, so a quick tap isn't lost
    var unseen = {}, releaseAfterStep = {};

    function onKey(event, down) {
        var name = KEY_CODES[event.code];
        if (!name) return;
        if (name === 1) name = event.code;
        event.preventDefault();
        if (down && event.repeat) return; // the original ignored auto-repeat
        if (down) {
            keys[name] = true;
            unseen[name] = true;
            delete releaseAfterStep[name];
        } else if (unseen[name]) {
            releaseAfterStep[name] = true;
        } else {
            keys[name] = false;
        }
    }

    function afterStep() {
        unseen = {};
        for (var name in releaseAfterStep) keys[name] = false;
        releaseAfterStep = {};
    }

    /**
     * Starts the game on `target` (a 640×960 canvas). With `startRun`, it skips the GAME OVER screen the original
     * opens on and goes straight into a run, as if Enter had been pressed.
     */
    window.startFloorIsLava = function (target, base, startRun) {
        canvas = target;
        ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false; // the original's textures were GL_NEAREST
        return loadSprites(base).then(function () {
            heroImg.walk = { left: img['Hero/wl3'], right: img['Hero/wr3'], up: img['Hero/wu3'], down: img['Hero/wd3'] };
            heroImg.mine = {};
            ['left', 'right', 'up', 'down'].forEach(function (side) {
                var c = side.charAt(0);
                heroImg.mine[side] = [img['Hero/m' + c + '1'], img['Hero/m' + c + '2'], img['Hero/m' + c + '3']];
            });
            heroImg.death = img['Hero/death'];

            images = new Images();
            background = new Background();
            worldWidth = background.worldWidth;
            worldHeight = background.worldHeight;
            camera = new Camera(WIDTH, HEIGHT);
            hero = new Hero(512, worldHeight - 256 + blockVSP);
            lava = new Lava(worldHeight - 160);

            window.addEventListener('keydown', function (event) { onKey(event, true); });
            window.addEventListener('keyup', function (event) { onKey(event, false); });
            window.addEventListener('blur', function () {
                keys = {};
                unseen = {};
                releaseAfterStep = {};
            });

            if (startRun) {
                step(); // one pass on the GAME OVER screen sets everything up, as the original's first frame does
                isGameOver = false;
            }

            var last = performance.now(), behind = 0;
            function loop(now) {
                behind += Math.min(now - last, 250); // after a hidden tab, carry on rather than catch up
                last = now;
                while (behind >= TICK) {
                    step();
                    afterStep();
                    behind -= TICK;
                }
                requestAnimationFrame(loop);
            }
            requestAnimationFrame(loop);
        });
    };
})();
