import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.util.List;  
/**
 * Write a description of class ufo here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class ufo extends enemies
{
    GreenfootImage ufoWhite;
    
    GreenfootImage ufoBlue1;
    GreenfootImage ufoBlue2;
    GreenfootImage ufoBlue3;
    GreenfootImage ufoBlue4;
    GreenfootImage ufoBlue5;
    GreenfootImage ufoBlue6;
    GreenfootImage ufoBlue7;
    
    GreenfootImage ufoRed1;
    GreenfootImage ufoRed2;
    GreenfootImage ufoRed3;
    GreenfootImage ufoRed4;
    GreenfootImage ufoRed5;
    GreenfootImage ufoRed6;
    GreenfootImage ufoRed7;
    
    int ufoHP;
    
    int pickAttack; //Picks which attack is done
    int changeBlueImageTimer;
    int changeRedImageTimer;
    int speed;
    int pickAttackTimer;
    int attackTimer;
    int nextAttackTimer;
    int bulletDamageTimer;
    int locationTimer;
    int yLocation;
    int attackCountdown;
    
    int guyX;
    int guyY;
    
    boolean canAttack;
    boolean isAttack;
    boolean movingLeft;
    boolean movingRight;
    boolean notMoving;
    boolean attacked;
    boolean isAlive;
    
    public ufo()
    {
        ufoWhite = new GreenfootImage("ufoWhite.png");
        
        ufoBlue1 = new GreenfootImage("ufoBlue1.png");
        ufoBlue2 = new GreenfootImage("ufoBlue2.png");
        ufoBlue3 = new GreenfootImage("ufoBlue3.png");
        ufoBlue4 = new GreenfootImage("ufoBlue4.png");
        ufoBlue5 = new GreenfootImage("ufoBlue5.png");
        ufoBlue6 = new GreenfootImage("ufoBlue6.png");
        ufoBlue7 = new GreenfootImage("ufoBlue7.png");
        
        ufoRed1 = new GreenfootImage("ufoRed1.png");
        ufoRed2 = new GreenfootImage("ufoRed2.png");
        ufoRed3 = new GreenfootImage("ufoRed3.png");
        ufoRed4 = new GreenfootImage("ufoRed4.png");
        ufoRed5 = new GreenfootImage("ufoRed5.png");
        ufoRed6 = new GreenfootImage("ufoRed6.png");
        ufoRed7 = new GreenfootImage("ufoRed7.png");
                
        setImage(ufoWhite);
        
        ufoHP = 10;
        
        changeBlueImageTimer = 0;
        changeRedImageTimer = 0;
        speed = 2;
        pickAttackTimer = 0;
        attackTimer = 0;
        nextAttackTimer = 0;
        bulletDamageTimer = 0;
        locationTimer = 0;
        yLocation = 0;
        attackCountdown = 0;
        
        guyX = 0;
        guyY = 0;
        
        canAttack = true;
        isAttack = false;
        movingLeft = false;
        movingRight = false;
        attacked = false;
        isAlive = true;
    }
    
    /**
     * Act - do whatever the ufo wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        if(isAlive == true)
        {
            checkGuyInRange();
            updateGuyPosition(guyX, guyY);
            attacked();
            checkBullet();
            hover();
            
            if(isAttack == true & canAttack == true)
            {
                attackTimer++;
                if(attackTimer >= 15)
                {
                    attack();
                }
            }
            
            if(ufoHP <= 0)
            {
                isAlive = false;
            }
        }
        else
        {
            getWorld().removeObject(this);
        }
    }      
    
    public void updateGuyPosition(int x, int y)
    {
        guyX = x;
        guyY = y;
    }
    
    public void checkBullet()
    {
        Actor bullet;
        bullet = getOneIntersectingObject(bullet.class);
        
        if(bullet != null)
        {
            bulletDamageTimer++;
            if(bulletDamageTimer == 1)
            {
                ufoHP = ufoHP - 1;
                bulletDamageTimer = 0;
            }
        }
        else
        {
        }
    }
    
    public boolean checkGuyInRange()  
    {  
        List<Guy> list_guy_=getObjectsInRange(400,Guy.class);  
        for(Guy guy_:list_guy_)  
        {  
            follow(); //Follow Guy
        }  
        return list_guy_ != null;
    }
    
    public void follow()
    {  
        if(getX() >= guyX)
        {
            move(-speed);
            movingLeft = true;
            movingRight = false;
        }
        if(getX() < guyX)
        {
            move(speed);
            movingRight = true;
            movingLeft = false;
        }
        
        if(getX() == guyX)
        {
            attackCountdown++;
            
            if(attackCountdown >= 10)
            {
                isAttack = true;
                attackCountdown = 0;
            }
        }
    }
    
    public void attack()
    {
        pickAttackTimer++;
        if(pickAttackTimer == 1)
        {
            pickAttack = Greenfoot.getRandomNumber(9);
        }
            
        if(pickAttack <= 4)
        {
            attackBlue();
        }
        else if(pickAttack > 5)
        {
            attackRed();
        }
    }
    
    public void attacked()
    {
        if(attacked == true)
        {
            canAttack = false;
            nextAttackTimer++;
        }
        
        if(nextAttackTimer == 250)
        {
            canAttack = true;
            attacked = false;
            nextAttackTimer = 0;
        }
    }
    
    public void hover()
    {
        locationTimer++;
        
        if(locationTimer == 2 & yLocation <= 19)
        {
            yLocation++;
            setLocation(getX(), getY()+1);
            locationTimer = 0;
        }
        if(yLocation >= 20)
        {
            if(yLocation <= 39)
            {
                if(locationTimer == 2)
                {
                    yLocation++;
                    setLocation(getX(), getY()-1);
                    locationTimer = 0;
                }
            }
        }
        
        if(yLocation == 40)
        {
            yLocation = 0;
        }
    }
    
    public void attackBlue()
    {
        changeBlueImageTimer++;
        if(changeBlueImageTimer >= 1)
        {
            if(changeBlueImageTimer <= 5)
            {
                setImage(ufoBlue1);
            }
        }
        if(changeBlueImageTimer >= 6)
        {
            if(changeBlueImageTimer <= 10)
            {
                setImage(ufoBlue2);
            }
        }
        if(changeBlueImageTimer >= 11)
        {
            if(changeBlueImageTimer <= 15)
            {
                setImage(ufoBlue3);
            }
        }
        if(changeBlueImageTimer >= 16)
        {
            if(changeBlueImageTimer <= 20)
            {
                setImage(ufoBlue4);
            }
        }
        if(changeBlueImageTimer >= 21)
        {
            if(changeBlueImageTimer <= 25)
            {
                setImage(ufoBlue5);
            }
        }
        if(changeBlueImageTimer >= 26)
        {
            if(changeBlueImageTimer <= 30)
            {
                setImage(ufoBlue6);
            }
        }
        if(changeBlueImageTimer >= 31)
        {
            if(changeBlueImageTimer <= 65)
            {
                setImage(ufoBlue7);
            }
        }
        if(changeBlueImageTimer == 65)
        {
            ufoBeamBlue ufoBeamBlue;
            ufoBeamBlue = new ufoBeamBlue();
            getWorld().addObject(ufoBeamBlue, getX(), getY()+87);
                
            changeBlueImageTimer = 0;
            attackTimer = 0;
            speed = 2;
            attacked = true;
            isAttack = false;
            setImage(ufoWhite);
        }
    }
    
    public void attackRed()
    {
        changeRedImageTimer++;
        if(changeRedImageTimer >= 1)
        {
            if(changeRedImageTimer <= 5)
            {
                setImage(ufoRed1);
            }
        }
        if(changeRedImageTimer >= 6)
        {
            if(changeRedImageTimer <= 10)
            {
                setImage(ufoRed2);
            }
        }
        if(changeRedImageTimer >= 11)
        {
            if(changeRedImageTimer <= 15)
            {
                setImage(ufoRed3);
            }
        }
        if(changeRedImageTimer >= 16)
        {
            if(changeRedImageTimer <= 20)
            {
                setImage(ufoRed4);
            }
        }
        if(changeRedImageTimer >= 21)
        {
            if(changeRedImageTimer <= 25)
            {
                setImage(ufoRed5);
            }
        }
        if(changeRedImageTimer >= 26)
        {
            if(changeRedImageTimer <= 30)
            {
                setImage(ufoRed6);
            }
        }
        if(changeRedImageTimer >= 31)
        {
            if(changeRedImageTimer <= 65)
            {
                setImage(ufoRed7);
            }
        }
        if(changeRedImageTimer == 65)
        {
            ufoBeamRed ufoBeamRed;
            ufoBeamRed = new ufoBeamRed();
            getWorld().addObject(ufoBeamRed, getX(), getY()+87);
            
            
            changeRedImageTimer = 0;
            attackTimer = 0;
            speed = 2;
            attacked = true;
            isAttack = false;
            setImage(ufoWhite);
        }
    }
}
