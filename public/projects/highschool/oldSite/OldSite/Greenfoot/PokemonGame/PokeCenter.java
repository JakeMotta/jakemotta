import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.awt.Font;
import java.awt.Color;

/**
 * Write a description of class TallGrass here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class PokeCenter extends Barriers
{   
//stops multiple pop ups from being created
int popUpBlocker;

    public PokeCenter()
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
    
    /*
        public void createSign()
    {
        GreenfootImage closedSign = new GreenfootImage(100,100);
        
        closedSign.setColor(new Color(255,0,0, 100));
        
        closedSign.fillRect(0, 0, 100, 100);
        
    }
    */
  
}
