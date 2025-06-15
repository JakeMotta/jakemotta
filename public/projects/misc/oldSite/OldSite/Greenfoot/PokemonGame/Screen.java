import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class Screen here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class Screen extends Actor
{
//the two title screens
GreenfootImage titleOn;
GreenfootImage titleOff;

//counter for the blinking effect
int blinker;


    public Screen()
    {
        titleOn = new GreenfootImage("TitleScreen.gif");
        titleOff = new GreenfootImage("TitleScreen2.gif");
        
        blinker = 0;
        
    }
    
    /**
     * Act - do whatever the Screen wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        //methods name
        blink();
        
        changeWorld();
    }    
    
    public void blink()
    {
        blinker++;
        
        if(blinker <= 49)
        {
            setImage(titleOn);
        }
        if(blinker >=50)
        {
            setImage(titleOff);
        }
        if(blinker == 100)
        {
            setImage(titleOn);
            
            blinker = 0;
        }
    }
    
    public void changeWorld()
    {
        if(Greenfoot.isKeyDown("space"))
        {
            World TrainingVille = new TrainingVille();
            Greenfoot.setWorld(TrainingVille);
        }
    }
}
