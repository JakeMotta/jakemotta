import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class ninjaStar here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class enemyStar extends Enemies
{
    int speed = 5;
    int timer = 0;
    int life = 150;
    int direction = 1;
    boolean ninjaHit = false; 
    int deathTimer = 0;
    int g = 0;
    int gravity = 0;
    boolean Gravity = false;
    boolean swordHit = false;
    int swordTimer = 0;
    boolean starCancel = false;
    int collisionTimer = 0;
    boolean death = false;
    int deleteTimer = 0;
    boolean timeOut = false;
    boolean onGround = false;
    
    public enemyStar(int d)
    {
        direction = d;
    }
    
    /**
     * Act - do whatever the ninjaStar wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        if(ninjaHit == true)
            death = true;
        
        if(death != true && onGround == false)
        {
            move();
            rotate();
            checkHit();            
            checkWalls();     
            
            life--;
            
            if(life <= 0)
                Gravity = true;
                
            if(Gravity == true)
                gravity();
        }
        else
            death();
    }    
    
    public void move()
    {
        if(direction == 1)
            moveRight();
        if(direction == 0)
            moveLeft();
    }
    
    public void moveRight()
    {
        setLocation(getX()+speed, getY());
    }
    
    public void moveLeft()
    {
        setLocation(getX()-speed, getY());
    }
    
    public void rotate()
    {
        timer+=10;
        if(direction == 1)
            setRotation(timer); 
        if(direction == 0)
            setRotation(timer*-1); 
    }
    
    public void checkHit()
    {
        Actor ninja;
        ninja = getOneIntersectingObject(NinjaDonut.class);
        
        if(ninja != null)
        {
             if(ninja instanceof ninjaStar)
                if(collisionTimer == 0)
                    starCancel();
             if(ninja instanceof Ninja)
                if(collisionTimer == 0)
                    ninjaHit();
             if(ninja instanceof Sword)
                if(collisionTimer == 0)
                    swordCancel();
        }
    }
    
    public void starCancel()
    {
        collisionTimer++;
        starCancel = true;
        speed*=-1;
        Gravity = true;
    }
    
    public void swordHit(boolean h, int t) //canHit and attackTimer
    {
        swordHit = h;
        swordTimer = t;
    }
    
    public void ninjaHit()
    {
        collisionTimer++;
        ninjaHit = true;
    }
    
    public void swordCancel()
    {
        if(swordHit == true)
        {
           Sword sword;
           sword = (Sword)getOneIntersectingObject(Sword.class);
           
           collisionTimer++;
           starCancel = true;
           Gravity = true;
           speed = 8;
           System.out.println("SWORD HIT");
           if(sword != null)
               sword.points(50);
           
            if(swordTimer <= 15) //downward swing
            {
                if(direction == 1)
                    setLocation(getX()-speed, getY()+speed);
                if(direction == 0)
                    setLocation(getX()+speed, getY()+speed);
           }
           if(swordTimer >= 16) //front swing
            {
                if(direction == 1)
                    setLocation(getX()-speed, getY()-speed);
                if(direction == 0)
                    setLocation(getX()+speed, getY()-speed);
           }
        }
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
    
    public void checkWalls()
    {
        if(getY() >= 397)
            onGround = true;
    }
    
    public void death() //hits a target and stops, then dies
    {
        if(ninjaHit == true)
            getWorld().removeObject(this);
    }
}
