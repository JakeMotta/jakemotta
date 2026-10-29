import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class PL here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class PR extends Actor
{
    GreenfootImage r1;
    GreenfootImage r2;
    GreenfootImage r3;
    GreenfootImage r4;
    GreenfootImage r5;
    
    int pRTimer;
    public PR()
    {
        r1 = new GreenfootImage("PR1.fw.png");
        r2 = new GreenfootImage("PR2.fw.png");
        r3 = new GreenfootImage("PR3.fw.png");
        r4 = new GreenfootImage("PR4.fw.png");
        r5 = new GreenfootImage("PR5.fw.png");
        
        pRTimer = 0;
    }
    
    /**
     * Act - do whatever the PL wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        changeImage();
    }    
    
    public void changeImage()
    {
        pRTimer++;
        
        if(pRTimer <= 9)
        {
            setImage(r1);
        }
        if(pRTimer >= 10)
        {
            if(pRTimer <= 19)
            {
                setImage(r2);
            }
        }
        if(pRTimer >= 20)
        {
            if(pRTimer <= 29)
            {
                setImage(r3);
            }
        }
        if(pRTimer >= 30)
        {
            if(pRTimer <= 39)
            {
                setImage(r4);
            }
        }
        if(pRTimer >= 40)
        {
            if(pRTimer <= 49)
            {
                setImage(r5);
            }
        }
        if(pRTimer == 49)
        {
            pRTimer = 0;
        }
    }
}
