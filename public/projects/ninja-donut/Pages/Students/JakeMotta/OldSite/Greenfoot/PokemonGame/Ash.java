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
GreenfootImage right2;
GreenfootImage right1;
GreenfootImage right;

GreenfootImage left2;
GreenfootImage left1;
GreenfootImage left;

GreenfootImage up2;
GreenfootImage up1;
GreenfootImage up;

GreenfootImage down2;
GreenfootImage down1;
GreenfootImage down;

//image timer, so I can take the delay out.
int imageTimer;

//Ash's walking speed up, down, left, and right
int movementSpeedUp;
int movementSpeedDown;
int movementSpeedLeft;
int movementSpeedRight;

//diagonal movements
int movementSpeedRightUp;
int movementSpeedLeftUp;
int movementSpeedRightDown;
int movementSpeedLeftDown;

boolean isHitAbove;
boolean isHitLeft;
boolean isHitRight;
boolean isHitBelow;

    public Ash()
    {
        right2 = new GreenfootImage("AshRight2.gif");
        right1 = new GreenfootImage("AshRight1.gif");
        right = new GreenfootImage("AshRight.gif");
        
        left2 = new GreenfootImage("AshLeft2.gif");
        left1 = new GreenfootImage("AshLeft1.gif");
        left = new GreenfootImage("AshLeft.gif");
        
        up2 = new GreenfootImage("AshUp2.gif");
        up1 = new GreenfootImage("AshUp1.gif");
        up = new GreenfootImage("AshUp.gif");
        
        down2 = new GreenfootImage("AshDown2.gif");
        down1 = new GreenfootImage("AshDown1.gif");
        down = new GreenfootImage("AshDown.gif");
        
        imageTimer = 0;
        
        movementSpeedUp = 1;
        movementSpeedDown = 1;
        movementSpeedLeft = 1;
        movementSpeedRight = 1;
        
        //diagonal movement speed
        movementSpeedRightUp = 0;
        movementSpeedLeftUp = 0;
        movementSpeedRightDown = 0;
        movementSpeedLeftDown = 0;

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
        
        //diagonal movement
        moveRightUp();
        moveLeftUp();
        moveRightDown();
        moveLeftDown();
        
        //checks for act
        removePopUp();
        
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
            
            //increase imageTimer
            imageTimer++;
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
            
            //increase imageTimer
            imageTimer++;
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
            
            //increase imageTimer
            imageTimer++;
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
            
            //increase imageTimer
            imageTimer++;
        }
    }
    
    //diagonal movement speed
    public void moveRightUp()
    {
        if(Greenfoot.isKeyDown("right"))
        {
            if(Greenfoot.isKeyDown("up"))
            {
                rightUpKeyDown();
            }
        }
    }
    public void moveRightDown()
    {
        if(Greenfoot.isKeyDown("right"))
        {
            if(Greenfoot.isKeyDown("down"))
            {
                rightDownKeyDown();
            }
        }
    }
    public void moveLeftUp()
    {
        if(Greenfoot.isKeyDown("left"))
        {
            if(Greenfoot.isKeyDown("up"))
            {
                leftUpKeyDown();
            }
        }
    }
    public void moveLeftDown()
    {
        if(Greenfoot.isKeyDown("left"))
        {
            if(Greenfoot.isKeyDown("down"))
            {
                leftDownKeyDown();
            }
        }
    }
    
    
    //button to remove popUp text
    public void removePopUp()
    {
         if(Greenfoot.isKeyDown("enter"))
        {
            getWorld().removeObjects(getWorld().getObjects(ClosedSign.class));
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
    
    //diagonal fix
    public void rightUpKeyDown()
    {
        //sets right movement speed to 0
        movementSpeedRight = 0;
        
        //sets up movement speed to 0
        movementSpeedUp = 0;
        
        //sets image to "right"
        setImage(right);
    }
    public void rightDownKeyDown()
    {
        //sets right movement speed to 0
        movementSpeedRight = 0;
        
        //sets down movement speed to 0
        movementSpeedDown = 0;
        
        //sets image to "right"
        setImage(right);
    }
    public void leftUpKeyDown()
    {
        //sets left movement speed to 0
        movementSpeedLeft = 0;
        
        //sets up movement speed to 0
        movementSpeedUp = 0;
        
        //sets image to "left"
        setImage(left);
    }
    public void leftDownKeyDown()
    {
        //sets left movement speed to 0
        movementSpeedLeft = 0;
        
        //sets down movement speed to 0
        movementSpeedDown = 0;
        
        //sets image to "left"
        setImage(left);
    }
    
    //changing the images
    public void changeImageRight()
    {    
        if(imageTimer == 3)
        {
            setImage(right1);
        }
        if(imageTimer == 6)
        {
            setImage(right);
        }
        if(imageTimer == 9)
        {
            setImage(right2);
        }
        if(imageTimer == 12)
        {
            setImage(right);
            
            imageTimer = 0;
        }          
    }
    public void changeImageLeft()
    {
        if(imageTimer == 3)
        {
            setImage(left1);
        }
        if(imageTimer == 6)
        {
            setImage(left);
        }
        if(imageTimer == 9)
        {
            setImage(left2);
        }
        if(imageTimer == 12)
        {
            setImage(left);
            
            imageTimer = 0;
        }
    }
    public void changeImageUp()
    {
        if(imageTimer == 3)
        {
            setImage(up1);
        }
        if(imageTimer == 6)
        {
            setImage(up);
        }
        if(imageTimer == 9)
        {
            setImage(up2);
        }
        if(imageTimer == 12)
        {
            setImage(up);
            
            imageTimer = 0;
        }
    }
    public void changeImageDown()
    {
        if(imageTimer == 3)
        {
            setImage(down1);
        }
        if(imageTimer == 6)
        {
            setImage(down);
        }
        if(imageTimer == 9)
        {
            setImage(down2);
        }
        if(imageTimer == 12)
        {
            setImage(down);
            
            imageTimer = 0;
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
