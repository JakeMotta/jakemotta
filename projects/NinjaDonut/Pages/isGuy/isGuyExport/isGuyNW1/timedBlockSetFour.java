import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class timedBlockSetOne here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class timedBlockSetFour extends barriers
{
    int addBlockTimer; //Timer to add the blocks in
    
    public timedBlockSetFour()
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
            getWorld().addObject(new disappearBlock(), 242, 548);
        }
        if(addBlockTimer == 120)
        {
                getWorld().addObject(new disappearBlock(), 340, 496);    
        }
        if(addBlockTimer == 240)
        {
                //Blank
        }
        if(addBlockTimer == 360)
        {
                getWorld().addObject(new disappearBlock(), 101, 496);  
        }
        if(addBlockTimer == 480)
        {
                getWorld().addObject(new disappearBlock(), 170, 415);  
        }
        if(addBlockTimer == 600)
        {
                getWorld().addObject(new disappearBlock(), 254, 378);  
        }
        if(addBlockTimer == 720)
        {
                addBlockTimer = 0;
        }
        
    }
}
