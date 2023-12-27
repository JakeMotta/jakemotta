import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class Skuddle here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class Skuddle extends enemies
{
    int speed;
    
    int randomDirection;
    int Gravity;
    int gCount;
    int switchDirectionTimer;
    int fallTimer;
    
    boolean movingLeft;
    boolean movingRight;
    boolean switchDirection;
    boolean checkForGround;
    boolean fallingDeath;
    
    public Skuddle()
    {
        speed = 3;
        
        randomDirection = Greenfoot.getRandomNumber(9);
        Gravity = 0;
        gCount = 0;
        switchDirectionTimer = 0;
        fallTimer = 0;
        
        movingLeft = false;
        movingRight = false;
        switchDirection = false;
        checkForGround = true;
        fallingDeath = false;
        
        if(randomDirection <= 4)
        {
            movingRight = true;
            movingLeft = false;
        }
        else if(randomDirection >= 5)
        {
            movingLeft = true;
            movingRight = false;
        }
    }
    
    /**
     * Act - do whatever the Skuddle wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        checkGround();
        movement();
        checkGroundEdge();
        checkSkuddle();
        checkGuy();
        
        if(getY() >= 700)
        {
            getWorld().removeObject(this);
        }
    }    
    
    public void movement()
    {
        //Actual movement
        if(movingRight == true)
        {
            move(speed);
        }
        if(movingLeft == true)
        {
            move(-speed);
        }
    }
    
    public void checkGroundEdge()
    {
        Actor groundEdge;
        groundEdge = getOneIntersectingObject(groundEdge.class);
       
        if(groundEdge != null & checkForGround == true)
        {
            if(switchDirectionTimer == 0)
            {
                if(movingLeft == true)
                {
                    movingRight = true;
                    movingLeft = false;
                }
                else if(movingRight == true)
                {
                    movingLeft = true;
                    movingRight = false;              
                }
                switchDirection = true; //If Skuddle hits groundEdge, start the timer so he can't detect it again instantly
            }
        }
        else
        {
        }
        
        if(switchDirection == true) //Run timer
        {
            switchDirectionTimer++;
        }
        
        if(switchDirectionTimer >= 50) //Reset timer and boolean once timer reaches limit. This allows Skuddle to check for groundEdge again
        {
            switchDirection = false;
            switchDirectionTimer = 0;
        }
    }
    
    public void checkSkuddle()
    {
        Actor Skuddle;
        Skuddle = getOneIntersectingObject(Skuddle.class);
        
        if(Skuddle != null)
        {
            if(switchDirectionTimer == 0)
            {
                if(movingLeft == true)
                {
                    movingRight = true;
                    movingLeft = false;
                }
                else if(movingRight == true)
                {
                    movingLeft = true;
                    movingRight = false;              
                }
                switchDirection = true; //If Skuddle hits groundEdge, start the timer so he can't detect it again instantly
            }
        }
        
        if(switchDirection == true) //Run timer
        {
            switchDirectionTimer++;
        }
        
        if(switchDirectionTimer >= 50) //Reset timer and boolean once timer reaches limit. This allows Skuddle to check for groundEdge again
        {
            switchDirection = false;
            switchDirectionTimer = 0;
        }
    }
    
    public void checkGround()
    {
        Actor barriers;
        barriers = getOneIntersectingObject(barriers.class);
        
        if(barriers != null & checkForGround == true)
        {
            Gravity = 0;
        }
        else
        {
            gravityEffect();
        }
    }
    
    public void gravityEffect()
    {
        gCount++;
        
        if(gCount == 3)
        {
            Gravity += 1;
            gCount = 0;
        }
        
        if(Gravity >= 1)
        {
            checkForGround = false;
        }
        
        setLocation(getX(), getY()+Gravity);
    }
    
    public void checkGuy()
    {
        Actor Guy;
        Guy = getOneIntersectingObject(Guy.class);
        
        if(Guy != null)
        {
            if(switchDirectionTimer == 0)
            {
                if(movingLeft == true)
                {
                    movingRight = true;
                    movingLeft = false;
                }
                else if(movingRight == true)
                {
                    movingLeft = true;
                    movingRight = false;              
                }
                switchDirection = true; //If Skuddle hits groundEdge, start the timer so he can't detect it again instantly
            }
        }
        
        if(switchDirection == true) //Run timer
        {
            switchDirectionTimer++;
        }
        
        if(switchDirectionTimer >= 50) //Reset timer and boolean once timer reaches limit. This allows Skuddle to check for groundEdge again
        {
            switchDirection = false;
            switchDirectionTimer = 0;
        }
    }
}
