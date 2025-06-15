import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class electricField here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class electricField extends Actor
{
    GreenfootImage electricFieldOff;
    GreenfootImage electricFieldOn1;
    GreenfootImage electricFieldOn2;
    GreenfootImage electricFieldOn3;
    GreenfootImage electricFieldOn4;
    GreenfootImage electricFieldOn5;
    GreenfootImage electricFieldOn6;
    
    int electricTimer; //Timer to change images when electricField is ON
    
    boolean isOn; //Boolean which determines whether the electriField is ON or OFF
    
    public electricField()
    {
        electricFieldOff = new GreenfootImage("electricFieldOff.png");
        electricFieldOn1 = new GreenfootImage("electricFieldOn1.png");
        electricFieldOn2 = new GreenfootImage("electricFieldOn2.png");
        electricFieldOn3 = new GreenfootImage("electricFieldOn3.png");
        electricFieldOn4 = new GreenfootImage("electricFieldOn4.png");
        electricFieldOn5 = new GreenfootImage("electricFieldOn5.png");
        electricFieldOn6 = new GreenfootImage("electricFieldOn6.png");
        
        electricTimer = 0;
        
        isOn = true; //electricField is ON by default! Oh Noooooo!
    }
    
    /**
     * Act - do whatever the electricField wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        if(isOn == true)
        {
            changeImage(); //Method to change electricField's ON images
        }
        else
        {
            setImage(electricFieldOff);
        }
    }    
    
    public void changeImage()
    {
        electricTimer += 1; //Increase Timer so images will change
        
        if(electricTimer >= 1)
        {
            if(electricTimer <= 3)
            {
                setImage(electricFieldOn1);
            }
        }
        if(electricTimer >= 4)
        {
            if(electricTimer <= 6)
            {
                setImage(electricFieldOn2);
            }
        }
        if(electricTimer >= 7)
        {
            if(electricTimer <= 9)
            {
                setImage(electricFieldOn3);
            }
        }
        if(electricTimer >= 10)
        {
            if(electricTimer <= 12)
            {
                setImage(electricFieldOn4);
            }
        }
        if(electricTimer >= 13)
        {
            if(electricTimer <= 15)
            {
                setImage(electricFieldOn5);
            }
        }
        if(electricTimer >= 16)
        {
            if(electricTimer <= 18)
            {
                setImage(electricFieldOn6);
            }
        }
        if(electricTimer == 18)
        {
            electricTimer = 0; //Reset electricTimer to rerun this image cycle
        }
    }
}
