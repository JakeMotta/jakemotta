import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.lang.Math;
import java.awt.Color;

/**
 * Write a description of class Ball here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class Ball extends Actor
{
    int wallTimer;
    int powerTimer;
    int timer;

    int maxShots;
    int shotTimer;

    int myScore;

    double powerSum;
    int power;
    int angle;

    double mX;
    double mY;
    double bX;
    double bY;

    boolean canMove;
    boolean wallHit;
    boolean canShoot;
    boolean outOfShots;
    boolean retryLevel;
    trail trail = new trail();
    Arrow arrow = new Arrow();
    dimScreen dimScreen = new dimScreen();
    player player = new player();

    public Ball(int levelShots, int score)
    {
        maxShots = levelShots;
        myScore = score;

        wallTimer = 0;
        powerTimer = 0;
        timer = 0;
        shotTimer = 0;

        score = 0;

        power = 0;
        powerSum = 0;
        angle = 0;

        canMove = false;
        wallHit = false;
        canShoot = true;
        outOfShots = false;
        retryLevel = false;

        makeBall();
    }

    public void makeBall()
    {
        GreenfootImage Ball = new GreenfootImage(24, 24);

        Ball.setColor(new Color(0, 0, 0));
        Ball.fillOval(0, 0, 24, 24);

        setImage(Ball);
    }

    public void act()
    {
        checkShots();
        updateStats();
        checkKeys(retryLevel);
        
        if(canShoot == true)
        {
            if(canMove == true)
            {
                slide();
                checkPower();
                arrow.updateBall(false); //should arrow follow mouse

                wallTimer++;
                timer++;
                shotTimer++;

            }
            else
            {
                checkMouse();
                addArrow();
                arrow.updateBall(true); //should arrow follow mouse                

                timer = 0;
                shotTimer = 0;

                if(outOfShots == true)
                {
                    player.updateMove(false);
                    canShoot = false;
                }
                else
                {
                    //player.updateMove(true);
                }
            }  
        }
        else
        {
            if(getWorld() instanceof levelOne) 
            {  
                levelOne currentWorld = (levelOne)getWorld();  
                currentWorld.levelFailed();  
            }
            if(getWorld() instanceof levelTwo) 
            {  
                levelTwo currentWorld = (levelTwo)getWorld();  
                currentWorld.levelFailed();  
            }
        }
    }

    public void slide()
    {
        move(power);
        checkBarriers();
        checkTarget();
        addTrail();
        myScore += 1;

        if(shotTimer == 1)
        {
            maxShots -= 1;
        }
    }

    public void checkTarget()
    {
        Target Target = (Target)getOneIntersectingObject(Target.class);

        if(Target != null)
        {
            if(getWorld() instanceof levelOne) 
            {  
                Greenfoot.setWorld(new levelTwo(myScore));
            }
        }
    }

    public void updateStats()
    {
        if(getWorld() instanceof levelOne) 
        {  
            levelOne currentWorld = (levelOne)getWorld();  
            currentWorld.updateScore(myScore);  
            currentWorld.updateShots(maxShots); 
        }
        if(getWorld() instanceof levelTwo) 
        {  
            levelTwo currentWorld = (levelTwo)getWorld();  
            currentWorld.updateScore(myScore);  
            currentWorld.updateShots(maxShots); 
        }
    }

    public void checkShots()
    {
        if(maxShots > 0)
        {
            canShoot = true;
        }
        else
        {
            outOfShots = true;
        }
    }

    public void checkPower()
    {
        powerTimer++;

        if(powerTimer == 10)
        {
            power -= 1;
            powerTimer = 0;
        }

        if(power <= 0)
        {
            power = 0;
            canMove = false;
        }
    }

    public void addArrow()
    {
        getWorld().addObject(arrow, getX(), getY());
        arrow.setLocation(getX(), getY());
    }

    public void updateArrowRotation(int recievedAngle)
    { 
        angle = recievedAngle; 

        setRotation(angle);  
    }

    public void checkMouse()
    {
        MouseInfo mouse = Greenfoot.getMouseInfo();

        if(Greenfoot.mouseMoved(null) & canMove == false)
        {
            mX = mouse.getX();
            mY = mouse.getY();

            angle = ((int)(180*Math.atan2(mY-getY(),mX-getX())/Math.PI));
        }

        if(Greenfoot.mouseMoved(null) & canMove == false)
        {
            bX = getX();
            bY = getY();

            if(mX < 0)
            {
                mX = (mX * -1);
            }
            if(mY < 0)
            {
                mY = (mY * -1);
            }

            powerSum = Math.sqrt((Math.pow((mX - bX), 2)) + (Math.pow((mY - bY), 2)));

            power = (int)powerSum;
            power = (power / 10);

            if(power < 0)
            {
                power = (power * -1);
            }
            if(power > 100)
            {
                power = 100;
            }
            arrow.updateArrow(power);            
        }

        if(Greenfoot.mousePressed(null))
        {
            setRotation(angle);         
            canMove = true;      
            removeArrow();
        }
    }

    public void removeArrow()
    {
        getWorld().removeObject(arrow);
    }

    public void checkBarriers()
    {
        Actor bL;
        bL = getOneIntersectingObject(barriersLong.class);

        Actor bF;
        bF = getOneIntersectingObject(barriersFlat.class);

        if(bL != null & wallTimer > 1)
        {
            setRotation(180 - getRotation());

            wallTimer = 0;
        }

        if(bF != null & wallTimer > 1)
        {
            setRotation(360 - getRotation());

            wallTimer = 0;
        }
    }

    public void addTrail()
    {
        getWorld().addObject(new trail(), getX(), getY());
    }

    public void checkKeys(boolean rT)
    {
        retryLevel = rT;
        
        if(Greenfoot.isKeyDown("r"))
        {
            retryLevel = true;
        }
        else
        {
            retryLevel = false;
        }

        if(retryLevel == true)
        {
            if(getWorld() instanceof levelOne) 
            {  
                Greenfoot.setWorld(new levelOne()); 
            }
            if(getWorld() instanceof levelTwo) 
            {  
                Greenfoot.setWorld(new levelTwo(myScore));
            }
            
            retryLevel = false;
        }
    }
}
