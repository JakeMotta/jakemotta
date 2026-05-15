import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class electricField here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class electricField extends keyElectricFields
{
    GreenfootImage electricFieldOff;
    GreenfootImage electricFieldOn1;
    GreenfootImage electricFieldOn2;
    GreenfootImage electricFieldOn3;
    GreenfootImage electricFieldOn4;
    GreenfootImage electricFieldOn5;
    GreenfootImage electricFieldOn6;
    
    int electricTimer; //Timer to change images when electricField is ON
    int damageGuy; //Damage to Guy
    
    boolean isOn; //Boolean which determines whether the electriField is ON or OFF
    boolean isKey; //Does Guy have the Key?
    
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
        damageGuy = 100;
        
        isOn = true; //electricField is ON by default! Oh Noooooo!
        isKey = false; 
    }
    
    /**
     * Act - do whatever the electricField wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        checkElectricity();
    }    
    
    public void checkElectricity()
    {
        if(isOn == true)
        {
            changeImage(); //Sets images for electricity on
            checkGuy();
            checkKey(isKey);
        }
        else
        {
            setImage(electricFieldOff); //OFF! YOU SHALL PASS!
        }
    }
    
    public void checkGuy()
    {
        Guy Guy;
        Guy = (Guy)getOneIntersectingObject(Guy.class);
        
        if(Guy != null)
        {
            Guy.checkElectricField(damageGuy);
        }
    }
    
    public void checkKey(boolean recievedKey)
    {
        isKey = recievedKey; //Set equal from value recieved from world
        
        if(isKey == true)
        {
            isOn = false;
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
            electricTimer = 1; //Reset electricTimer to rerun this image cycle
        }
    }
}
