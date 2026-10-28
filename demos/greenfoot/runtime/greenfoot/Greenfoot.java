package greenfoot;

import java.util.Random;

/** Greenfoot's static helpers: the world, the speed, keys, the mouse, random numbers and sounds */
public class Greenfoot {
    private static final Random random = new Random();

    public static void setWorld(World world) {
        Simulation.setWorld(world);
    }

    public static String getKey() {
        return Host.getKey();
    }

    public static boolean isKeyDown(String keyName) {
        return keyName != null && Host.isKeyDown(keyName.toLowerCase());
    }

    public static void delay(int time) {
        Simulation.delay(time);
    }

    public static void setSpeed(int speed) {
        Simulation.setSpeed(speed);
    }

    public static void stop() {
        Simulation.setRunning(false);
    }

    public static void start() {
        Simulation.setRunning(true);
    }

    public static int getRandomNumber(int limit) {
        return random.nextInt(limit);
    }

    public static void playSound(String soundFile) {
        new GreenfootSound(soundFile).play();
    }

    public static boolean mousePressed(Object obj) {
        return Simulation.matches(Simulation.pressed, obj);
    }

    public static boolean mouseClicked(Object obj) {
        return Simulation.matches(Simulation.clicked, obj);
    }

    public static boolean mouseDragged(Object obj) {
        return Simulation.matches(Simulation.dragged, obj);
    }

    public static boolean mouseDragEnded(Object obj) {
        return Simulation.matches(Simulation.dragEnded, obj);
    }

    public static boolean mouseMoved(Object obj) {
        return Simulation.matches(Simulation.moved, obj);
    }

    public static MouseInfo getMouseInfo() {
        return Simulation.latest == null ? null : new MouseInfo(Simulation.latest);
    }

    public static int getMicLevel() {
        return 0;
    }

    public static String ask(String prompt) {
        return null;
    }
}
