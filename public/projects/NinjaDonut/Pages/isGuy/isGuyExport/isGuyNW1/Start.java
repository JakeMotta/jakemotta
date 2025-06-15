import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.awt.Font;
import java.awt.Color;

/**
 * Write a description of class Start here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class Start extends Buttons
{ 
    boolean isStart;
    GreenfootSound startSound;
    
    public Start()
    {
        isStart = false;
        startSound = new GreenfootSound("coin.wav");
        startSound.setVolume(80);
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
            startSound.play();
            MouseInfo mouse = Greenfoot.getMouseInfo();
            isStart = true;
            
            if(getWorld() instanceof gameStartWorld) 
            {  
                gameStartWorld currentWorld = (gameStartWorld)getWorld();  
                currentWorld.startGame(isStart);  
            } 
            else if(getWorld() instanceof howToWorld) 
            {  
                howToWorld currentWorld = (howToWorld)getWorld();  
                currentWorld.startGame(isStart);
            } 
            else if(getWorld() instanceof gameInfoWorld) 
            {  
                gameInfoWorld currentWorld = (gameInfoWorld)getWorld();  
                currentWorld.startGame(isStart);
            } 
        }
    }
}
