import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class Start here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class musicButton extends Buttons
{ 
    boolean isMusic;
    
    GreenfootImage musicOn;
    GreenfootImage musicOff;
    
    public musicButton()
    {
        isMusic = true;
        
        musicOn = new GreenfootImage("MusicOn.png");
        musicOff = new GreenfootImage("MusicOff.png");
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
            isMusic = false;
            
            if(getWorld() instanceof gameStartWorld) 
            {  
                gameStartWorld currentWorld = (gameStartWorld)getWorld();  
                currentWorld.checkMusic(isMusic);  
            } 
        }
    }
}
