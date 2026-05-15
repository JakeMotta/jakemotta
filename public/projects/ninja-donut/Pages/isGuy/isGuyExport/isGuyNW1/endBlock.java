import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class disappearBlock here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class endBlock extends timedBlockSetTwo
{
    int lifeTimer; //Timer that deletes the object when 0
    int Gravity;
    int gCount;
    
    boolean startTimer; //Should the timer start running
    
    public endBlock()
    {
        lifeTimer = 199;
        Gravity = 0;
        gCount = 0;
        
        startTimer = false;
    }
    
    /**
     * Act - do whatever the disappearBlock wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {   
        if(startTimer == true)
        {
            lifeTimer--;
            if(lifeTimer <= 0)
            {
                gravityMethod();
            }
        }
        
        if(getY() >= 800)
        {
            getWorld().removeObject(this);
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
    
    public void checkFall(boolean checkKey)
    {
        startTimer = checkKey;
    }
}
