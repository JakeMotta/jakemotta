package greenfoot;

/**
 * Greenfoot's Font, standing in for java.awt.Font the same way Color does (see Color). Sizes are in pixels, which is
 * what a Java2D point is at the default transform.
 */
public class Font {
    public static final int PLAIN = 0;
    public static final int BOLD = 1;
    public static final int ITALIC = 2;

    private final String name;
    private final int style;
    private final int size;
    private String css;

    /** java.awt.Font(name, style, size) */
    public Font(String name, int style, int size) {
        this.name = name == null ? "Dialog" : name;
        this.style = style;
        this.size = size;
    }

    public Font(String name, boolean bold, boolean italic, int size) {
        this(name, (bold ? BOLD : 0) | (italic ? ITALIC : 0), size);
    }

    public Font(boolean bold, boolean italic, int size) {
        this("SansSerif", bold, italic, size);
    }

    public Font(int size) {
        this("SansSerif", PLAIN, size);
    }

    public String getName() {
        return name;
    }

    public String getFontName() {
        return name;
    }

    public String getFamily() {
        return name;
    }

    public int getStyle() {
        return style;
    }

    public int getSize() {
        return size;
    }

    public boolean isPlain() {
        return style == PLAIN;
    }

    public boolean isBold() {
        return (style & BOLD) != 0;
    }

    public boolean isItalic() {
        return (style & ITALIC) != 0;
    }

    public Font deriveFont(float size) {
        return new Font(name, style, Math.round(size));
    }

    public Font deriveFont(int style) {
        return new Font(name, style, size);
    }

    public Font deriveFont(int style, float size) {
        return new Font(name, style, Math.round(size));
    }

    String toCss() {
        if (css == null) {
            css = (isItalic() ? "italic " : "") + (isBold() ? "bold " : "") + size + "px " + family(name);
        }
        return css;
    }

    // Java's logical fonts, and the 2012-era Windows fonts the games name, as CSS families
    private static String family(String name) {
        switch (name.toLowerCase()) {
            case "dialog":
            case "dialoginput":
            case "sansserif":
            case "sans-serif":
                return "Arial, Helvetica, sans-serif";
            case "serif":
                return "\"Times New Roman\", Times, serif";
            case "monospaced":
                return "\"Courier New\", Courier, monospace";
            default:
                // A named font falls back to its own kind, as Java's font lookup would
                String lower = name.toLowerCase();
                String generic = lower.contains("courier") || lower.contains("mono") ? "\"Courier New\", Courier, monospace"
                        : lower.contains("times") || lower.contains("serif") && !lower.contains("sans") ? "\"Times New Roman\", Times, serif"
                        : "Arial, Helvetica, sans-serif";
                return "\"" + name + "\", " + generic;
        }
    }

    @Override
    public String toString() {
        return "Font{name=" + name + ",style=" + style + ",size=" + size + "}";
    }
}
