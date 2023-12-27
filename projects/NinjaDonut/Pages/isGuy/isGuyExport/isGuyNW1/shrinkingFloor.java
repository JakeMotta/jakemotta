import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.awt.Color;

/**
 * Write a description of class blackOut here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class shrinkingFloor extends barriers
{
    int widthTimer;
    int width;
    boolean shrink;
    
    public shrinkingFloor()
    {
        widthTimer = 0;
        width = 1000;
        shrink = false;
        
        makeBoard();
    }
    
    /**
     * Act - do whatever the blackOut wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        checkKey(shrink);
        
        if(shrink == true)
        {
            updateBoard();
        }
    }    
    
    public void makeBoard()
    { 
        GreenfootImage blackOut = new GreenfootImage(width, 30);
        
        blackOut.setColor(new Color(105,105,105));
        blackOut.fillRect(0, 0, width, 30);
        setImage(blackOut);
        
    }
    
    public void updateBoard()
    {
        widthTimer++;
        
        if(widthTimer == 3)
        {
            width -= 1;
            widthTimer = 0;
        }
        
        
        GreenfootImage blackOut = new GreenfootImage(width, 30);
        
        blackOut.setColor(new Color(105,105,105));
        blackOut.fillRect(0, 0, width, 30);
        setImage(blackOut);
        
        if(width <= 1)
        {
            getWorld().removeObject(this);
        }
    }
    
    public void checkKey(boolean guyHasKey)
    {
        shrink = guyHasKey;
        System.out.println(shrink);
    }
}
