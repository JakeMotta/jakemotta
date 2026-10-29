import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class Villain here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class Villain extends Actor
{

boolean outOfSpawn;
int movementTimer;
int villainSpeed;
int battleTimer;
int wallTimer;
int rMT;


    public Villain()
    {
        outOfSpawn = false;
        movementTimer = 0;
        villainSpeed = 1;
        battleTimer = 0;
        wallTimer = 0;
        rMT = 0;
    }
    
    /**
     * Act - do whatever the Villain wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
    //boolean to make sure the villains go out of spawn correctly
    if(outOfSpawn = false)
    {
        spawnMove();
    }
    if(outOfSpawn = true)
    {
        Movement();
        checkEdges();
        checkHero();
        checkMovement();
    }
    }    
    
    public void spawnMove()
    {
        if(getX()<=5)
        {
            setLocation(getX()+1, getY());
        }
        if(getX()>=795)
        {
            setLocation(getX()-1, getY());
        }
        if(getX()<=780 || getX()>=20)
        {
            outOfSpawn = true;
        }
    }
    
    public void Movement()
    {        
        move(villainSpeed);
        
        movementTimer++;
        
        if(movementTimer == 10)
        {  
        int VillainTurn = Greenfoot.getRandomNumber(100);
        if(VillainTurn <= 50)
        {
            turn(10);
        }
        else
        {
            turn(-10);
        }     
        movementTimer = 0;
        }
    }
    
    public void checkMovement()
    {
        if(villainSpeed == 0)
        {
            rMT++;
            if(rMT == 300)
            {
                villainSpeed = 1;
                rMT = 0;
            }
        }
    }
    
    public void checkEdges()
    {
        checkXEdge();
        checkYEdge();
    }
    
    public void checkXEdge()
    {
        if(getX()>=780 || getX()<=20)
        {
            wallTimer++;
            if(wallTimer == 50)
            {
            setRotation(getRotation()-180);
            wallTimer = 0;
            } 
        }
    }
    
    public void checkYEdge()
    {
        if(getY()>=580 || getY()<=20)
        {
            wallTimer++;
            if(wallTimer == 50)
            {
            setRotation(getRotation()-180);
            wallTimer = 0;
            } 
        }
    }
    
    public void checkHero()
    {
        if(isHeroHit())
        {
            villainSpeed = 0;
            return;
        }
    }
    
    public boolean isHeroHit()
    {
        Actor heroHit;
        
        heroHit = getOneIntersectingObject(Hero.class);
        
        if(heroHit != null)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}

