import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class Water here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class Water extends Scenery
{
private GreenfootImage waveOne;
private GreenfootImage waveTwo;
private GreenfootImage waveThree;

    public Water()
    {
        waveOne = new GreenfootImage("Water1.gif");
        waveTwo = new GreenfootImage("Water2.gif");
        waveThree = new GreenfootImage("Water3.gif");
    }
    
    /**
     * Act - do whatever the Water wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
       changeImage();
       //Greenfoot.delay(30);
    }    
    
    public void changeImage()
    {
        if(getImage() == waveOne)
        {
            setImage(waveThree);
        }
        else
        {
            setImage(waveOne);
        }
    }
}
