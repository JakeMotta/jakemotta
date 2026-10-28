package greenfoot;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Greenfoot's World. Actors are kept in the order they were added, which is the order they act in and are painted
 * in (later on top) unless setActOrder or setPaintOrder say otherwise, as in Greenfoot.
 */
public abstract class World {
    private final int width;
    private final int height;
    private final int cellSize;
    private final boolean bounded;
    private final List<Actor> actors = new ArrayList<>();
    /** The actors of each class asked about, rebuilt after any add or remove (see actorsOf) */
    private final Map<Class<?>, List<Actor>> byClass = new HashMap<>();
    private GreenfootImage background;
    private Class<?>[] paintOrder;
    private Class<?>[] actOrder;
    private final Map<Class<?>, Integer> paintRanks = new HashMap<>();
    private final Map<Class<?>, Integer> actRanks = new HashMap<>();
    final List<Object[]> texts = new ArrayList<>();

    public World(int worldWidth, int worldHeight, int cellSize) {
        this(worldWidth, worldHeight, cellSize, true);
    }

    public World(int worldWidth, int worldHeight, int cellSize, boolean bounded) {
        this.width = worldWidth;
        this.height = worldHeight;
        this.cellSize = cellSize;
        this.bounded = bounded;
        GreenfootImage classImage = Simulation.classImage(getClass());
        if (classImage != null) {
            setBackground(new GreenfootImage(classImage));
        }
    }

    public void act() {
    }

    public void started() {
    }

    public void stopped() {
    }

    public final void setBackground(GreenfootImage image) {
        if (image != null && (image.getWidth() < getWidthInPixels() || image.getHeight() < getHeightInPixels())) {
            // Smaller than the world: tiled, on white
            GreenfootImage tiled = new GreenfootImage(getWidthInPixels(), getHeightInPixels());
            tiled.setColor(Color.WHITE);
            tiled.fill();
            for (int x = 0; x < getWidthInPixels(); x += image.getWidth()) {
                for (int y = 0; y < getHeightInPixels(); y += image.getHeight()) {
                    tiled.drawImage(image, x, y);
                }
            }
            background = tiled;
        } else {
            background = image;
        }
    }

    public final void setBackground(String filename) {
        setBackground(new GreenfootImage(filename));
    }

    public GreenfootImage getBackground() {
        if (background == null) {
            background = new GreenfootImage(getWidthInPixels(), getHeightInPixels());
        }
        return background;
    }

    GreenfootImage backgroundOrNull() {
        return background;
    }

    public Color getColorAt(int x, int y) {
        return getBackground().getColorAt(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
    }

    public int getWidth() {
        return width;
    }

    public int getHeight() {
        return height;
    }

    public int getCellSize() {
        return cellSize;
    }

    int getWidthInPixels() {
        return width * cellSize;
    }

    int getHeightInPixels() {
        return height * cellSize;
    }

    boolean isBounded() {
        return bounded;
    }

    public void setPaintOrder(Class<?>... classes) {
        paintOrder = classes;
        paintRanks.clear();
    }

    public void setActOrder(Class<?>... classes) {
        actOrder = classes;
        actRanks.clear();
    }

    public void addObject(Actor object, int x, int y) {
        if (object.world != null) {
            if (object.world == this) {
                return;
            }
            object.world.removeObject(object);
        }
        if (bounded) {
            x = Math.max(0, Math.min(width - 1, x));
            y = Math.max(0, Math.min(height - 1, y));
        }
        object.x = x;
        object.y = y;
        object.world = this;
        actors.add(object);
        byClass.clear();
        object.addedToWorld(this);
    }

    public void removeObject(Actor object) {
        if (object == null || object.world != this) {
            return;
        }
        actors.remove(object);
        byClass.clear();
        object.world = null;
    }

    public void removeObjects(Collection<? extends Actor> objects) {
        for (Actor actor : new ArrayList<Actor>(objects)) {
            removeObject(actor);
        }
    }

    @SuppressWarnings("unchecked")
    public <A> List<A> getObjects(Class<A> cls) {
        return new ArrayList<>((List<A>) actorsOf(cls));
    }

    /**
     * The actors that are instances of cls (all of them for null), in the order they were added. Greenfoot looks
     * collisions up in a spatial tree; here a query for one class only tests that class's actors, which is what keeps
     * Pokémon's town (742 patches of grass, each asking every act whether Ash is on it) cheap. The list is shared:
     * don't change it. An add or remove makes a new one, so a caller looping over the old one is safe.
     */
    List<Actor> actorsOf(Class<?> cls) {
        if (cls == null) {
            return actors;
        }
        List<Actor> list = byClass.get(cls);
        if (list == null) {
            list = new ArrayList<>();
            for (Actor actor : actors) {
                if (cls.isInstance(actor)) {
                    list.add(actor);
                }
            }
            byClass.put(cls, list);
        }
        return list;
    }

    @SuppressWarnings("unchecked")
    public <A> List<A> getObjectsAt(int x, int y, Class<A> cls) {
        return (List<A>) objectsAtCell(x, y, cls);
    }

    /** The actors of a class whose images cover a cell's centre, as Greenfoot's point lookup does */
    List<Actor> objectsAtCell(int x, int y, Class<?> cls) {
        double px = x * cellSize + cellSize / 2;
        double py = y * cellSize + cellSize / 2;
        List<Actor> result = new ArrayList<>();
        for (Actor actor : actorsOf(cls)) {
            if (actor.containsPoint(px, py)) {
                result.add(actor);
            }
        }
        return result;
    }

    public int numberOfObjects() {
        return actors.size();
    }

    public void repaint() {
    }

    public void showText(String text, int x, int y) {
        for (int i = 0; i < texts.size(); i++) {
            Object[] label = texts.get(i);
            if ((Integer) label[1] == x && (Integer) label[2] == y) {
                texts.remove(i);
                break;
            }
        }
        if (text != null && !text.isEmpty()) {
            texts.add(new Object[] { text, x, y });
        }
    }

    List<Actor> actors() {
        return actors;
    }

    /** The actors in the order they act: by setActOrder's classes, then the rest, each group in the order added */
    List<Actor> inActOrder() {
        List<Actor> result = new ArrayList<>(actors);
        if (actOrder != null) {
            for (Actor actor : result) {
                actor.actRank = rank(actOrder, actRanks, actor);
            }
            // A stable sort, so each group keeps the order its actors were added in
            result.sort((a, b) -> Integer.compare(a.actRank, b.actRank));
        }
        return result;
    }

    /** The actors bottom to top: classes missing from setPaintOrder at the bottom, its first class on top */
    List<Actor> inPaintOrder() {
        List<Actor> result = new ArrayList<>(actors);
        if (paintOrder != null) {
            for (Actor actor : result) {
                actor.paintRank = rank(paintOrder, paintRanks, actor);
            }
            result.sort((a, b) -> Integer.compare(b.paintRank, a.paintRank));
        }
        return result;
    }

    private static int rank(Class<?>[] order, Map<Class<?>, Integer> cache, Actor actor) {
        Integer cached = cache.get(actor.getClass());
        if (cached == null) {
            cached = order.length;
            for (int i = 0; i < order.length; i++) {
                if (Simulation.isInstance(order[i], actor)) {
                    cached = i;
                    break;
                }
            }
            cache.put(actor.getClass(), cached);
        }
        return cached;
    }
}
