import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class electricField here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class smallElectricField extends constantElectricFields
{
    GreenfootImage smallElectricFieldOn1;
    GreenfootImage smallElectricFieldOn2;
    GreenfootImage smallElectricFieldOn3;
    GreenfootImage smallElectricFieldOn4;
    GreenfootImage smallElectricFieldOn5;
    GreenfootImage smallElectricFieldOn6; 
    
    int electricTimer; //Timer to change images when electricField is ON
    
    boolean isOn; //Boolean which determines whether the electriField is ON or OFF
    
    public smallElectricField()
    {
        smallElectricFieldOn1 = new GreenfootImage("smallElectricFieldOn1.png");
        smallElectricFieldOn2 = new GreenfootImage("smallElectricFieldOn2.png");
        smallElectricFieldOn3 = new GreenfootImage("smallElectricFieldOn3.png");
        smallElectricFieldOn4 = new GreenfootImage("smallElectricFieldOn4.png");
        smallElectricFieldOn5 = new GreenfootImage("smallElectricFieldOn5.png");
        smallElectricFieldOn6 = new GreenfootImage("smallElectricFieldOn6.png");
        
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
    }    
    
    public void changeImage()
    {
        electricTimer += 1; //Increase Timer so images will change
        
        if(electricTimer >= 1)
        {
            if(electricTimer <= 3)
            {
                setImage(smallElectricFieldOn1);
            }
        }
        if(electricTimer >= 4)
        {
            if(electricTimer <= 6)
            {
                setImage(smallElectricFieldOn2);
            }
        }
        if(electricTimer >= 7)
        {
            if(electricTimer <= 9)
            {
                setImage(smallElectricFieldOn3);
            }
        }
        if(electricTimer >= 10)
        {
            if(electricTimer <= 12)
            {
                setImage(smallElectricFieldOn4);
            }
        }
        if(electricTimer >= 13)
        {
            if(electricTimer <= 15)
            {
                setImage(smallElectricFieldOn5);
            }
        }
        if(electricTimer >= 16)
        {
            if(electricTimer <= 18)
            {
                setImage(smallElectricFieldOn6);
            }
        }
        if(electricTimer == 18)
        {
            electricTimer = 0; //Reset electricTimer to rerun this image cycle
        }
    }
}
