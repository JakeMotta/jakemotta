package greenfoot;

import org.teavm.jso.JSObject;

/** A sound file, played through an <audio> element that host.js streams from the game's sounds folder */
public class GreenfootSound {
    private final String filename;
    private final JSObject sound;
    private int volume = 100;

    public GreenfootSound(String filename) {
        this.filename = filename;
        this.sound = Host.sound(filename);
    }

    public void play() {
        if (sound != null) {
            Host.playSound(sound, false);
        }
    }

    public void playLoop() {
        if (sound != null) {
            Host.playSound(sound, true);
        }
    }

    public void stop() {
        if (sound != null) {
            Host.stopSound(sound, true);
        }
    }

    public void pause() {
        if (sound != null) {
            Host.stopSound(sound, false);
        }
    }

    public boolean isPlaying() {
        return sound != null && Host.isSoundPlaying(sound);
    }

    public int getVolume() {
        return volume;
    }

    public void setVolume(int level) {
        volume = Math.max(0, Math.min(100, level));
        if (sound != null) {
            Host.setSoundVolume(sound, volume);
        }
    }

    @Override
    public String toString() {
        return "GreenfootSound: " + filename;
    }
}
