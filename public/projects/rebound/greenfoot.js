// The parts of Greenfoot 2.2.1 that Rebound uses, in JavaScript on a canvas: World, Actor, GreenfootImage, Greenfoot,
// MouseInfo, and java.awt's Color and Font. Greenfoot's own HTML5 conversion only runs on greenfoot.org's servers, so
// this stands in for it. It follows Greenfoot 2's behaviour where the game depends on it (see docs/projects/rebound.md):
//   - each act cycle, the world acts first, then every actor that was in it when the cycle began, in the order added;
//   - adding an actor to the world it's already in does nothing;
//   - mouseMoved, mousePressed and getMouseInfo describe what the mouse did since the last cycle, and getMouseInfo is
//     null when it did nothing;
//   - setPaintOrder puts the first class on top, and actors of unlisted classes underneath;
//   - collisions test the actors' images as rectangles, turned with the actor.
// One thing differs on purpose: Greenfoot 2 throws when a removed actor's location is used or set. Here setLocation does
// nothing and getX/getY give its last place, so the game carries on where the original would have stopped.
(function (global) {
    'use strict';

    // Java's integer division and (int) cast
    function int(n) {
        return Math.trunc(n);
    }

    function Color(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a === undefined ? 255 : a;
    }
    Color.prototype.css = function () {
        return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a / 255 + ')';
    };
    Color.BLACK = new Color(0, 0, 0);
    Color.WHITE = new Color(255, 255, 255);
    Color.RED = new Color(255, 0, 0);

    // Java's point sizes are pixels at Java2D's 72 dpi
    function Font(name, style, size) {
        this.name = name;
        this.style = style;
        this.size = size;
    }
    Font.PLAIN = 0;
    Font.BOLD = 1;
    Font.ITALIC = 2;
    Font.prototype.css = function () {
        var family = { 'Times New Roman': '"Times New Roman", Times, serif', SansSerif: 'Arial, Helvetica, sans-serif', Serif: '"Times New Roman", Times, serif', Monospaced: '"Courier New", monospace' }[this.name] || '"' + this.name + '", sans-serif';
        return (this.style & Font.ITALIC ? 'italic ' : '') + (this.style & Font.BOLD ? 'bold ' : '') + this.size + 'px ' + family;
    };

    // Images files, loaded up front by start(), since Greenfoot reads them synchronously
    var files = {};

    function loadImages(dir, names) {
        return Promise.all(
            names.map(function (name) {
                return new Promise(function (resolve, reject) {
                    var img = new Image();
                    img.onload = function () {
                        files[name] = img;
                        resolve();
                    };
                    img.onerror = function () {
                        reject(new Error('could not load ' + dir + name));
                    };
                    img.src = dir + name;
                });
            })
        );
    }

    function canvasOf(width, height) {
        var canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        return canvas;
    }

    class GreenfootImage {
        constructor(a, b) {
            this.color = Color.BLACK;
            this.font = new Font('SansSerif', Font.PLAIN, 12);
            this.transparency = 255;
            if (typeof a === 'number') {
                this.canvas = canvasOf(a, b);
            } else if (typeof a === 'string') {
                var file = files[a];
                if (!file) throw new Error('Could not find image: ' + a);
                this.canvas = canvasOf(file.naturalWidth, file.naturalHeight);
                this.canvas.getContext('2d').drawImage(file, 0, 0);
            } else {
                this.canvas = canvasOf(a.getWidth(), a.getHeight());
                this.canvas.getContext('2d').drawImage(a.canvas, 0, 0);
                this.color = a.color;
                this.font = a.font;
                this.transparency = a.transparency;
            }
            this.ctx = this.canvas.getContext('2d');
        }
        getWidth() {
            return this.canvas.width;
        }
        getHeight() {
            return this.canvas.height;
        }
        setColor(color) {
            this.color = color;
        }
        getColor() {
            return this.color;
        }
        setFont(font) {
            this.font = font;
        }
        getFont() {
            return this.font;
        }
        setTransparency(t) {
            this.transparency = t;
        }
        getTransparency() {
            return this.transparency;
        }
        clear() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        fill() {
            this.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        fillRect(x, y, w, h) {
            this.ctx.fillStyle = this.color.css();
            this.ctx.fillRect(x, y, w, h);
        }
        drawRect(x, y, w, h) {
            this.ctx.strokeStyle = this.color.css();
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(x + 0.5, y + 0.5, w, h);
        }
        fillOval(x, y, w, h) {
            this.ctx.fillStyle = this.color.css();
            this.ctx.beginPath();
            this.ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
            this.ctx.fill();
        }
        drawString(text, x, y) {
            this.ctx.fillStyle = this.color.css();
            this.ctx.font = this.font.css();
            this.ctx.textBaseline = 'alphabetic';
            this.ctx.fillText(text, x, y);
        }
        drawImage(image, x, y) {
            this.ctx.globalAlpha = image.transparency / 255;
            this.ctx.drawImage(image.canvas, x, y);
            this.ctx.globalAlpha = 1;
        }
        scale(w, h) {
            var old = this.canvas;
            this.canvas = canvasOf(w, h);
            this.ctx = this.canvas.getContext('2d');
            this.ctx.drawImage(old, 0, 0, w, h);
        }
    }

    // class name → image file, as project.greenfoot's class.<name>.image lines give them. An actor takes the image of
    // its class, or failing that of the nearest superclass that has one.
    var classImages = {};

    function classImageFor(object) {
        for (var proto = Object.getPrototypeOf(object); proto && proto !== Actor.prototype; proto = Object.getPrototypeOf(proto)) {
            var name = classImages[proto.constructor.name];
            if (name) return new GreenfootImage(name);
        }
        return null;
    }

    function normalize(rotation) {
        rotation %= 360;
        return rotation < 0 ? rotation + 360 : rotation;
    }

    class Actor {
        constructor() {
            this._x = 0;
            this._y = 0;
            this._rotation = 0;
            this._world = null;
            this._image = classImageFor(this);
        }
        act() {}
        addedToWorld(world) {}
        getWorld() {
            return this._world;
        }
        getX() {
            return this._x;
        }
        getY() {
            return this._y;
        }
        getRotation() {
            return this._rotation;
        }
        setRotation(rotation) {
            this._rotation = normalize(rotation);
        }
        turn(amount) {
            this.setRotation(this._rotation + amount);
        }
        setLocation(x, y) {
            if (!this._world) return; // Greenfoot 2 throws here; see the top of the file
            if (this._world._bounded) {
                x = Math.min(Math.max(x, 0), this._world._width - 1);
                y = Math.min(Math.max(y, 0), this._world._height - 1);
            }
            this._x = x;
            this._y = y;
        }
        move(distance) {
            var radians = (this._rotation * Math.PI) / 180;
            this.setLocation(this._x + Math.round(Math.cos(radians) * distance), this._y + Math.round(Math.sin(radians) * distance));
        }
        getImage() {
            return this._image;
        }
        setImage(image) {
            this._image = typeof image === 'string' ? new GreenfootImage(image) : image;
        }
        intersects(other) {
            return intersects(this, other);
        }
        getOneIntersectingObject(cls) {
            if (!this._world) return null;
            var objects = this._world._objects;
            for (var i = 0; i < objects.length; i++) {
                var other = objects[i];
                if (other !== this && (!cls || other instanceof cls) && intersects(this, other)) return other;
            }
            return null;
        }
        getIntersectingObjects(cls) {
            var self = this;
            return this._world ? this._world._objects.filter(function (other) {
                return other !== self && (!cls || other instanceof cls) && intersects(self, other);
            }) : [];
        }
    }

    // The four corners of an actor's image, turned with it about its location
    function corners(actor) {
        var w = actor._image.getWidth(), h = actor._image.getHeight();
        var left = -int(w / 2), top = -int(h / 2);
        var radians = (actor._rotation * Math.PI) / 180, cos = Math.cos(radians), sin = Math.sin(radians);
        return [[left, top], [left + w, top], [left + w, top + h], [left, top + h]].map(function (p) {
            return [actor._x + p[0] * cos - p[1] * sin, actor._y + p[0] * sin + p[1] * cos];
        });
    }

    // Separating axes: the shapes miss if, along one edge's normal, the other lies wholly to one side. Shapes that
    // only touch don't intersect, as Greenfoot's exclusive right and bottom edges have it.
    function separated(a, b) {
        for (var i = 0; i < 4; i++) {
            var p = a[i], q = a[(i + 1) % 4], nx = q[1] - p[1], ny = p[0] - q[0];
            var minA = Infinity, maxA = -Infinity, minB = Infinity, maxB = -Infinity;
            for (var j = 0; j < 4; j++) {
                var pa = a[j][0] * nx + a[j][1] * ny, pb = b[j][0] * nx + b[j][1] * ny;
                minA = Math.min(minA, pa);
                maxA = Math.max(maxA, pa);
                minB = Math.min(minB, pb);
                maxB = Math.max(maxB, pb);
            }
            if (maxA <= minB + 1e-9 || maxB <= minA + 1e-9) return true;
        }
        return false;
    }

    function intersects(a, b) {
        if (!a._image || !b._image) return false;
        var ca = corners(a), cb = corners(b);
        return !separated(ca, cb) && !separated(cb, ca);
    }

    class World {
        constructor(width, height, cellSize, bounded) {
            this._width = width;
            this._height = height;
            this._cellSize = cellSize;
            this._bounded = bounded === undefined ? true : bounded;
            this._objects = [];
            this._paintOrder = null;
            // A world with no image of its own is white
            this._background = new GreenfootImage(width * cellSize, height * cellSize);
            this._background.setColor(Color.WHITE);
            this._background.fill();
        }
        act() {}
        getWidth() {
            return this._width;
        }
        getHeight() {
            return this._height;
        }
        getCellSize() {
            return this._cellSize;
        }
        getBackground() {
            return this._background;
        }
        setBackground(image) {
            this._background = typeof image === 'string' ? new GreenfootImage(image) : image;
        }
        addObject(object, x, y) {
            if (object._world === this) return;
            if (object._world) object._world.removeObject(object);
            this._objects.push(object);
            object._world = this;
            object.setLocation(x, y);
            object.addedToWorld(this);
        }
        removeObject(object) {
            if (!object || object._world !== this) return;
            this._objects.splice(this._objects.indexOf(object), 1);
            object._world = null;
        }
        removeObjects(objects) {
            for (var i = 0; i < objects.length; i++) this.removeObject(objects[i]);
        }
        getObjects(cls) {
            return this._objects.filter(function (object) {
                return !cls || object instanceof cls;
            });
        }
        numberOfObjects() {
            return this._objects.length;
        }
        setPaintOrder() {
            this._paintOrder = Array.prototype.slice.call(arguments);
        }
    }

    // How far down an actor is painted: the place of its class, or its nearest listed superclass, in setPaintOrder's
    // list (0 is on top). Unlisted classes go under all of them.
    function paintRank(world, actor) {
        var order = world._paintOrder;
        if (!order) return 0;
        for (var proto = Object.getPrototypeOf(actor); proto && proto !== Actor.prototype; proto = Object.getPrototypeOf(proto)) {
            var index = order.indexOf(proto.constructor);
            if (index >= 0) return index;
        }
        return order.length;
    }

    // The mouse. Events gather in `next` and become `current` as each act cycle begins.
    function MouseInfo(x, y, button, actor) {
        this.x = x;
        this.y = y;
        this.button = button;
        this.actor = actor;
    }
    MouseInfo.prototype.getX = function () {
        return this.x;
    };
    MouseInfo.prototype.getY = function () {
        return this.y;
    };
    MouseInfo.prototype.getButton = function () {
        return this.button;
    };
    MouseInfo.prototype.getActor = function () {
        return this.actor;
    };

    function emptyMouse() {
        return { any: false, x: 0, y: 0, button: 0, moved: false, pressed: null, clicked: null };
    }
    var nextMouse = emptyMouse(), currentMouse = emptyMouse();

    // The topmost actor under a point, for mousePressed(actor) and mouseClicked(actor)
    function actorAt(world, x, y) {
        var hits = world._objects.filter(function (actor) {
            if (!actor._image) return false;
            var c = corners(actor), inside = true;
            for (var i = 0; i < 4 && inside; i++) {
                var p = c[i], q = c[(i + 1) % 4];
                inside = (q[0] - p[0]) * (y - p[1]) - (q[1] - p[1]) * (x - p[0]) >= 0;
            }
            return inside;
        });
        hits.sort(function (a, b) {
            return paintRank(world, a) - paintRank(world, b) || world._objects.indexOf(b) - world._objects.indexOf(a);
        });
        return hits[0] || null;
    }

    function mouseOn(event, object) {
        if (!event) return false;
        if (!object) return true;
        if (object instanceof World) return event.actor === null;
        return event.actor === object;
    }

    // Keys by Greenfoot's names, from KeyboardEvent.code so Shift doesn't change them
    var keysDown = {};
    var lastKey = null;
    function keyName(event) {
        var code = event.code;
        var named = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', Space: 'space', Enter: 'enter', Escape: 'escape', Tab: 'tab', Backspace: 'backspace', ShiftLeft: 'shift', ShiftRight: 'shift', ControlLeft: 'control', ControlRight: 'control', AltLeft: 'alt', AltRight: 'alt' };
        if (named[code]) return named[code];
        if (/^Key[A-Z]$/.test(code)) return code.slice(3).toLowerCase();
        if (/^Digit[0-9]$/.test(code)) return code.slice(5);
        if (/^F[0-9]+$/.test(code)) return code.toLowerCase();
        return (event.key || '').toLowerCase();
    }

    var world = null;
    var running = false;

    var Greenfoot = {
        getRandomNumber: function (limit) {
            return Math.floor(Math.random() * limit);
        },
        isKeyDown: function (name) {
            return !!keysDown[name.toLowerCase()];
        },
        getKey: function () {
            var key = lastKey;
            lastKey = null;
            return key;
        },
        setWorld: function (next) {
            world = next;
        },
        getMouseInfo: function () {
            var m = currentMouse;
            return m.any ? new MouseInfo(m.x, m.y, m.button, world ? actorAt(world, m.x, m.y) : null) : null;
        },
        mouseMoved: function (object) {
            return currentMouse.moved && mouseOn(currentMouse.movedAt, object);
        },
        mousePressed: function (object) {
            return mouseOn(currentMouse.pressed, object);
        },
        mouseClicked: function (object) {
            return mouseOn(currentMouse.clicked, object);
        },
        start: function () {
            running = true;
        },
        stop: function () {
            running = false;
        },
    };

    function actOnce() {
        currentMouse = nextMouse;
        nextMouse = emptyMouse();
        var acting = world;
        acting.act();
        var actors = acting._objects.slice();
        for (var i = 0; i < actors.length; i++) {
            if (actors[i]._world === acting) actors[i].act();
        }
    }

    function paint(ctx) {
        var cell = world._cellSize;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = 1;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(world._background.canvas, 0, 0);
        var objects = world._objects.slice();
        var ranks = new Map(objects.map(function (actor) {
            return [actor, paintRank(world, actor)];
        }));
        objects.sort(function (a, b) {
            return ranks.get(b) - ranks.get(a) || objects.indexOf(a) - objects.indexOf(b);
        });
        objects.forEach(function (actor) {
            var image = actor._image;
            if (!image) return;
            ctx.setTransform(1, 0, 0, 1, actor._x * cell + int(cell / 2), actor._y * cell + int(cell / 2));
            if (actor._rotation) ctx.rotate((actor._rotation * Math.PI) / 180);
            ctx.globalAlpha = image.transparency / 255;
            ctx.drawImage(image.canvas, -int(image.getWidth() / 2), -int(image.getHeight() / 2));
        });
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = 1;
    }

    // Runs a scenario on `canvas`. options: images (the folder, ending in /), classImages, world (a function that makes
    // the starting world), actsPerSecond, onError(error). Returns controls for the page: run, pause, reset, isRunning.
    function start(canvas, options) {
        Object.assign(classImages, options.classImages);
        var ctx = canvas.getContext('2d');
        var actMs = 1000 / options.actsPerSecond;
        var behind = 0, last = 0, failed = false;

        function where(event) {
            var box = canvas.getBoundingClientRect(), cell = world._cellSize;
            return {
                x: int(((event.clientX - box.left) * (canvas.width / box.width)) / cell),
                y: int(((event.clientY - box.top) * (canvas.height / box.height)) / cell),
            };
        }
        function record(event, kind) {
            if (!world) return;
            var p = where(event), m = nextMouse;
            var hit = { x: p.x, y: p.y, actor: actorAt(world, p.x, p.y) };
            m.any = true;
            m.x = p.x;
            m.y = p.y;
            m.button = event.button === 2 ? 3 : event.button === 1 ? 2 : 1;
            if (kind === 'moved') {
                m.moved = true;
                m.movedAt = hit;
            } else {
                m[kind] = hit;
            }
        }

        // A mouse aims by moving and shoots by pressing. A finger can't hover, so touching and dragging count as
        // moving, and lifting it counts as the press.
        canvas.addEventListener('pointerdown', function (event) {
            canvas.focus();
            if (event.pointerType === 'mouse') record(event, 'pressed');
            else {
                canvas.setPointerCapture(event.pointerId);
                record(event, 'moved');
            }
            event.preventDefault();
        });
        canvas.addEventListener('pointermove', function (event) {
            if (event.pointerType !== 'mouse' || !event.buttons) record(event, 'moved');
        });
        canvas.addEventListener('pointerup', function (event) {
            if (event.pointerType !== 'mouse') record(event, 'pressed');
            record(event, 'clicked');
        });
        canvas.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        });
        window.addEventListener('keydown', function (event) {
            var name = keyName(event);
            keysDown[name] = true;
            lastKey = name;
            if (['left', 'right', 'up', 'down', 'space'].indexOf(name) >= 0) event.preventDefault();
        });
        window.addEventListener('keyup', function (event) {
            keysDown[keyName(event)] = false;
        });
        window.addEventListener('blur', function () {
            keysDown = {};
        });

        function fail(error) {
            failed = true;
            running = false;
            if (options.onError) options.onError(error);
            else console.error(error);
        }

        function reset() {
            failed = false;
            nextMouse = emptyMouse();
            try {
                world = options.world();
            } catch (error) {
                fail(error);
            }
        }

        // Greenfoot's speed slider caps the act rate rather than setting it; run at that cap, catching up at most a
        // few acts after a slow frame and dropping the rest
        function frame(now) {
            if (running && !failed) {
                behind += Math.min(now - last, 250);
                for (var steps = 0; behind >= actMs && steps < 4; steps++) {
                    behind -= actMs;
                    try {
                        actOnce();
                    } catch (error) {
                        fail(error);
                        break;
                    }
                }
                if (behind >= actMs) behind = 0;
            } else {
                behind = 0;
            }
            last = now;
            if (world) paint(ctx);
            requestAnimationFrame(frame);
        }

        return loadImages(options.images, Object.keys(options.classImages).map(function (name) {
            return options.classImages[name];
        }).filter(function (name, i, all) {
            return all.indexOf(name) === i;
        })).then(function () {
            reset();
            requestAnimationFrame(function (now) {
                last = now;
                frame(now);
            });
            return {
                run: function () {
                    if (!failed) running = true;
                },
                pause: function () {
                    running = false;
                },
                reset: reset,
                isRunning: function () {
                    return running;
                },
            };
        });
    }

    global.greenfoot = { Actor: Actor, World: World, GreenfootImage: GreenfootImage, Greenfoot: Greenfoot, MouseInfo: MouseInfo, Color: Color, Font: Font, int: int, start: start };
})(window);
