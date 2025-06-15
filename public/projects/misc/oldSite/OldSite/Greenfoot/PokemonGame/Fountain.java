import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class Fountain here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class Fountain extends Barriers
{
  private GreenfootImage fountain;
private GreenfootImage fountain2;
private GreenfootImage fountain3;
private GreenfootImage fountain4;
private GreenfootImage fountain5;

//times out fountain waves
int fountainTimer;

    public Fountain()
    {
        fountain = new GreenfootImage("Fountain.gif");
        fountain2 = new GreenfootImage("Fountain2.gif");
        fountain3 = new GreenfootImage("Fountain3.gif");
        fountain4 = new GreenfootImage("Fountain4.gif");
        fountain5 = new GreenfootImage("Fountain5.gif");
        
        fountainTimer = 0;
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
    fountainTimer++;
        
    if(fountainTimer <= 2)
    {
        setImage(fountain); 
    }
    if(fountainTimer >= 3)  
    {
        if(fountainTimer <= 5)
        {
        setImage(fountain2);
        }
    }
    if(fountainTimer >= 6)  
    {
        if(fountainTimer <= 8)
        {
        setImage(fountain3);
        }
    }
    if(fountainTimer >= 9)  
    {
        if(fountainTimer <= 11)
        {
        setImage(fountain4);
        }
    }
    if(fountainTimer >= 12)  
    {
        if(fountainTimer <= 14)
        {
        setImage(fountain5);
        }
    }
    if(fountainTimer == 15)
    {
        fountainTimer = 0;
    }
}  
}
