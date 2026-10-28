import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.awt.Color;
import java.awt.Font;

/**
 * Write a description of class gameText here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class GameTextLarge extends GameText
{
    GreenfootImage board;
    
    public GameTextLarge(String text)
    {
        makeText(text);
    }
    
    /**
     * Act - do whatever the gameText wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        // Add your action code here.
    }    
    
    public void makeText(String text)
    {
        board = new GreenfootImage(text.length()*20, 50);
        board.setColor(Color.BLACK);
        
        Font myFont;
        myFont = new Font("Times New Roman", Font.BOLD, 50);
        
        board.setFont(myFont);
        
        setImage(board);
    }
    
    public void setGameText(String text)
    {
        GreenfootImage board = getImage();
        
        board.clear();
        
        board.drawString(text, 10,20);
    } 
}
