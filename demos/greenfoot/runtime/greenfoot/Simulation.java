package greenfoot;

import java.io.OutputStream;
import java.io.PrintStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Runs the scenario: builds the world, acts at the scenario's speed on the browser's frame loop and paints the
 * world after each frame that changed it. The act cycle is Greenfoot's: the world acts, then each actor still in a
 * world, then keys pressed during the cycle are forgotten.
 */
public final class Simulation {
    /** The game's starting world, built again by Reset */
    public interface WorldFactory {
        World create();
    }

    /** project.greenfoot's class images, which an Actor or World without its own image starts with */
    private static final Map<String, String> classImageFiles = new HashMap<>();
    private static final Map<Class<?>, GreenfootImage> classImages = new HashMap<>();
    static final String LOGO = "<greenfoot-logo>";

    private static WorldFactory factory;
    private static World world;
    private static boolean running;
    private static boolean dirty = true;
    private static int speed;
    private static double delay;
    private static double last;
    private static double frameInterval = 1000 / 60.0;
    private static double budget;
    private static double sleepUntil;
    private static double now;

    // The mouse events of the last act cycle, as Greenfoot reports them
    static MouseEvent pressed, clicked, dragged, dragEnded, moved, latest;

    private Simulation() {
    }

    public static void setClassImage(String className, String file) {
        classImageFiles.put(className, file);
    }

    public static void start(WorldFactory worldFactory, int initialSpeed) {
        // The games' debug prints went to a Java console nobody saw; here they'd flood the browser's, every act
        System.setOut(new PrintStream(new OutputStream() {
            @Override
            public void write(int b) {
            }
        }));
        factory = worldFactory;
        setSpeed(initialSpeed);
        try {
            setWorld(factory.create());
        } catch (Throwable e) {
            fail(e);
            return;
        }
        setRunning(true);
        Host.exposeDump(Simulation::dumpWorld);
        Host.run(Simulation::frame);
    }

    /** One line per actor, in the order added: class, cell, image size and rotation */
    private static String dumpWorld() {
        StringBuilder out = new StringBuilder(world.getClass().getName()).append('\n');
        for (Actor actor : world.actors()) {
            GreenfootImage image = actor.getImage();
            out.append(actor.getClass().getName()).append(' ').append(actor.x).append(',').append(actor.y);
            if (image != null) {
                out.append(' ').append(image.getWidth()).append('x').append(image.getHeight());
            }
            if (actor.rotation != 0) {
                out.append(" r").append(actor.rotation);
            }
            out.append('\n');
        }
        return out.toString();
    }

    static GreenfootImage classImage(Class<?> cls) {
        if (classImages.containsKey(cls)) {
            return classImages.get(cls);
        }
        GreenfootImage image = null;
        for (Class<?> c = cls; c != null && c != Actor.class && c != World.class && c != Object.class; c = c.getSuperclass()) {
            String file = classImageFiles.get(c.getName());
            if (file != null) {
                image = new GreenfootImage(file);
                break;
            }
        }
        if (image == null && Actor.class.isAssignableFrom(cls)) {
            image = new GreenfootImage(LOGO);
        }
        classImages.put(cls, image);
        return image;
    }

    static boolean isInstance(Class<?> cls, Object object) {
        return cls == null || cls.isInstance(object);
    }

    static void setWorld(World newWorld) {
        if (newWorld == null || newWorld == world) {
            return;
        }
        World old = world;
        world = newWorld;
        dirty = true;
        if (running && old != null) {
            old.stopped();
            newWorld.started();
        }
    }

    static World world() {
        return world;
    }

    static void setSpeed(int newSpeed) {
        speed = Math.max(0, Math.min(100, newSpeed));
        // Greenfoot's Simulation.calculateDelay, in milliseconds: speed 50 acts every 16.2 ms
        long steps = 100 - speed;
        double base = Math.pow(10_000_000_000.0 / 30_000, 1 / 99.0);
        delay = steps > 0 ? Math.pow(base, steps - 1) * 30_000 / 1e6 : 0;
    }

    static void setRunning(boolean run) {
        if (run == running) {
            return;
        }
        running = run;
        budget = 0;
        last = 0;
        Host.setRunning(run);
        if (world != null) {
            try {
                if (run) {
                    world.started();
                } else {
                    world.stopped();
                }
            } catch (Throwable e) {
                fail(e);
            }
        }
    }

    static void delay(int cycles) {
        sleepUntil = Math.max(sleepUntil, now) + cycles * Math.max(delay, frameInterval);
    }

