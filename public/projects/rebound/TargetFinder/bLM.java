import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.awt.Color;

/**
 * Write a description of class dimScreen here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class bLM extends barriersLong
{
    public bLM()
    {
        makeWall();
    }

    /**
     * Act - do whatever the dimScreen wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        
    }    

    public void makeWall()
    {
        GreenfootImage wall = new GreenfootImage(20, 75);
        wall.setColor(new Color(54, 54, 54));
        wall.fillRect(0, 0, 20, 75);

        setImage(wall);

    }
}
