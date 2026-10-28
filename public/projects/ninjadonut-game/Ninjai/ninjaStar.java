import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class ninjaStar here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class ninjaStar extends NinjaDonut
{
    int speed = 12;
    int timer = 0;
    int life = 100;
    int direction = 1;
    int lastDirection = 1;
    boolean hit = false; 
    int deathTimer = 0;
    int g = 0;
    int gravity = 0;
    boolean Gravity = false;
    int points = 0;
    int collisionTimer = 0;
    boolean hitStar = false;
    boolean pointsGiven = false;
    boolean death = false;
    
    airText airText;
    public ninjaStar(int d, int ld)
    {
        direction = d;  
        lastDirection = ld;
        airText = new airText("");  
    }
    
    /**
     * Act - do whatever the ninjaStar wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        if(hit != true)
        {
            if(death == false)
            {
                life--;
            
                move();
                rotate();
                checkHit();
                checkWalls();
            
                if(life <= 0)
                    Gravity = true;
            
                if(Gravity == true)
                    gravity();  
            }
        }
        else
            death();
    }    
    
    public void move()
    {
        if(direction == 0) //0 is NOT moving, gets the way ninja is facing. 
        {
            if(lastDirection == 1)
                moveRight();
            if(lastDirection == 2)
                moveLeft();
        }
        if(direction == 1)
            moveRight();
        if(direction == 2)
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
        setRotation(timer); 
    }
    
    public void checkHit()
    {
        Enemy enemy;
        enemy = (Enemy)getOneIntersectingObject(Enemy.class);
        
        if(enemy != null)
             if(enemy.death != true)
                hit = true;      
        
        enemyStar enemyStar;
        enemyStar = (enemyStar)getOneIntersectingObject(enemyStar.class);
        
        if(enemyStar != null && enemyStar.death == false) 
            if(collisionTimer == 0)
                starCancel();
    }
    
    public void starCancel()
    {
        collisionTimer++;
        speed*=-1;
        Gravity = true;
        hitStar = true;
            
        points(50);
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
        {
            death = true;
        }
    }
    
    public void death() //hits a target and stops, then dies
    {
        Enemy enemy;
        enemy = (Enemy)getOneIntersectingObject(Enemy.class);
        
        if(enemy != null && enemy.death != true && enemy.spawn == true) //Hitting an enemy off spawn
             points(150);  
                
        if(hitStar == false) //Hitting an enemy
            points(100);
        if(hitStar == true) //Hitting an enemy star
            points(50);
        if(hit == true && collisionTimer >= 1) //Hitting an enemy star, then an enemy
            points(150);
     
        getWorld().removeObject(this);
    }
    
    public void points(int recievedPoints)
    {
        points = recievedPoints;
        
        if(direction == 0) //0 is NOT moving, gets the way ninja is facing. 
        {
            if(lastDirection == 1)
                getWorld().addObject(new airText("+" + points), getX(), getY());
            if(lastDirection == 2)
                getWorld().addObject(new airText("+" + points), getX(), getY());
        }
        if(direction == 1)
            getWorld().addObject(new airText("+" + points), getX(), getY());
        if(direction == 2)
            getWorld().addObject(new airText("+" + points), getX(), getY());
            
        if(getWorld() instanceof levelOne) 
        {  
            levelOne currentWorld = (levelOne)getWorld();  
            currentWorld.updatePoints(points);  
        }
    }
}