    private static void frame(double time) {
        if (last > 0) {
            double elapsed = time - last;
            frameInterval += (Math.min(elapsed, 100) - frameInterval) * 0.05;
        }
        now = time;
        if (Host.resetRequested()) {
            reset();
        }
        if (Host.runToggleRequested()) {
            setRunning(!running);
        }
        if (running && world != null) {
            runActs(time);
        }
        last = time;
        if (dirty) {
            dirty = false;
            paint();
        }
    }

    private static void runActs(double time) {
        if (time < sleepUntil) {
            return;
        }
        int acts;
        if (Math.abs(delay - frameInterval) < frameInterval * 0.1) {
            // Close enough to the display's own rate to act once a frame, which moves things more evenly
            acts = 1;
        } else {
            budget += last > 0 ? Math.min(time - last, 250) : delay;
            acts = delay > 0 ? (int) (budget / delay) : 1;
            budget -= acts * delay;
            // Catch up on a slow frame, but not on a long stall (a hidden tab, say), which would fast-forward the game
            acts = Math.min(acts, 8);
        }
        for (int i = 0; i < acts && running && time >= sleepUntil; i++) {
            actOnce();
        }
    }

    private static void actOnce() {
        World current = world;
        takeMouseEvents(current);
        try {
            current.act();
            List<Actor> actors = current.inActOrder();
            for (Actor actor : actors) {
                if (actor.world != null) {
                    actor.act();
                }
            }
        } catch (Throwable e) {
            fail(e);
        }
        Host.clearLatchedKeys();
        dirty = true;
    }

    private static void reset() {
        try {
            World fresh = factory.create();
            boolean wasRunning = running;
            setRunning(false);
            world = fresh;
            setRunning(wasRunning);
            dirty = true;
        } catch (Throwable e) {
            fail(e);
        }
    }

    private static void fail(Throwable e) {
        e.printStackTrace();
        setRunning(false);
        Host.error(e.getClass().getName() + (e.getMessage() == null ? "" : ": " + e.getMessage()));
    }

    private static void paint() {
        World w = world;
        if (w == null) {
            return;
        }
        GreenfootImage background = w.backgroundOrNull();
        Host.beginPaint(w.getWidthInPixels(), w.getHeightInPixels(), background == null ? null : background.handle());
        int cell = w.getCellSize();
        for (Actor actor : w.inPaintOrder()) {
            GreenfootImage image = actor.getImage();
            if (image != null) {
                Host.paintActor(image.handle(), actor.x * cell + cell / 2.0, actor.y * cell + cell / 2.0, actor.rotation, image.alpha());
            }
        }
        for (Object[] label : w.texts) {
            Host.paintText((String) label[0], (Integer) label[1] * cell + cell / 2, (Integer) label[2] * cell + cell / 2);
        }
    }

    // The mouse

    static final class MouseEvent {
        final int x, y, button, clicks;
        final Actor actor;

        MouseEvent(int x, int y, int button, int clicks, Actor actor) {
            this.x = x;
            this.y = y;
            this.button = button;
            this.clicks = clicks;
            this.actor = actor;
        }
    }

    private static void takeMouseEvents(World w) {
        pressed = clicked = dragged = dragEnded = moved = null;
        int[] events = Host.takeMouseEvents();
        int cell = w.getCellSize();
        for (int i = 0; i + 4 < events.length; i += 5) {
            int px = events[i + 1], py = events[i + 2];
            MouseEvent event = new MouseEvent(px / cell, py / cell, events[i + 3], events[i + 4], topActorAt(w, px, py));
            switch (events[i]) {
                case 1:
                    pressed = event;
                    break;
                case 2:
                    clicked = event;
                    break;
                case 3:
                    moved = event;
                    break;
                case 4:
                    dragged = event;
                    break;
                case 5:
                    dragEnded = event;
                    break;
                default:
                    break;
            }
            latest = event;
        }
    }

    private static Actor topActorAt(World w, int px, int py) {
        List<Actor> actors = w.inPaintOrder();
        for (int i = actors.size() - 1; i >= 0; i--) {
            Actor actor = actors.get(i);
            if (actor.getImage() != null && actor.containsPoint(px, py)) {
                return actor;
            }
        }
        return null;
    }

    /** Greenfoot's rule for whose event it was: null means anyone's, the world means the background's */
    static boolean matches(MouseEvent event, Object target) {
        if (event == null) {
            return false;
        }
        if (target == null) {
            return true;
        }
        if (target instanceof World) {
            return event.actor == null;
        }
        return event.actor == target;
    }
}
