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

    public PokeCenter()
    {
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
        
        if(isRead())
        {
            //adds the closed sign pop up
            getWorld().addObject(new ClosedSign(), 100, 100);
        }
        else
        {
            //removes the closed sign pop up
            getWorld().removeObject(new ClosedSign());
        }
        
    }
   
      public boolean isRead()
    {
        //create variable of type Actor
        Actor read;
        //set variable value
        read = getOneObjectAtOffset(0, -30, Ash.class);        
        
        if(read != null)
        {
            return true;
        }
        else
        {
            return false;
        }
        
    }
    
        public void createSign()
    {
        GreenfootImage closedSign = new GreenfootImage(100,100);
        
        closedSign.setColor(new Color(255,0,0, 100));
        
        closedSign.fillRect(0, 0, 100, 100);
        
    }
  
}
