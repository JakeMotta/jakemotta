import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

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
    
    boolean walkRightLast; //boolean to set correct image for which way Guy is facing
    boolean walkLeftLast; //boolean to set correct image for which way Guy is facing
    boolean canJump; //tells if Guy can jump or not
    boolean jump; //tells if Guy is jumping or not
    boolean atLadder; //tells Guy if there is he is touching a ladder. Stops his jump if true
    boolean canClimbLadder; //Stops midair jump ladder climbing
    boolean Ground; //Tells Guy if there is Ground or not
    boolean canFire; //Tells Guy if he can or cannot fire his gun
    
    public Guy()
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
        
        walkRightLast = false;
        walkLeftLast = false;
        canJump = true;
        jump = false;
        atLadder = false;
        canClimbLadder = true;
        Ground = false;
        canFire = true;
    }
    
    /**
     * Act - do whatever the Guy wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        checkKeys();
        checkGround();
        gravityMethod();
        checkLadder();
        //System.out.println(atLadder);
        if(jump == true)
        {
            jumpMethod();
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
        
        //checks for jump. Will only jump if "canJump" is true, and if there is no ladder present
        if(canJump == true & atLadder == false)
        {
            if(Greenfoot.isKeyDown("up"))
            {
                jump = true;
            }
        }
        
        //changes Guy's speed for running and walking
        if(Greenfoot.isKeyDown("shift"))
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
            if(canFire == true)
            {
                //Fire bullet facing right
                if(walkRightLast == true & fireTimer == 0) //Instant shot when pressed
                {
                    bulletRight bulletRight;
                    bulletRight = new bulletRight();
                    getWorld().addObject(bulletRight, getX(), getY());
                    fireTimer = 1; //Increase fireTimer to 1 so Guy can't shoot again
                }   
            
                //Fire bullet facing left
                if(walkLeftLast == true & fireTimer == 0) //Instant shot when pressed
                {
                    bulletLeft bulletLeft;
                    bulletLeft = new bulletLeft();
                    getWorld().addObject(bulletLeft, getX(), getY());
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
                walkRightImageTimer = 0;
                walkRightFire();
            }
            
            //if Guy is walking left when space is pressed
            if(Greenfoot.isKeyDown("left"))
            {
                walkLeftImageTimer = 0;
                walkLeftFire();
            }
            
            //if Guy is running right when spaced is pressed
            if(Greenfoot.isKeyDown("right") & Greenfoot.isKeyDown("shift"))
            {
                walkRightImageTimer = 0;
                runRightImageTimer = 0;
                runRightFire();
            }
            
            //if Guy is running left when spaced is pressed
            if(Greenfoot.isKeyDown("left") & Greenfoot.isKeyDown("shift"))
            {
                walkLeftImageTimer = 0;
                runLeftImageTimer = 0;
                runLeftFire();
            }
        }
        else
        {
            fireTimer = 0; //Reset fireTimer so player can shoot again. Play can shoot once per space press. 
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
        Actor ground;
        ground = getOneIntersectingObject(ground.class);
       
        if(ground != null)
        {
            Gravity = 0;
            Ground = true;
        }
        else
        {
            gCount++;
            Ground = false;
            canJump = false;
        }       
        
        Actor left;
        left = getOneObjectAtOffset(0 , 0, ground.class );
        
        if(left != null)
        {
            speedLeft = 0;
        }
        else
        {
            speedLeft = speedLeft;
        }
        
        Actor right;
        right = getOneObjectAtOffset(-210 , 0, ground.class );
        
        if(left != null)
        {
            speedRight = 0;
        }
        else
        {
            speedRight = speedRight;
        }
        
        Actor bottom;
        bottom = getOneObjectAtOffset(0 , -5, ground.class );
        
        if(bottom != null)
        {
            speedUp = 0;
            
            if(atLadder == true)
            {
                speedUp = 1;
            }
        }
        else
        {
            speedUp = speedUp;
        }
        
        //Makes it so there is no double jump.
        if(Gravity == 0)
        {
            canJump = true;
        }
        
        if(Gravity != 0)
        {
            canJump = false;
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
        setLocation(getX(), getY()-Jump);    
        if(Jump == 0)
        {
            jump = false;
            jCount = 0;
            Jump = 10; //make sure this value is the same as the one defined up top
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
                    setLocation(getX(), getY()-speedUp);
                    ladderClimbMethod(); //method where Guy's image changes for ladder climb
                    Gravity = 0; //Stops Gravity from keeping him down
                    canFire = false; //Stops Guy from firing on ladder
                }
                else
                {
                    canFire = true; //Allows Guy to shoot again. He may shoot while falling down ladder.
                }
                
                /**
                //Guy's properties for climbing DOWN the ladder
                if(Greenfoot.isKeyDown("down"))
                {
                    setLocation(getX(), getY()+speedDown);
                    ladderClimbMethod(); //method where Guy's image changes for ladder climb
                    Gravity = 0; //Stops Gravity from keeping him down
                    canFire = false; //Stops Guy from firing on ladder
                    
                    if(Ground == true)
                    {
                        speedDown = 0; //stops Guy from going through the floor when he's on the ladder
                    }
                }
                else
                {
                    canFire = true; //Allows Guy to shoot again. He may shoot while falling down ladder.
                }
                **/
            }
            
            /**
            //stops the jump after reaching top of ladder
            if(onLadderTimer > 1 & atLadder == false) //if Guy is off the ladder, he can't jump until "offLadderTimer" reaches 20
            {
                canJump = false;
                offLadderTimer++;
                
                if(offLadderTimer == 20)
                {
                    canJump = true;
                    onLadderTimer = 0; //Reset
                    offLadderTimer = 0; //Reset
                }
            }
            **/
        }
        else
        {
            atLadder = false;
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
}
