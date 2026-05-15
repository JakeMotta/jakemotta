import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class TallGrass here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class TallGrass extends Actor
{
//normal tall grass
GreenfootImage TallGrass;

//when stepped on grass
GreenfootImage TallGrassDown;

//ignore
GreenfootImage TallGrass3;

//stops Greenfoot from counting. For random battles, so it doesn't check 10 thousand times.
int runStopper;

//boolean for a random battle being true or false
boolean battleOn;

    public TallGrass()
    {
        TallGrass = new GreenfootImage("TallGrass.gif");
        
        TallGrassDown = new GreenfootImage("TallGrassDown.gif");
        
        TallGrass3 = new GreenfootImage("TallGrass3.gif");
        
        runStopper = 0;
        
        battleOn = false;
    }
    
    /**
     * Act - do whatever the TallGrass wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        checkIfSteppedOn();
        
    }    
    
    public void checkIfSteppedOn()
    {
        if(isSteppedOn())
        {
            //sets grass hit image
            setImage(TallGrassDown);
    
            //gets random number, and may start battle
            randomBattle();
            
            
        }
        else
        {
            setImage(TallGrass);
            
        }
    }
    
      public boolean isSteppedOn()
    {
        //create variable of type Actor
        Actor steppedOn;
        //set variable value
        steppedOn = getOneObjectAtOffset(0, 0, Ash.class);        
        
        if(steppedOn != null)
        {
            return true;
        }
        else
        {
            return false;
        }
        
    }
    
    
    public void randomBattle()
    {
        //increases the runStoppers number
        runStopper++;
        
        //stops runStopper at 3. Pretty much instantly.
        if(runStopper == 1)
        {   
            //creates a random number between 0 and 11;
            int randomNumber=Greenfoot.getRandomNumber(11);
            
            //gets a random number between 0 and 11. Checks if the number is equal to 3.
            if(randomNumber == 3)  
            { 
                 //sets new image for grass
                 setImage(TallGrass3);
                 
                 //Chaggy, get this to check the random numbers picked.
                 //System.out.println(randomNumber);
                 
                 //switch world to battle world
                 //Greenfoot.setWorld(World BattleWorld.class);
                 
                 //battle is on!
                 battleOn = true;
                 
                 Greenfoot.stop();
            }
            else
            {
                 //sets image for initial grass
                 setImage(TallGrass);
           }
        }
    }
}
