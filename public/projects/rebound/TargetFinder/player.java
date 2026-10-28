import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class player here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class player extends Actor
{
    int speed = 5;
    boolean canMove;

    Arrow arrow = new Arrow();
    public player()
    {
        canMove = true;
    }

    /**
     * Act - do whatever the player wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        checkKeys();
    }       

    public void checkKeys()
    {
        if(canMove == true)
        {
            if(Greenfoot.isKeyDown("right") || Greenfoot.isKeyDown("d"))
            {
                setLocation(500+speed, getY());
            }

            if(Greenfoot.isKeyDown("left") || Greenfoot.isKeyDown("a"))
            {
                setLocation(100-speed, getY());
            }

            if(Greenfoot.isKeyDown("up") || Greenfoot.isKeyDown("w"))
            {
                setLocation(getX(), getY()-speed);
            }

            if(Greenfoot.isKeyDown("down") || Greenfoot.isKeyDown("s"))
            {
                setLocation(getX(), getY()+speed);
            }
        }
        else
        {
            
        }
    }
    
    public void updateMove(boolean movement)
    {
        canMove = movement;
    }

}
