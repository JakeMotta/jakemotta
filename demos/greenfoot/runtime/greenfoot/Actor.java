package greenfoot;

import java.util.ArrayList;
import java.util.List;

/**
 * Greenfoot's Actor. Locations, bounds and collisions follow Greenfoot 3.0.4's own Actor: an actor's image is
 * centred on its cell, its bounding box is the image's (turned with it), and two actors touch when their boxes
 * overlap.
 */
public abstract class Actor {
    int x;
    int y;
    int rotation;
    World world;
    int paintRank;
    int actRank;
    private GreenfootImage image;

    public Actor() {
        GreenfootImage classImage = Simulation.classImage(getClass());
        setImage(classImage == null ? null : new GreenfootImage(classImage));
    }

    public void act() {
    }

    protected void addedToWorld(World world) {
    }

    public int getX() {
        failIfNotInWorld();
        return x;
    }

    public int getY() {
        failIfNotInWorld();
        return y;
    }

    public int getRotation() {
        return rotation;
    }

    public void setRotation(int r) {
        r %= 360;
        if (r < 0) {
            r += 360;
        }
        rotation = r;
    }

    public void turn(int amount) {
        setRotation(rotation + amount);
    }

    public void turnTowards(int tx, int ty) {
        failIfNotInWorld();
        setRotation((int) Math.toDegrees(Math.atan2(ty - y, tx - x)));
    }

    public void move(int distance) {
        double radians = Math.toRadians(rotation);
        int dx = (int) Math.round(Math.cos(radians) * distance);
        int dy = (int) Math.round(Math.sin(radians) * distance);
        setLocation(x + dx, y + dy);
    }

    public boolean isAtEdge() {
        failIfNotInWorld();
        return x <= 0 || y <= 0 || x >= world.getWidth() - 1 || y >= world.getHeight() - 1;
    }

    public void setLocation(int newX, int newY) {
        failIfNotInWorld();
        if (world.isBounded()) {
            newX = Math.max(0, Math.min(world.getWidth() - 1, newX));
            newY = Math.max(0, Math.min(world.getHeight() - 1, newY));
        }
        x = newX;
        y = newY;
    }

    public World getWorld() {
        return world;
    }

    @SuppressWarnings("unchecked")
    public <W> W getWorldOfType(Class<W> type) {
        return (W) world;
    }

    public GreenfootImage getImage() {
        return image;
    }

    public void setImage(String filename) {
        setImage(new GreenfootImage(filename));
    }

    public void setImage(GreenfootImage image) {
        this.image = image;
    }

    private void failIfNotInWorld() {
        if (world == null) {
            throw new IllegalStateException("Actor not in world. An attempt was made to use the actor's location while it is not in the world. "
                    + "Either it has not yet been inserted, or it has been removed.");
        }
    }

    // Bounds, in world pixels: the four corners of the image as drawn

    private double[] corners() {
        int cell = world.getCellSize();
        if (image == null) {
            double cx = x * cell + cell / 2;
            double cy = y * cell + cell / 2;
            return new double[] { cx, cy, cx, cy, cx, cy, cx, cy };
        }
        int w = image.getWidth();
        int h = image.getHeight();
        if (rotation % 90 == 0) {
            if (rotation % 180 != 0) {
                int t = w;
                w = h;
                h = t;
            }
            // Greenfoot's own integer arithmetic, so the boxes come out on the same pixels
            int left = cell * x + (cell - w - 1) / 2;
            int top = cell * y + (cell - h - 1) / 2;
            return new double[] { left, top, left + w, top, left + w, top + h, left, top + h };
        }
        double cx = x * cell + cell / 2.0;
        double cy = y * cell + cell / 2.0;
        double radians = Math.toRadians(rotation);
        double cos = Math.cos(radians);
        double sin = Math.sin(radians);
        double[] result = new double[8];
        double[] dx = { -w / 2.0, w / 2.0, w / 2.0, -w / 2.0 };
        double[] dy = { -h / 2.0, -h / 2.0, h / 2.0, h / 2.0 };
        for (int i = 0; i < 4; i++) {
            result[i * 2] = cx + dx[i] * cos - dy[i] * sin;
            result[i * 2 + 1] = cy + dx[i] * sin + dy[i] * cos;
        }
        return result;
    }

    protected boolean intersects(Actor other) {
        double[] a = corners();
        double[] b = other.corners();
        if (rotation % 90 == 0 && other.rotation % 90 == 0) {
            // Rect.intersects: right and bottom edges are exclusive
            return b[0] < a[2] && a[0] < b[2] && b[1] < a[5] && a[1] < b[5];
        }
        return !separated(a, b) && !separated(b, a);
    }

