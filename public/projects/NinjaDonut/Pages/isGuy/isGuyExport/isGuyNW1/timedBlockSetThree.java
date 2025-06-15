import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class timedBlockSetOne here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class timedBlockSetThree extends barriers
{
    int addBlockTimer; //Timer to add the blocks in
    
    public timedBlockSetThree()
    {
        addBlockTimer = 0;
    }
    
    /**
     * Act - do whatever the timedBlockSetOne wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        addBlocks();
        addBlockTimer++; //Increase Timer
    }    
    
    public void addBlocks()
    {
        disappearBlock disappearBlock;
        disappearBlock = new disappearBlock();
        
        if(addBlockTimer == 1)
        {
            getWorld().addObject(new disappearBlock(), 480, 590);
        }
        if(addBlockTimer == 120)
        {
                getWorld().addObject(new disappearBlock(), 320, 590);    
        }
        if(addBlockTimer == 480)
        {
                addBlockTimer = 0;
        }
        
    }
}
