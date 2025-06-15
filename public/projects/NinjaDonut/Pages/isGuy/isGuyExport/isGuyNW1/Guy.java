import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.awt.Color;

/**
 * Write a description of class Guy here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class Guy extends Actor
{
    //walkRight images
    GreenfootImage standRight;
    GreenfootImage walkRight1;
    GreenfootImage walkRight2;
    GreenfootImage walkRight3;
    GreenfootImage walkRight4;
    
    //walkLeft images
    GreenfootImage standLeft;
    GreenfootImage walkLeft1;
    GreenfootImage walkLeft2;
    GreenfootImage walkLeft3;
    GreenfootImage walkLeft4;
    
    //runRight images
    GreenfootImage runRight1;
    GreenfootImage runRight2;
    GreenfootImage runRight3;
    GreenfootImage runRight4;
    GreenfootImage runRight5;
    
    //runLeft images
    GreenfootImage runLeft1;
    GreenfootImage runLeft2;
    GreenfootImage runLeft3;
    GreenfootImage runLeft4;
    GreenfootImage runLeft5;
    
    //Right walk firing images
    GreenfootImage walkRightFire1;
    GreenfootImage walkRightFire2;
    GreenfootImage walkRightFire3;
    GreenfootImage walkRightFire4;
    
    //Left walk firing images
    GreenfootImage walkLeftFire1;
    GreenfootImage walkLeftFire2;
    GreenfootImage walkLeftFire3;
    GreenfootImage walkLeftFire4;
    
    //Right run firing images
    GreenfootImage standRightFire;
    GreenfootImage runRightFire1;
    GreenfootImage runRightFire2;
    GreenfootImage runRightFire3;
    GreenfootImage runRightFire4;
    GreenfootImage runRightFire5;
    
    //Left run firing images
    GreenfootImage standLeftFire;
    GreenfootImage runLeftFire1;
    GreenfootImage runLeftFire2;
    GreenfootImage runLeftFire3;
    GreenfootImage runLeftFire4;
    GreenfootImage runLeftFire5;
    
    //Ladder climbing images
    GreenfootImage climbLadder1;
    GreenfootImage climbLadder2;
    GreenfootImage climbLadder3;
    GreenfootImage climbLadder4;
    GreenfootImage climbLadder5;
    GreenfootImage climbLadder6;
    GreenfootImage climbLadder7;
    GreenfootImage climbLadder8;
    
    //Hit by laser's while walking right images
    GreenfootImage guyLaserTouchRight1;
    GreenfootImage guyLaserTouchRight2;
    GreenfootImage guyLaserTouchRight3;
    
    //Hit by laser's while walking left images
    GreenfootImage guyLaserTouchLeft1;
    GreenfootImage guyLaserTouchLeft2;
    GreenfootImage guyLaserTouchLeft3;
    
    //Guy's Death Image(s)
    GreenfootImage guyDeath1; 
    
    int guyHP; //Guy's hp
    int enemyAttackDamage; //How much damage an enemy attack will do
    int guyLives; //Guy's lives
    int electricFieldDamage; //How much damage an electricField does
    int constantEectricFieldDamage; //How much damage an constantElectricField does
    int skuddleDamage; //How much damage getting hit by Skuddle does
    int flickDamage; //How much damage getting hit by Flick does                
    int deathRotationTimer; //Timer to make Guy do a 360 when he dies
    
    int speedRight; //Guy's movement speed right
    int speedLeft; //Guy's movement speed left
    int speedUp; //Guy's movement speed up
    int speedDown; //Guy's movement speed down
    int walkRightImageTimer; //timer to change right walking image of Guy
    int walkLeftImageTimer; //timer to change left walking image of Guy
    int runRightImageTimer; //timer to change right run image of Guy
    int runLeftImageTimer; //timer to change left run image of Guy
    int walkRightFireImageTimer; //timer to change right walking fire image of Guy
    int walkLeftFireImageTimer; //timer to change left walking fire image of Guy
    int runRightFireImageTimer; //timer to change right running fire image of Guy
    int runLeftFireImageTimer; //timer to change left running fire image of Guy
    int climbLadderImageTimer; //timer to change climbLadder image of Guy
    int Gravity; //Total gravity
    int gCount; //Gravity increase
    int jCount; //jump speed decrease
    int Jump; //Totaljump height
    int onLadderTimer; //Timer to stop Guy's jump after getting off ladder
    int offLadderTimer; //Timer to declare "canJump" as true again after "onLadderTimer"
    int fireTimer; //Timer to delay shots
    int bulletSpeed; //Speed of the bullet Guy shoots
    int laserHitTimer; //Timer for image change when guy is hit by lasers
    int laserDamage; //How much damage getting hit by a laser does
    int hitByLaserTimer; //Timer to make sure laserDamage is only added once per hit
    int worldSwitchTimer; //Timer to switch worlds
    int lifeCountTimer; //Timer to make sure only one life is taken away at death
    int deathSequenceTimer; //Timer to give Guy's death animation
    int hitTimer; //Timer identical to laserHit, but without all the damage
    int wasHitByFlickTimer; //Timer to make sure Guy is only damaged once
    int wasHitBySkuddleTimer; //Timer to make sure Guy is only damaged once
    int guyBottomBorder; //Check Guy's width for hit detection, so he doesn't fall early
    int slowedTimer; //Timer that runs when Guy is slowed
    int shotDelay; //Shot delay timer
    int jumpDelay;
    
    boolean walkRightLast; //boolean to set correct image for which way Guy is facing
    boolean walkLeftLast; //boolean to set correct image for which way Guy is facing
    boolean canJump; //tells if Guy can jump or not
    boolean jump; //tells if Guy is jumping or not
    boolean atLadder; //tells Guy if there is he is touching a ladder. Stops his jump if true
    boolean canClimbLadder; //Stops midair jump ladder climbing
    boolean Ground; //Tells Guy if there is Ground or not
    boolean canFire; //Tells Guy if he can or cannot fire his gun
    boolean isAlive; //Tells if Guy is alive or not
    boolean hitByLasers; //Tells if Guy has been hit by lasers
    boolean controls; //Can the player use the controls or not
    boolean atDoor; //Checks if Guy is at the door or not
    boolean levelEnd; //If true, world will change to the next
    boolean invincible; //Guy is invincible or not
    boolean guyDead; //Is Guy dead or not?
    boolean guyWasHitFlick; //General boolean to give guy the "laserHit" effect
    boolean guyWasHitSkuddle; //General boolean to give guy the "laserHit" effect
    boolean gotKey; //Checks if Guy grabbed the key or not
    boolean ceiling; //Is Guy hitting his head
    boolean worldEdge; //Is Guy hitting the edge of the world
    boolean climbingLadder; //Is Guy climbing a ladder
    boolean onGround; //Tells if Guy is on the Ground or not
    boolean hitByBlueLaser; //Was Guy hit by blueLaser
    boolean canRun; //can Guy run?
    boolean ladderStop; //Guy stopping on the ladder
    boolean nextJump;
    
    public Guy(smallGameText Score, int startingHp, int startingLives)
    {
        standRight = new GreenfootImage("standRight.png");
        walkRight1 = new GreenfootImage("walkRight1.png");
        walkRight2 = new GreenfootImage("walkRight2.png");
        walkRight3 = new GreenfootImage("walkRight3.png");
        walkRight4 = new GreenfootImage("walkRight4.png");
        
        standLeft = new GreenfootImage("standLeft.png");
        walkLeft1 = new GreenfootImage("walkLeft1.png");
        walkLeft2 = new GreenfootImage("walkLeft2.png");
        walkLeft3 = new GreenfootImage("walkLeft3.png");
        walkLeft4 = new GreenfootImage("walkLeft4.png");
        
        runRight1 = new GreenfootImage("runRight1.png");
        runRight2 = new GreenfootImage("runRight2.png");
        runRight3 = new GreenfootImage("runRight3.png");
        runRight4 = new GreenfootImage("runRight4.png");
        runRight5 = new GreenfootImage("runRight5.png");
        
        runLeft1 = new GreenfootImage("runLeft1.png");
        runLeft2 = new GreenfootImage("runLeft2.png");
        runLeft3 = new GreenfootImage("runLeft3.png");
        runLeft4 = new GreenfootImage("runLeft4.png");
        runLeft5 = new GreenfootImage("runLeft5.png");
        
        walkRightFire1 = new GreenfootImage("walkRightFire1.png");
        walkRightFire2 = new GreenfootImage("walkRightFire2.png");
        walkRightFire3 = new GreenfootImage("walkRightFire3.png");
        walkRightFire4 = new GreenfootImage("walkRightFire4.png");
        
        walkLeftFire1 = new GreenfootImage("walkLeftFire1.png");
        walkLeftFire2 = new GreenfootImage("walkLeftFire2.png");
        walkLeftFire3 = new GreenfootImage("walkLeftFire3.png");
        walkLeftFire4 = new GreenfootImage("walkLeftFire4.png");
        
        standRightFire = new GreenfootImage("standRightFire.png");
        runRightFire1 = new GreenfootImage("runRightFire1.png");
        runRightFire2 = new GreenfootImage("runRightFire2.png");
        runRightFire3 = new GreenfootImage("runRightFire3.png");
        runRightFire4 = new GreenfootImage("runRightFire4.png");
        runRightFire5 = new GreenfootImage("runRightFire5.png");
        
        standLeftFire = new GreenfootImage("standLeftFire.png");
        runLeftFire1 = new GreenfootImage("runLeftFire1.png");
        runLeftFire2 = new GreenfootImage("runLeftFire2.png");
        runLeftFire3 = new GreenfootImage("runLeftFire3.png");
        runLeftFire4 = new GreenfootImage("runLeftFire4.png");
        runLeftFire5 = new GreenfootImage("runLeftFire5.png");
        
        climbLadder1 = new GreenfootImage("climbLadder1.png");
        climbLadder2 = new GreenfootImage("climbLadder2.png");
        climbLadder3 = new GreenfootImage("climbLadder3.png");
        climbLadder4 = new GreenfootImage("climbLadder4.png");
        climbLadder5 = new GreenfootImage("climbLadder5.png");
        climbLadder6 = new GreenfootImage("climbLadder6.png");
        climbLadder7 = new GreenfootImage("climbLadder7.png");
        climbLadder8 = new GreenfootImage("climbLadder8.png");
        
        guyLaserTouchRight1 = new GreenfootImage("guyLaserTouchRight1.png");
        guyLaserTouchRight2 = new GreenfootImage("guyLaserTouchRight2.png");
        guyLaserTouchRight3 = new GreenfootImage("guyLaserTouchRight3.png");
        
        guyLaserTouchLeft1 = new GreenfootImage("guyLaserTouchLeft1.png");
        guyLaserTouchLeft2 = new GreenfootImage("guyLaserTouchLeft2.png");
        guyLaserTouchLeft3 = new GreenfootImage("guyLaserTouchLeft3.png");    
        
        guyDeath1 = new GreenfootImage("guyDeath1.png");

        guyHP = startingHp; //Set Guy's hp to the number sent to him from the world
        guyLives = startingLives; //Set Guy's lives to the number send from the world
        laserDamage = 20; //How much damage getting hit by the laser does
        electricFieldDamage = 0; //Damage sent from electricField
        constantEectricFieldDamage = 100; //Instant kill
        skuddleDamage = 15; //How mch damage does Skuddle do
        flickDamage = 15; //How much damage does Flick do
        deathRotationTimer = 0;
        
        speedRight = 1;
        speedLeft = 1;
        speedUp = 1;
        speedDown = 1;
        walkRightImageTimer = 0;
        walkLeftImageTimer = 0;
        runRightImageTimer = 0;
        runLeftImageTimer = 0;
        walkRightFireImageTimer = 0;
        walkLeftFireImageTimer = 0;
        runRightFireImageTimer = 0;
        runLeftFireImageTimer = 0;
        climbLadderImageTimer = 0;
        Gravity = 0;
        gCount = 0;
        jCount = 0;
        Jump = 10; //change this value to increase/decrease his jump height
        onLadderTimer = 0;
        offLadderTimer = 0;
        fireTimer = 0;
        bulletSpeed = 8;
        laserHitTimer = 0;
        hitByLaserTimer = 0;
        worldSwitchTimer = 0;
        lifeCountTimer = 0;
        deathSequenceTimer = 0;
        hitTimer = 0;
        wasHitByFlickTimer = 0;
        wasHitBySkuddleTimer = 0;
        guyBottomBorder = 0;
        slowedTimer = 0;
        shotDelay = 0;
        jumpDelay = 0;
        
        walkRightLast = true;
        walkLeftLast = false;
        canJump = true;
        jump = false;
        atLadder = false;
        canClimbLadder = true;
        Ground = false;
        canFire = true;
        isAlive = true;
        hitByLasers = false;
        controls = true;
        atDoor = false;
        levelEnd = false;
        invincible = false;
        guyDead = false;
        guyWasHitFlick = false;
        guyWasHitSkuddle = false;
        gotKey = false;
        ceiling = false;
        worldEdge = false;
        climbingLadder = false;
        onGround = false;
        hitByBlueLaser = false;
        canRun = true;
        ladderStop = false;
        nextJump = true;
    }
    
    /**
     * Act - do whatever the Guy wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
       if(isAlive == true)
       {
            if(controls == true)
            {
                checkKeys();
            }
            else
            {
                //No Control >:D
            }

            if(invincible == true)
            {
                //Don't check for anything. Can't hurt Guy.
            }
            else
            {
                //Things to check if Guy isn't invisible
                checkEnemyAttacks();
                checkLasers();
                checkBlueLaser();
                checkSkuddle();
                checkFlick();
            }
            
            if(ladderStop == true)
            {
                gCount = 0;
                Gravity = 0;
            }
            else
            {
            }
            
            gravityMethod();
            checkGround();
            checkLadder();
            checkDoor();
            checkNextLevel();
            checkBoundries();           
            checkKey();
            checkConstantElectricFields();
            checkMovingPlatforms();
            updateGuyPosition();
            shotDelay++;
            
            if(canJump == true)
            {
                checkJump();
            }
            if(jump == true)
            {
                canJump = false;
                jumpMethod();
            }
       }
       else
       {
           guyDead = true;
           onDeath();
           
           //Makes Guy jump, then fall, without checking for the ground or anything
           gCount++;
           gravityMethod();
           Jump = 7; //Gives Guy a bounce up at death
           
           if(jump == true)
           {
               jumpMethod();
           } 
       }
       
       if(guyHP <= 0) //Kill guy if his health is 0
       {
           isAlive = false;
       }
    }    
    
    public void onDeath()
    {
        if(isAlive == false)
        {   
            lifeCountTimer++;
            if(lifeCountTimer == 1)
            {
                guyLives -= 1; //Take away a life
                guyDeathImages();
                
                //SEND DAMAGE AND LIVES TO THE WORLD
                if(getWorld() instanceof worldOne) 
                {  
                    worldOne currentWorld = (worldOne)getWorld();  
                    currentWorld.updateLives(guyLives);  
                    currentWorld.respawnGuy(guyDead);  
                } 
                else if(getWorld() instanceof worldTwo) 
                {  
                    worldTwo currentWorld = (worldTwo)getWorld();  
                    currentWorld.updateLives(guyLives);  
                    currentWorld.respawnGuy(guyDead);  
                } 
                else if(getWorld() instanceof worldThree) 
                {  
                    worldThree currentWorld = (worldThree)getWorld();  
                    currentWorld.updateLives(guyLives);  
                    currentWorld.respawnGuy(guyDead);  
                } 
                else if(getWorld() instanceof worldFour) 
                {  
                    worldFour currentWorld = (worldFour)getWorld();  
                    currentWorld.updateLives(guyLives);  
                    currentWorld.respawnGuy(guyDead);  
                } 
                else if(getWorld() instanceof worldFive) 
                {  
                    worldFive currentWorld = (worldFive)getWorld();  
                    currentWorld.updateLives(guyLives);  
                    currentWorld.respawnGuy(guyDead);  
                } 
            }  
        }
    }
    
    public void guyDeathImages()
    {
        deathSequenceTimer++;
        
        if(deathSequenceTimer >= 1)
        {
            controls = false;
            setImage(guyDeath1);
            jump = true;
        }   
    }
    
    public void checkKeys()
    {
        //checks for walking right
        if(Greenfoot.isKeyDown("right"))
        {
            move(speedRight);
            walkRight();
            walkRightLast = true;
            walkLeftLast = false;
        }
        else
        {
            walkRightImageTimer = 0;
            if(walkRightLast == true)
            {
                setImage(standRight);
            }
        }   
        
        //checks for walking left
        if(Greenfoot.isKeyDown("left"))
        {
            move(-speedLeft);
            walkLeft();
            walkRightLast = false;
            walkLeftLast = true;
        }
        else
        {
            walkLeftImageTimer = 0;
            if(walkLeftLast == true)
            {
                setImage(standLeft);
            }
        }
        
        //stops the weird moonwalk if both keys are pressed
        if(Greenfoot.isKeyDown("right") & Greenfoot.isKeyDown("left"))
        {
            setImage(standRight);
        }
        
        //changes Guy's speed for running and walking
        if(Greenfoot.isKeyDown("shift") & canRun == true)
        {
            speedRight = 3; //change speedRight to a running speed
            speedLeft = 3; //change speedLeft to a running speed
            
            //checks for Guy running right
            if(walkRightLast == true & Greenfoot.isKeyDown("right"))
            {       
                walkRightImageTimer = 0; //stop walking right timer
                runRight();
            }
            
            //checks for Guy running left
            if(walkLeftLast == true & Greenfoot.isKeyDown("left"))
            {
                walkLeftImageTimer = 0; //stop walking right timer
                runLeft();
            }
        }
        else
        {
            speedRight = 1; //reset speedLeft to default
            speedLeft = 1; //reset speedLeft to default
        }
        
        //fire method
        if(Greenfoot.isKeyDown("space"))
        {
            //stops guy from firing on ladder
            if(canFire == true && shotDelay >= 15)
            {
                shotDelay = 0;
                
                //Fire bullet facing right
                if(walkRightLast == true & fireTimer == 0 & climbingLadder == false & ladderStop == false) //Instant shot when pressed
                {
                    bullet bullet;
                    bullet = new bullet(1); //Int sent to bullet to determine shot direction
                    getWorld().addObject(bullet, getX(), getY());
                    
                    fireTimer = 1; //Increase fireTimer to 1 so Guy can't shoot again
                }   
            
                //Fire bullet facing left
                if(walkLeftLast == true & fireTimer == 0 & climbingLadder == false & ladderStop == false) //Instant shot when pressed
                {
                    bullet bullet;
                    bullet = new bullet(2); //Int sent to bullet to determine shot direction
                    getWorld().addObject(bullet, getX(), getY());
                    
                    fireTimer = 1; //Increase fireTimer to 1 so Guy can't shoot again
                } 
                
                //Fire bullet while climbing a ladder
                if(climbingLadder == true & fireTimer == 0) //Instant shot when pressed
                {
                    bullet bullet;
                    bullet = new bullet(3); //Int sent to bullet to determine shot direction
                    getWorld().addObject(bullet, getX(), getY());
                    
                    fireTimer = 1; //Increase fireTimer to 1 so Guy can't shoot again
                } 
                
                if(climbingLadder == false & ladderStop == true & fireTimer == 0) //Instant shot when pressed
                {   
                    bullet bullet;
                    bullet = new bullet(3); //Int sent to bullet to determine shot direction
                    getWorld().addObject(bullet, getX(), getY());
                    
                    fireTimer = 1; //Increase fireTimer to 1 so Guy can't shoot again
                } 
            }
            
            //if Guy is standing right when spaced is pressed
            if(walkRightLast == true)
            {
                setImage(standRightFire);
            }
            
            //if Guy is standing left when spaced is pressed
            if(walkLeftLast == true)
            {
                setImage(standLeftFire);
            }
            
            //if Guy is walking right when space is pressed
            if(Greenfoot.isKeyDown("right"))
            {
                walkRightFire();
            }
            
            //if Guy is walking left when space is pressed
            if(Greenfoot.isKeyDown("left"))
            {
                walkLeftFire();
            }
            
            //if Guy is running right when spaced is pressed
            if(Greenfoot.isKeyDown("right") & Greenfoot.isKeyDown("shift"))
            {
                runRightFire();
            }
            
            //if Guy is running left when spaced is pressed
            if(Greenfoot.isKeyDown("left") & Greenfoot.isKeyDown("shift"))
            {
                runLeftFire();
            }
        }
        else
        {
            fireTimer = 0; //Reset fireTimer so player can shoot again. Play can shoot once per space press. 
        }
        
        if(Greenfoot.isKeyDown("enter") & atDoor == true)
        {
            levelEnd = true;
            
            //TELL THE WORLD TO CHANGE WORLDS
            if(getWorld() instanceof worldOne) 
            {  
                worldOne currentWorld = (worldOne)getWorld();  
                currentWorld.changeWorld(levelEnd);  
            } 
            else if(getWorld() instanceof worldTwo) 
            {  
                worldTwo currentWorld = (worldTwo)getWorld();  
                currentWorld.changeWorld(levelEnd);  
            } 
            else if(getWorld() instanceof worldThree) 
            {  
                worldThree currentWorld = (worldThree)getWorld();  
                currentWorld.changeWorld(levelEnd);  
            } 
            else if(getWorld() instanceof worldFour) 
            {  
                worldFour currentWorld = (worldFour)getWorld();  
                currentWorld.changeWorld(levelEnd);  
            } 
            else if(getWorld() instanceof worldFive) 
            {  
                worldFive currentWorld = (worldFive)getWorld();  
                currentWorld.changeWorld(levelEnd);  
            } 
        }
    }
    
    public void checkJump()
    {
        //checks for jump. Will only jump if "canJump" is true, and if there is no ladder present
        if(atLadder == false)
        {
            if(Greenfoot.isKeyDown("up") & canJump == true)
            {
                jump = true;
            }
        }
    }
    
    public void walkRight()
    {
        walkRightImageTimer++; //increase timer
        
        if(walkRightImageTimer >= 1)
        {
            if(walkRightImageTimer <= 5)
            {
                setImage(walkRight1);
            }
        }
        if(walkRightImageTimer >= 6)
        {
            if(walkRightImageTimer <= 10)
            {
                setImage(walkRight2);
            }
        }
        if(walkRightImageTimer >= 11)
        {
            if(walkRightImageTimer <= 15)
            {
                setImage(walkRight3);
            }
        }
        if(walkRightImageTimer >= 16)
        {
            if(walkRightImageTimer <= 20)
            {
                setImage(walkRight4);
            }
        }
        if(walkRightImageTimer == 20)
        {
            walkRightImageTimer = 1;
        }
    }
    
    public void walkRightFire()
    {
        walkRightFireImageTimer = walkRightImageTimer;
        
        walkRightFireImageTimer++; //increase timer
        
        if(walkRightFireImageTimer >= 1)
        {
            if(walkRightFireImageTimer <= 5)
            {
                setImage(walkRightFire1);
            }
        }
        if(walkRightFireImageTimer >= 6)
        {
            if(walkRightFireImageTimer <= 10)
            {
                setImage(walkRightFire2);
            }
        }
        if(walkRightFireImageTimer >= 11)
        {
            if(walkRightFireImageTimer <= 15)
            {
                setImage(walkRightFire3);
            }
        }
        if(walkRightFireImageTimer >= 16)
        {
            if(walkRightFireImageTimer <= 20)
            {
                setImage(walkRightFire4);
            }
        }
        if(walkRightFireImageTimer == 20)
        {
            walkRightFireImageTimer = 1;
        }
    }
    
    public void runRight()
    {
        runRightImageTimer++; //increase timer
        
        if(runRightImageTimer >= 1)
        {
            if(runRightImageTimer <= 5)
            {
                setImage(runRight1);
            }
        }
        if(runRightImageTimer >= 6)
        {
            if(runRightImageTimer <= 10)
            {
                setImage(runRight2);
            }
        }
        if(runRightImageTimer >= 11)
        {
            if(runRightImageTimer <= 15)
            {
                setImage(runRight3);
            }
        }
        if(runRightImageTimer >= 16)
        {
            if(runRightImageTimer <= 20)
            {
                setImage(runRight4);
            }
        }
        if(runRightImageTimer >= 21)
        {
            if(runRightImageTimer <= 25)
            {
                setImage(runRight5);
            }
        }
        if(runRightImageTimer == 25)
        {
            runRightImageTimer = 1;
        }
    }
    
    public void runRightFire()
    {
        runRightFireImageTimer = runRightImageTimer;
        
        runRightFireImageTimer++; //increase timer
        
        if(runRightFireImageTimer >= 1)
        {
            if(runRightFireImageTimer <= 5)
            {
                setImage(runRightFire1);
            }
        }
        if(runRightFireImageTimer >= 6)
        {
            if(runRightFireImageTimer <= 10)
            {
                setImage(runRightFire2);
            }
        }
        if(runRightFireImageTimer >= 11)
        {
            if(runRightFireImageTimer <= 15)
            {
                setImage(runRightFire3);
            }
        }
        if(runRightFireImageTimer >= 16)
        {
            if(runRightFireImageTimer <= 20)
            {
                setImage(runRightFire4);
            }
        }
        if(runRightFireImageTimer >= 21)
        {
            if(runRightFireImageTimer <= 25)
            {
                setImage(runRightFire5);
            }
        }
        if(runRightFireImageTimer == 25)
        {
            runRightFireImageTimer = 1;
        }
    }
    
    public void walkLeft()
    {
        walkLeftImageTimer++; //increase timer
        
        if(walkLeftImageTimer >= 1)
        {
            if(walkLeftImageTimer <= 5)
            {
                setImage(walkLeft1);
            }
        }
        if(walkLeftImageTimer >= 6)
        {
            if(walkLeftImageTimer <= 10)
            {
                setImage(walkLeft2);
            }
        }
        if(walkLeftImageTimer >= 11)
        {
            if(walkLeftImageTimer <= 15)
            {
                setImage(walkLeft3);
            }
        }
        if(walkLeftImageTimer >= 16)
        {
            if(walkLeftImageTimer <= 20)
            {
                setImage(walkLeft4);
            }
        }
        if(walkLeftImageTimer == 20)
        {
            walkLeftImageTimer = 1;
        }
    }
    
    public void walkLeftFire()
    {
        walkLeftFireImageTimer = walkLeftImageTimer;
        walkLeftFireImageTimer++; //increase timer
        
        if(walkLeftFireImageTimer >= 1)
        {
            if(walkLeftFireImageTimer <= 5)
            {
                setImage(walkLeftFire1);
            }
        }
        if(walkLeftFireImageTimer >= 6)
        {
            if(walkLeftFireImageTimer <= 10)
            {
                setImage(walkLeftFire2);
            }
        }
        if(walkLeftFireImageTimer >= 11)
        {
            if(walkLeftFireImageTimer <= 15)
            {
                setImage(walkLeftFire3);
            }
        }
        if(walkLeftFireImageTimer >= 16)
        {
            if(walkLeftFireImageTimer <= 20)
            {
                setImage(walkLeftFire4);
            }
        }
        if(walkLeftFireImageTimer == 20)
        {
            walkLeftFireImageTimer = 1;
        }
    }
    
    public void runLeft()
    {
        runLeftImageTimer++; //increase timer
        
        if(runLeftImageTimer >= 1)
        {
            if(runLeftImageTimer <= 5)
            {
                setImage(runLeft1);
            }
        }
        if(runLeftImageTimer >= 6)
        {
            if(runLeftImageTimer <= 10)
            {
                setImage(runLeft2);
            }
        }
        if(runLeftImageTimer >= 11)
        {
            if(runLeftImageTimer <= 15)
            {
                setImage(runLeft3);
            }
        }
        if(runLeftImageTimer >= 16)
        {
            if(runLeftImageTimer <= 20)
            {
                setImage(runLeft4);
            }
        }
        if(runLeftImageTimer >= 21)
        {
            if(runLeftImageTimer <= 25)
            {
                setImage(runLeft5);
            }
        }
        if(runLeftImageTimer == 25)
        {
            runLeftImageTimer = 1;
        }
    }
    
    public void runLeftFire()
    {
        runLeftFireImageTimer = runLeftImageTimer;
        
        runLeftFireImageTimer++; //increase timer
        
        if(runLeftFireImageTimer >= 1)
        {
            if(runLeftFireImageTimer <= 5)
            {
                setImage(runLeftFire1);
            }
        }
        if(runLeftFireImageTimer >= 6)
        {
            if(runLeftFireImageTimer <= 10)
            {
                setImage(runLeftFire2);
            }
        }
        if(runLeftFireImageTimer >= 11)
        {
            if(runLeftFireImageTimer <= 15)
            {
                setImage(runLeftFire3);
            }
        }
        if(runLeftFireImageTimer >= 16)
        {
            if(runLeftFireImageTimer <= 20)
            {
                setImage(runLeftFire4);
            }
        }
        if(runLeftFireImageTimer >= 21)
        {
            if(runLeftFireImageTimer <= 25)
            {
                setImage(runLeftFire5);
            }
        }
        if(runLeftFireImageTimer == 25)
        {
            runLeftFireImageTimer = 1;
        }
    }
    
    public void checkGround()
    {
        Actor left;
        left = getOneObjectAtOffset(-16 , 0, barriers.class );
        
        if(left != null)
        {
            speedLeft = 0;
            worldEdge = true;
        }
        else
        {
            speedLeft = speedLeft;
            worldEdge = false;
        }
        
        Actor right;
        right = getOneObjectAtOffset(16 , 0, barriers.class );
        
        if(right != null)
        {
            speedRight = 0;
            worldEdge = true;
        }
        else
        {
            speedRight = speedRight;
            worldEdge = false;
        }
        
        Actor barriers;
        barriers = getOneObjectAtOffset(0, 26, barriers.class );
        
        if(barriers != null)
        {
            speedDown = 0;
            Gravity = 0;
            Ground = true;
            canJump = true;
            jump = false;
            Jump = 10; //make sure this value is the same as the one defined up top
            
            //Fixes the whole, "Guy loves to sink through the floor" problem.
            if(barriers instanceof ground)
            {
                setLocation(getX(), barriers.getY()-41); 
            }
            else if(barriers instanceof halfGround)
            {
                setLocation(getX(), barriers.getY()-41); 
            }
            else if(barriers instanceof disappearBlock)
            {
                setLocation(getX(), barriers.getY()-46); 
            }
            else if(barriers instanceof fallingBlock & climbingLadder == false & ladderStop == false)
            {
                setLocation(getX(), barriers.getY()-41); 
            }
            else if(barriers instanceof movingLeftPlatform)
            {
                setLocation(getX(), barriers.getY()-32); 
            }
            else if(barriers instanceof movingRightPlatform)
            {
                setLocation(getX(), barriers.getY()-32); 
            }
            
        }
        else
        {
            gCount++;
            Ground = false;
            speedDown = speedDown;
        }
        
        
        Actor ground;
        ground = getOneIntersectingObject(ground.class);
        
        if(ground != null)
        {
            onGround = true;
        }
        else
        {
            onGround = false;
        }
        
        Actor top;
        top = getOneObjectAtOffset(0 , -30, barriers.class );
        
        if(top != null)
        {
            ceiling = true;
            speedUp = 0;
            if(atLadder == true)
            {
                speedUp = 1;
            }
        }
        else
        {
            ceiling = false;
            speedUp = 1;
        }   
    }
    
    public void gravityMethod()
    {
        //gCount runs a timer, and every time it reaches 5, Gravity increases, making Guy fall faster. 
        if(gCount == 5)
        {
            Gravity += 1;
            gCount = 0;
        }
        setLocation(getX(), getY()+Gravity);
        
        //If Guy dies, make him rotate
        if(isAlive == false & Gravity >= 1)
        {
            deathRotationTimer += 5; //change this to change Guy's death spin rotation rate
            setRotation(deathRotationTimer);
        }
    }
    
    public void jumpMethod()
    {
        //jCount runs a timer, and every timer it reaches 3, Jump slows, making him stop in midair, where Gravity will cause him to fall back down.
        jCount++;
        if(jCount == 3)
        {
            Jump -= 1;
            jCount = 0;
        }
        if(ceiling == false)
        {
            setLocation(getX(), getY()-Jump); 
        }
        else
        {
            Jump = 0;
        }

        if(Jump == 0)
        {
            jCount = 0;
            canClimbLadder = true;
        }
        else
        {
            canClimbLadder = false; //If Guy jumping, he cannot climb
        }
    }
    
    public void checkLadder()
    {
        Actor ladder;
        ladder = getOneIntersectingObject(ladder.class);
        
        if(ladder != null)
        {
            atLadder = true; //Tells Guy to stop jumping
            canJump = false; //stops Guy's jump from ladder
            /**onLadderTimer++;**/
            
            //Prevents midair jump climbing
            if(canClimbLadder == true)
            {
                //Guy's properties for climbing UP the ladder
                if(Greenfoot.isKeyDown("up"))
                {
                    climbingLadder = true;
                    
                    if(climbingLadder == true)
                    {
                        setLocation(getX(), getY()-speedUp);
                        ladderClimbMethod(); //method where Guy's image changes for ladder climb
                        Gravity = 0; //Stops Gravity from keeping him down
                    }
                }
                else
                {
                    climbingLadder = false;
                }
                
                if(Greenfoot.isKeyDown("shift") & Ground != true)
                {
                    ladderStop = true;
                    setImage(climbLadder1);
                }
                else
                {
                    ladderStop = false;
                }
                
                if(ladderStop == true & climbingLadder == true)
                {
                    ladderClimbMethod();
                }
            }
        }
        else
        {
            atLadder = false;
            climbingLadder = false;
            ladderStop = false;
        }
    }
    
    public void ladderClimbMethod()
    {
        climbLadderImageTimer++; //increase timer
        
        if(climbLadderImageTimer >= 1)
        {
            if(climbLadderImageTimer <= 5)
            {
                setImage(climbLadder1);
            }
        }
        if(climbLadderImageTimer >= 6)
        {
            if(climbLadderImageTimer <= 10)
            {
                setImage(climbLadder2);
            }
        }
        if(climbLadderImageTimer >= 11)
        {
            if(climbLadderImageTimer <= 15)
            {
                setImage(climbLadder3);
            }
        }
        if(climbLadderImageTimer >= 16)
        {
            if(climbLadderImageTimer <= 20)
            {
                setImage(climbLadder4);
            }
        }
        if(climbLadderImageTimer >= 21)
        {
            if(climbLadderImageTimer <= 25)
            {
                setImage(climbLadder5);
            }
        }
        if(climbLadderImageTimer >= 26)
        {
            if(climbLadderImageTimer <= 30)
            {
                setImage(climbLadder6);
            }
        }
        if(climbLadderImageTimer >= 31)
        {
            if(climbLadderImageTimer <= 35)
            {
                setImage(climbLadder7);
            }
        }
        if(climbLadderImageTimer >= 36)
        {
            if(climbLadderImageTimer <= 40)
            {
                setImage(climbLadder8);
            }
        }
        if(climbLadderImageTimer == 40)
        {
            climbLadderImageTimer = 1;
        }
    }
    
    public void checkFlick()
    {
        Flick Flick;
        Flick = (Flick)getOneIntersectingObject(Flick.class);
        
        if(Flick != null)
        {
            if(Flick.visible == true)
            {
                controls = false; //Player loses control for a bit
                guyWasHitFlick = true;
            }
            else
            {
                //Do nothing. He's invisible!
            }
        }
        
        if(guyWasHitFlick == true)
        {
            wasHitByFlickTimer++;
            guyHitImages();
            
            if(wasHitByFlickTimer == 1) //Makes it so that laserDamage is only added once per hit, instead of 20 damage 50 times from a single hit
            {
                guyHP = guyHP - flickDamage; //Subtract damage from hp
            }
            
            if(wasHitByFlickTimer >= 50) //Resets timer. 
            {
                wasHitByFlickTimer = 0;
            }
            
            //SEND DAMAGE TO THE WORLD
            if(getWorld() instanceof worldOne) 
            {  
                worldOne currentWorld = (worldOne)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            }
            else if(getWorld() instanceof worldTwo) 
            {  
                worldTwo currentWorld = (worldTwo)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            } 
            else if(getWorld() instanceof worldThree) 
            {  
                worldThree currentWorld = (worldThree)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            } 
            else if(getWorld() instanceof worldFour) 
            {  
                worldFour currentWorld = (worldFour)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            } 
            else if(getWorld() instanceof worldFive) 
            {  
                worldFive currentWorld = (worldFive)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            } 
        }
    }
    
    public void checkSkuddle()
    {
        Actor Skuddles;
        Skuddles = getOneIntersectingObject(Skuddle.class);
        
        if(Skuddles != null)
        {
            controls = false;
            guyWasHitSkuddle = true;
        }
        
        if(guyWasHitSkuddle == true)
        {
            wasHitBySkuddleTimer++;
            guyHitImages();
            if(wasHitBySkuddleTimer == 1) //Makes it so that laserDamage is only added once per hit, instead of 20 damage 50 times from a single hit
            {
                guyHP = guyHP - skuddleDamage; //Subtract damage from hp
            }
            
            if(wasHitBySkuddleTimer >= 30) //Resets timer. 
            {
                wasHitBySkuddleTimer = 0;
            }
        
            //SEND DAMAGE TO THE WORLD
            if(getWorld() instanceof worldOne) 
            {  
                worldOne currentWorld = (worldOne)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            }
            else if(getWorld() instanceof worldTwo) 
            {  
                worldTwo currentWorld = (worldTwo)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            } 
            else if(getWorld() instanceof worldThree) 
            {  
                worldThree currentWorld = (worldThree)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            } 
            else if(getWorld() instanceof worldFour) 
            {  
                worldFour currentWorld = (worldFour)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            } 
            else if(getWorld() instanceof worldFive) 
            {  
                worldFive currentWorld = (worldFive)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            } 
        }
    }
    
    public void checkEnemyAttacks()
    {
        Actor enemyAttacks;
        enemyAttacks = getOneIntersectingObject(enemyAttacks.class);
        
        if(enemyAttacks != null)
        {
            damageGuy(enemyAttackDamage);
        }
    }
    
    public void damageGuy(int enemyAttackDamage)
    {
        guyHP = guyHP - enemyAttackDamage; //Subtract damage from hp
        
        //SEND DAMAGE TO THE WORLD
        if(getWorld() instanceof worldOne) 
            {  
                worldOne currentWorld = (worldOne)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            }
            else if(getWorld() instanceof worldTwo) 
            {  
                worldTwo currentWorld = (worldTwo)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            } 
            else if(getWorld() instanceof worldThree) 
            {  
                worldThree currentWorld = (worldThree)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            } 
            else if(getWorld() instanceof worldFour) 
            {  
                worldFour currentWorld = (worldFour)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            }
            else if(getWorld() instanceof worldFive) 
            {  
                worldFive currentWorld = (worldFive)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            }
        //((currentWorld)getWorld()).populateHpBar(guyHP); //Send total Guy's health to the World
    }
    
    public void checkLasers()
    {
        Actor lasers;
        lasers = getOneIntersectingObject(laserBeams.class);
        
        if(lasers != null) //If Guy is hit by lasers
        {
            controls = false; //Player loses control for a bit
            hitByLasers = true; //Boolean runs method
        }
        
        if(hitByLasers == true) //Run method if true
        {
            guyLaserHitImages();
            hitByLaserTimer++;
            
            if(hitByLaserTimer == 1) //Makes it so that laserDamage is only added once per hit, instead of 20 damage 50 times from a single hit
            {
                guyHP = guyHP - laserDamage;
            }
            
            if(hitByLaserTimer >= 30) //Resets timer. 
            {
                //Make sure Timer is running longer than Guy can possibly be inside the laser. 
                //Max laser time = 11 counts.
                //
                hitByLaserTimer = 0;
            }
            
            //SEND DAMAGE TO THE WORLD
            if(getWorld() instanceof worldOne) 
            {  
                worldOne currentWorld = (worldOne)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            }
            else if(getWorld() instanceof worldTwo) 
            {  
                worldTwo currentWorld = (worldTwo)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            } 
            else if(getWorld() instanceof worldThree) 
            {  
                worldThree currentWorld = (worldThree)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            } 
            else if(getWorld() instanceof worldFour) 
            {  
                worldFour currentWorld = (worldFour)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            }
            else if(getWorld() instanceof worldFive) 
            {  
                worldFive currentWorld = (worldFive)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            }
        }
    }
    
    public void checkBlueLaser()
    {
        Actor blueLaser;
        blueLaser = getOneIntersectingObject(ufoBeamBlue.class);
        
        if(blueLaser != null) //If Guy is hit by lasers
        {
            hitByBlueLaser = true;
        }
        
        if(hitByBlueLaser == true)
        {
            slowedTimer++;
            canRun = false;
        }
        else
        {
            canRun = true;
        }
        
        if(slowedTimer == 150)
        {
            hitByBlueLaser = false;
            canRun = true;
        }
    }
    
    public void guyLaserHitImages()
    {
        laserHitTimer++; //Increase timer
        
        if(worldEdge == false)
        {
            if(walkRightLast == true)
            {
                setLocation(getX()-2, getY()); //Make Guy kind of fly back
                if(laserHitTimer >= 1)
                {
                    if(laserHitTimer <= 19)
                    {
                        setImage(guyLaserTouchRight1);
                    }
                }
                if(laserHitTimer >= 20)
                {
                    if(laserHitTimer <= 24)
                    {
                        setImage(guyLaserTouchRight2);
                    }
                }
                if(laserHitTimer >= 25)
                {
                    if(laserHitTimer <= 29)
                    {
                        setImage(guyLaserTouchRight3);
                    }
                }
            
                if(laserHitTimer == 29) //Reset everything to normal
                {
                    laserHitTimer = 0;
                    controls = true;
                    hitByLasers = false;
                }
            }
        
            if(walkLeftLast == true)
            {
                setLocation(getX()+2, getY()); //Make Guy kind of fly back
                if(laserHitTimer >= 1)
                {
                    if(laserHitTimer <= 19)
                    {
                        setImage(guyLaserTouchLeft1);
                    }
                }
                if(laserHitTimer >= 20)
                {
                    if(laserHitTimer <= 24)
                    {
                        setImage(guyLaserTouchLeft2);
                    }
                }
                if(laserHitTimer >= 25)
                {
                    if(laserHitTimer <= 29)
                    {
                        setImage(guyLaserTouchLeft3);
                    }
                }
            
                if(laserHitTimer == 29) //Reset everything to normal
                {
                    laserHitTimer = 0;
                    controls = true;
                    hitByLasers = false;
                }
            }
        }
        else
        {
            if(walkRightLast == true)
            {
                setLocation(getX()-0, getY()); //Make Guy kind of fly back
                if(laserHitTimer >= 1)
                {
                    if(laserHitTimer <= 19)
                    {
                        setImage(guyLaserTouchRight1);
                    }
                }
                if(laserHitTimer >= 20)
                {
                    if(laserHitTimer <= 24)
                    {
                        setImage(guyLaserTouchRight2);
                    }
                }
                if(laserHitTimer >= 25)
                {
                    if(laserHitTimer <= 29)
                    {
                        setImage(guyLaserTouchRight3);
                    }
                }
            
                if(laserHitTimer == 29) //Reset everything to normal
                {
                    laserHitTimer = 0;
                    controls = true;
                    hitByLasers = false;
                }
            }
        
            if(walkLeftLast == true)
            {
                setLocation(getX()-0, getY()); //Make Guy kind of fly back
                if(laserHitTimer >= 1)
                {
                    if(laserHitTimer <= 19)
                    {
                        setImage(guyLaserTouchLeft1);
                    }
                }
                if(laserHitTimer >= 20)
                {
                    if(laserHitTimer <= 24)
                    {
                        setImage(guyLaserTouchLeft2);
                    }
                }
                if(laserHitTimer >= 25)
                {
                    if(laserHitTimer <= 29)
                    {
                        setImage(guyLaserTouchLeft3);
                    }
                }
            
                if(laserHitTimer == 29) //Reset everything to normal
                {
                    laserHitTimer = 0;
                    controls = true;
                    hitByLasers = false;
                }
            }
        }
    }
    
    public void guyHitImages()
    {
        hitTimer++; //Increase timer
        
        if(worldEdge == false)
        {
            if(walkRightLast == true)
            {
                speedLeft = 2;
                setLocation(getX()-speedLeft, getY()); //Make Guy kind of fly back
                if(hitTimer >= 1)
                {
                    if(hitTimer <= 19)
                    {
                        setImage(guyLaserTouchRight1);
                    }
                }
                if(hitTimer >= 20)
                {
                    if(hitTimer <= 24)
                    {
                        setImage(guyLaserTouchRight2);
                    }
                }
                if(hitTimer >= 25)
                {
                    if(hitTimer <= 29)
                    {
                        setImage(guyLaserTouchRight3);
                    }
                }
            
                if(hitTimer == 29) //Reset everything to normal
                {
                    hitTimer = 0;
                    speedLeft = 1;
                    wasHitBySkuddleTimer = 0;
                    wasHitByFlickTimer = 0;
                    guyWasHitSkuddle = false;
                    guyWasHitFlick = false;
                    controls = true;
                }
            }
        
            if(walkLeftLast == true)
            {
                speedRight = 2;
                setLocation(getX()+speedRight, getY()); //Make Guy kind of fly back
                if(hitTimer >= 1)
                {
                    if(hitTimer <= 19)
                    {
                        setImage(guyLaserTouchLeft1);
                    }
                }
                if(hitTimer >= 20)
                {
                    if(hitTimer <= 24)
                    {
                        setImage(guyLaserTouchLeft2);
                    }
                }
                if(hitTimer >= 25)
                {
                    if(hitTimer <= 29)
                    {
                        setImage(guyLaserTouchLeft3);
                    }
                }
            
                if(hitTimer == 29) //Reset everything to normal
                {
                    hitTimer = 0;
                    speedRight = 1;
                    wasHitBySkuddleTimer = 0;
                    wasHitByFlickTimer = 0;
                    guyWasHitSkuddle = false;
                    guyWasHitFlick = false;
                    controls = true;
                }
             }
        }
        else
        {
           if(walkRightLast == true)
            {
                speedLeft = 0;
                setLocation(getX()-speedLeft, getY()); //Make Guy kind of fly back
                if(hitTimer >= 1)
                {
                    if(hitTimer <= 19)
                    {
                        setImage(guyLaserTouchRight1);
                    }
                }
                if(hitTimer >= 20)
                {
                    if(hitTimer <= 24)
                    {
                        setImage(guyLaserTouchRight2);
                    }
                }
                if(hitTimer >= 25)
                {
                    if(hitTimer <= 29)
                    {
                        setImage(guyLaserTouchRight3);
                    }
                }
            
                if(hitTimer == 29) //Reset everything to normal
                {
                    hitTimer = 0;
                    speedLeft = 1;
                    wasHitBySkuddleTimer = 0;
                    wasHitByFlickTimer = 0;
                    guyWasHitSkuddle = false;
                    guyWasHitFlick = false;
                    controls = true;
                }
            }
        
           if(walkLeftLast == true)
           {
               speedRight = 0;
               setLocation(getX()+speedRight, getY()); //Make Guy kind of fly back
               if(hitTimer >= 1)
               {
                   if(hitTimer <= 19)
                   {
                       setImage(guyLaserTouchLeft1);
                   }
               }
               if(hitTimer >= 20)
               {
                   if(hitTimer <= 24)
                   {
                       setImage(guyLaserTouchLeft2);
                   }
               }
               if(hitTimer >= 25)
               {
                   if(hitTimer <= 29)
                   {
                       setImage(guyLaserTouchLeft3);
                   }
               }
            
               if(hitTimer == 29) //Reset everything to normal
               {
                   hitTimer = 0;
                   speedRight = 1;
                   wasHitBySkuddleTimer = 0;
                   wasHitByFlickTimer = 0;
                   guyWasHitSkuddle = false;
                   guyWasHitFlick = false;
                   controls = true;
               }
           }
        }
    }
    
    public void checkDoor()
    {
        Actor door;
        door = getOneIntersectingObject(door.class);
        
        if(door != null)
        {
            atDoor = true; //Guy is at the door
        }
        else
        {
            atDoor = false; //Guy is not at the door
        }
    }
    
    public void checkNextLevel()
    {
        if(levelEnd == true)
        {
            invincible = true;
        }
        else
        {
            invincible = false;
        }
    }
    
    public void checkElectricField(int electricDamage) //Recieve damage from electricField
    {
        electricFields electricFields;
        electricFields = (electricFields)getOneIntersectingObject(electricFields.class);
        
        electricFieldDamage = electricDamage; //set it equal to damage
        
        if(electricFields != null)
        {
            guyHP = guyHP - electricFieldDamage;
            
            //SEND DAMAGE TO THE WORLD
            if(getWorld() instanceof worldOne) 
            {  
                worldOne currentWorld = (worldOne)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            }
            else if(getWorld() instanceof worldTwo) 
            {  
                worldTwo currentWorld = (worldTwo)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            } 
            else if(getWorld() instanceof worldThree) 
            {  
                worldThree currentWorld = (worldThree)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            } 
            else if(getWorld() instanceof worldFour) 
            {  
                worldFour currentWorld = (worldFour)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            } 
            else if(getWorld() instanceof worldFive) 
            {  
                worldFive currentWorld = (worldFive)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            } 
        }
    }
    
    public void checkConstantElectricFields()
    {
        Actor constantElectricFields;
        constantElectricFields = getOneIntersectingObject(constantElectricFields.class);
        
        if(constantElectricFields != null)
        {
            guyHP = guyHP - constantEectricFieldDamage;

            //SEND DAMAGE TO THE WORLD
            if(getWorld() instanceof worldOne) 
            {  
                worldOne currentWorld = (worldOne)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            }
            else if(getWorld() instanceof worldTwo) 
            {  
                worldTwo currentWorld = (worldTwo)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            } 
            else if(getWorld() instanceof worldThree) 
            {  
                worldThree currentWorld = (worldThree)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            } 
            else if(getWorld() instanceof worldFour) 
            {  
                worldFour currentWorld = (worldFour)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            } 
            else if(getWorld() instanceof worldFive) 
            {  
                worldFive currentWorld = (worldFive)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            } 
        }
    }
    
    public void checkBoundries()
    {
        if(getY() > 700 || getX() <= -15)
        {
            guyHP = guyHP - 100;
            
            //SEND DAMAGE TO THE WORLD
            if(getWorld() instanceof worldOne) 
            {  
                worldOne currentWorld = (worldOne)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            }
            else if(getWorld() instanceof worldTwo) 
            {  
                worldTwo currentWorld = (worldTwo)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            } 
            else if(getWorld() instanceof worldThree) 
            {  
                worldThree currentWorld = (worldThree)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            } 
            else if(getWorld() instanceof worldFour) 
            {  
                worldFour currentWorld = (worldFour)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            } 
            else if(getWorld() instanceof worldFive) 
            {  
                worldFive currentWorld = (worldFive)getWorld();  
                currentWorld.populateHpBar(guyHP);  
            } 
        }
    }
    
    public void checkKey()
    {
        Actor key;
        key = getOneIntersectingObject(key.class);
        
        if(key != null)
        {  
            gotKey = true;
            //SEND KEY TO THE WORLD
            if(getWorld() instanceof worldTwo) 
            {  
                worldTwo currentWorld = (worldTwo)getWorld();  
                currentWorld.populateElectricFields(gotKey);  
            } 
            else if(getWorld() instanceof worldFour) 
            {  
                worldFour currentWorld = (worldFour)getWorld();  
                currentWorld.populateElectricFields(gotKey);  
            } 
            else if(getWorld() instanceof worldFive) 
            {  
                worldFive currentWorld = (worldFive)getWorld();  
            } 
        }
    }
    
    public void checkMovingPlatforms()
    {
        movingLeftPlatform leftPlat;
        leftPlat = (movingLeftPlatform)getOneIntersectingObject(movingLeftPlatform.class);
        
        if(leftPlat != null & onGround == false)
        {
            if(leftPlat.movingLeft == true)
            {
                move(leftPlat.speed*-1);
            }
            if(leftPlat.movingRight == true)
            {
                move(leftPlat.speed);
            }
        }
        
        movingRightPlatform rightPlat;
        rightPlat = (movingRightPlatform)getOneIntersectingObject(movingRightPlatform.class);
        
        if(rightPlat != null & onGround == false)
        {
            if(rightPlat.movingLeft == true)
            {
                move(rightPlat.speed*-1);
            }
            if(rightPlat.movingRight == true)
            {
                move(rightPlat.speed);
            }
        }
    }
    
    public void updateGuyPosition()
    {
        if(getWorld() instanceof worldOne) 
        {  
            worldOne currentWorld = (worldOne)getWorld();  
            currentWorld.updateGuyPosition(getX(), getY());  
        } 
        else if(getWorld() instanceof worldTwo) 
        {  
            worldTwo currentWorld = (worldTwo)getWorld();  
            currentWorld.updateGuyPosition(getX(), getY());  
        } 
        else if(getWorld() instanceof worldThree) 
        {  
            worldThree currentWorld = (worldThree)getWorld();  
            currentWorld.updateGuyPosition(getX(), getY());  
        } 
        else if(getWorld() instanceof worldFour) 
        {  
            worldFour currentWorld = (worldFour)getWorld();  
            currentWorld.updateGuyPosition(getX(), getY());  
        } 
        else if(getWorld() instanceof worldFive) 
        {  
            worldFive currentWorld = (worldFive)getWorld();  
            currentWorld.updateGuyPosition(getX(), getY());  
        } 
    }
}