    private static boolean separated(double[] a, double[] b) {
        for (int i = 0; i < 4; i++) {
            int j = (i + 1) % 4;
            double nx = a[j * 2 + 1] - a[i * 2 + 1];
            double ny = a[i * 2] - a[j * 2];
            double minA = Double.MAX_VALUE, maxA = -Double.MAX_VALUE, minB = Double.MAX_VALUE, maxB = -Double.MAX_VALUE;
            for (int k = 0; k < 4; k++) {
                double pa = a[k * 2] * nx + a[k * 2 + 1] * ny;
                double pb = b[k * 2] * nx + b[k * 2 + 1] * ny;
                minA = Math.min(minA, pa);
                maxA = Math.max(maxA, pa);
                minB = Math.min(minB, pb);
                maxB = Math.max(maxB, pb);
            }
            if (maxA <= minB || maxB <= minA) {
                return true;
            }
        }
        return false;
    }

    /** Whether the image covers the given world pixel */
    boolean containsPoint(double px, double py) {
        double[] c = corners();
        if (rotation % 90 == 0) {
            return px >= c[0] && px < c[2] && py >= c[1] && py < c[5];
        }
        boolean inside = false;
        for (int i = 0, j = 3; i < 4; j = i++) {
            double xi = c[i * 2], yi = c[i * 2 + 1], xj = c[j * 2], yj = c[j * 2 + 1];
            if ((yi > py) != (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) {
                inside = !inside;
            }
        }
        return inside;
    }

    @SuppressWarnings("unchecked")
    protected <A> List<A> getIntersectingObjects(Class<A> cls) {
        failIfNotInWorld();
        List<A> result = new ArrayList<>();
        for (Actor actor : world.actors()) {
            if (actor != this && Simulation.isInstance(cls, actor) && intersects(actor)) {
                result.add((A) actor);
            }
        }
        return result;
    }

    protected Actor getOneIntersectingObject(Class<?> cls) {
        failIfNotInWorld();
        for (Actor actor : world.actors()) {
            if (actor != this && Simulation.isInstance(cls, actor) && intersects(actor)) {
                return actor;
            }
        }
        return null;
    }

    protected boolean isTouching(Class<?> cls) {
        return getOneIntersectingObject(cls) != null;
    }

    protected void removeTouching(Class<?> cls) {
        Actor actor = getOneIntersectingObject(cls);
        if (actor != null) {
            world.removeObject(actor);
        }
    }

    @SuppressWarnings("unchecked")
    protected <A> List<A> getObjectsAtOffset(int dx, int dy, Class<A> cls) {
        failIfNotInWorld();
        List<A> result = new ArrayList<>();
        for (Actor actor : world.objectsAtCell(x + dx, y + dy)) {
            if (actor != this && Simulation.isInstance(cls, actor)) {
                result.add((A) actor);
            }
        }
        return result;
    }

    protected Actor getOneObjectAtOffset(int dx, int dy, Class<?> cls) {
        failIfNotInWorld();
        for (Actor actor : world.objectsAtCell(x + dx, y + dy)) {
            if (actor != this && Simulation.isInstance(cls, actor)) {
                return actor;
            }
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    protected <A> List<A> getObjectsInRange(int radius, Class<A> cls) {
        failIfNotInWorld();
        List<A> result = new ArrayList<>();
        for (Actor actor : world.actors()) {
            if (actor != this && Simulation.isInstance(cls, actor)) {
                long ddx = actor.x - x;
                long ddy = actor.y - y;
                if (ddx * ddx + ddy * ddy <= (long) radius * radius) {
                    result.add((A) actor);
                }
            }
        }
        return result;
    }

    @SuppressWarnings("unchecked")
    protected <A> List<A> getNeighbours(int distance, boolean diagonal, Class<A> cls) {
        failIfNotInWorld();
        List<A> result = new ArrayList<>();
        for (Actor actor : world.actors()) {
            if (actor == this || !Simulation.isInstance(cls, actor)) {
                continue;
            }
            int ddx = Math.abs(actor.x - x);
            int ddy = Math.abs(actor.y - y);
            boolean near = diagonal ? Math.max(ddx, ddy) <= distance : ddx + ddy <= distance;
            if (near) {
                result.add((A) actor);
            }
        }
        return result;
    }
}
