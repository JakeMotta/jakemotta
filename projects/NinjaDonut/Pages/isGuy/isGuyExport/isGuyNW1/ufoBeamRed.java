import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.awt.Color;
import java.awt.Font;

/**
 * Write a description of class testBeam here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class ufoBeamRed extends laserBeams
{
    //timer to remove laserBeam
    int lifeSpanTimer;
    
    public ufoBeamRed()
    {
        //change lifeSpanTimer to change the laserBeam's duration
        lifeSpanTimer = 11;
        
        drawImage();
    }
    
    /**
     * Act - do whatever the testBeam wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        lifeSpan();
    }    
    
    public void drawImage()
    {
                GreenfootImage blueLaser = new GreenfootImage(20, 148);
        
                blueLaser.setColor(new Color(255, 0, 0, 100));
        
                blueLaser.fillRect(0, 0, 20, 148);
        
                setImage(blueLaser);
    }
    
    public void lifeSpan()
    {
        lifeSpanTimer--;
        
        if(lifeSpanTimer == 0)
        {
            getWorld().removeObject(this);
        }
    }
}