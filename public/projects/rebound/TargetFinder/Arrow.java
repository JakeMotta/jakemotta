import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.awt.Color;

/**
 * Write a description of class Arrow here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class Arrow extends Actor
{
    int mx;
    int my;
    double colorLevel;
    boolean giveAngle = true;

    public Arrow()
    {
        colorLevel = 0;

        makeArrow();
    }

    public void act() 
    {
        checkMouse();
    }    

    public void makeArrow()
    {
        GreenfootImage Arrow = new GreenfootImage(100, 20);

        Arrow.setColor(new Color(255, 0, 0));
        Arrow.fillRect(0, 0, 100, 20);   

        setImage(Arrow);
    }

    public void checkMouse()
    {
        MouseInfo mouse = Greenfoot.getMouseInfo();
        
        if(Greenfoot.mouseMoved(null) & giveAngle == true)
        {
            mx = mouse.getX();
            my = mouse.getY();

            setRotation((int)(180*Math.atan2(mouse.getY()-getY(),mouse.getX()-getX())/Math.PI));

        }
    }

    public void updateArrow(double recievedPower)
    {
        colorLevel = recievedPower;
        int newColor = (int)colorLevel;

        GreenfootImage Arrow = getImage();
        Arrow.clear();

        if(colorLevel >= 100)
        {
            Arrow.setColor(new Color(255, 0, 0));
            Arrow.fillRect(0, 0, 100, 20);
        }
        else
        {
            Arrow.setColor(new Color(newColor+150, 0, 0));
            Arrow.fillRect(0, 0, newColor, 20);
        }
    }   

    public void updateBall(boolean canMove)
    {
        giveAngle = canMove;
    }
}
