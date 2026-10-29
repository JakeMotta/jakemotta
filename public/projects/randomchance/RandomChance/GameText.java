import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.awt.Font;
import java.awt.Color;
/**
 * Write a description of class GameText here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class GameText extends Actor
{
    GreenfootImage board;
    
    int boardLengthX;
    
    public GameText(String text)
    {
        makeBoard(text);
    }
    /**
     * Act - do whatever the GameText wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        // Add your action code here.
    }
    
    public void makeBoard(String text)
    {
        int boardLengthX = text.length()*20;
        
        board = new GreenfootImage(boardLengthX, 30);
        
        Font myFont;
        myFont = new Font("Arial", Font.BOLD, 20);
        
        board.setFont(myFont);
        
        board.drawString(text, 10, 20);
        
        setImage(board);
    }
    
    public void setGameText(String text)
    {
        GreenfootImage board = getImage();
        
        board.clear();
        
        board.drawString(text, 10,20);
    }
}
