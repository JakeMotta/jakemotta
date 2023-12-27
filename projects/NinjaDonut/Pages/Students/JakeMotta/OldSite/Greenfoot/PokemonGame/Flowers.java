import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class Water here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class Flowers extends Scenery
{
private GreenfootImage flower1;
private GreenfootImage flower2;
private GreenfootImage flower3;

//times out waves
int flowerTimer;

    public Flowers()
    {
        flower1 = new GreenfootImage("Flower1.gif");
        flower2 = new GreenfootImage("Flower2.gif");
        flower3 = new GreenfootImage("Flower3.gif");
        
        flowerTimer = 0;
    }
    
    /**
     * Act - do whatever the Water wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
       changeImage();
    }    
    
    public void changeImage()
    {
    flowerTimer++;
        
    if(flowerTimer <= 9)
    {
        setImage(flower1); 
    }
    if(flowerTimer >= 10)  
    {
        if(flowerTimer <= 19)
        {
        setImage(flower2);
        }
    }
    if(flowerTimer >= 20)  
    {
        if(flowerTimer <= 29)
        {
        setImage(flower3);
        }
    }
    if(flowerTimer == 30)
    {
        flowerTimer = 0;
    }
}
}
