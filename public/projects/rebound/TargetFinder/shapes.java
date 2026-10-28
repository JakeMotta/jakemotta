import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.awt.Color;

/**
 * Write a description of class shapes here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class shapes extends Actor
{

    int w = Greenfoot.getRandomNumber(150)+25;
    int x = Greenfoot.getRandomNumber(255)+1;
    int y = Greenfoot.getRandomNumber(255)+1;
    int z = Greenfoot.getRandomNumber(255)+1;
    int speed = Greenfoot.getRandomNumber(3);
    
    public shapes()
    {
        makeShapes();
    }

    /**
     * Act - do whatever the shapes wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        fall();
        checkY();
    }    
    
    public void fall()
    {
        setLocation(getX(), getY()+speed);
    }
    
    public void checkY()
    {
        if(getY() >= 600)
        {
            getWorld().removeObject(this);
        }
    }

    public void makeShapes()
    {
        GreenfootImage shape = new GreenfootImage(w, w);

        shape.setColor(new Color(x, y, z));
        shape.fillOval(0, 0, w, w);

        setImage(shape);
    }
}
