import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.awt.Color;

/**
 * Write a description of class blackOut here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class blackIn extends Effects
{
    int widthTimer;
    int blackWidth;
    int randomRotate;
    
    public blackIn()
    {
        widthTimer = 0;
        blackWidth = 1000;
        randomRotate = Greenfoot.getRandomNumber(360);
        
        makeBoard();
    }
    
    /**
     * Act - do whatever the blackOut wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        widthTimer++;
        updateBoard();
    }    
    
    public void makeBoard()
    { 
        GreenfootImage blackOut = new GreenfootImage(blackWidth, 1000);
        
        blackOut.setColor(new Color(0, 0, 0));
        blackOut.fillRect(0, 0, blackWidth, 1000);
        setImage(blackOut);
        
        //Set rotation off randomRotate
        //setRotation(randomRotate);
    }
    
    public void updateBoard()
    {
        if(widthTimer == 1)
        {
            blackWidth -= 10;
            widthTimer = 0;
        }
        
        
        GreenfootImage blackOut = new GreenfootImage(blackWidth, 1000);
        
        blackOut.setColor(new Color(0, 0, 0));
        blackOut.fillRect(0, 0, blackWidth, 1000);
        setImage(blackOut);
        
        if(blackWidth <= 10)
        {
            getWorld().removeObject(this);
        }
    }
}
