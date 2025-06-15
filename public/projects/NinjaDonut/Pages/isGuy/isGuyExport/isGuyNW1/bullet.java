import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class bullet here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class bullet extends Actor
{
    GreenfootSound bulletSound;
    
    int speed;
    int lifeTimer;
    int myDirection; //Equal to the direction (int Guy passes) Guy is facing
    int damage; //How much damage Guy's bullet does
    int offLadderTimer; //Timer to check the barrier after that of the one being shot through
    int soundTimer;
    
    boolean isAlive; //Is the bullet alive or not? In the world or not?
    boolean checkWalls; //A boolean to stop the bullet from deleting if it hits a wall while Guy is climbing a ladder
    
    public bullet(int direction) //Sent from Guy
    {
        bulletSound = new GreenfootSound("bulletShot7.mp3");
        bulletSound.setVolume(50);
        
        speed = 8;
        lifeTimer = 75;
        damage = 3; //Change this to increase/decrease bullet damage
        offLadderTimer = 0;
        soundTimer = 0;
        
        isAlive = true;
        checkWalls = true;
        
        myDirection = direction; // either a 1 or 2
    }
    
    /**
     * Act - do whatever the bullet wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        lifeTimer--; //Decrease lifeTimer, giving the bullet a time limit of existance
        if(isAlive == true)
        {
            if(lifeTimer > 0 )
            {
                move();
                checkFlick(); //check to detect Flick
                checkLasers(); //check to detect Lasers
                checkSkuddle(); //check to detect Skudds
                checkUfo(); //check to detect UFO
                soundTimer++;
                
                if(soundTimer == 1)
                {
                    bulletSound.play();
                }
                
                //If bullet should be checking for walls, run checkBarrier
                if(checkWalls == true)
                {
                    checkBarriers(); //check to detect walls
                }
                else
                {
                    //Don't check for walls
                }
            }
            else
            {
                isAlive = false;
            }
        }
        else
        {
            getWorld().removeObject(this);
        }
    }    
    
    public void move()
    {  
            //Shoots bullet right if Guy faces right
            if(myDirection == 1)
            {
                move(speed);
            }
            
            //Shoots bullet left if Guy faces left
            if(myDirection == 2)
            {
                move(-speed);
            }
            
            //Shoots bullet up if Guy is on a ladder
            if(myDirection == 3)
            {
                setRotation(270);
                move(speed);
                checkLadder(); //check to detect Ladder
                
                //If the bullet has been off the ladder for X counts, start checking for barriers again
                if(offLadderTimer >= 10)
                {
                    checkBarriers(); //check walls
                }
            }
    }
    
    public void checkFlick() //Only checks for Flick. Special detection to see if Flick is invisible or not
    {
        Flick target;
        target = (Flick)getOneIntersectingObject(Flick.class);
        
        if(target != null)
        {
            if(target.visible == true)
            {
                target.damageFlick(damage); //Sents a number (damage) to Flick's "damageFlick" method
                isAlive = false;
            }
            else
            {
                //Do Absolutely Nothing!
            }
        }
    }
    
    public void checkLasers()
    {
        Actor lasers;
        lasers = getOneIntersectingObject(laserBeams.class);
        
        if(lasers != null)
        {
            isAlive = false;
        }
        else
        {
        }
    }
    
    public void checkSkuddle()
    {
        Actor Skuddle;
        Skuddle = getOneIntersectingObject(Skuddle.class);
        
        if(Skuddle != null)
        {
            isAlive = false;
        }
        else
        {
        }
    }
    
    public void checkBarriers()
    {
        Actor barriers;
        barriers = getOneIntersectingObject(barriers.class);
        
        if(barriers != null)
        {
            isAlive = false;
        }
        else
        {
        }
    }
    
    public void checkLadder()
    {
        Actor ladder;
        ladder = getOneIntersectingObject(ladder.class);
        
        if(ladder != null)
        {
            checkWalls = false;
        }
        else
        {
            offLadderTimer++;
        }
    }
    
    public void checkUfo()
    {
        Actor ufo;
        ufo = getOneIntersectingObject(ufo.class);
        
        if(ufo != null)
        {
            isAlive = false;
        }
        else
        {
        }
    }
}
