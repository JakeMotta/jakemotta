import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.awt.Font;
import java.awt.Color;

/**
 * Write a description of class TallGrass here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class ClosedSign extends Actor
{   

    public ClosedSign()
    {
        createSign();
    }
    
    /**
     * Act - do whatever the TallGrass wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        
    }    
    
    public void createSign()
    {
        GreenfootImage closedSign = new GreenfootImage(100,100);
        
        closedSign.setColor(new Color(255,0,0, 100));
        
        closedSign.fillRect(0, 0, 100, 100);
        
        setImage(closedSign);
    }
}
