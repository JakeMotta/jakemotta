import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class PL here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class PL extends Actor
{
    GreenfootImage l1;
    GreenfootImage l2;
    GreenfootImage l3;
    GreenfootImage l4;
    GreenfootImage l5;
    
    int pLTimer;
    public PL()
    {
        l1 = new GreenfootImage("PL1.fw.png");
        l2 = new GreenfootImage("PL2.fw.png");
        l3 = new GreenfootImage("PL3.fw.png");
        l4 = new GreenfootImage("PL4.fw.png");
        l5 = new GreenfootImage("PL5.fw.png");
        
        pLTimer = 0;
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
        pLTimer++;
        
        if(pLTimer <= 9)
        {
            setImage(l1);
        }
        if(pLTimer >= 10)
        {
            if(pLTimer <= 19)
            {
                setImage(l2);
            }
        }
        if(pLTimer >= 20)
        {
            if(pLTimer <= 29)
            {
                setImage(l3);
            }
        }
        if(pLTimer >= 30)
        {
            if(pLTimer <= 39)
            {
                setImage(l4);
            }
        }
        if(pLTimer >= 40)
        {
            if(pLTimer <= 49)
            {
                setImage(l5);
            }
        }
        if(pLTimer == 49)
        {
            pLTimer = 0;
        }
    }
}
