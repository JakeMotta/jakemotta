import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class movingPlatform here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class movingLeftPlatform extends barriers
{
    int speed;
    int speedIncrease;
    int directionTimer;
    
    boolean movingLeft;
    boolean movingRight;
    
    public movingLeftPlatform()
    {
        speed = 0;
        speedIncrease = 0;
        directionTimer = 0;
        //randomDirection = Greenfoot.getRandomNumber(9);
        
        movingLeft = true;
        movingRight = false;  
    }
    
    /**
     * Act - do whatever the movingPlatform wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        move();
    }    
    
    public void move()
    {
        if(movingLeft == true)
        {
            speedIncrease++;
            directionTimer++;
            move(-speed);
            if(speed <= 3 & directionTimer <= 64)
            {
                if(speedIncrease == 20)
                {
                    speed += 1;
                    speedIncrease = 0;
                }
            }
            if(speed == 3 & directionTimer == 70)
            {   
                    speed -= 1;
                    speedIncrease = 0;
            }
            if(speed >= 0 & directionTimer >= 71)
            {
                if(speedIncrease == 20)
                {
                    speed -= 1;
                    speedIncrease = 0;
                }
            }
            if(speed == 0 & directionTimer == 110)
            {
                movingLeft = false;
                movingRight = true;
                directionTimer = 0;
            }
        }
        if(movingRight == true)
        {
            speedIncrease++;
            directionTimer++;
            move(speed);
            if(speed <= 3 & directionTimer <= 64)
            {
                if(speedIncrease == 20)
                {
                    speed += 1;
                    speedIncrease = 0;
                }
            }
            if(speed == 3 & directionTimer == 70)
            {   
                    speed -= 1;
                    speedIncrease = 0;
            }
            if(speed >= 0 & directionTimer >= 71)
            {
                if(speedIncrease == 20)
                {
                    speed -= 1;
                    speedIncrease = 0;
                }
            }
            if(speed == 0 & directionTimer == 110)
            {
                movingRight = false;
                movingLeft = true;
                directionTimer = 0;
            }
        }
    }
}
