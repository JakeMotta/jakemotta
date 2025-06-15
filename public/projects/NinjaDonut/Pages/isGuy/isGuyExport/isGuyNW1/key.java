import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class key here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class key extends Actor
{
    public key()
    {
    }
    
    /**
     * Act - do whatever the key wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        checkGuy();
    }    
    
    public void checkGuy()
    {
        Actor Guy;
        Guy = getOneIntersectingObject(Guy.class);
        
        if(Guy != null)
        {
            getWorld().removeObject(this);
        }
    }
}
