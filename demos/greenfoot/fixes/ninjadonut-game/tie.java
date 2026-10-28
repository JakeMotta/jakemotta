// FIXED on 2026-10-28 for jakemotta.com: Ninjai/tie.java with the changes marked FIXED below. The site's build
// reads it from fixes.jar ahead of ninjadonut.jar (docs/projects/ninjadonut-game.md, Fixes).
import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class tie here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class tie extends NinjaDonut
{
    GreenfootImage rtie1 = new GreenfootImage("rtie1.gif");
    GreenfootImage rtie2 = new GreenfootImage("rtie2.gif");
    GreenfootImage rtie3 = new GreenfootImage("rtie3.gif");
    GreenfootImage rtie4 = new GreenfootImage("rtie4.gif");
    GreenfootImage rtie5 = new GreenfootImage("rtie5.gif");
    
    GreenfootImage ltie1 = new GreenfootImage("ltie1.gif");
    GreenfootImage ltie2 = new GreenfootImage("ltie2.gif");
    GreenfootImage ltie3 = new GreenfootImage("ltie3.gif");
    GreenfootImage ltie4 = new GreenfootImage("ltie4.gif");
    GreenfootImage ltie5 = new GreenfootImage("ltie5.gif");
    
    int timer = 0;
    int ninjaX = 0;
    int ninjaY = 0;
    int ninjaDirection = 0;
    int lastNinjaDirection = 1;
    int opacity = 255;
    
    public tie()
    {
    }
    
    /**
     * Act - do whatever the tie wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act()
    {
        // FIXED: follow where the ninja is now. The world hands its position on before he moves, from his last
        // act, so in a jump the headband trailed him by two acts, up to 24 pixels
        if(getWorld() instanceof levelOne)
        {
            Ninja ninja = ((levelOne)getWorld()).ninja;
            if(ninja != null && ninja.getWorld() != null)
                ninjaInfo(ninja.getX(), ninja.getY());
        }
        location();
    }        
    
    public void updateNinja(int z, int lD, int o)
    {       
        //ninjaX = ((levelOne) getWorld()).ninjaX; 
        ninjaDirection = z;
        lastNinjaDirection = lD;
        opacity = o;      
    }
    
    public void location()
    {
        if(ninjaDirection == 0)
        {
            if(lastNinjaDirection == 1)
                moveRight();    
            if(lastNinjaDirection == 2)
                moveLeft(); 
        }
        if(ninjaDirection == 1)
            moveRight(); 
        if(ninjaDirection == 2)
            moveLeft(); 
            
        getImage().setTransparency(opacity); 
    }
    
    public void moveRight()
    {
        rcycle();
        setLocation(ninjaX-35, ninjaY-22);
    }
    
    public void moveLeft()
    {
        lcycle();
        setLocation(ninjaX+35, ninjaY-22);
    }
    
    public void rcycle()
    {
        timer++;
        
        if(timer < 5)
            setImage(rtie1);
        if(timer >= 5)
            if(timer < 9)
                setImage(rtie2);
        if(timer >= 9)
            if(timer < 14)
                setImage(rtie3);
        if(timer >= 14)
            if(timer < 19)
                setImage(rtie4);
        if(timer >= 19)
            if(timer < 24)
                setImage(rtie5);
        if(timer == 24)
            timer = 0;
    }
    
    public void lcycle()
    {
        timer++;
        
        if(timer < 5)
            setImage(ltie1);
        if(timer >= 5)
            if(timer < 9)
                setImage(ltie2);
        if(timer >= 9)
            if(timer < 14)
                setImage(ltie3);
        if(timer >= 14)
            if(timer < 19)
                setImage(ltie4);
        if(timer >= 19)
            if(timer < 24)
                setImage(ltie5);
        if(timer == 24)
            timer = 0;
    }
    
    public void ninjaInfo(int x, int y)
    {
        ninjaX = x;
        ninjaY = y;
    }
}
