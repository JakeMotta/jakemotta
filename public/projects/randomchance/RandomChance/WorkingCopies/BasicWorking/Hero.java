import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class Hero here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class Hero extends Actor
{

int heroMovementTimer;
int heroSpeed;
int battleTimer;
boolean canMove;
int wallTimer;

int lifeCounter;
int killCounter;
boolean isAlive;

GameText myLife;
GameText myKills;

    public Hero(GameText lifeText, GameText killText)
    {
        heroMovementTimer = 0;
        heroSpeed = 1;      
        battleTimer = 0;
        canMove = true;
        wallTimer = 0;
        isAlive = true;

        lifeCounter = 100;
        killCounter = 0;
       
        myLife = lifeText;
        myKills = killText;
    }
    
    /**
     * Act - do whatever the Hero wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {     
        if(isAlive == true)
        {
        if(canMove == true)
        {
        heroMovement();
        }
        heroCheckEdges();
        checkVillain();
        myLife.setGameText("Life: " + lifeCounter);
        myKills.setGameText("Kills: " + killCounter); 
        }
    }    
    
    public void heroMovement()
    {
        move(heroSpeed);
        
        heroMovementTimer++;
        
        if(heroMovementTimer == 10)
        {  
        int heroTurn = Greenfoot.getRandomNumber(100);
        if(heroTurn <= 50)
        {
            turn(10);
        }
        else
        {
            turn(-10);
        }     
        heroMovementTimer = 0;
        }
    }
    
    public void heroCheckEdges()
    {
        heroCheckXEdge();
        heroCheckYEdge();
    }
    
    public void heroCheckXEdge()
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
    
    public void heroCheckYEdge()
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
    
    public void damageHero()
    {
        //damage is a random number up to 30 that can hurt the Hero
        int damage = Greenfoot.getRandomNumber(30);
        System.out.println("Damage is: " + damage);
        lifeCounter = lifeCounter-damage;
        
        if(lifeCounter <= 0)
        {
            getWorld().removeObject(this);
        }
    }
    
    public void checkVillain()
    {
        Actor villainHit;
        
        villainHit = getOneIntersectingObject(Villain.class);
        
        if(villainHit != null)
        {
            canMove = false;
            int victoryRate = Greenfoot.getRandomNumber(100);
            battleTimer++;
            
            if(battleTimer >=30)
            {
            if(victoryRate >= 15)
            {
                getWorld().removeObject(villainHit);
                killCounter++;
            }
            else
            {
                //introduce a counter to make sure Hero is only hit once
                int damageHit = 0;
                //increase the counter by 1, so it hits once
                damageHit++;
                if(damageHit == 1)
                {
                damageHero();
                damageHit = 0;
                }
            }
            battleTimer = 0;
            }
        }
        else
        {
            canMove = true;
        }
    }
    
    
}
