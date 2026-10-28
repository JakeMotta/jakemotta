package greenfoot;

import org.teavm.jso.JSBody;
import org.teavm.jso.JSFunctor;
import org.teavm.jso.JSObject;

/**
 * The calls into host.js (window.GF), which does everything that touches the browser: canvases, images, input,
 * sound and the frame loop. Images are passed around as opaque handles (an <img> or a <canvas>).
 */
final class Host {
    private Host() {
    }

    @JSFunctor
    interface FrameCallback extends JSObject {
        void frame(double now);
    }

    @JSBody(params = { "callback" }, script = "GF.run(callback);")
    static native void run(FrameCallback callback);

    @JSFunctor
    interface DumpCallback extends JSObject {
        String dump();
    }

    /** GF.dumpWorld() in the console lists the world's actors, for debugging a port */
    @JSBody(params = { "callback" }, script = "GF.dumpWorld = callback;")
    static native void exposeDump(DumpCallback callback);

    @JSBody(params = { "message" }, script = "GF.error(message);")
    static native void error(String message);

    @JSBody(params = { "running" }, script = "GF.setRunning(running);")
    static native void setRunning(boolean running);

    @JSBody(script = "return GF.resetRequested();")
    static native boolean resetRequested();

    @JSBody(script = "return GF.runToggleRequested();")
    static native boolean runToggleRequested();

    // Images

    @JSBody(params = { "name" }, script = "return GF.image(name);")
    static native JSObject image(String name);

    @JSBody(params = { "width", "height" }, script = "return GF.canvas(width, height);")
    static native JSObject canvas(int width, int height);

    @JSBody(params = { "image" }, script = "return GF.copy(image);")
    static native JSObject copy(JSObject image);

    @JSBody(params = { "image" }, script = "return image.width;")
    static native int width(JSObject image);

    @JSBody(params = { "image" }, script = "return image.height;")
    static native int height(JSObject image);

    @JSBody(params = { "image", "width", "height" }, script = "return GF.scaled(image, width, height);")
    static native JSObject scaled(JSObject image, int width, int height);

    @JSBody(params = { "image", "degrees" }, script = "return GF.rotated(image, degrees);")
    static native JSObject rotated(JSObject image, int degrees);

    @JSBody(params = { "image", "horizontal" }, script = "return GF.mirrored(image, horizontal);")
    static native JSObject mirrored(JSObject image, boolean horizontal);

    @JSBody(params = { "target", "image", "x", "y", "alpha" }, script = "GF.drawImage(target, image, x, y, alpha);")
    static native void drawImage(JSObject target, JSObject image, int x, int y, double alpha);

    @JSBody(params = { "target", "color", "font", "shape", "args" }, script = "GF.draw(target, color, font, shape, args);")
    static native void draw(JSObject target, String color, String font, String shape, double[] args);

    @JSBody(params = { "target", "color", "font", "text", "x", "y" }, script = "GF.drawString(target, color, font, text, x, y);")
    static native void drawString(JSObject target, String color, String font, String text, int x, int y);

    @JSBody(params = { "font", "text" }, script = "return GF.textWidth(font, text);")
    static native int textWidth(String font, String text);

    @JSBody(params = { "target" }, script = "GF.clear(target);")
    static native void clear(JSObject target);

    @JSBody(params = { "image", "x", "y" }, script = "return GF.getPixel(image, x, y);")
    static native int getPixel(JSObject image, int x, int y);

    @JSBody(params = { "target", "x", "y", "argb" }, script = "GF.setPixel(target, x, y, argb);")
    static native void setPixel(JSObject target, int x, int y, int argb);

    // The screen

    @JSBody(params = { "width", "height", "background" }, script = "GF.beginPaint(width, height, background);")
    static native void beginPaint(int width, int height, JSObject background);

    @JSBody(params = { "image", "x", "y", "rotation", "alpha" }, script = "GF.paintActor(image, x, y, rotation, alpha);")
    static native void paintActor(JSObject image, double x, double y, int rotation, double alpha);

    @JSBody(params = { "text", "x", "y" }, script = "GF.paintText(text, x, y);")
    static native void paintText(String text, int x, int y);

    // Input

    @JSBody(params = { "key" }, script = "return GF.isKeyDown(key);")
    static native boolean isKeyDown(String key);

    @JSBody(script = "return GF.getKey();")
    static native String getKey();

    @JSBody(script = "GF.clearLatchedKeys();")
    static native void clearLatchedKeys();

    /** Mouse events since the last call, five numbers each: type, x, y, button, click count. */
    @JSBody(script = "return GF.takeMouseEvents();")
    static native int[] takeMouseEvents();

    // Sound

    @JSBody(params = { "name" }, script = "return GF.sound(name);")
    static native JSObject sound(String name);

    @JSBody(params = { "sound", "loop" }, script = "GF.playSound(sound, loop);")
    static native void playSound(JSObject sound, boolean loop);

    @JSBody(params = { "sound", "rewind" }, script = "GF.stopSound(sound, rewind);")
    static native void stopSound(JSObject sound, boolean rewind);

    @JSBody(params = { "sound" }, script = "return GF.isSoundPlaying(sound);")
    static native boolean isSoundPlaying(JSObject sound);

    @JSBody(params = { "sound", "volume" }, script = "GF.setSoundVolume(sound, volume);")
    static native void setSoundVolume(JSObject sound, int volume);
}
