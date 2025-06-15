import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class tempGroundEdge here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class tempGroundEdge extends groundEdge
{
    int lifeTimer;
    
    public void tempGroundEdge()
    {
        lifeTimer = 0;
    }
    
    /**
     * Act - do whatever the tempGroundEdge wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        lifeTimer += 1;
        
        if(lifeTimer == 300)
        {
            getWorld().removeObject(this);
        }
        
    }    
}
