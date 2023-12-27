import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.awt.Font;
import java.awt.Color;

/**
 * Write a description of class TallGrass here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class ClosedSign extends Actor
{   
    public ClosedSign(String text)
    {
        
        createSign();
        
    }
    
    /**
     * Act - do whatever the TallGrass wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        
    }    
    
    public void createSign()
    {
        GreenfootImage closedSign = new GreenfootImage(329, 97);
        
        Font myFont;
        
        myFont = new Font("Times New Roman", Font.BOLD, 12);
        
        closedSign.setFont(myFont);
        
        closedSign.setColor(Color.BLACK);
        
        closedSign.drawString("NOTICE: Closed due to recent attacks!", 20, 30);
        
    }
}
