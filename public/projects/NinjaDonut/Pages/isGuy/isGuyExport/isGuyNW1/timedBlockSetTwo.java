import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class timedBlockSetTwo here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class timedBlockSetTwo extends barriers
{
    fallingBlock fallingBlock;
    
    int populateTimer;
    boolean canFall;
    
    public timedBlockSetTwo()
    {
        populateTimer = 0;
        canFall = false;
    }
    
    /**
     * Act - do whatever the timedBlockSetTwo wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        populateTimer++;
        
        if(populateTimer == 1)
        {
            populateBlocks();
        }
    }    
    
    public void populateBlocks()
    {
        int xPosition = 0;
        
        for(int i = 0; i <= 20; i++)
        {
            xPosition += 39;
            fallingBlock = new fallingBlock();
            getWorld().addObject(new fallingBlock(), -29 + xPosition, 190);
        }
        
    } 
    
    public void checkKey(boolean hasKey)
    {
        canFall = hasKey;

        fallingBlock.checkKey(canFall);
    }
}
