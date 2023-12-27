import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class disappearBlock here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class disappearBlock extends barriers
{
    int lifeTimer; //Timer that deletes the object when 0
    boolean isAlive; //Is the block alive?
    
    public disappearBlock()
    {
        lifeTimer = 239;
        isAlive = true;
    }
    
    /**
     * Act - do whatever the disappearBlock wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {   
        if(isAlive == true)
        {
            lifeTimer--;
        }
        else
        {
            getWorld().removeObject(this);
        }
        
        if(lifeTimer <= 0)
        {
            isAlive = false;
        }
    }    
}
