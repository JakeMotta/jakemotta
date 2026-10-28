import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class tie here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class Sword extends NinjaDonut
{
    GreenfootImage swordLeft = new GreenfootImage("SwordLeft.png");
    GreenfootImage swordRight = new GreenfootImage("SwordRight.png");
    
    GreenfootImage swordAttackR1 = new GreenfootImage("SwordAttack1.png");
    GreenfootImage swordAttackR2 = new GreenfootImage("SwordAttack2.png");
    GreenfootImage swordAttackR3 = new GreenfootImage("SwordAttack3.png");
    GreenfootImage swordAttackR4 = new GreenfootImage("SwordAttack4.png");
    GreenfootImage swordAttackR5 = new GreenfootImage("SwordAttack5.png");
    
    GreenfootImage swordAttackL1 = new GreenfootImage("SwordAttackL1.png");
    GreenfootImage swordAttackL2 = new GreenfootImage("SwordAttackL2.png");
    GreenfootImage swordAttackL3 = new GreenfootImage("SwordAttackL3.png");
    GreenfootImage swordAttackL4 = new GreenfootImage("SwordAttackL4.png");
    GreenfootImage swordAttackL5 = new GreenfootImage("SwordAttackL5.png");
    
    GreenfootImage swordAttackFrontR1 = new GreenfootImage("SwordAttackFront1.png");
    GreenfootImage swordAttackFrontR2 = new GreenfootImage("SwordAttackFront2.png");
    GreenfootImage swordAttackFrontR3 = new GreenfootImage("SwordAttackFront3.png");
    GreenfootImage swordAttackFrontR4 = new GreenfootImage("SwordAttackFront4.png");
    
    GreenfootImage swordAttackFrontL1 = new GreenfootImage("SwordAttackFrontL1.png");
    GreenfootImage swordAttackFrontL2 = new GreenfootImage("SwordAttackFrontL2.png");
    GreenfootImage swordAttackFrontL3 = new GreenfootImage("SwordAttackFrontL3.png");
    GreenfootImage swordAttackFrontL4 = new GreenfootImage("SwordAttackFrontL4.png");
    
    int timer = 0;
    int ninjaX = 0;
    int ninjaY = 0;
    int ninjaDirection = 0;
    int lastNinjaDirection = 1;
    int opacity = 255;
    int attackTimer = 0;
    boolean attack = false;
    boolean rightAttack = false;
    boolean leftAttack = false;
    boolean attackFront = false;
    boolean attackFrontR = false;
    boolean attackFrontL = false;
    int r = 0;
    int l = 0;
    boolean canHit = false;
    int points = 0;
    int test = 0;
    
    airText airText;
    public Sword()
    {
        airText = new airText("");
    }
    
    /**
     * Act - do whatever the tie wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {     
        checkHit();
        test++;
        //System.out.println(test);
        if(attack == false)
            location();
       
        if(attack == true)
            attacking();
        else
            attackTimer = 0;
        
        if(rightAttack == true && leftAttack == true && attackTimer >= 9 && attackTimer <= 15)
            attackFront = true;
                        
        if(attackFront == true)
        {
            if(r > l)
                attackFrontR = true;
            if(l > r)
                attackFrontL = true;
                
            attackFront();
        }
        
        if(attackTimer >= 6 && attackTimer <= 27)
            canHit = true;
        else
            canHit = false;  
    }    
    
    public void updateNinja(int z, int lD, int o)
    {       
        //ninjaX = ((levelOne) getWorld()).ninjaX; 
        ninjaDirection = z;
        lastNinjaDirection = lD;
        opacity = o;           
    }
    
    public void checkHit()
    {
        enemyStar star;
        star = (enemyStar)getOneIntersectingObject(enemyStar.class);
        
        if(star != null && star.onGround == false)
        {
            star.swordHit(canHit, attackTimer);
            //System.out.println("STAR HIT");
            
        }
        //System.out.println(canHit);
        
        Enemy enemy;
        enemy = (Enemy)getOneIntersectingObject(Enemy.class);
        
        if(enemy != null)
            if(enemy.deathTimer < 30)
                enemy.checkSword(canHit);
    }
    
    public void location()
    {
        if(ninjaDirection == 0)
        {
            if(lastNinjaDirection == 1)
                moveRight();    
            if(lastNinjaDirection == 2)
                moveLeft(); 
        }
        if(ninjaDirection == 1)
            moveRight();    
        if(ninjaDirection == 2)
            moveLeft(); 
            
        getImage().setTransparency(opacity); 
    }
    
    public void attack()
    {
        attack = true;
    }
    
    public void notAttacking()
    {
        attack = false;
        attackTimer = 0;
    }
    
    public void attacking()
    {
        if(ninjaDirection == 0)
        {
            if(lastNinjaDirection == 1)
                attackRight(); 
            if(lastNinjaDirection == 2)
                attackLeft();
        }
        if(ninjaDirection == 1)
                attackRight();
        if(ninjaDirection == 2)
                attackLeft();
                
        attackTimer++;
    }
    
    public void attackRight()
    {
        if(attackFront != true)
        {
            rightAttack = true;
            r++;
            
            setLocation(ninjaX+65, ninjaY-45);
            setRotation(-15);
        
            if(attackTimer < 3)
                setImage(swordAttackR1);
            if(attackTimer >= 3)
                if(attackTimer < 6)
                    setImage(swordAttackR2);
            if(attackTimer >= 6)
                if(attackTimer < 9)
                    setImage(swordAttackR3);
            if(attackTimer >= 9)
                if(attackTimer < 12)
                    setImage(swordAttackR4);
            if(attackTimer >= 12)
                if(attackTimer < 15)
                    setImage(swordAttackR5); 
            if(attackTimer >= 15)
            {
                attackTimer = 0;
                attack = false;
                rightAttack = false;     
            }
        }          
    }
    
    public void attackLeft()
    {
        if(attackFront != true)
        {
            leftAttack = true;
            l++;
            
            setLocation(ninjaX-65, ninjaY-45);
            setRotation(15);
        
            if(attackTimer < 3)
                setImage(swordAttackL1);
            if(attackTimer >= 3)
                if(attackTimer < 6)
                   setImage(swordAttackL2);
            if(attackTimer >= 6)
                if(attackTimer < 9)
                   setImage(swordAttackL3);
            if(attackTimer >= 9)
                if(attackTimer < 12)
                    setImage(swordAttackL4);
            if(attackTimer >= 12)
                if(attackTimer < 15)
                    setImage(swordAttackL5);
            if(attackTimer >= 15)
            {
                attackTimer = 0;
                attack = false;
                leftAttack = false;   
            }
        }
    }
    
    public void attackFront()
    {
        if(attackFrontR == true)
        {
            setLocation(ninjaX-65, ninjaY-45);
            setRotation(15);
            
            if(attackTimer < 15)
                setImage(swordAttackFrontR1);
            if(attackTimer >= 18)
                if(attackTimer < 21)
                    setImage(swordAttackFrontR2);
            if(attackTimer >= 21)
                if(attackTimer < 24)
                    setImage(swordAttackFrontR3);
            if(attackTimer >= 24)
                if(attackTimer < 27)
                    setImage(swordAttackFrontR4);
            if(attackTimer >= 27)
            {
                attackTimer = 0;
                attack = false;
                attackFront = false;
                attackFrontR = false;
                leftAttack = false;
                rightAttack = false;
                r = 0;
                l = 0;
            }
        }
        
        if(attackFrontL == true)
        {
            setLocation(ninjaX+65, ninjaY-45);
            setRotation(-15);
            
            if(attackTimer < 15)
                setImage(swordAttackFrontL1);
            if(attackTimer >= 18)
                if(attackTimer < 21)
                    setImage(swordAttackFrontL2);
            if(attackTimer >= 21)
                if(attackTimer < 24)
                    setImage(swordAttackFrontL3);
            if(attackTimer >= 24)
                if(attackTimer < 27)
                    setImage(swordAttackFrontL4);
            if(attackTimer >= 27)
            {
                attackTimer = 0;
                attack = false;
                attackFront = false;
                attackFrontL = false;
                leftAttack = false;
                rightAttack = false;
                r = 0;
                l = 0;
            }
        }
    }
    
    public void ninjaInfo(int x, int y)
    {
        ninjaX = x;
        ninjaY = y;
    }
    
    public void moveRight()
    {
        setLocation(ninjaX, ninjaY);
        setRotation(-45);
        setImage(swordLeft);
    }
    
    public void moveLeft()
    {
        setLocation(ninjaX, ninjaY);
        setRotation(45);
        setImage(swordRight);
    }
    
    public void points(int recievedPoints)
    {
        points = recievedPoints;
        
        getWorld().addObject(new airText("+" + points), getX(), getY());
        
        if(getWorld() instanceof levelOne) 
        {  
            levelOne currentWorld = (levelOne)getWorld();  
            currentWorld.updatePoints(points);  
        }
    }
}
