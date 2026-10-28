import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.awt.Font;
import java.awt.Color;

/**
 * Write a description of class smallText here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class airText extends GameText
{
    GreenfootImage board;
    int speed = 1;
    int lifeTimer = 150;
    int opacity = 255;
    
    public airText(String text)
    {
        makeBoard(text);
    }
    
    /**
     * Act - do whatever the smallText wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        scroll();
    }    
    
    public void scroll()
    {
        setLocation(getX(), getY()-speed);
        lifeTimer--;
        
        if(lifeTimer <= 100)
            opacity-=5;
            
        getImage().setTransparency(opacity);
            
        if(opacity <= 0)
            getWorld().removeObject(this);
    }
    
    public void makeBoard(String text)
    {
        board = new GreenfootImage(300, 50);
        
        Font font;
        font = new Font("Consolas", Font.BOLD, 15);
        
        board.setFont(font);
        board.drawString(text, 10, 20);
        
        setImage(board);
    }
    
    public void setGameText(String text)
    {
        GreenfootImage board = getImage();
        board.clear();
        board.drawString(text, 10, 20);
    }
}
