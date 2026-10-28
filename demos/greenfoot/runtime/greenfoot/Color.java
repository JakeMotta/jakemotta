package greenfoot;

/**
 * Greenfoot's Color. The games were written against java.awt.Color, which a browser doesn't have, so the build
 * renames java/awt/Color to greenfoot/Color in their classes and this class carries both APIs: Greenfoot 3's and the
 * parts of AWT's that old scenarios used (the lower-case constants, the float constructor, brighter and darker).
 */
public class Color {
    public static final Color WHITE = new Color(255, 255, 255);
    public static final Color LIGHT_GRAY = new Color(192, 192, 192);
    public static final Color GRAY = new Color(128, 128, 128);
    public static final Color DARK_GRAY = new Color(64, 64, 64);
    public static final Color BLACK = new Color(0, 0, 0);
    public static final Color RED = new Color(255, 0, 0);
    public static final Color PINK = new Color(255, 175, 175);
    public static final Color ORANGE = new Color(255, 200, 0);
    public static final Color YELLOW = new Color(255, 255, 0);
    public static final Color GREEN = new Color(0, 255, 0);
    public static final Color MAGENTA = new Color(255, 0, 255);
    public static final Color CYAN = new Color(0, 255, 255);
    public static final Color BLUE = new Color(0, 0, 255);

    public static final Color white = WHITE;
    public static final Color lightGray = LIGHT_GRAY;
    public static final Color gray = GRAY;
    public static final Color darkGray = DARK_GRAY;
    public static final Color black = BLACK;
    public static final Color red = RED;
    public static final Color pink = PINK;
    public static final Color orange = ORANGE;
    public static final Color yellow = YELLOW;
    public static final Color green = GREEN;
    public static final Color magenta = MAGENTA;
    public static final Color cyan = CYAN;
    public static final Color blue = BLUE;

    private final int argb;
    private String css;

    public Color(int r, int g, int b) {
        this(r, g, b, 255);
    }

    public Color(int r, int g, int b, int a) {
        check(r);
        check(g);
        check(b);
        check(a);
        argb = (a << 24) | (r << 16) | (g << 8) | b;
    }

    public Color(float r, float g, float b) {
        this(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
    }

    public Color(float r, float g, float b, float a) {
        this(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), Math.round(a * 255));
    }

    public Color(int rgb) {
        argb = 0xff000000 | rgb;
    }

    public Color(int rgba, boolean hasAlpha) {
        argb = hasAlpha ? rgba : 0xff000000 | rgba;
    }

    static Color fromArgb(int argb) {
        return new Color(argb, true);
    }

    private static void check(int value) {
        if (value < 0 || value > 255) {
            throw new IllegalArgumentException("Color parameter outside of expected range: " + value);
        }
    }

    public int getRed() {
        return (argb >> 16) & 0xff;
    }

    public int getGreen() {
        return (argb >> 8) & 0xff;
    }

    public int getBlue() {
        return argb & 0xff;
    }

    public int getAlpha() {
        return (argb >>> 24) & 0xff;
    }

    public int getRGB() {
        return argb;
    }

    public Color brighter() {
        int r = getRed(), g = getGreen(), b = getBlue();
        int i = (int) (1.0 / 0.3);
        if (r == 0 && g == 0 && b == 0) {
            return new Color(i, i, i, getAlpha());
        }
        if (r > 0 && r < i) r = i;
        if (g > 0 && g < i) g = i;
        if (b > 0 && b < i) b = i;
        return new Color(Math.min((int) (r / 0.7), 255), Math.min((int) (g / 0.7), 255), Math.min((int) (b / 0.7), 255), getAlpha());
    }

    public Color darker() {
        return new Color(Math.max((int) (getRed() * 0.7), 0), Math.max((int) (getGreen() * 0.7), 0), Math.max((int) (getBlue() * 0.7), 0), getAlpha());
    }

    String toCss() {
        if (css == null) {
            css = "rgba(" + getRed() + "," + getGreen() + "," + getBlue() + "," + (getAlpha() / 255.0) + ")";
        }
        return css;
    }

    @Override
    public boolean equals(Object other) {
        return other instanceof Color && ((Color) other).argb == argb;
    }

    @Override
    public int hashCode() {
        return argb;
    }

    @Override
    public String toString() {
        return "Color{r=" + getRed() + ",g=" + getGreen() + ",b=" + getBlue() + ",a=" + getAlpha() + "}";
    }
}
