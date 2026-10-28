import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.util.List; 

/**
 * Write a description of class Enemy here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class Enemy extends Enemies
{
    GreenfootImage stand = new GreenfootImage("enemyStand.png");
    GreenfootImage base = new GreenfootImage("enemyBase.png");
    GreenfootImage starHit = new GreenfootImage("enemyStarHit.png");
    
    GreenfootImage rrun1 = new GreenfootImage("enemyRRun1.png");
    GreenfootImage rrun2 = new GreenfootImage("enemyRRun2.png");
    GreenfootImage rrun3 = new GreenfootImage("enemyRRun3.png");
    GreenfootImage rrun4 = new GreenfootImage("enemyRRun4.png");
    GreenfootImage rrun5 = new GreenfootImage("enemyRRun5.png");
    
    GreenfootImage lrun1 = new GreenfootImage("enemyLRun1.png");
    GreenfootImage lrun2 = new GreenfootImage("enemyLRun2.png");
    GreenfootImage lrun3 = new GreenfootImage("enemyLRun3.png");
    GreenfootImage lrun4 = new GreenfootImage("enemyLRun4.png");
    GreenfootImage lrun5 = new GreenfootImage("enemyLRun5.png");
    
    GreenfootImage swordDeath1 = new GreenfootImage("EnemySwordDeath1.png");
    GreenfootImage swordDeath2 = new GreenfootImage("EnemySwordDeath2.png");
    GreenfootImage swordDeath3 = new GreenfootImage("EnemySwordDeath3.png");
    GreenfootImage swordDeath4 = new GreenfootImage("EnemySwordDeath4.png");
    
    boolean ninjaInRange = false;
    boolean onGround = false;
    boolean spawn = true;
    boolean death = false;
    boolean starDead = false;
    int speed = 1;
    int iDirection = 0;
    int rrunTimer = 0;
    int lrunTimer = 0;
    int g = 0;
    int gravity = 0;
    int spin = 0;
    int flipTimer = 0;
    int opacityTimer = 0;
    int opacity = 255;
    int deathTimer = 0;
    int deathX = 0;
    int deathR = 0;
    int deathY = 0;
    int deathJump = 8;
    int deathJ = 0;
    int deathDirection = 1;
    int bloodTimer = 0;
    int starTimer = 0;
    boolean hitInAir = false;
    boolean starDeath = false;
    boolean swordDeath = false;
    int swordDeathTimer = 0;
    boolean swordHit = false;
    int pointTimer = 0;
    int points = 0;
    int ninjaX = 480;
    int ninjaY = 0;
    
    public Enemy(int x)
    {
        iDirection = x;
    }
    
    /**
     * Act - do whatever the Enemy wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        if(onGround == true)
            gravity = 0;
        else
            gravity();

        if(death != true)
        {
            spawn();
            checkWalls();
            starRange();
            checkStars();
            checkSword(swordHit);
            checkNinja();
            
            flipTimer++;
            starTimer++;
            System.out.println("ninjaX: " + ninjaX);
        }
        else
        {
            death();
        }
    }    
    
    public void spawn()
    {
        if(onGround == false && spawn == true)
        {
            if(iDirection == 1)
            {
                airSpin();
                rPush();
            }
            if(iDirection == 0)
            {
                airSpin();
                lPush();
            }
        }
        else
        {
            setRotation(0);
        }

        if(onGround == true)
            spawn = false;
    }
    
    public void getInfo(int x, int y)
    {
        ninjaX = x;
        ninjaY = y;
    }
    
    public void rPush()
    {
        setLocation(getX()+5, getY());
    }
    
    public void lPush()
    {
        setLocation(getX()-5, getY());
    }    
    
    public void checkWalls()
    {        
        if(death == false)
        {
            if(getY() >= 362)
                onGround = true;
            else
                onGround = false;
        }
        else
        {
            if(starDeath == true)
            {
                if(getY() >= 405)
                    onGround = true;
                else
                    onGround = false;
            }
            if(swordDeath == true)
            {
                if(getY() >= 375)
                    onGround = true;
                else
                    onGround = false;
            }
        }
            
        if(spawn == false && death == false)
        {
            if(getX() > 920)
            {
                //flipDirection();
            }
            if(getX() < 40)
            {
                //flipDirection();
            }
        }
    }
    
    public void checkStars()
    {
        ninjaStar star;
        star = (ninjaStar)getOneIntersectingObject(ninjaStar.class);
        
        if(star != null && star.death == false)
        {
            if(star.direction == 0)
            {
                if(star.lastDirection == 1)
                    deathDirection = 1;
                if(star.lastDirection == 2)
                    deathDirection = 2;
            }
            if(star.lastDirection == 1)
                deathDirection = 1;
            if(star.lastDirection == 2)
                deathDirection = 2;
                
            starDeath = true;
            death = true;    
        }
    }
    
    public void checkSword(boolean sHit)
    {
        Sword sword;
        sword = (Sword)getOneIntersectingObject(Sword.class);
        
        swordHit = sHit;
        
        points = deathTimer*10;
        
        if(sword != null && swordHit == true)
        {
            if(pointTimer == 0)
            {
                if(spawn == true)                
                    sword.points(150);            
                else if(spawn == false)     
                    sword.points(100);               
            }
            pointTimer++;
            swordDeath = true;
            death = true;
        }
    }

    public void flipDirection()
    {
        if(flipTimer > 30)
        {
            if(iDirection == 0)
                iDirection = 1;
            else
                iDirection = 0;
        }     
    }
    
    public void airSpin()
    {
        spin+=15;
        setRotation(spin);
        setImage(base);
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
    
    public boolean starRange()  
    {  
        List<Ninja> list_ninja_=getObjectsInRange(900,Ninja.class);  
        for(Ninja ninja_:list_ninja_)  
        {  
            if(starTimer > 150)
            {
                throwStar();
                starTimer = 0;
            }
        }  
        return list_ninja_ != null;
    }
    
    public boolean checkNinja()  
    {          
        List<Ninja> list_ninja_=getObjectsInRange(500,Ninja.class);  
        for(Ninja ninja_:list_ninja_)  
        {  
            if(ninjaX > getX())
            {
                rCycle();
            }
            if(ninjaX < getX())
            {
                lCycle();
            }
        }  
        return list_ninja_ != null;
    }
    
    public void throwStar()
    {
        enemyStar star;
        star = new enemyStar(iDirection);
        if(iDirection == 1) //right
        {
            getWorld().addObject(new enemyStar(iDirection), getX()+10, getY());
        }
        if(iDirection == 0) //left
        {
            getWorld().addObject(new enemyStar(iDirection), getX()-10, getY());
        }
    }
    
    public void rCycle()
    {
        rrunTimer++;
        setLocation(getX()+speed, getY());
        iDirection = 1;
        
        if(rrunTimer < 9)
            setImage(rrun1);
        if(rrunTimer >= 9)
            if(rrunTimer < 18)
                setImage(rrun2);
        if(rrunTimer >= 18)
            if(rrunTimer < 27)
                setImage(rrun3);
        if(rrunTimer >= 27)
            if(rrunTimer < 36)
                setImage(rrun4);
        if(rrunTimer >= 36)
            if(rrunTimer < 45)
                setImage(rrun5);
        if(rrunTimer == 45)
            rrunTimer = 0;
    }
    
     public void lCycle()
    {
        lrunTimer++;
        setLocation(getX()-speed, getY());
        iDirection = 0;
        
        if(lrunTimer < 9)
            setImage(lrun1);
        if(lrunTimer >= 9)
            if(lrunTimer < 18)
                setImage(lrun2);
        if(lrunTimer >= 18)
            if(lrunTimer < 27)
                setImage(lrun3);
        if(lrunTimer >= 27)
            if(lrunTimer < 36)
                setImage(lrun4);
        if(lrunTimer >= 36)
            if(lrunTimer < 45)
                setImage(lrun5);
        if(lrunTimer == 45)
            lrunTimer = 0;
    }
    
    public void swordDeathCycle()
    {
        swordDeathTimer++;
        setLocation(getX(), getY());
        
        if(swordDeathTimer < 6)
            setImage(swordDeath1);
        if(swordDeathTimer >= 6)
            if(swordDeathTimer < 12)
                setImage(swordDeath2);
        if(swordDeathTimer >= 12)
            if(swordDeathTimer < 18)
                setImage(swordDeath3);
        if(swordDeathTimer >= 18)
            if(swordDeathTimer <= 200)
                setImage(swordDeath4);
        if(swordDeathTimer == 200)
            swordDeathTimer = 0;
    }

    public void death()
    {
        deathTimer++;
        bloodTimer++;
        opacityTimer++;
        checkWalls();
        
        if(opacityTimer == 125)
            getImage().setTransparency(0);
        if(opacityTimer == 150)
        {
            getImage().setTransparency(255);
            opacityTimer = 100;
        }
        
        if(starDeath == true && swordDeath == false)
        {
            setImage(starHit);       
            deathAnimation();

            if(bloodTimer < 45)
                blood(); 
        
            if(deathTimer == 200)
                getWorld().removeObject(this);
        }
        
        if(swordDeath == true && starDeath == false)
        {
            swordDeathCycle();
            
            if(bloodTimer < 25)
                 blood();
            
            if(deathTimer == 200)
                getWorld().removeObject(this);
        }
        
        if(starDeath == true && swordDeath == true)
        {
            swordDeathCycle();
            setRotation(0);
            
            if(bloodTimer < 25)
                 blood();
            
            if(deathTimer == 200)
                getWorld().removeObject(this);
        }
        
        if(deathTimer == 1)
        {
            if(getWorld() instanceof levelOne)
            {
                levelOne currentLevel = (levelOne)getWorld();
                currentLevel.enemyCount();
            }
        }
    }
    
    public void blood()
    {
        Blood blood;
        blood = new Blood();
        getWorld().addObject(new Blood(), getX()+15, getY());
    }
    
    public void deathAnimation()
    {
        deathX++;
        deathR+=10;
        deathY++;
        deathJ++;
        
        if(deathDirection == 1)
        {
            if(deathX < 50)
                setLocation(getX()+3, getY());
            if(deathR <= 90)
                setRotation(deathR);
        }
        else
        {
            if(deathX < 50)
                setLocation(getX()-3, getY());
            if(deathR <= 90)
                setRotation(deathR*-1);
            
        }
        
        if(deathY < 10)
            setLocation(getX(), getY()+3);      
        if(deathJ == 3 && deathJump > 0)
        {
            deathJump--;  
            deathJ = 0;
        }
        
        setLocation(getX(), getY()-deathJump);
    }
}
