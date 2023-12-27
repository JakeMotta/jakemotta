import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class Market here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class Market extends Barriers
{
    int popUpBlocker;

    public Market()
    {
        popUpBlocker = 0;
    }
    
    /**
     * Act - do whatever the TallGrass wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        //checks if Ash trys to enter 
        checkIfRead();
    }    
    
    public void checkIfRead()
    {
        ClosedSign popUp;
        popUp = new ClosedSign("Hey");
        if(isRead())
        {
        popUpBlocker++;
        //adds the closed sign pop up
        if(popUpBlocker == 1)
        {
            getWorld().addObject(popUp, 383, 61);
            popUp.setImage("Notice.gif");
            
            popUpBlocker = 0;
        }
        }     
    }
   
      public boolean isRead()
    {
        //create variable of type Actor
        Actor read;
        //set variable value
        read = getOneIntersectingObject(Ash.class);        
        
        if(read != null)
        {
            return true;
        }
        else
        {
            return false;
        }
        
    }
}
