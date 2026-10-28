import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class Blood here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class Blood extends Actor
{
    int bloodCount = 5;
    int bloodTimer = 0;
    int g = 0;
    int gravity = 0;
    boolean onGround = false;
    int sprayX = Greenfoot.getRandomNumber(10);
    int sprayY = Greenfoot.getRandomNumber(10);
    int speedDecrease = 0;
    int speedTimer = 0;
    int life = 150;
    boolean Alive = true;
    int w = Greenfoot.getRandomNumber(8)+1;
    int survive = Greenfoot.getRandomNumber(10);
    
    public Blood()
    {
        makeBlood();
    }

    /**
     * Act - do whatever the Blood wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        if(Alive == true)
        {
            bloodEffect();
            checkWalls();
            
            if(survive != 7)
                die();
            
            
            if(onGround == true)
                gravity = 0;
            else
                gravity();
        }
        else
            getWorld().removeObject(this);
    }  
    
    public void bloodEffect()
    {
        speedTimer++;
        if(speedTimer == 6)
            speedDecrease++;
            
        if(sprayX > 0)
            sprayX = sprayX - speedDecrease;
        if(sprayY > 0)
        sprayY = sprayY - speedDecrease;
        
        setLocation(getX()+sprayX, getY()-sprayY);
    }
    
    public void checkWalls()
    {
        if(getY() >= 398)
            onGround = true;
        else
            onGround = false;
    }
    
    public void gravity()
    {
        g++;
        if(g == 3)
        {
            gravity++;
            g = 0;
        }
    
        setLocation(getX(), getY()+gravity); 
    }
    
    public void die()
    {
        life--;
        if(life <= 0)
        {
            Alive = false;
        }
    }
    
    public void makeBlood()
    {
        GreenfootImage blood = new GreenfootImage(w, w);
        blood.drawRect(w, w, w, w);
        blood.setColor(java.awt.Color.RED);
        blood.fill();
        setImage(blood);
    }
}
