import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class Ash here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class Ash extends Actor
{
//right, left, up, and down are the standing image.
//right1, left1, up1, and down1 are all the walking image. 
GreenfootImage right1;
GreenfootImage right;

GreenfootImage left1;
GreenfootImage left;

GreenfootImage up1;
GreenfootImage up;

GreenfootImage down1;
GreenfootImage down;

//image timer, so I can take the delay out.
int imageTimer;

//Ash's walking speed up, down, left, and right
int movementSpeedUp;
int movementSpeedDown;
int movementSpeedLeft;
int movementSpeedRight;

boolean isHitAbove;
boolean isHitLeft;
boolean isHitRight;
boolean isHitBelow;

    public Ash()
    {
        right1 = new GreenfootImage("AshRight1.gif");
        right = new GreenfootImage("AshRight.gif");
        
        left1 = new GreenfootImage("AshLeft1.gif");
        left = new GreenfootImage("AshLeft.gif");
        
        up1 = new GreenfootImage("AshUp1.gif");
        up = new GreenfootImage("AshUp.gif");
        
        down1 = new GreenfootImage("AshDown1.gif");
        down = new GreenfootImage("AshDown.gif");
        
        imageTimer = 0;
        
        movementSpeedUp = 3;
        movementSpeedDown = 3;
        movementSpeedLeft = 3;
        movementSpeedRight = 3;
        
        isHitAbove = false;
        isHitBelow = false;
        isHitRight = false;
        isHitLeft = false;
    }
    /**
     * Act - do whatever the Ash wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        //resets the movement speed
        //movementSpeed = 3;
        
        //arrow movement functions
        moveRight();
        moveLeft();
        moveUp();
        moveDown();
        
        imageTimer++;
        
        //add a delay to his walk, keeping it smooth and origional
        Greenfoot.delay(2);
    }   
    
    //the arrow keys
    public void moveRight()
    {
        if(Greenfoot.isKeyDown("right"))
        {
            //walking cycle
            changeImageRight();
            
            //actual moving
            rightKeyDown();
            
            //checks for a barrier to the right
            checkBarrierRight();
        }
    }
    public void moveLeft()
    {
        if(Greenfoot.isKeyDown("left"))
        {
            //walking cycle
            changeImageLeft();
            
            //actual moving
            leftKeyDown();
            
            //checks for a barrier to the left
            checkBarrierLeft();
        }
    }
    public void moveUp()
    {
        if(Greenfoot.isKeyDown("up"))
        {
            //walking cycle
            changeImageUp();
            
            //actual moving
            upKeyDown();
           
            //checks for a barrier above
            checkBarrierAbove();
        }
    }
    public void moveDown()
    {
        if(Greenfoot.isKeyDown("down"))
        {
            //walking cycle
            changeImageDown();
            
            //actual moving
            downKeyDown();
            
            //check barrier above
            checkBarrierBelow();
        }
    }
    
    //sets movement
    public void rightKeyDown()
    {
        //sets location to the right
        setLocation(getX()+movementSpeedRight, getY());
        
        //checks barrier right
        checkBarrierRight();
    }
    public void leftKeyDown()
    {
        //sets location to the left
        setLocation(getX()-movementSpeedLeft, getY());
        
        //checks barrier left
        checkBarrierLeft();
    }
    public void upKeyDown()
    {
        //sets location up
        setLocation(getX(), getY()-movementSpeedUp);
        
        //checks barrier above
        checkBarrierAbove();
    }
    public void downKeyDown()
    {
        //sets location down
        setLocation(getX(), getY()+movementSpeedDown);
        
        //checks barrier below
        checkBarrierBelow();
    }
    
    //changing the images
    public void changeImageRight()
    {
        
        imageTimer++;
        
        if(getImage() == right)
        {
            setImage(right1);
        }
        else
        {
            setImage(right);
        }

        //imageTimer = 0;              
    }
    public void changeImageLeft()
    {
        if(getImage() == left)
        {
            setImage(left1);
        }
        else
        {
            setImage(left);
        }
    }
    public void changeImageUp()
    {
        if(getImage() == up)
        {
            setImage(up1);
        }
        else
        {
            setImage(up);
        }
    }
    public void changeImageDown()
    {
        if(getImage() == down)
        {
            setImage(down1);
        }
        else
        {
            setImage(down);
        }
    }

    //checks for a barrier above
    public void checkBarrierAbove()
    {
        if(isBarrierAbove())
        {
            movementSpeedUp = 0;
        }
        else
        {
            movementSpeedUp = 3;
        }
    }
    
      public boolean isBarrierAbove()
    {
        //create variable of type Actor
        Actor above;
        //set variable value
        above = getOneObjectAtOffset(0, -10, Barriers.class);        
        
        if(above != null)
        {
            return true;
        }
        else
        {
            return false;
        }
        
    }
    
    //checks for a barrier Below
    public void checkBarrierBelow()
    {
        if(isBarrierBelow())
        {
            movementSpeedDown = 0;
        }
        else
        {
            movementSpeedDown = 3;
        }
    }
    
      public boolean isBarrierBelow()
    {
        //create variable of type Actor
        Actor below;
        //set variable value
        below = getOneObjectAtOffset(0, +10, Barriers.class);        
        
        if(below != null)
        {
            return true;
        }
        else
        {
            return false;
        }
        
    }
    
    
    //checks for a barrier right
    public void checkBarrierRight()
    {
        if(isBarrierRight())
        {
            movementSpeedRight = 0;
        }
        else
        {
            movementSpeedRight = 3;
        }
    }
    
      public boolean isBarrierRight()
    {
        //create variable of type Actor
        Actor right;
        //set variable value
        right = getOneObjectAtOffset(10, 0, Barriers.class);        
        
        if(right != null)
        {
            return true;
        }
        else
        {
            return false;
        }
        
    }
    
    //checks for a barrier left
    public void checkBarrierLeft()
    {
        if(isBarrierLeft())
        {
            movementSpeedLeft = 0;
        }
        else
        {
            movementSpeedLeft = 3;
        }
    }
    
      public boolean isBarrierLeft()
    {
        //create variable of type Actor
        Actor left;
        //set variable value
        left = getOneObjectAtOffset(-10, 0, Barriers.class);        
        
        if(left != null)
        {
            return true;
        }
        else
        {
            return false;
        }
        
    }
    
}
