import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class timedBlockSetOne here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class timedBlockSetOne extends barriers
{
    int addBlockTimer; //Timer to add the blocks in
    
    public timedBlockSetOne()
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
            getWorld().addObject(new disappearBlock(), 200, 150);
        }
        if(addBlockTimer == 120)
        {
                getWorld().addObject(new disappearBlock(), 350, 250);    
        }
        if(addBlockTimer == 240)
        {
                getWorld().addObject(new disappearBlock(), 350, 150);  
        }
        if(addBlockTimer == 360)
        {
                getWorld().addObject(new disappearBlock(), 500, 250);  
        }
        if(addBlockTimer == 480)
        {
                getWorld().addObject(new disappearBlock(), 500, 150);  
        }
        if(addBlockTimer == 720)
        {
                getWorld().addObject(new disappearBlock(), 650, 150);  
        }
        if(addBlockTimer == 840)
        {
                addBlockTimer = 0;
        }
        
    }
}
