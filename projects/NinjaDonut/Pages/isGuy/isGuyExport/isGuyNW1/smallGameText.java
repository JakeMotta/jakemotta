import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.awt.Font;
import java.awt.Color;

/**
 * Write a description of class GameText here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class smallGameText extends gameText
{
    GreenfootImage board;
    
    public smallGameText(String text)
    {
        makeBoard(text);
    }
    
    /**
     * Act - do whatever the GameText wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
    }    
    
    public void makeBoard(String text)
    {
        board = new GreenfootImage(300, 50);
        
        Font myFont;
        myFont = new Font("Arial", Font.BOLD, 15);
        
        board.setFont(myFont);
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
