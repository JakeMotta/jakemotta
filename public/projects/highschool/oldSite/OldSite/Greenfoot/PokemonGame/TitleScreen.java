import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class Intro here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class TitleScreen extends World
{

    /**
     * Constructor for objects of class Intro.
     * 
     */
    public TitleScreen()
    {    
        // Create a new world with 600x400 cells with a cell size of 1x1 pixels.
        super(800, 600, 1); 
        
        PopulateScreen();
        
        //World Intro = new TitleScreen();
        //Greenfoot.setWorld(Intro);
        
    }
    
    public void PopulateScreen()
    {
        addObject(new Screen(), 400, 300);
    }
}
