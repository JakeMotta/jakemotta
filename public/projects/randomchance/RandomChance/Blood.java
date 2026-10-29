import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class Blood here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class Blood extends Actor
{
    GreenfootImage b1;
    GreenfootImage b2;
    GreenfootImage b3;
    GreenfootImage b4;
    GreenfootImage b5;
    GreenfootImage b6;
    
    int bloodTimer;
    
    public Blood()
    {
        b1 = new GreenfootImage("blood.gif");
        b2 = new GreenfootImage("blood2.gif");
        b3 = new GreenfootImage("blood3.gif");
        b4 = new GreenfootImage("blood4.gif");
        b5 = new GreenfootImage("blood5.gif");	
        b6 = new GreenfootImage("blood6.gif");
        
        bloodTimer = 0;
    }
    
    /**
     * Act - do whatever the Blood wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        cycle();
    }    
    
    public void cycle()
    {
        bloodTimer++;
        
        if(bloodTimer <= 99)
        {
            setImage(b1);
        }
        if(bloodTimer >= 100)
        {
            if(bloodTimer <=119)
            {
                setImage(b2);
            }
        }
        if(bloodTimer >= 120)
        {
            if(bloodTimer <=139)
            {
                setImage(b3);
            }
        }
        if(bloodTimer >= 140)
        {
            if(bloodTimer <=159)
            {
                setImage(b4);
            }
        }
        if(bloodTimer >= 160)
        {
            if(bloodTimer <=179)
            {
                setImage(b5);
            }
        }
        if(bloodTimer >= 180)
        {
            if(bloodTimer <=199)
            {
                setImage(b6);
            }
        }
        if(bloodTimer == 200)
        {
            getWorld().removeObject(this);
        }
        
    }
}
