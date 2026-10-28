import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.awt.Color;

/**
 * Write a description of class Blood here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class sky extends Actor
{  
    int x = 960;
    int y = 400;
    
    public sky()
    {
        makeSky();
    }

    /**
     * Act - do whatever the Blood wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
    }  
    
    public void makeSky()
    {
        GreenfootImage sky = new GreenfootImage(x,y);
        sky.drawRect(x,y,x,y);
        sky.setColor(new Color(245, 245, 235, 255));
        sky.fill();
        setImage(sky);
    }
}
