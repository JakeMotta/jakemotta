import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.awt.Color;

/**
 * Write a description of class trail here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class trail extends Actor
{
    int w = 24;
    int x = Greenfoot.getRandomNumber(255)+1;
    int y = Greenfoot.getRandomNumber(255)+1;
    int z = Greenfoot.getRandomNumber(255)+1;
    int t = 0;
    
    public trail()
    {   
        makeTrail();
    }

    /**
     * Act - do whatever the trail wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        shrink();
    } 

    public void shrink()
    {
        w--;
        t += 5;

        GreenfootImage trail = getImage();
        trail.clear();

        trail = new GreenfootImage(w, w);
        trail.setColor(new Color(t, 0, 0));
        trail.fillOval(0, 0, w, w);
        setImage(trail);

        if(w <= 2)
        {
            getWorld().removeObject(this);
        }
    }

    public void makeTrail()
    {
        GreenfootImage trail = new GreenfootImage(w, w);

        trail.setColor(new Color(t, 0, 0));
        trail.fillOval(0, 0, w, w);

        setImage(trail);
    }
}
