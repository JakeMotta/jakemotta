import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.awt.Color;

/**
 * Write a description of class dimScreen here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class dimScreen extends Actor
{
    boolean canFall;
    
    retryScreen retryScreen = new retryScreen();
    public dimScreen()
    {
        makeScreen();

        canFall = true;
    }

    /**
     * Act - do whatever the dimScreen wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        fall();
    }    

    public void makeScreen()
    {
        GreenfootImage screen = new GreenfootImage(600, 400);
        screen.setColor(new Color(0, 0, 0));
        screen.fillRect(0, 0, 600, 400);
        screen.setTransparency(150);

        setImage(screen);

    }

    public void fall()
    {
        if(getY() == 200)
        {
            canFall = false;
            
            if(getWorld() instanceof levelOne) 
            {  
                levelOne currentWorld = (levelOne)getWorld();  
                currentWorld.levelFailed();  
            }
        }
        else
        {
            canFall = true;
        }

        if(canFall == true)
        {
            setLocation(getX(), getY()+5);
        }
        else
        {
            setLocation(getX(), getY()+0);
        }
    }
}
