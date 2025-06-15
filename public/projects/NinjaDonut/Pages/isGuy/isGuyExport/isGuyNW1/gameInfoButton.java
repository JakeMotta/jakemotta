import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class Start here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class gameInfoButton extends Buttons
{ 
    boolean infoClicked;

    public gameInfoButton()
    {
        infoClicked = false;
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
            infoClicked = true;

            if(getWorld() instanceof gameOverWorld) 
            {  
                gameOverWorld currentWorld = (gameOverWorld)getWorld();  
                currentWorld.openGameInfo(infoClicked);
            } 
            else if(getWorld() instanceof howToWorld) 
            {  
                howToWorld currentWorld = (howToWorld)getWorld();  
                currentWorld.openGameInfo(infoClicked);
            } 
            else if(getWorld() instanceof victoryWorld) 
            {  
                victoryWorld currentWorld = (victoryWorld)getWorld();  
                currentWorld.openGameInfo(infoClicked);
            } 
        }
    }
}
