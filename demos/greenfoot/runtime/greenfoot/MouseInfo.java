package greenfoot;

/** Where the mouse was in the last act cycle's latest event, in cells */
public class MouseInfo {
    private final Simulation.MouseEvent event;

    MouseInfo(Simulation.MouseEvent event) {
        this.event = event;
    }

    public Actor getActor() {
        return event.actor;
    }

    public int getX() {
        return event.x;
    }

    public int getY() {
        return event.y;
    }

    public int getButton() {
        return event.button;
    }

    public int getClickCount() {
        return event.clicks;
    }

    @Override
    public String toString() {
        return "MouseInfo. Actor: " + event.actor + "  Location: (" + event.x + "," + event.y + ")  Button: " + event.button + " Click Count: " + event.clicks;
    }
}
