import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.awt.Color;
import java.awt.Font;

/**
 * Write a description of class dimScreen here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class retryScreen extends Actor
{
    boolean canMove;
    boolean retry;
    
    //Ball Ball = new Ball();
    public retryScreen()
    {
        makeScreen();

        canMove = true;
        retry = false;
    }

    /**
     * Act - do whatever the dimScreen wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        moveScreen();
        checkMouse();
    }    

    public void makeScreen()
    {
        GreenfootImage screen = new GreenfootImage(400, 200);
        screen.setColor(new Color(0, 0, 0));
        screen.fillRect(0, 0, 400, 200);

        Font myFont;

        myFont = new Font("Times New Roman", Font.BOLD, 50);

        screen.setFont(myFont);
        screen.setColor(Color.WHITE);

        screen.drawString("Retry", 150, 50);

        setImage(screen);

    }

    public void checkMouse()
    {
        MouseInfo mouse = Greenfoot.getMouseInfo();

        if(Greenfoot.mouseMoved(null))
        {
            int mX = mouse.getX();
            int mY = mouse.getY();

            if((mY <= 170 & mY > 110 & mX >= 245 & mX <= 375))
            {
                GreenfootImage screen = getImage();
                screen.clear();

                screen = new GreenfootImage(400, 200);
                screen.setColor(new Color(0, 0, 0));
                screen.fillRect(0, 0, 400, 200);
                Font myFont;
                myFont = new Font("Times New Roman", Font.BOLD, 50);
                screen.setFont(myFont);
                screen.setColor(Color.RED);
                screen.drawString("Retry", 150, 50);
                setImage(screen);
            }
            else
            {
                GreenfootImage screen = getImage();
                screen.clear();

                screen = new GreenfootImage(400, 200);
                screen.setColor(new Color(0, 0, 0));
                screen.fillRect(0, 0, 400, 200);
                Font myFont;
                myFont = new Font("Times New Roman", Font.BOLD, 50);
                screen.setFont(myFont);
                screen.setColor(Color.WHITE);
                screen.drawString("Retry", 150, 50);
                setImage(screen);
            }
        }

        if(Greenfoot.mouseClicked(this))
        {
            retry = true;
            //Ball.checkKeys(retry);
        }
    }

    public void moveScreen()
    {
        if(getX() == 300)
        {
            canMove = false;
        }
        else
        {
            canMove = true;
        }

        if(canMove == true)
        {
            setLocation(getX()+10, getY());
        }
        else
        {
            setLocation(getX()+0, getY());
        }
    }
}
