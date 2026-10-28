package greenfoot;

import org.teavm.jso.JSObject;

/**
 * An image: a handle on a loaded <img> or on a <canvas>. Copies share their handle until one of them is drawn on
 * (copy on write, as in Greenfoot), so the many images the games copy each act cost nothing until they change.
 */
public class GreenfootImage {
    private static final Font DEFAULT_FONT = new Font("Dialog", Font.PLAIN, 12);

    private JSObject handle;
    /** True when handle is a canvas no other image shares, so it can be drawn on in place */
    private boolean owned;
    private Color color = Color.BLACK;
    private Font font = DEFAULT_FONT;
    private int transparency = 255;
    private final String fileName;

    public GreenfootImage(String filename) {
        if (filename == null) {
            throw new NullPointerException("Filename must not be null.");
        }
        handle = Host.image(filename);
        if (handle == null) {
            throw new IllegalArgumentException("Could not find file: " + filename);
        }
        fileName = filename;
    }

    public GreenfootImage(int width, int height) {
        if (width <= 0 || height <= 0) {
            throw new IllegalArgumentException("Image dimensions must be greater than zero; got " + width + "x" + height);
        }
        handle = Host.canvas(width, height);
        owned = true;
        fileName = null;
    }

    public GreenfootImage(GreenfootImage image) {
        if (image == null) {
            throw new IllegalArgumentException("Image must not be null.");
        }
        handle = image.handle;
        image.owned = false;
        color = image.color;
        font = image.font;
        transparency = image.transparency;
        fileName = image.fileName;
    }

    public GreenfootImage(String string, int size, Color foreground, Color background) {
        this(string, size, foreground, background, null);
    }

    public GreenfootImage(String string, int size, Color foreground, Color background, Color outline) {
        String[] lines = string.replace("\r", "").split("\n", -1);
        Font textFont = new Font("SansSerif", Font.PLAIN, size);
        String css = textFont.toCss();
        int lineHeight = Math.max(1, (int) Math.ceil(size * 1.2));
        int width = 1;
        for (String line : lines) {
            width = Math.max(width, Host.textWidth(css, line));
        }
        handle = Host.canvas(width, lineHeight * lines.length);
        owned = true;
        fileName = null;
        font = textFont;
        if (background != null) {
            color = background;
            fill();
        }
        for (int i = 0; i < lines.length; i++) {
            int x = (width - Host.textWidth(css, lines[i])) / 2;
            int y = i * lineHeight + Math.round(size * 0.95f);
            if (outline != null) {
                for (int dx = -1; dx <= 1; dx++) {
                    for (int dy = -1; dy <= 1; dy++) {
                        if (dx != 0 || dy != 0) {
                            Host.drawString(handle, outline.toCss(), css, lines[i], x + dx, y + dy);
                        }
                    }
                }
            }
            Host.drawString(handle, foreground == null ? Color.BLACK.toCss() : foreground.toCss(), css, lines[i], x, y);
        }
        color = foreground == null ? Color.BLACK : foreground;
    }

    JSObject handle() {
        return handle;
    }

    double alpha() {
        return transparency / 255.0;
    }

    private JSObject writable() {
        if (!owned) {
            handle = Host.copy(handle);
            owned = true;
        }
        return handle;
    }

    public int getWidth() {
        return Host.width(handle);
    }

    public int getHeight() {
        return Host.height(handle);
    }

    public void rotate(int degrees) {
        handle = Host.rotated(handle, degrees);
        owned = true;
    }

    public void scale(int width, int height) {
        if (width == getWidth() && height == getHeight()) {
            return;
        }
        handle = Host.scaled(handle, width, height);
        owned = true;
    }

    public void mirrorVertically() {
        handle = Host.mirrored(handle, false);
        owned = true;
    }

    public void mirrorHorizontally() {
        handle = Host.mirrored(handle, true);
        owned = true;
    }

    public void fill() {
        fillRect(0, 0, getWidth(), getHeight());
    }

    public void drawImage(GreenfootImage image, int x, int y) {
        Host.drawImage(writable(), image.handle, x, y, image.alpha());
    }

    public void setFont(Font f) {
        font = f;
    }

    public Font getFont() {
        return font;
    }

    public void setColor(Color c) {
        color = c;
    }

    public Color getColor() {
        return color;
    }

    public Color getColorAt(int x, int y) {
        checkInside(x, y);
        return Color.fromArgb(Host.getPixel(handle, x, y));
    }

    public void setColorAt(int x, int y, Color c) {
        checkInside(x, y);
        Host.setPixel(writable(), x, y, c.getRGB());
    }

    private void checkInside(int x, int y) {
        if (x < 0 || y < 0 || x >= getWidth() || y >= getHeight()) {
            throw new IndexOutOfBoundsException("Coordinate out of bounds: " + x + "," + y);
        }
    }

    public void setTransparency(int t) {
        if (t < 0 || t > 255) {
            throw new IllegalArgumentException("The transparency value has to be in the range 0 to 255. It was: " + t);
        }
        transparency = t;
    }

    public int getTransparency() {
        return transparency;
    }

    public void clear() {
        Host.clear(writable());
    }

    private void draw(String shape, double... args) {
        Host.draw(writable(), color.toCss(), font.toCss(), shape, args);
    }

    public void fillRect(int x, int y, int width, int height) {
        draw("fillRect", x, y, width, height);
    }

    public void drawRect(int x, int y, int width, int height) {
        draw("drawRect", x, y, width, height);
    }

    public void fillOval(int x, int y, int width, int height) {
        draw("fillOval", x, y, width, height);
    }

    public void drawOval(int x, int y, int width, int height) {
        draw("drawOval", x, y, width, height);
    }

    public void drawLine(int x1, int y1, int x2, int y2) {
        draw("drawLine", x1, y1, x2, y2);
    }

    public void fillPolygon(int[] xs, int[] ys, int points) {
        draw("fillPolygon", polygon(xs, ys, points));
    }

    public void drawPolygon(int[] xs, int[] ys, int points) {
        draw("drawPolygon", polygon(xs, ys, points));
    }

    private static double[] polygon(int[] xs, int[] ys, int points) {
        double[] args = new double[points * 2];
        for (int i = 0; i < points; i++) {
            args[i * 2] = xs[i];
            args[i * 2 + 1] = ys[i];
        }
        return args;
    }

    public void drawString(String string, int x, int y) {
        String[] lines = string.split("\n", -1);
        int lineHeight = (int) Math.ceil(font.getSize() * 1.2);
        for (int i = 0; i < lines.length; i++) {
            Host.drawString(writable(), color.toCss(), font.toCss(), lines[i], x, y + i * lineHeight);
        }
    }

    @Override
    public String toString() {
        return "Image file name: " + fileName + " " + getWidth() + "x" + getHeight();
    }
}
