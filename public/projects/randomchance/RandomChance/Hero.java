import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class Hero here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class Hero extends Actor
{
GreenfootImage main;
GreenfootImage in1;
GreenfootImage in2;
GreenfootImage in3;
GreenfootImage in4;
GreenfootImage in5;
GreenfootImage in6;

int heroMovementTimer;
int heroSpeed;
int battleTimer;
boolean canMove;
int wallTimer;
boolean isInvinsible;
int lifeCounter;
int killCounter;
boolean isAlive;
int iCD;
int invinsibleTimer;
int inTimer;

//introduce a counter to make sure Hero is only hit once
int damageHit;

GameText myLife;
GameText myKills;

    public Hero(GameText lifeText, GameText killText)
    {
        main = new GreenfootImage("Green.gif");
        in1 = new GreenfootImage("Invinse1.gif");
        in2 = new GreenfootImage("Invinse2.gif");
        in3 = new GreenfootImage("Invinse3.gif");
        in4 = new GreenfootImage("Invinse4.gif");
        in5 = new GreenfootImage("Invinse5.gif");
        in6 = new GreenfootImage("Invinse6.gif");
        
        heroMovementTimer = 0;
        heroSpeed = 1;      
        battleTimer = 0;
        canMove = true;
        wallTimer = 0;
        isAlive = true;
        isInvinsible = false;
        lifeCounter = 100;
        killCounter = 0;
        iCD = 0;
        invinsibleTimer = 0;
        inTimer = 0;
        damageHit = 0;
        
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
        System.out.println("Boolean: " + isInvinsible);
        }
        heroCheckEdges();
        checkVillain();
        myLife.setGameText("Life: " + lifeCounter);
        myKills.setGameText("Kills: " + killCounter); 
        checkBoons();
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
        if(isInvinsible != true)
        {
        //damage is a random number up to 30 that can hurt the Hero
        int damage = Greenfoot.getRandomNumber(30);
        System.out.println("Damage is: " + damage);
        lifeCounter = lifeCounter-damage;
        }
        if(lifeCounter <= 0)
        {
            getWorld().removeObject(this);
        }
        
    }
    
    public void enemyDeath()
    {
        Blood blood;
        blood = new Blood();
        getWorld().addObject(blood, getX(), getY());
        
        int invinseDrop = Greenfoot.getRandomNumber(1000);
        System.out.println("invinsibility number is " + invinseDrop);
        if(invinseDrop < 50)
        {
            iCD = 2000;
        }
        
    }
    
    public void checkVillain()
    {
        Actor villainHit;
        
        villainHit = getOneIntersectingObject(Villain.class);
        
        if(villainHit != null)
        {
            canMove = false;
            battleTimer++;
            int successRate = Greenfoot.getRandomNumber(100);
            if(battleTimer >=30)
            {
            if(successRate >= 15)
            {
                System.out.println(successRate + " = victoryRate");
                enemyDeath();
                getWorld().removeObject(villainHit);
                killCounter++;
            }
            else
            {
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
    
    public void checkBoons()
    {
        checkHealth();
        checkStrong();
    }
    
    public void checkHealth()
    {
        Actor hP;
        
        hP = getOneIntersectingObject(Health.class);
        
        int hBonus = Greenfoot.getRandomNumber(15);
        //auto 15 health if picked up, plus a random chance up to 15 extra
        int health = 15 + hBonus;
        
        
        if(hP != null)
        {
            lifeCounter = lifeCounter + health;
        }
        
    }
    
    public void checkStrong()
    {
        if(iCD > 0)
        {
        iCD--;
        System.out.println("timer: " + iCD);
        
        invinsibleMethod();
        }
        if(iCD == 0)
        {
            isInvinsible = false;
            setImage(main);
            invinsibleTimer = 0;
        }
    }
    
    public void invinsibleMethod()
    {
        isInvinsible = true;
        
        if(isInvinsible == true)
        {
            invinsibleTimer++;
            
            if(invinsibleTimer != 1000)
            {
                inTimer++;
                
                if(inTimer <= 19)
                {
                 setImage(in1);
                }
                if(inTimer >= 20)
                {
                    if(inTimer <= 39)
                    {
                        setImage(in2);
                    }
                }
                if(inTimer >= 40)
                {
                    if(inTimer <= 59)
                    {
                        setImage(in3);
                    }
                }
                if(inTimer >= 60)
                {
                    if(inTimer <= 79)
                    {
                        setImage(in4);
                    }
                }
                if(inTimer >= 80)
                {
                    if(inTimer <= 99)
                    {
                        setImage(in5);
                    }
                }
                if(inTimer >= 100)
                {
                    if(inTimer <= 119)
                    {
                        setImage(in6);
                    }
                }
                if(inTimer == 120)
                {
                    inTimer = 0;
                }
            }
        }
        if(invinsibleTimer == 1000)
        {
            isInvinsible = false;
            setImage(main);
            invinsibleTimer = 0;
        }
    }
    
}
