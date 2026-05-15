import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.awt.Font;
import java.awt.Color;

/**
 * Write a description of class hpBar here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class hpBar extends Actor
{
    int guyHealth;
    int currentHp;
    
    public hpBar(int previousHp)
    {
        currentHp = previousHp;
        
        makeHP();      
    }
    
    /**
     * Act - do whatever the hpBar wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    { 
    }    
    
    public void makeHP()
    {

            GreenfootImage hpBar = new GreenfootImage(10, currentHp);
        
            hpBar.setColor(new Color(255, 0, 0));
            hpBar.fillRect(0, 0, 10, currentHp);
        
            setImage(hpBar);
    }
    
    /**
     *
     *I FINALLY DID IT! I GOT THE HEALTH BAR TO WORK CORRECTLY! :*)
     * 
    * */
    
    public void setHP(int guyHP) //Recieve Guy's hp from the world
    {
        guyHealth = guyHP; //set guyHealth equal to Guy's hp
        
        GreenfootImage hpBar = getImage();
        
        hpBar.clear();
        
        hpBar.fillRect(0, 0, 10, guyHealth); //update the health bar height to match Guy's hp
    }
}
