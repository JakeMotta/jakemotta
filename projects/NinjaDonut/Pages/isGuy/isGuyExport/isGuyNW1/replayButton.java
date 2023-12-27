import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.awt.Font;
import java.awt.Color;

/**
 * Write a description of class Start here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class replayButton extends Buttons
{ 
    boolean replay;
    
    public replayButton()
    {
        replay = false;
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
            replay = true;

            if(getWorld() instanceof gameOverWorld) 
            {  
                gameOverWorld currentWorld = (gameOverWorld)getWorld();  
                currentWorld.checkReplay(replay);
            } 
            else if(getWorld() instanceof victoryWorld) 
            {  
                victoryWorld currentWorld = (victoryWorld)getWorld();  
                currentWorld.checkReplay(replay);
            } 
        }
        
    }
}
