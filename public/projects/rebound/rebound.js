// Rebound, Jake's Greenfoot game from April 2013, translated from its Java source (TargetFinder/*.java) onto greenfoot.js.
// Each class is the Java class of the same name, method for method and in the same order, so the two can be read side by
// side. What a translation has to spell out: Java's integer division and (int) casts (int()), fields that Java starts
// at 0, false or null, and field initialisers, which run after super() as they do in Java. A few local variables are
// renamed where Java let them share a class's name, and the four walls, which differ only in size, share wall(). Nothing
// else in the game has been changed.
(function () {
    'use strict';

    var gf = window.greenfoot;
    var Actor = gf.Actor, World = gf.World, GreenfootImage = gf.GreenfootImage, Greenfoot = gf.Greenfoot, Color = gf.Color, Font = gf.Font, int = gf.int;

    // ---- menuWorld.java (never opened: the game starts on levelOne, and the title is never drawn)
    class menuWorld extends World {
        constructor() {
            // Create a new world with 600x400 cells with a cell size of 1x1 pixels.
            super(600, 400, 1);
            this.title = null;

            this.addTitle();
        }

        addTitle() {
            this.title = new GameTextLarge('Rebound');
            this.addObject(this.title, 300, 200);
        }
    }

    // ---- SWorld.java: danpost's scrolling world, v2.0 (January 13, 2013), shared on greenfoot.org
    class SWorld extends World {
        // SWorld(wide, high, cellSize, scrollWide) is the horizontal scroller: scrollHigh is the window height
        constructor(wide, high, cellSize, scrollWide, scrollHigh) {
            if (scrollHigh === undefined) scrollHigh = high;
            super(cellSize == 1 ? wide : int(wide / 2) * 2 + 1, cellSize == 1 ? high : int(high / 2) * 2 + 1, cellSize, false);
            this.scrollingWidth = 0; this.scrollingHeight = 0; // limits for main actor within universal coordinates
            this.actorMinX = 0; this.actorMaxX = 0; this.actorMinY = 0; this.actorMaxY = 0; // limits for main actor within world coordinates
            this.AMT_X = 0; this.AMT_Y = 0; // initial scrolled amount
            this.scrollType = 0; // indicates scrolling directions (0=none, 1=horizontal, 2=vertical, 3=both)
            this.mainActor = null; // the actor that always stays visible
            this.genActors = []; // lists all generic scrolling actor objects
            this.background = null;

            this.scrollType = (scrollWide > wide ? 1 : 0) + (scrollHigh > high ? 2 : 0);
            this.scrollingWidth = this.scrollType % 2 == 1 ? scrollWide : wide;
            this.scrollingHeight = int(this.scrollType / 2) == 1 ? scrollHigh : high;
        }

        setMainActor(main, xRange, yRange) {
            if (main == null) {
                console.log('A main actor MUST be supplied.');
                return;
            }
            super.addObject(main, int(this.getWidth() / 2), int(this.getHeight() / 2));
            this.mainActor = main;
            xRange = Math.min(xRange, this.getWidth());
            yRange = Math.min(yRange, this.getHeight());
            this.actorMinX = int(this.getWidth() / 2) - int(xRange / 2);
            this.actorMaxX = int(this.getWidth() / 2) + int(xRange / 2);
            this.actorMinY = int(this.getHeight() / 2) - int(yRange / 2);
            this.actorMaxY = int(this.getHeight() / 2) + int(yRange / 2);
        }

        setScrollingBackground(scrollingBackground) {
            if (this.mainActor == null) {
                console.log("'setMainActor' MUST be called prior to calling 'setScrollingBackground'.");
                return;
            }
            this.background = new GreenfootImage(scrollingBackground);
            this.background.scale(this.scrollingWidth * this.getCellSize(), this.scrollingHeight * this.getCellSize());
            this.scrollBackground();
        }

        fillScrollingBackground(fillImage) {
            if (this.mainActor == null) {
                console.log("'setMainActor' MUST be called prior to calling 'fillScrollingBackground'.");
                return;
            }
            if (fillImage.getWidth() < this.getWidth() && fillImage.getHeight() < this.getHeight()) {
                this.setBackground(new GreenfootImage(fillImage));
                fillImage = this.getBackground();
            }
            this.background = new GreenfootImage(this.scrollingWidth * this.getCellSize(), this.scrollingHeight * this.getCellSize());
            for (var x = 0; x < this.background.getWidth(); x += fillImage.getWidth())
                for (var y = 0; y < this.background.getHeight(); y += fillImage.getHeight()) this.background.drawImage(fillImage, x, y);
            this.scrollBackground();
        }

        // addObject(obj, xLoc, yLoc) adds a scrollable object
        addObject(obj, xLoc, yLoc, scroller) {
            if (scroller === undefined) scroller = true;
            super.addObject(obj, xLoc, yLoc);
            if (scroller) this.genActors.push(obj);
        }

        removeObject(obj) {
            if (obj == null) return;
            if (obj === this.mainActor) this.mainActor = null;
            else {
                var index = this.genActors.indexOf(obj);
                if (index >= 0) this.genActors.splice(index, 1);
            }
            super.removeObject(obj);
        }

        removeObjects(objs) {
            for (var i = 0; i < objs.length; i++) this.removeObject(objs[i]);
        }

        act() {
            this.scrollObjects();
            this.scrollBackground();
        }

        scrollBackground() {
            if (this.background == null) return;
            var image = new GreenfootImage(this.background);
            image.drawImage(this.background, int((this.getWidth() * this.getCellSize() - this.background.getWidth()) / 2) - this.AMT_X * this.getCellSize(), int((this.getHeight() * this.getCellSize() - this.background.getHeight()) / 2) - this.AMT_Y * this.getCellSize());
            this.setBackground(image);
        }

        scrollObjects() {
            var mainActor = this.mainActor, genActors = this.genActors, i, actor;
            if (mainActor == null) return;
            // determine how far the main actor is outside its standard window limits
            var dx = 0, dy = 0;
            if (mainActor.getX() < this.actorMinX) dx = this.actorMinX - mainActor.getX();
            if (mainActor.getX() > this.actorMaxX) dx = this.actorMaxX - mainActor.getX();
            if (mainActor.getY() < this.actorMinY) dy = this.actorMinY - mainActor.getY();
            if (mainActor.getY() > this.actorMaxY) dy = this.actorMaxY - mainActor.getY();
            if (dx == 0 && dy == 0) return; // not outside window limits
            // ** outside standard window limits **
            this.AMT_X -= dx; this.AMT_Y -= dy; // track scroll amount
            // move all objects to place main actor back within standard window limits
            mainActor.setLocation(mainActor.getX() + dx, mainActor.getY() + dy);
            for (i = 0; i < genActors.length; i++) {
                actor = genActors[i];
                actor.setLocation(actor.getX() + dx, actor.getY() + dy);
            }
            // determine how far the background is inside the world limits
            dx = 0; dy = 0;
            var w = this.getWidth(), h = this.getHeight(), sw = this.scrollingWidth, sh = this.scrollingHeight;
            if (this.AMT_X > int(sw / 2) - int(w / 2)) dx = this.AMT_X - (int(sw / 2) - int(w / 2));
            if (this.AMT_X < int(w / 2) - int(sw / 2)) dx = this.AMT_X - (int(w / 2) - int(sw / 2));
            if (this.AMT_Y > int(sh / 2) - int(h / 2)) dy = this.AMT_Y - (int(sh / 2) - int(h / 2));
            if (this.AMT_Y < int(h / 2) - int(sh / 2)) dy = this.AMT_Y - (int(h / 2) - int(sh / 2));
            if (dx == 0 && dy == 0) return; // background image covers the world
            // ** background does not completely cover world limits
            this.AMT_X -= dx; this.AMT_Y -= dy; // adjust scroll amount
            // move all objects so background covers the world
            mainActor.setLocation(mainActor.getX() + dx, mainActor.getY() + dy);
            for (i = 0; i < genActors.length; i++) {
                actor = genActors[i];
                actor.setLocation(actor.getX() + dx, actor.getY() + dy);
            }
            // determine how far main actor is outside universal limits
            dx = 0; dy = 0;
            if (mainActor.getX() < 0) dx = 0 - mainActor.getX();
            if (mainActor.getX() > w - 1) dx = w - 1 - mainActor.getX();
            if (mainActor.getY() < 0) dy = 0 - mainActor.getY();
            if (mainActor.getY() > h - 1) dy = h - 1 - mainActor.getY();
            if (dx == 0 && dy == 0) return;
            // ** outside universal limits
            // move main actor back within world limits
            mainActor.setLocation(mainActor.getX() + dx, mainActor.getY() + dy);
        }
    }

    // ---- levelOne.java
    class levelOne extends SWorld {
        constructor() {
            super(600, 400, 1, 1200); // scroll world constructor call; last parameter is scroll width
            this.rTimer = 0;
            this.shapeTimer = 0;
            this.rNumber = Greenfoot.getRandomNumber(50) + 5;

            this.maxShots = 2;
            this.myScore = 0;
            this.rShots = this.maxShots;

            this.retry = false; //screen

            this.player = new player();
            this.mouse = Greenfoot.getMouseInfo();
            this.shapes = new shapes();
            this.dScreen = new dimScreen();
            this.rScreen = new retryScreen();
            this.Score = null;
            this.Shots = null;

            this.setPaintOrder(retryScreen, dimScreen, GameText, Ball, Arrow, trail, Target, barriersLong, barriersFlat, shapes, player);

            this.Score = new GameTextMed('Score: ' + this.myScore);
            this.addObject(this.Score, 100, 50);

            this.Shots = new GameTextMed('Remaining Shots: ' + this.rShots);
            this.addObject(this.Shots, 200, 75);

            this.addPlayer();
            this.addText();
            this.prepare();
        }

        act() {
            super.act();

            this.addShapes();
            this.checkRetry();
        }

        addPlayer() {
            var ball = new Ball(this.maxShots, this.myScore);
            this.addObject(ball, 130, 275);
            this.setMainActor(this.player, 300, 200);
        }

        addText() {}

        updateScore(ballScore) {
            this.myScore = ballScore;
            this.Score.setGameText('Score: ' + this.myScore);
        }

        updateShots(shots) {
            this.rShots = shots;
            this.Shots.setGameText('Remaining Shots: ' + this.rShots);
        }

        levelFailed() {
            this.addObject(this.dScreen, 300, -200, false);
            this.retry = true;
        }

        checkRetry() {
            if (this.retry == true) {
                this.rTimer++;

                if (this.rTimer == 100) {
                    this.addObject(this.rScreen, -200, 200, false);
                }
            } else {
                this.rTimer = 0;
            }
        }

        addShapes() {
            this.shapeTimer++;

            var x = Greenfoot.getRandomNumber(600);

            if (this.shapeTimer == 30 + this.rNumber) {
                this.addObject(new shapes(), x, -200);
                this.shapeTimer = 0;
            }
        }

        prepare() {
            this.addObject(new bL(), 10, 200);
            this.addObject(new bL(), 790, 200);
            this.addObject(new bF(), 250, 10);
            this.addObject(new bF(), 250, 390);
            this.addObject(new bF(), 550, 10);
            this.addObject(new bF(), 550, 390);

            this.addObject(new bLM(), 250, 342);
            this.addObject(new bLM(), 250, 268);
            this.addObject(new bLM(), 250, 193);
            this.addObject(new bFM(), 316, 165);
            this.addObject(new bFM(), 466, 165);

            this.addObject(new Target(), 300, 215);
        }
    }

    // ---- levelTwo.java
    class levelTwo extends SWorld {
        constructor(score) {
            super(600, 400, 1, 1200); // scroll world constructor call; last parameter is scroll width
            this.rTimer = 0;
            this.shapeTimer = 0;
            this.rNumber = Greenfoot.getRandomNumber(50) + 5;

            this.maxShots = 3;
            this.myScore = 0;
            this.rShots = this.maxShots;

            this.retry = false; //screen

            this.player = new player();
            this.mouse = Greenfoot.getMouseInfo();
            this.shapes = new shapes();
            this.dScreen = new dimScreen();
            this.rScreen = new retryScreen();
            this.Score = null;
            this.Shots = null;

            this.setPaintOrder(retryScreen, dimScreen, GameText, Ball, Arrow, trail, Target, barriersLong, barriersFlat, shapes, player);

            this.myScore = score;

            this.Score = new GameTextMed('Score: ' + this.myScore);
            this.addObject(this.Score, 100, 50);

            this.Shots = new GameTextMed('Remaining Shots: ' + this.rShots);
            this.addObject(this.Shots, 200, 75);

            this.addPlayer();
            this.addText();
            this.prepare();
        }

        act() {
            super.act();

            this.addShapes();
            this.checkRetry();
        }

        addPlayer() {
            var ball = new Ball(this.maxShots, this.myScore);
            this.addObject(ball, 75, 275);
            this.setMainActor(this.player, 300, 200);
        }

        addText() {}

        updateScore(ballScore) {
            this.myScore = ballScore;
            this.Score.setGameText('Score: ' + this.myScore);
        }

        updateShots(shots) {
            this.rShots = shots;
            this.Shots.setGameText('Remaining Shots: ' + this.rShots);
        }

        levelFailed() {
            this.addObject(this.dScreen, 300, -200, false);
            this.retry = true;
        }

        checkRetry() {
            if (this.retry == true) {
                this.rTimer++;

                if (this.rTimer == 100) {
                    this.addObject(this.rScreen, -200, 200, false);
                }
            } else {
                this.rTimer = 0;
            }
        }

        addShapes() {
            this.shapeTimer++;

            var x = Greenfoot.getRandomNumber(600);

            if (this.shapeTimer == 30 + this.rNumber) {
                this.addObject(new shapes(), x, -200);
                this.shapeTimer = 0;
            }
        }

        prepare() {
            //borders
            this.addObject(new bL(), 10, 200);
            this.addObject(new bL(), 790, 200);
            this.addObject(new bF(), 250, 10);
            this.addObject(new bF(), 250, 390);
            this.addObject(new bF(), 550, 10);
            this.addObject(new bF(), 550, 390);

            //obsticles
            this.addObject(new bLM(), 150, 342);
            this.addObject(new bLM(), 150, 268);
            this.addObject(new bLM(), 150, 193);

            this.addObject(new bLM(), 350, 57);
            this.addObject(new bLM(), 350, 132);
            this.addObject(new bLM(), 350, 207);

            this.addObject(new bLM(), 550, 342);
            this.addObject(new bLM(), 550, 268);
            this.addObject(new bLM(), 550, 119);

            this.addObject(new bFM(), 715, 119);
            this.addObject(new bFM(), 635, 119);

            this.addObject(new Target(), 700, 300);
        }
    }

    // ---- Ball.java
    class Ball extends Actor {
        constructor(levelShots, score) {
            super();
            this.wallTimer = 0;
            this.powerTimer = 0;
            this.timer = 0;

            this.maxShots = 0;
            this.shotTimer = 0;

            this.myScore = 0;

            this.powerSum = 0;
            this.power = 0;
            this.angle = 0;

            this.mX = 0;
            this.mY = 0;
            this.bX = 0;
            this.bY = 0;

            this.canMove = false;
            this.wallHit = false;
            this.canShoot = false;
            this.outOfShots = false;
            this.retryLevel = false;
            this.trail = new trail();
            this.arrow = new Arrow();
            this.dimScreen = new dimScreen();
            this.player = new player();

            this.maxShots = levelShots;
            this.myScore = score;

            this.wallTimer = 0;
            this.powerTimer = 0;
            this.timer = 0;
            this.shotTimer = 0;

            score = 0;

            this.power = 0;
            this.powerSum = 0;
            this.angle = 0;

            this.canMove = false;
            this.wallHit = false;
            this.canShoot = true;
            this.outOfShots = false;
            this.retryLevel = false;

            this.makeBall();
        }

        makeBall() {
            var ball = new GreenfootImage(24, 24);

            ball.setColor(new Color(0, 0, 0));
            ball.fillOval(0, 0, 24, 24);

            this.setImage(ball);
        }

        act() {
            this.checkShots();
            this.updateStats();
            this.checkKeys(this.retryLevel);

            if (this.canShoot == true) {
                if (this.canMove == true) {
                    this.slide();
                    this.checkPower();
                    this.arrow.updateBall(false); //should arrow follow mouse

                    this.wallTimer++;
                    this.timer++;
                    this.shotTimer++;
                } else {
                    this.checkMouse();
                    this.addArrow();
                    this.arrow.updateBall(true); //should arrow follow mouse

                    this.timer = 0;
                    this.shotTimer = 0;

                    if (this.outOfShots == true) {
                        this.player.updateMove(false);
                        this.canShoot = false;
                    } else {
                        //player.updateMove(true);
                    }
                }
            } else {
                if (this.getWorld() instanceof levelOne) {
                    this.getWorld().levelFailed();
                }
                if (this.getWorld() instanceof levelTwo) {
                    this.getWorld().levelFailed();
                }
            }
        }

        slide() {
            this.move(this.power);
            this.checkBarriers();
            this.checkTarget();
            this.addTrail();
            this.myScore += 1;

            if (this.shotTimer == 1) {
                this.maxShots -= 1;
            }
        }

        checkTarget() {
            var target = this.getOneIntersectingObject(Target);

            if (target != null) {
                if (this.getWorld() instanceof levelOne) {
                    Greenfoot.setWorld(new levelTwo(this.myScore));
                }
            }
        }

        updateStats() {
            if (this.getWorld() instanceof levelOne) {
                this.getWorld().updateScore(this.myScore);
                this.getWorld().updateShots(this.maxShots);
            }
            if (this.getWorld() instanceof levelTwo) {
                this.getWorld().updateScore(this.myScore);
                this.getWorld().updateShots(this.maxShots);
            }
        }

        checkShots() {
            if (this.maxShots > 0) {
                this.canShoot = true;
            } else {
                this.outOfShots = true;
            }
        }

        checkPower() {
            this.powerTimer++;

            if (this.powerTimer == 10) {
                this.power -= 1;
                this.powerTimer = 0;
            }

            if (this.power <= 0) {
                this.power = 0;
                this.canMove = false;
            }
        }

        addArrow() {
            this.getWorld().addObject(this.arrow, this.getX(), this.getY());
            this.arrow.setLocation(this.getX(), this.getY());
        }

        updateArrowRotation(recievedAngle) {
            this.angle = recievedAngle;

            this.setRotation(this.angle);
        }

        checkMouse() {
            var mouse = Greenfoot.getMouseInfo();

            if (Greenfoot.mouseMoved(null) && this.canMove == false) {
                this.mX = mouse.getX();
                this.mY = mouse.getY();

                this.angle = int((180 * Math.atan2(this.mY - this.getY(), this.mX - this.getX())) / Math.PI);
            }

            if (Greenfoot.mouseMoved(null) && this.canMove == false) {
                this.bX = this.getX();
                this.bY = this.getY();

                if (this.mX < 0) {
                    this.mX = this.mX * -1;
                }
                if (this.mY < 0) {
                    this.mY = this.mY * -1;
                }

                this.powerSum = Math.sqrt(Math.pow(this.mX - this.bX, 2) + Math.pow(this.mY - this.bY, 2));

                this.power = int(this.powerSum);
                this.power = int(this.power / 10);

                if (this.power < 0) {
                    this.power = this.power * -1;
                }
                if (this.power > 100) {
                    this.power = 100;
                }
                this.arrow.updateArrow(this.power);
            }

            if (Greenfoot.mousePressed(null)) {
                this.setRotation(this.angle);
                this.canMove = true;
                this.removeArrow();
            }
        }

        removeArrow() {
            this.getWorld().removeObject(this.arrow);
        }

        checkBarriers() {
            var long = this.getOneIntersectingObject(barriersLong);

            var flat = this.getOneIntersectingObject(barriersFlat);

            if (long != null && this.wallTimer > 1) {
                this.setRotation(180 - this.getRotation());

                this.wallTimer = 0;
            }

            if (flat != null && this.wallTimer > 1) {
                this.setRotation(360 - this.getRotation());

                this.wallTimer = 0;
            }
        }

        addTrail() {
            this.getWorld().addObject(new trail(), this.getX(), this.getY());
        }

        checkKeys(rT) {
            this.retryLevel = rT;

            if (Greenfoot.isKeyDown('r')) {
                this.retryLevel = true;
            } else {
                this.retryLevel = false;
            }

            if (this.retryLevel == true) {
                if (this.getWorld() instanceof levelOne) {
                    Greenfoot.setWorld(new levelOne());
                }
                if (this.getWorld() instanceof levelTwo) {
                    Greenfoot.setWorld(new levelTwo(this.myScore));
                }

                this.retryLevel = false;
            }
        }
    }

    // ---- Arrow.java
    class Arrow extends Actor {
        constructor() {
            super();
            this.mx = 0;
            this.my = 0;
            this.colorLevel = 0;
            this.giveAngle = true;

            this.colorLevel = 0;

            this.makeArrow();
        }

        act() {
            this.checkMouse();
        }

        makeArrow() {
            var arrow = new GreenfootImage(100, 20);

            arrow.setColor(new Color(255, 0, 0));
            arrow.fillRect(0, 0, 100, 20);

            this.setImage(arrow);
        }

        checkMouse() {
            var mouse = Greenfoot.getMouseInfo();

            if (Greenfoot.mouseMoved(null) && this.giveAngle == true) {
                this.mx = mouse.getX();
                this.my = mouse.getY();

                this.setRotation(int((180 * Math.atan2(mouse.getY() - this.getY(), mouse.getX() - this.getX())) / Math.PI));
            }
        }

        updateArrow(recievedPower) {
            this.colorLevel = recievedPower;
            var newColor = int(this.colorLevel);

            var arrow = this.getImage();
            arrow.clear();

            if (this.colorLevel >= 100) {
                arrow.setColor(new Color(255, 0, 0));
                arrow.fillRect(0, 0, 100, 20);
            } else {
                arrow.setColor(new Color(newColor + 150, 0, 0));
                arrow.fillRect(0, 0, newColor, 20);
            }
        }

        updateBall(canMove) {
            this.giveAngle = canMove;
        }
    }

    // ---- player.java: the invisible main actor the world scrolls around
    class player extends Actor {
        constructor() {
            super();
            this.speed = 5;
            this.canMove = false;

            this.arrow = new Arrow();

            this.canMove = true;
        }

        act() {
            this.checkKeys();
        }

        checkKeys() {
            if (this.canMove == true) {
                if (Greenfoot.isKeyDown('right') || Greenfoot.isKeyDown('d')) {
                    this.setLocation(500 + this.speed, this.getY());
                }

                if (Greenfoot.isKeyDown('left') || Greenfoot.isKeyDown('a')) {
                    this.setLocation(100 - this.speed, this.getY());
                }

                if (Greenfoot.isKeyDown('up') || Greenfoot.isKeyDown('w')) {
                    this.setLocation(this.getX(), this.getY() - this.speed);
                }

                if (Greenfoot.isKeyDown('down') || Greenfoot.isKeyDown('s')) {
                    this.setLocation(this.getX(), this.getY() + this.speed);
                }
            }
        }

        updateMove(movement) {
            this.canMove = movement;
        }
    }

    // ---- GameText.java, GameTextLarge.java, GameTextMed.java
    class GameText extends Actor {
        act() {
            // Add your action code here.
        }
    }

    class GameTextLarge extends GameText {
        constructor(text) {
            super();
            this.board = null;

            this.makeText(text);
        }

        act() {
            // Add your action code here.
        }

        makeText(text) {
            this.board = new GreenfootImage(text.length * 20, 50);
            this.board.setColor(Color.BLACK);

            var myFont = new Font('Times New Roman', Font.BOLD, 50);

            this.board.setFont(myFont);

            this.setImage(this.board);
        }

        setGameText(text) {
            var board = this.getImage();

            board.clear();

            board.drawString(text, 10, 20);
        }
    }

    class GameTextMed extends GameText {
        constructor(text) {
            super();
            this.board = null;

            this.makeText(text);
        }

        act() {
            // Add your action code here.
        }

        makeText(text) {
            this.board = new GreenfootImage(text.length * 20, 50);
            this.board.setColor(Color.BLACK);

            var myFont = new Font('Times New Roman', Font.BOLD, 20);

            this.board.setFont(myFont);

            this.setImage(this.board);
        }

        setGameText(text) {
            var board = this.getImage();

            board.clear();

            board.drawString(text, 10, 20);
        }
    }

    // ---- Target.java
    class Target extends Actor {
        act() {
            // Add your action code here.
        }
    }

    // ---- barriersFlat.java, barriersLong.java, and the four walls: bF.java, bFM.java, bL.java, bLM.java
    class barriersFlat extends Actor {
        act() {
            // Add your action code here.
        }
    }

    class barriersLong extends Actor {
        act() {
            // Add your action code here.
        }
    }

    function wall(width, height) {
        var image = new GreenfootImage(width, height);
        image.setColor(new Color(54, 54, 54));
        image.fillRect(0, 0, width, height);
        return image;
    }

    class bF extends barriersFlat {
        constructor() {
            super();
            this.makeWall();
        }
        act() {}
        makeWall() {
            this.setImage(wall(500, 20));
        }
    }

    class bFM extends barriersFlat {
        constructor() {
            super();
            this.makeWall();
        }
        act() {}
        makeWall() {
            this.setImage(wall(150, 20));
        }
    }

    class bL extends barriersLong {
        constructor() {
            super();
            this.makeWall();
        }
        act() {}
        makeWall() {
            this.setImage(wall(20, 360));
        }
    }

    class bLM extends barriersLong {
        constructor() {
            super();
            this.makeWall();
        }
        act() {}
        makeWall() {
            this.setImage(wall(20, 75));
        }
    }

    // ---- dimScreen.java
    class dimScreen extends Actor {
        constructor() {
            super();
            this.canFall = false;

            this.retryScreen = new retryScreen();

            this.makeScreen();

            this.canFall = true;
        }

        act() {
            this.fall();
        }

        makeScreen() {
            var screen = new GreenfootImage(600, 400);
            screen.setColor(new Color(0, 0, 0));
            screen.fillRect(0, 0, 600, 400);
            screen.setTransparency(150);

            this.setImage(screen);
        }

        fall() {
            if (this.getY() == 200) {
                this.canFall = false;

                if (this.getWorld() instanceof levelOne) {
                    this.getWorld().levelFailed();
                }
            } else {
                this.canFall = true;
            }

            if (this.canFall == true) {
                this.setLocation(this.getX(), this.getY() + 5);
            } else {
                this.setLocation(this.getX(), this.getY() + 0);
            }
        }
    }

    // ---- retryScreen.java
    class retryScreen extends Actor {
        constructor() {
            super();
            this.canMove = false;
            this.retry = false;

            //Ball Ball = new Ball();
            this.makeScreen();

            this.canMove = true;
            this.retry = false;
        }

        act() {
            this.moveScreen();
            this.checkMouse();
        }

        makeScreen() {
            var screen = new GreenfootImage(400, 200);
            screen.setColor(new Color(0, 0, 0));
            screen.fillRect(0, 0, 400, 200);

            var myFont = new Font('Times New Roman', Font.BOLD, 50);

            screen.setFont(myFont);
            screen.setColor(Color.WHITE);

            screen.drawString('Retry', 150, 50);

            this.setImage(screen);
        }

        checkMouse() {
            var mouse = Greenfoot.getMouseInfo();
            var screen, myFont;

            if (Greenfoot.mouseMoved(null)) {
                var mX = mouse.getX();
                var mY = mouse.getY();

                if (mY <= 170 && mY > 110 && mX >= 245 && mX <= 375) {
                    screen = this.getImage();
                    screen.clear();

                    screen = new GreenfootImage(400, 200);
                    screen.setColor(new Color(0, 0, 0));
                    screen.fillRect(0, 0, 400, 200);
                    myFont = new Font('Times New Roman', Font.BOLD, 50);
                    screen.setFont(myFont);
                    screen.setColor(Color.RED);
                    screen.drawString('Retry', 150, 50);
                    this.setImage(screen);
                } else {
                    screen = this.getImage();
                    screen.clear();

                    screen = new GreenfootImage(400, 200);
                    screen.setColor(new Color(0, 0, 0));
                    screen.fillRect(0, 0, 400, 200);
                    myFont = new Font('Times New Roman', Font.BOLD, 50);
                    screen.setFont(myFont);
                    screen.setColor(Color.WHITE);
                    screen.drawString('Retry', 150, 50);
                    this.setImage(screen);
                }
            }

            if (Greenfoot.mouseClicked(this)) {
                this.retry = true;
                //Ball.checkKeys(retry);
            }
        }

        moveScreen() {
            if (this.getX() == 300) {
                this.canMove = false;
            } else {
                this.canMove = true;
            }

            if (this.canMove == true) {
                this.setLocation(this.getX() + 10, this.getY());
            } else {
                this.setLocation(this.getX() + 0, this.getY());
            }
        }
    }

    // ---- shapes.java: the colored circles drifting down behind the level
    class shapes extends Actor {
        constructor() {
            super();
            this.w = Greenfoot.getRandomNumber(150) + 25;
            this.x = Greenfoot.getRandomNumber(255) + 1;
            this.y = Greenfoot.getRandomNumber(255) + 1;
            this.z = Greenfoot.getRandomNumber(255) + 1;
            this.speed = Greenfoot.getRandomNumber(3);

            this.makeShapes();
        }

        act() {
            this.fall();
            this.checkY();
        }

        fall() {
            this.setLocation(this.getX(), this.getY() + this.speed);
        }

        checkY() {
            if (this.getY() >= 600) {
                this.getWorld().removeObject(this);
            }
        }

        makeShapes() {
            var shape = new GreenfootImage(this.w, this.w);

            shape.setColor(new Color(this.x, this.y, this.z));
            shape.fillOval(0, 0, this.w, this.w);

            this.setImage(shape);
        }
    }

    // ---- trail.java
    class trail extends Actor {
        constructor() {
            super();
            this.w = 24;
            this.x = Greenfoot.getRandomNumber(255) + 1;
            this.y = Greenfoot.getRandomNumber(255) + 1;
            this.z = Greenfoot.getRandomNumber(255) + 1;
            this.t = 0;

            this.makeTrail();
        }

        act() {
            this.shrink();
        }

        shrink() {
            this.w--;
            this.t += 5;

            var image = this.getImage();
            image.clear();

            image = new GreenfootImage(this.w, this.w);
            image.setColor(new Color(this.t, 0, 0));
            image.fillOval(0, 0, this.w, this.w);
            this.setImage(image);

            if (this.w <= 2) {
                this.getWorld().removeObject(this);
            }
        }

        makeTrail() {
            var image = new GreenfootImage(this.w, this.w);

            image.setColor(new Color(this.t, 0, 0));
            image.fillOval(0, 0, this.w, this.w);

            this.setImage(image);
        }
    }

    window.rebound = {
        // project.greenfoot: world.lastInstantiated, the world Greenfoot opens the scenario on
        world: function () {
            return new levelOne();
        },
        // project.greenfoot's class.<name>.image lines. bF, bFM, bL and bLM draw their own walls over theirs.
        classImages: { Target: 'Target.png', player: 'player.fw.png', bF: 'borderFlat.png', bFM: 'borderFlatMed.png', bL: 'borderLong.png', bLM: 'borderLongMed.png' },
        menuWorld: menuWorld,
    };
})();
