import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.util.List; 
/**
 * Write a description of class disappearBlock here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class fallingBlock extends barriers
{
    int countDown; //Timer that deletes the object when 0
    int Gravity;
    int gCount;
    int blockNumber;
    int randomTime;
    int rotationTimer;
    
    boolean startTimer; //Should the timer start running
    boolean canFall; //Does Guy have key?
    boolean fall;
    public fallingBlock()
    {
        Gravity = 0;
        gCount = 0;
        randomTime = Greenfoot.getRandomNumber(150)+1;
        countDown = 150 + randomTime;
        rotationTimer = 0;
        
        canFall = false;
        fall = false;
    }
    
    /**
     * Act - do whatever the disappearBlock wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {   
        //checkFall();
        checkGuy();
        if(getY() >= 800)
        {
            getWorld().removeObject(this);
        }
    }    
    
    public void checkFall()
    {
        if(fall == false)
        {
            checkKey(canFall);
        }
        else
        {
            checkGuy();
        }
    }
    
    public void checkKey(boolean hasKey)
    {
        canFall = hasKey;
        
        if(canFall == true)
        {
            fall = true;
        }
    }
    
    public void checkGuy()
    {
        Actor Guy;
        Guy = getOneIntersectingObject(Guy.class);  
        
        if(Guy != null)
        {
            countDown--;
            
            if(countDown > 0)
            {
                if(countDown <= 100)
                {
                    rotationTimer++; 
                    if(rotationTimer <= 4)
                    {
                        setRotation(5);
                    }
                    if(rotationTimer >= 5)
                    {
                        if(rotationTimer <= 9)
                        {
                            setRotation(0);
                        }
                    }
                    if(rotationTimer >= 10)
                    {
                        if(rotationTimer <= 14)
                        {
                            setRotation(-5);
                        }
                    }
                    if(rotationTimer >= 15)
                    {
                        if(rotationTimer <= 20)
                        {
                            setRotation(0);
                            rotationTimer = 0;
                        }
                    }
                }
            }
        }
        else
        {
            setRotation(0);
        }
        
        if(countDown <= 0)
        {
            gravityMethod();
        }
    }
    
    public void gravityMethod()
    {
        gCount++;
        
        if(gCount == 3)
        {
            Gravity += 1;
            gCount = 0;
        }
        setLocation(getX(), getY()+Gravity);
    }
    
}
