import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.awt.Font;
import java.awt.Color;

/**
 * Write a description of class Start here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class howToButton extends Buttons
{ 
    boolean isHowTo;
    
    public howToButton()
    {
        isHowTo = false;
    }
    
    /**
     * Act - do whatever the Start wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        checkMouse();
    }      
    
    public void checkMouse()
    {
        if(Greenfoot.mouseClicked(this))
        {
            MouseInfo mouse = Greenfoot.getMouseInfo();
            isHowTo = true;
            if(getWorld() instanceof gameStartWorld) 
            {  
                gameStartWorld currentWorld = (gameStartWorld)getWorld();  
                currentWorld.openHowTo(isHowTo);
            } 
            else if(getWorld() instanceof gameOverWorld) 
            {  
                gameOverWorld currentWorld = (gameOverWorld)getWorld();  
                currentWorld.openHowTo(isHowTo);
            } 
            else if(getWorld() instanceof gameInfoWorld) 
            {  
                gameInfoWorld currentWorld = (gameInfoWorld)getWorld();  
                currentWorld.openHowTo(isHowTo);
            } 
        }
    }
}
