import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class electricField here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class pulsingElectricField extends keyElectricFields
{
    GreenfootImage electricFieldPulse1;
    GreenfootImage electricFieldPulse2;
    GreenfootImage electricFieldPulse3;
    GreenfootImage electricFieldPulse4;
    GreenfootImage electricFieldPulse5;
    GreenfootImage electricFieldPulse6;
    GreenfootImage electricFieldPulseOff;
    
    int electricTimer; //Timer to change images when electricField is ON
    int runTimer;
    int randomStart;
    int damageGuy;
    
    boolean isOn; //Boolean which determines whether the electriField is ON or OFF
    
    public pulsingElectricField()
    {
        electricFieldPulse1 = new GreenfootImage("electricFieldPulse1.png");
        electricFieldPulse2 = new GreenfootImage("electricFieldPulse2.png");
        electricFieldPulse3 = new GreenfootImage("electricFieldPulse3.png");
        electricFieldPulse4 = new GreenfootImage("electricFieldPulse4.png");
        electricFieldPulse5 = new GreenfootImage("electricFieldPulse5.png");
        electricFieldPulse6 = new GreenfootImage("electricFieldPulse6.png");
        electricFieldPulseOff = new GreenfootImage("electricFieldPulseOff.png");
        
        electricTimer = 0;
        runTimer = 0;
        randomStart = Greenfoot.getRandomNumber(30);
        damageGuy = 100;
        
        isOn = true; //electricField is ON by default! Oh Noooooo!
    }
    
    /**
     * Act - do whatever the electricField wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {   
        electricTimer += 1; //Increase Timer so images will change
        System.out.println(electricTimer);
        if(isOn == true)
        {
            checkGuy();
            changeImage(); //Method to change electricField's ON images
        }
        else
        {
            setImage(electricFieldPulseOff);  
            if(electricTimer == randomStart + 18)
            {
                electricTimer = 0;
                runTimer++;
            }
            
            if(runTimer == 10)
            {
                runTimer = 0;
                electricTimer = 0;
                isOn = true;
            }
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
    
    public void changeImage()
    {
        if(electricTimer >= randomStart + 1)
        {
            if(electricTimer <= randomStart + 3)
            {
                setImage(electricFieldPulse1);
            }
        }
        if(electricTimer >= randomStart + 4)
        {
            if(electricTimer <= randomStart + 6)
            {
                setImage(electricFieldPulse2);
            }
        }
        if(electricTimer >= randomStart + 7)
        {
            if(electricTimer <= randomStart + 9)
            {
                setImage(electricFieldPulse3);
            }
        }
        if(electricTimer >= randomStart + 10)
        {
            if(electricTimer <= randomStart + 12)
            {
                setImage(electricFieldPulse4);
            }
        }
        if(electricTimer >= randomStart + 13)
        {
            if(electricTimer <= randomStart + 15)
            {
                setImage(electricFieldPulse5);
            }
        }
        if(electricTimer >= randomStart + 16)
        {
            if(electricTimer <= randomStart + 18)
            {
                setImage(electricFieldPulse6);
            }
        }
        if(electricTimer == randomStart + 18)
        {
            electricTimer = 0; //Reset electricTimer to rerun this image cycle
            runTimer++;
        }
        
        if(runTimer == 5)
        {
            isOn = false;
        }
    }
}
