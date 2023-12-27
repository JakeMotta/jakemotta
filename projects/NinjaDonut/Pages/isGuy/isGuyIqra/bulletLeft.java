import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class bullet here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class bulletLeft extends bullet
{
    int speed;
    int lifeTimer;
    
    boolean isAlive;
    
    public bulletLeft()
    {
        speed = -8;
        lifeTimer = 300;
        
        isAlive = true;
    }
    
    /**
     * Act - do whatever the bullet wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        lifeTimer--;
        
        if(isAlive == true)
        {
            move();
        }
        if(isAlive == false)
        {
            getWorld().removeObject(this);
        }
    }    
    
    public void move()
    {
        if(lifeTimer > 0 )
        {
            move(speed);
        }
        else
        {
            isAlive = false;
        }
    }
}
