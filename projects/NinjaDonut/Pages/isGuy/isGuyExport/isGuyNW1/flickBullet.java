import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class bullet here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class flickBullet extends enemyAttacks
{
    int speed;
    int lifeTimer;
    int flickDirection; //Equal to the direction (int Flick passes) Flick is facing
    
    boolean isAlive; //Is the bullet alive or not? In the world or not?
    
    public flickBullet(int direction) //Sent from Guy
    {
        speed = 8;
        lifeTimer = 300;
        
        isAlive = true;
        
        flickDirection = direction; // either a 1 or 2
    }
    
    /**
     * Act - do whatever the bullet wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        lifeTimer--; //Decrease lifeTimer, giving the bullet a time limit of existance
        if(isAlive == true)
        {
            move();
            checkGuy();
        }
        else
        {
            getWorld().removeObject(this);
        }
    }    
    
    public void move()
    {
        if(lifeTimer > 0 )
        {
            
            //Shoots bullet right if Guy faces right
            if(flickDirection == 1)
            {
                move(speed);
            }
            
            //Shoots bullet left if Guy faces left
            if(flickDirection == 2)
            {
                move(-speed);
            }
        }
        else
        {
            isAlive = false;
        }
    }
    
    public void checkGuy() //Remove bullet from world if it hits guy
    {
        Guy Guy;
        Guy = (Guy)getOneIntersectingObject(Guy.class);
        
        if(Guy != null)
        {
            Guy.damageGuy(10);
            getWorld().removeObject(this);
        }
        else
        {
            //Nothing
        }
    }
}
