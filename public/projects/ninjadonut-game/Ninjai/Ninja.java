import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class ND here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class Ninja extends NinjaDonut
{
    GreenfootImage stand = new GreenfootImage("stand.gif");

    GreenfootImage rrun1 = new GreenfootImage("rrun1.gif");
    GreenfootImage rrun2 = new GreenfootImage("rrun2.gif");
    GreenfootImage rrun3 = new GreenfootImage("rrun3.gif");
    GreenfootImage rrun4 = new GreenfootImage("rrun4.gif");
    GreenfootImage rrun5 = new GreenfootImage("rrun5.gif");
    
    GreenfootImage lrun1 = new GreenfootImage("lrun1.gif");
    GreenfootImage lrun2 = new GreenfootImage("lrun2.gif");
    GreenfootImage lrun3 = new GreenfootImage("lrun3.gif");
    GreenfootImage lrun4 = new GreenfootImage("lrun4.gif");
    GreenfootImage lrun5 = new GreenfootImage("lrun5.gif");
    
    GreenfootImage jump1 = new GreenfootImage("jump1.gif");
    GreenfootImage jump2 = new GreenfootImage("jump2.gif");
    GreenfootImage jump3 = new GreenfootImage("jump3.gif");
    
    int rrunTimer = 0;
    int lrunTimer = 0;
    int jumpTimer = 0;
    boolean rightKey = false;
    boolean leftKey = false;
    boolean upKey = false;
    boolean onGround = true;
    boolean hide = false;
    boolean invisible = false;
    int lastDirection = 1;
    int speed = 3;
    int g = 0;
    int gravity = 0;
    int direction = 0;
    int starTimer = 0;
    int opacity = 255; 
    boolean swordAttack = false;
    int swordTimer = 50;
    boolean canMove = true;

    public Ninja()
    {
        
    }
    
    /**
     * Act - do whatever the ND wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        giveInfo();
        checkKeys();
        checkWalls();
        actions();  
        swordAttack();
    }    
    
    public void checkKeys()
    {
        if(Greenfoot.isKeyDown("right") && hide == false && opacity == 255)
        {
            setLocation(getX()+speed, getY());
            rrun();
            rightKey = true;
            lastDirection = 1;
        }
        else
        {
            rrunTimer = 0;
            rightKey = false;
        }
        if(Greenfoot.isKeyDown("left") && hide == false  && opacity == 255)
        {
            setLocation(getX()-speed, getY());
            lrun();
            leftKey = true;
            lastDirection = 2;
        }
        else
        {
            lrunTimer = 0;
            leftKey = false;
        }
        
        if(Greenfoot.isKeyDown("up"))
            upKey = true;
            
        if(Greenfoot.isKeyDown("down") && rightKey == false && leftKey == false && upKey == false)
            hide = true;
        else
            hide = false;
            
        if(rightKey == false && leftKey == false)
            setImage(stand);
        
        if(Greenfoot.isKeyDown("z") && starTimer > 30 && hide == false  && opacity == 255)
            throwStar();
            
        if(Greenfoot.isKeyDown("x") && hide == false && opacity == 255)
            swordAttack = true;
        else
            swordAttack = false;
    }
    
    public void actions()
    {
        starTimer++;
        swordTimer++;
        
        if(upKey == true)
           jump();
        
        if(hide == true)
        {
            if(opacity > 17)
            {
                opacity-=17;
                getImage().setTransparency(opacity);
            }
            
            if(opacity == 17)
                invisible = true;
            else
                invisible = false;
        }
        else
        {
            if(opacity < 255)
            {
                opacity+=17;
                getImage().setTransparency(opacity);
            }
        }
        
        if(rightKey == false && leftKey == false)
            direction = 0;
        if(rightKey == true)
            direction = 1;
        if(leftKey == true)
            direction = 2;
    }
    
    public void throwStar()
    {
        ninjaStar star;
        star = new ninjaStar(direction, lastDirection);      
        getWorld().addObject(star, getX()+10, getY());
        starTimer = 0;
    }
    
    public void swordAttack()
    {
        Sword sword;
        sword = (Sword)getOneIntersectingObject(Sword.class);


        if(sword != null)
            if(swordAttack == true && swordTimer > 50)
            {
                sword.attack();
                swordTimer = 0;
            }
    }
    
    public void swordStop()
    {
        swordAttack = false;
    }
    
    public void checkWalls()
    {        
        if(getY() >= 362)
            onGround = true;
        else
            onGround = false;
            
        if(onGround == true)
            gravity = 0;
        else
            gravity();
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
    
    public void actualJump()
    {
        int j = 0;
        int jump = 12;
        
        j++;
        
        if(j == 3)
        {
            jump--;
            j = 0;
        }
        
        setLocation(getX(), getY()-jump);
    }
    
    public void jump()
    {
        jumpTimer++;
        
        if(jumpTimer >= 6)
            if(jumpTimer < 18)
                actualJump();  
        
        if(jumpTimer < 3)
            setImage(jump1);
        if(jumpTimer >= 3)
        {
            if(jumpTimer < 6)
                setImage(jump2);
        }
        if(jumpTimer >= 6)
        {
            if(jumpTimer < 36)
                setImage(jump3);
        }
        if(jumpTimer >= 36)
        {
            if(jumpTimer < 39)
                setImage(jump2);
        }
        if(jumpTimer >= 39)
        {
            if(jumpTimer < 42)
                setImage(jump1);
        }
        if(jumpTimer == 41)
        {
            jumpTimer = 0;
            setImage(stand);
            upKey = false;
        }
    }
    
    public void rrun()
    {
        rrunTimer++;
        
        if(rrunTimer < 3)
        {
            setImage(rrun1);
        }
        if(rrunTimer >= 3)
        {
            if(rrunTimer < 6)
                setImage(rrun2);
        }
        if(rrunTimer >= 6)
        {
            if(rrunTimer < 9)
                setImage(rrun3);
        }
        if(rrunTimer >= 9)
        {
            if(rrunTimer < 12)
                setImage(rrun4);
        }
        if(rrunTimer >= 12)
        {
            if(rrunTimer < 15)
                setImage(rrun5);
        }
        if(rrunTimer == 14)
            rrunTimer = 0;
    }
    
    public void lrun()
    {
        lrunTimer++;
        
        if(lrunTimer < 3)
        {
            setImage(lrun1);
        }
        if(lrunTimer >= 3)
        {
            if(lrunTimer < 6)
            {
                setImage(lrun2);
            }
        }
        if(lrunTimer >= 6)
        {
            if(lrunTimer < 9)
            {
                setImage(lrun3);
            }
        }
        if(lrunTimer >= 9)
        {
            if(lrunTimer < 12)
            {
                setImage(lrun4);
            }
        }
        if(lrunTimer >= 12)
        {
            if(lrunTimer < 15)
            {
                setImage(lrun5);
            }
        }
        if(lrunTimer == 14)
        {
            lrunTimer = 0;
        }
    }
    
    public void giveInfo()
    {
        if(getWorld() instanceof levelOne)
        {
            levelOne currentLevel = (levelOne)getWorld();
            currentLevel.updateNinjaPosition(getX(), getY());
        }
        
        tie tie;
        tie = (tie)getOneIntersectingObject(tie.class);
        
        if(tie != null)
            tie.updateNinja(direction, lastDirection, opacity);
            
        Sword sword;
        sword = (Sword)getOneIntersectingObject(Sword.class);
        
        if(sword != null)
            sword.updateNinja(direction, lastDirection, opacity);    
    }
}