import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class laser here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class longLaser extends lasers
{
    GreenfootImage laserOff;
    GreenfootImage laserOn1;
    GreenfootImage laserOn2;
    GreenfootImage laserOn3;
    GreenfootImage laserOn4;
    GreenfootImage laserOn5;
    
    int laserTimer; //Timer for laser image change
    int randomStart; //random number which will make lasers start at different times
    
    public longLaser()
    {
        laserOff = new GreenfootImage("laserOff.png");
        laserOn1 = new GreenfootImage("laserOn1.png");
        laserOn2 = new GreenfootImage("laserOn2.png");
        laserOn3 = new GreenfootImage("laserOn3.png");
        laserOn4 = new GreenfootImage("laserOn4.png");
        laserOn5 = new GreenfootImage("laserOn5.png");
        
        setImage(laserOff); //Set initail start image for laser
        
        laserTimer = 0;
        randomStart = Greenfoot.getRandomNumber(30);
    }
    
    /**
     * Act - do whatever the laser wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        imageChange();
    }    
    
    public void imageChange()
    {
        laserTimer += 1; //Increase the laser timer
        
        if(laserTimer < randomStart + 30)
        {
            setImage(laserOff);
        }
        if(laserTimer >= randomStart + 31)
        {
            if(laserTimer <= randomStart + 35)
            {
                setImage(laserOn1);
            }
        }
        if(laserTimer >= randomStart + 36)
        {
            if(laserTimer <= randomStart + 40)
            {
                setImage(laserOn2);
            }
        }
        if(laserTimer >= randomStart + 41)
        {
            if(laserTimer <= randomStart + 45)
            {
                setImage(laserOn3);
            }
        }
        if(laserTimer >= randomStart + 46)
        {
            if(laserTimer <= randomStart + 50)
            {
                setImage(laserOn4);
            }
        }
        if(laserTimer >= randomStart + 51)
        {
            if(laserTimer <= randomStart + 61) 
            {
                setImage(laserOn5);
                
                //Add the actual laserBeam to the world, which is what hits Guy and deals damage.
                longBeam longBeam;
                longBeam = new longBeam();
                getWorld().addObject(longBeam, getX(), getY()+283);
            }
        }
        
        //change this number to change the shot frequency 
        if(laserTimer == randomStart + 101)
        {
            laserTimer = 0; //Reset laser timer to restart the image cycle
        }
    }
}
