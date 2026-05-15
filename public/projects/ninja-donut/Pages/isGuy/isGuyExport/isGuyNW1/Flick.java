import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)
import java.util.List;  

/**
 * Write a description of class Flick here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class Flick extends enemies
{
    //Flick's passive images
    GreenfootImage flickPassive1;
    GreenfootImage flickPassive2;
    GreenfootImage flickPassive3;
    GreenfootImage flickPassive4;
    GreenfootImage flickPassive5;
    GreenfootImage flickPassive6;
    GreenfootImage flickPassive7;
    GreenfootImage flickPassive8;
    GreenfootImage flickPassive9;
    GreenfootImage flickPassive10;

    //Flick's Invisible Images
    GreenfootImage flickInvisible1;
    GreenfootImage flickInvisible2;
    GreenfootImage flickInvisible3;
    GreenfootImage flickInvisible4;
    GreenfootImage flickInvisible5;
    GreenfootImage flickInvisible6;
    GreenfootImage flickInvisible7;
    GreenfootImage flickInvisible8;
    GreenfootImage flickInvisible9;
    GreenfootImage flickInvisible10;

    //Flick's Firing Images left
    GreenfootImage flickFireLeft1;
    GreenfootImage flickFireLeft2;
    GreenfootImage flickFireLeft3;
    GreenfootImage flickFireLeft4;
    GreenfootImage flickFireLeft5;
    GreenfootImage flickFireLeft6;
    GreenfootImage flickFireLeft7;
    GreenfootImage flickFireLeft8;
    GreenfootImage flickFireLeft9;
    GreenfootImage flickFireLeft10;

    //Flick's Firing Images right
    GreenfootImage flickFireRight1;
    GreenfootImage flickFireRight2;
    GreenfootImage flickFireRight3;
    GreenfootImage flickFireRight4;
    GreenfootImage flickFireRight5;
    GreenfootImage flickFireRight6;
    GreenfootImage flickFireRight7;
    GreenfootImage flickFireRight8;
    GreenfootImage flickFireRight9;
    GreenfootImage flickFireRight10;

    //Flick's Invisible Firing Images left
    GreenfootImage flickFireLeftInvisible1;
    GreenfootImage flickFireLeftInvisible2;
    GreenfootImage flickFireLeftInvisible3;
    GreenfootImage flickFireLeftInvisible4;
    GreenfootImage flickFireLeftInvisible5;
    GreenfootImage flickFireLeftInvisible6;
    GreenfootImage flickFireLeftInvisible7;
    GreenfootImage flickFireLeftInvisible8;
    GreenfootImage flickFireLeftInvisible9;
    GreenfootImage flickFireLeftInvisible10;

    //Flick's Invisible Firing Images right
    GreenfootImage flickFireRightInvisible1;
    GreenfootImage flickFireRightInvisible2;
    GreenfootImage flickFireRightInvisible3;
    GreenfootImage flickFireRightInvisible4;
    GreenfootImage flickFireRightInvisible5;
    GreenfootImage flickFireRightInvisible6;
    GreenfootImage flickFireRightInvisible7;
    GreenfootImage flickFireRightInvisible8;
    GreenfootImage flickFireRightInvisible9;
    GreenfootImage flickFireRightInvisible10;

    /** PROPERTIES **/
    int flickHP; //Flick's overall hp
    int speed; //Flick's movement speed
    int flickKill; //How many points killing Flick is worth

    /** TIMERS AND SUCH **/
    int invisibleSwitchTimer; //Timer to switch Flick from tangible to intangible and back
    int bonusInvisibleTime; //A random number to make Flick's invisibility at a different time than others
    int passiveImageTimer; //Image timer for Flick's tangible passive images
    int invisibleImageTimer; //Image timer for Flick's intangible images
    int randomDirection; //Picks a direction for Flick to initially move
    int switchDirectionTimer; //Timer to stop Flick from freezing when hitting groundEdge
    int fireTimer; //Temperary fire timer for Flick
    int fireRightTimer; //Image Timer for Flick's firing right
    int fireLeftTimer; //Image Timer for Flick's firing left
    int fireRightInvisibleTimer; //Image Timer for Flick's invisible firing right
    int fireLeftInvisibleTimer; //Image Timer for Flick's invisible firing left
    int fireBullet; //Flick fires one bullet
    int selfCollisionTimer; //Fix for when Flick gets stuck on another copy of himself
    int invisibleFlip;

    /** BOOLEANS **/
    public boolean isInvisible; //Simple boolean to tell if Flick is invisible or not
    public boolean visible;
    boolean movingRight; //Boolean to switch Flick's movement direction
    boolean movingLeft; //Boolean to switch Flick's movement direction
    boolean switchDirection; //Boolean to start "switchDirectionTimer"
    boolean isAlive; //Tells Flick if he is alive or not
    boolean isGuyInRange; //Method for if Guy is in range or not
    boolean invisibleCheck;

    public Flick()
    {       
        flickPassive1 = new GreenfootImage("Flick1.png");
        flickPassive2 = new GreenfootImage("Flick2.png");
        flickPassive3 = new GreenfootImage("Flick3.png");
        flickPassive4 = new GreenfootImage("Flick4.png");
        flickPassive5 = new GreenfootImage("Flick5.png");
        flickPassive6 = new GreenfootImage("Flick6.png");
        flickPassive7 = new GreenfootImage("Flick7.png");
        flickPassive8 = new GreenfootImage("Flick8.png");
        flickPassive9 = new GreenfootImage("Flick9.png");
        flickPassive10 = new GreenfootImage("Flick10.png");

        flickInvisible1 = new GreenfootImage("FlickInvisible1.png");
        flickInvisible2 = new GreenfootImage("FlickInvisible2.png");
        flickInvisible3 = new GreenfootImage("FlickInvisible3.png");
        flickInvisible4 = new GreenfootImage("FlickInvisible4.png");
        flickInvisible5 = new GreenfootImage("FlickInvisible5.png");
        flickInvisible6 = new GreenfootImage("FlickInvisible6.png");
        flickInvisible7 = new GreenfootImage("FlickInvisible7.png");
        flickInvisible8 = new GreenfootImage("FlickInvisible8.png");
        flickInvisible9 = new GreenfootImage("FlickInvisible9.png");
        flickInvisible10 = new GreenfootImage("FlickInvisible10.png");

        flickFireLeft1 = new GreenfootImage("FlickFireLeft1.png");
        flickFireLeft2 = new GreenfootImage("FlickFireLeft2.png");
        flickFireLeft3 = new GreenfootImage("FlickFireLeft3.png");
        flickFireLeft4 = new GreenfootImage("FlickFireLeft4.png");
        flickFireLeft5 = new GreenfootImage("FlickFireLeft5.png");
        flickFireLeft6 = new GreenfootImage("FlickFireLeft6.png");
        flickFireLeft7 = new GreenfootImage("FlickFireLeft7.png");
        flickFireLeft8 = new GreenfootImage("FlickFireLeft8.png");
        flickFireLeft9 = new GreenfootImage("FlickFireLeft9.png");
        flickFireLeft10 = new GreenfootImage("FlickFireLeft10.png");

        flickFireRight1 = new GreenfootImage("FlickFireRight1.png");
        flickFireRight2 = new GreenfootImage("FlickFireRight2.png");
        flickFireRight3 = new GreenfootImage("FlickFireRight3.png");
        flickFireRight4 = new GreenfootImage("FlickFireRight4.png");
        flickFireRight5 = new GreenfootImage("FlickFireRight5.png");
        flickFireRight6 = new GreenfootImage("FlickFireRight6.png");
        flickFireRight7 = new GreenfootImage("FlickFireRight7.png");
        flickFireRight8 = new GreenfootImage("FlickFireRight8.png");
        flickFireRight9 = new GreenfootImage("FlickFireRight9.png");
        flickFireRight10 = new GreenfootImage("FlickFireRight10.png");

        flickFireLeftInvisible1 = new GreenfootImage("FlickFireLeftInvisible1.png");
        flickFireLeftInvisible2 = new GreenfootImage("FlickFireLeftInvisible2.png");
        flickFireLeftInvisible3 = new GreenfootImage("FlickFireLeftInvisible3.png");
        flickFireLeftInvisible4 = new GreenfootImage("FlickFireLeftInvisible4.png");
        flickFireLeftInvisible5 = new GreenfootImage("FlickFireLeftInvisible5.png");
        flickFireLeftInvisible6 = new GreenfootImage("FlickFireLeftInvisible6.png");
        flickFireLeftInvisible7 = new GreenfootImage("FlickFireLeftInvisible7.png");
        flickFireLeftInvisible8 = new GreenfootImage("FlickFireLeftInvisible8.png");
        flickFireLeftInvisible9 = new GreenfootImage("FlickFireLeftInvisible9.png");
        flickFireLeftInvisible10 = new GreenfootImage("FlickFireLeftInvisible10.png");

        flickFireRightInvisible1 = new GreenfootImage("FlickFireRightInvisible1.png");
        flickFireRightInvisible2 = new GreenfootImage("FlickFireRightInvisible2.png");
        flickFireRightInvisible3 = new GreenfootImage("FlickFireRightInvisible3.png");
        flickFireRightInvisible4 = new GreenfootImage("FlickFireRightInvisible4.png");
        flickFireRightInvisible5 = new GreenfootImage("FlickFireRightInvisible5.png");
        flickFireRightInvisible6 = new GreenfootImage("FlickFireRightInvisible6.png");
        flickFireRightInvisible7 = new GreenfootImage("FlickFireRightInvisible7.png");
        flickFireRightInvisible8 = new GreenfootImage("FlickFireRightInvisible8.png");
        flickFireRightInvisible9 = new GreenfootImage("FlickFireRightInvisible9.png");
        flickFireRightInvisible10 = new GreenfootImage("FlickFireRightInvisible10.png");

        setImage(flickPassive1); //set default image for flick

        flickHP = 20; //Flick's total HP
        speed = 1;
        flickKill = 10; //Change this to change amount of points per Flick kill

        invisibleSwitchTimer = 0;
        bonusInvisibleTime = Greenfoot.getRandomNumber(100);
        passiveImageTimer = 0;
        invisibleImageTimer = 0;
        randomDirection = Greenfoot.getRandomNumber(9);
        switchDirectionTimer = 0;
        fireTimer = 0;
        fireRightTimer = 0;
        fireLeftTimer = 0;
        fireRightInvisibleTimer = 0;
        fireLeftInvisibleTimer = 0;
        fireBullet = 0;
        selfCollisionTimer = 0;
        invisibleFlip = 0;

        isInvisible = false;
        visible = true;
        movingRight = false; 
        movingLeft = false;
        switchDirection = false;
        isAlive = true;
        isGuyInRange = false;
        invisibleCheck = false;

        //Selects an initial direction for Flick to move
        if(randomDirection <= 4)
        {
            movingRight = true;
            movingLeft = false;
        }
        else if(randomDirection >= 5)
        {
            movingLeft = true;
            movingRight = false;
        }
    }

    /**
     * Act - do whatever the Flick wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        if(isAlive == true)
        {
            /**  This bit is for making Flick's "isInvisible" boolean true or false **/

            invisibleSwitchTimer++; //Constantly run this timer to make Flick tangible/intangible

            if(invisibleSwitchTimer <= 300 + bonusInvisibleTime & invisibleCheck == false) //If the timer is less than 300+bonus, he is tangible
            {
                isInvisible = false;
            }
            if(invisibleSwitchTimer >= 301 + bonusInvisibleTime) //If the timer is between 301+bonus and 500+bonus, he is intangible, else reset timer and make him tangible
            {
                if(invisibleSwitchTimer <= 500 + bonusInvisibleTime)
                {
                    isInvisible = true;
                }
            }
            if(invisibleSwitchTimer >= 501 + bonusInvisibleTime & invisibleCheck == false) //Reset "isInvisible" back to false, and "invisibleSwitchTimer" back to 0, if the timer goes over 501+bonus
            {
                isInvisible = false;
                invisibleSwitchTimer = 0;
            }

            if(invisibleSwitchTimer >= 501 + bonusInvisibleTime & invisibleCheck == true)
            {
                isInvisible = true;
            }

            /** Switching between tangible and intangible image timers **/

            if(isInvisible == false)
            {
                changePassiveFloat(); //changes Flick's passive floating images
                invisibleImageTimer = 0; //Set Invisible Images Timer to 0;
                checkFlick(); //Check to see if Flick is colliding with another enemy
                checkGuy(); //Check to see if Flick is hitting Guy
            }
            if(isInvisible == true)
            {
                changeInvisibleFloat(); //changes Flick's invisible floating images
                passiveImageTimer = 0; //Set passive Images Timer
                invisibleCheckFlick();
            }

            //Visible method for bullet class
            if(isInvisible == true)
            {
                visible = false;
            }
            else
            {
                visible = true;
            }    

            /** General Method Checks **/

            checkGroundEdge(); //Check for when he should flip around
            wander(); //Method to make Flick wander left and right. Flips when hits groundEdge
            fire();
            isGuyInRange();

        }
        else //Flicks Death properties
        {
            getWorld().removeObject(this);
        }
    }  

    public void changePassiveFloat()
    {
        passiveImageTimer++; //increase timer when method is called

        //Run image loop
        if(passiveImageTimer >= 1)
        {
            if(passiveImageTimer <= 5)
            {
                setImage(flickPassive1);
            }
        }
        if(passiveImageTimer >= 6)
        {
            if(passiveImageTimer <= 10)
            {
                setImage(flickPassive2);
            }
        }
        if(passiveImageTimer >= 11)
        {
            if(passiveImageTimer <= 15)
            {
                setImage(flickPassive3);
            }
        }
        if(passiveImageTimer >= 16)
        {
            if(passiveImageTimer <= 20)
            {
                setImage(flickPassive4);
            }
        }
        if(passiveImageTimer >= 21)
        {
            if(passiveImageTimer <= 25)
            {
                setImage(flickPassive5);
            }
        }
        if(passiveImageTimer >= 26)
        {
            if(passiveImageTimer <= 30)
            {
                setImage(flickPassive6);
            }
        }
        if(passiveImageTimer >= 31)
        {
            if(passiveImageTimer <= 35)
            {
                setImage(flickPassive7);
            }
        }
        if(passiveImageTimer >= 36)
        {
            if(passiveImageTimer <= 40)
            {
                setImage(flickPassive8);
            }
        }
        if(passiveImageTimer >= 41)
        {
            if(passiveImageTimer <= 45)
            {
                setImage(flickPassive9);
            }
        }
        if(passiveImageTimer >= 46)
        {
            if(passiveImageTimer <= 50)
            {
                setImage(flickPassive10);
            }
        }

        //Reset timer to rerun image loop
        if(passiveImageTimer == 50)
        {
            passiveImageTimer = 1;
        }
    }

    public void changeInvisibleFloat()
    {
        invisibleImageTimer++; //increase timer when method is called

        //Run image loop
        if(invisibleImageTimer >= 1)
        {
            if(invisibleImageTimer <= 5)
            {
                setImage(flickInvisible1);
            }
        }
        if(invisibleImageTimer >= 6)
        {
            if(invisibleImageTimer <= 10)
            {
                setImage(flickInvisible2);
            }
        }
        if(invisibleImageTimer >= 11)
        {
            if(invisibleImageTimer <= 15)
            {
                setImage(flickInvisible3);
            }
        }
        if(invisibleImageTimer >= 16)
        {
            if(invisibleImageTimer <= 20)
            {
                setImage(flickInvisible4);
            }
        }
        if(invisibleImageTimer >= 21)
        {
            if(invisibleImageTimer <= 25)
            {
                setImage(flickInvisible5);
            }
        }
        if(invisibleImageTimer >= 26)
        {
            if(invisibleImageTimer <= 30)
            {
                setImage(flickInvisible6);
            }
        }
        if(invisibleImageTimer >= 31)
        {
            if(invisibleImageTimer <= 35)
            {
                setImage(flickInvisible7);
            }
        }
        if(invisibleImageTimer >= 36)
        {
            if(invisibleImageTimer <= 40)
            {
                setImage(flickInvisible8);
            }
        }
        if(invisibleImageTimer >= 41)
        {
            if(invisibleImageTimer <= 45)
            {
                setImage(flickInvisible9);
            }
        }
        if(invisibleImageTimer >= 46)
        {
            if(invisibleImageTimer <= 50)
            {
                setImage(flickInvisible10);
            }
        }

        //Reset timer to rerun image loop
        if(invisibleImageTimer == 50)
        {
            invisibleImageTimer = 1;
        }
    }

    public void damageFlick(int bulletDamage)
    {
        flickHP = flickHP - bulletDamage; //Hurt Flick

        if(flickHP <= 0)
        {
            flickDeath(); //Method of what will happen when Flick dies
        }
    }

    public void flickDeath()
    {
        if(getWorld() instanceof worldOne) 
        {  
            worldOne currentWorld = (worldOne)getWorld();  
            currentWorld.updateScore(flickKill);  
        }
        else if(getWorld() instanceof worldTwo) 
        {  
            worldTwo currentWorld = (worldTwo)getWorld();  
            currentWorld.updateScore(flickKill);  
        } 
        else if(getWorld() instanceof worldThree) 
        {  
            worldThree currentWorld = (worldThree)getWorld();  
            currentWorld.updateScore(flickKill);  
        } 
        else if(getWorld() instanceof worldFour) 
        {  
            worldFour currentWorld = (worldFour)getWorld();  
            currentWorld.updateScore(flickKill);  
        } 
        else if(getWorld() instanceof worldFive) 
        {  
            worldFive currentWorld = (worldFive)getWorld();  
            currentWorld.updateScore(flickKill);  
        } 
        //((worldOne)getWorld()).updateScore(flickKill);
        isAlive = false;
    }

    public void checkGroundEdge()
    {
        Actor groundEdge;
        groundEdge = getOneIntersectingObject(groundEdge.class);

        if(groundEdge != null)
        {
            if(switchDirectionTimer == 0)
            {
                if(movingLeft == true)
                {
                    movingRight = true;
                    movingLeft = false;
                }
                else if(movingRight == true)
                {
                    movingLeft = true;
                    movingRight = false;              
                }
                switchDirection = true; //If Flick hits groundEdge, start the timer so he can't detect it again instantly
            }
        }
        else
        {
        }

        if(switchDirection == true) //Run timer
        {
            switchDirectionTimer++;
        }

        if(switchDirectionTimer >= 50) //Reset timer and boolean once timer reaches limit. This allows Flick to check for groundEdge again
        {
            switchDirection = false;
            switchDirectionTimer = 0;
        }
    }

    public void checkFlick()
    {
        Flick Flick;
        Flick = (Flick)getOneIntersectingObject(Flick.class);

        //Same code as groundEdge, because he needs to do the same thing if he hits another enemy.
        if(Flick != null)
        {
            if(Flick.visible == true)
            {
                if(switchDirectionTimer == 0)
                {
                    if(movingLeft == true)
                    {
                        movingRight = true;
                        movingLeft = false;
                    }
                    else if(movingRight == true)
                    {
                        movingLeft = true;
                        movingRight = false;              
                    }
                    switchDirection = true; //If Flick hits groundEdge, start the timer so he can't detect it again instantly
                }
            }
        }
        else
        {
        }

        if(switchDirection == true) //Run timer
        {
            switchDirectionTimer++;
        }

        if(switchDirectionTimer >= 50) //Reset timer and boolean once timer reaches limit. This allows Flick to check for groundEdge again
        {
            switchDirection = false;
            switchDirectionTimer = 0;
        }
    }

    public void invisibleCheckFlick()
    {
        Flick Flick;
        Flick = (Flick)getOneIntersectingObject(Flick.class);

        //Same code as groundEdge, because he needs to do the same thing if he hits another enemy.
        if(Flick != null)
        {
            invisibleCheck = true;
        }
        else
        {
            invisibleCheck = false;
        }

        if(invisibleCheck = true)
        {
            invisibleFlip++;
        }
        else
        {
            invisibleFlip = 0;
        }

        if(invisibleFlip >= 300)
        {
            invisibleCheck = false;
            invisibleFlip = 0;
        }
    }

    public void checkGuy()
    {
        Actor Guy;
        Guy = getOneIntersectingObject(Guy.class);

        if(Guy != null)
        {
            if(switchDirectionTimer == 0)
            {
                if(movingLeft == true)
                {
                    movingRight = true;
                    movingLeft = false;
                }
                else if(movingRight == true)
                {
                    movingLeft = true;
                    movingRight = false;              
                }
                switchDirection = true; //If Flick hits groundEdge, start the timer so he can't detect it again instantly
            }
        }
        else
        {
        }

        if(switchDirection == true) //Run timer
        {
            switchDirectionTimer++;
        }

        if(switchDirectionTimer >= 50) //Reset timer and boolean once timer reaches limit. This allows Flick to check for groundEdge again
        {
            switchDirection = false;
            switchDirectionTimer = 0;
        }
    }

    public void wander()
    {   
        //Movement for Flick
        if(movingRight == true)
        {
            move(speed);
        }
        if(movingLeft == true)
        {
            move(-speed);
        }
    }   

    public void fire()
    {
        if(fireTimer >= 1)
        {

            /** SETTING THE IMAGES EQUAL TO EACH OTHER IF FLICK HAPPENS TO GO GHOST OR SWITCH BACK TANGIBLE **/

            //If Firing Right while visible
            if(isInvisible == true & movingRight == true & fireRightTimer >= 1) //This is to set images equal to each other if he switches from tangible to intangible
            {
                fireRightInvisibleTimer = fireRightTimer; //If he is firing when he turns invisible, set the same image, but Invisible version
                fireRightTimer = 0; //reset Timer
            }

            //If Firing Left while visible
            if(isInvisible == true & movingLeft == true & fireLeftTimer >= 1) //This is to set images equal to each other if he switches from tangible to intangible
            {
                fireLeftInvisibleTimer = fireLeftTimer; //If he is firing when he turns invisible, set the same image, but Invisible version
                fireLeftTimer = 0; //reset Timer
            }

            //If Firing Right while invisible
            if(isInvisible == false & movingRight == true & fireRightInvisibleTimer >= 1) //This is to set images equal to each other if he switches from tangible to intangible
            {
                fireRightTimer = fireRightInvisibleTimer; //If he is firing when he turns invisible, set the same image, but Invisible version
                fireRightInvisibleTimer = 0; //reset Timer
            }

            //If Firing Left while invisible
            if(isInvisible == false & movingLeft == true & fireLeftInvisibleTimer >= 1) //This is to set images equal to each other if he switches from tangible to intangible
            {
                fireLeftTimer = fireLeftInvisibleTimer; //If he is firing when he turns invisible, set the same image, but Invisible version
                fireLeftInvisibleTimer = 0; //reset Timer
            }

            /** IF FLICK IS FIRING WHILE VISIBLE **/

            if(isInvisible == false) 
            {
                if(movingRight == true)
                {
                    fireRightTimer++;

                    if(fireRightTimer >= 1)
                    {
                        if(fireRightTimer <= 5)
                        {
                            setImage(flickFireRight1);
                        }
                    }
                    if(fireRightTimer >= 6)
                    {
                        if(fireRightTimer <= 10)
                        {
                            setImage(flickFireRight2);
                        }
                    }
                    if(fireRightTimer >= 11)
                    {
                        if(fireRightTimer <= 15)
                        {
                            setImage(flickFireRight3);
                        }
                    }
                    if(fireRightTimer >= 16)
                    {
                        if(fireRightTimer <= 20)
                        {
                            setImage(flickFireRight4);
                        }
                    }
                    if(fireRightTimer >= 21)
                    {
                        if(fireRightTimer <= 25)
                        {
                            setImage(flickFireRight5);
                        }
                    }
                    if(fireRightTimer >= 26)
                    {
                        fireBullet++;
                        if(fireRightTimer <= 30)
                        {
                            setImage(flickFireRight6);

                            if(fireBullet == 1)
                            {
                                flickBullet flickBullet;
                                flickBullet = new flickBullet(1);
                                getWorld().addObject(flickBullet, getX(), getY()+20);
                            }
                        }
                    }
                    if(fireRightTimer >= 31)
                    {
                        if(fireRightTimer <= 35)
                        {
                            setImage(flickFireRight7);
                        }
                    }
                    if(fireRightTimer >= 36)
                    {
                        if(fireRightTimer <= 40)
                        {
                            setImage(flickFireRight8);
                        }
                    }
                    if(fireRightTimer >= 41)
                    {
                        if(fireRightTimer <= 45)
                        {
                            setImage(flickFireRight9);
                        }
                    }
                    if(fireRightTimer >= 46)
                    {
                        if(fireRightTimer <= 50)
                        {
                            setImage(flickFireRight10);
                        }
                    }

                    if(fireRightTimer == 150)
                    {
                        fireRightTimer = 0;
                        fireTimer = 0;
                        fireBullet = 0;
                    }
                } //End of if(movingRight == true)

                if(movingLeft == true)
                {
                    fireLeftTimer++;

                    if(fireLeftTimer >= 1)
                    {
                        if(fireLeftTimer <= 5)
                        {
                            setImage(flickFireLeft1);
                        }
                    }
                    if(fireLeftTimer >= 6)
                    {
                        if(fireLeftTimer <= 10)
                        {
                            setImage(flickFireLeft2);
                        }
                    }
                    if(fireLeftTimer >= 11)
                    {
                        if(fireLeftTimer <= 15)
                        {
                            setImage(flickFireLeft3);
                        }
                    }
                    if(fireLeftTimer >= 16)
                    {
                        if(fireLeftTimer <= 20)
                        {
                            setImage(flickFireLeft4);
                        }
                    }
                    if(fireLeftTimer >= 21)
                    {
                        if(fireLeftTimer <= 25)
                        {
                            setImage(flickFireLeft5);
                        }
                    }
                    if(fireLeftTimer >= 26)
                    {
                        fireBullet++;
                        if(fireLeftTimer <= 30)
                        {
                            setImage(flickFireLeft6);

                            if(fireBullet == 1)
                            {
                                flickBullet flickBullet;
                                flickBullet = new flickBullet(2);
                                getWorld().addObject(flickBullet, getX(), getY()+20);
                            }
                        }
                    }
                    if(fireLeftTimer >= 31)
                    {
                        if(fireLeftTimer <= 35)
                        {
                            setImage(flickFireLeft7);
                        }
                    }
                    if(fireLeftTimer >= 36)
                    {
                        if(fireLeftTimer <= 40)
                        {
                            setImage(flickFireLeft8);
                        }
                    }
                    if(fireLeftTimer >= 41)
                    {
                        if(fireLeftTimer <= 45)
                        {
                            setImage(flickFireLeft9);
                        }
                    }
                    if(fireLeftTimer >= 46)
                    {
                        if(fireLeftTimer <= 50)
                        {
                            setImage(flickFireLeft10);
                        }
                    }

                    if(fireLeftTimer == 150)
                    {
                        fireLeftTimer = 0;
                        fireTimer = 0;
                        fireBullet = 0;
                    }
                } //End of if(movingLeft == true)
            } //End of if(IsInvisible == false)

            /** IF FLICK IS FIRING WHILE INVISIBLE **/

            else if(isInvisible == true)
            {
                if(movingRight == true)
                {
                    fireRightInvisibleTimer++;

                    if(fireRightInvisibleTimer >= 1)
                    {
                        if(fireRightInvisibleTimer <= 5)
                        {
                            setImage(flickFireRightInvisible1);
                        }
                    }
                    if(fireRightInvisibleTimer >= 6)
                    {
                        if(fireRightInvisibleTimer <= 10)
                        {
                            setImage(flickFireRightInvisible2);
                        }
                    }
                    if(fireRightInvisibleTimer >= 11)
                    {
                        if(fireRightInvisibleTimer <= 15)
                        {
                            setImage(flickFireRightInvisible3);
                        }
                    }
                    if(fireRightInvisibleTimer >= 16)
                    {
                        if(fireRightInvisibleTimer <= 20)
                        {
                            setImage(flickFireRightInvisible4);
                        }
                    }
                    if(fireRightInvisibleTimer >= 21)
                    {
                        if(fireRightInvisibleTimer <= 25)
                        {
                            setImage(flickFireRightInvisible5);
                        }
                    }
                    if(fireRightInvisibleTimer >= 26)
                    {
                        fireBullet++;
                        if(fireRightInvisibleTimer <= 30)
                        {
                            setImage(flickFireRightInvisible6);

                            if(fireBullet == 1)
                            {
                                flickBullet flickBullet;
                                flickBullet = new flickBullet(1);
                                getWorld().addObject(flickBullet, getX(), getY()+20);
                            }
                        }
                    }
                    if(fireRightInvisibleTimer >= 31)
                    {
                        if(fireRightInvisibleTimer <= 35)
                        {
                            setImage(flickFireRightInvisible7);
                        }
                    }
                    if(fireRightInvisibleTimer >= 36)
                    {
                        if(fireRightInvisibleTimer <= 40)
                        {
                            setImage(flickFireRightInvisible8);
                        }
                    }
                    if(fireRightInvisibleTimer >= 41)
                    {
                        if(fireRightInvisibleTimer <= 45)
                        {
                            setImage(flickFireRightInvisible9);
                        }
                    }
                    if(fireRightInvisibleTimer >= 46)
                    {
                        if(fireRightInvisibleTimer <= 50)
                        {
                            setImage(flickFireRightInvisible10);
                        }
                    }

                    if(fireRightInvisibleTimer == 150)
                    {
                        fireRightInvisibleTimer = 0;
                        fireTimer = 0;
                        fireBullet = 0;
                    }
                } //End of if(movingRight == true)

                if(movingLeft == true)
                {
                    fireLeftInvisibleTimer++;

                    if(fireLeftInvisibleTimer >= 1)
                    {
                        if(fireLeftInvisibleTimer <= 5)
                        {
                            setImage(flickFireLeftInvisible1);
                        }
                    }
                    if(fireLeftInvisibleTimer >= 6)
                    {
                        if(fireLeftInvisibleTimer <= 10)
                        {
                            setImage(flickFireLeftInvisible2);
                        }
                    }
                    if(fireLeftInvisibleTimer >= 11)
                    {
                        if(fireLeftInvisibleTimer <= 15)
                        {
                            setImage(flickFireLeftInvisible3);
                        }
                    }
                    if(fireLeftInvisibleTimer >= 16)
                    {
                        if(fireLeftInvisibleTimer <= 20)
                        {
                            setImage(flickFireLeftInvisible4);
                        }
                    }
                    if(fireLeftInvisibleTimer >= 21)
                    {
                        if(fireLeftInvisibleTimer <= 25)
                        {
                            setImage(flickFireLeftInvisible5);
                        }
                    }
                    if(fireLeftInvisibleTimer >= 26)
                    {
                        fireBullet++;
                        if(fireLeftInvisibleTimer <= 30)
                        {
                            setImage(flickFireLeftInvisible6);

                            if(fireBullet == 1)
                            {
                                flickBullet flickBullet;
                                flickBullet = new flickBullet(2);
                                getWorld().addObject(flickBullet, getX(), getY()+20);
                            }
                        }
                    }
                    if(fireLeftInvisibleTimer >= 31)
                    {
                        if(fireLeftInvisibleTimer <= 35)
                        {
                            setImage(flickFireLeftInvisible7);
                        }
                    }
                    if(fireLeftInvisibleTimer >= 36)
                    {
                        if(fireLeftInvisibleTimer <= 40)
                        {
                            setImage(flickFireLeftInvisible8);
                        }
                    }
                    if(fireLeftInvisibleTimer >= 41)
                    {
                        if(fireLeftInvisibleTimer <= 45)
                        {
                            setImage(flickFireLeftInvisible9);
                        }
                    }
                    if(fireLeftInvisibleTimer >= 46)
                    {
                        if(fireLeftInvisibleTimer <= 50)
                        {
                            setImage(flickFireLeftInvisible10);
                        }
                    }

                    if(fireLeftInvisibleTimer == 150)
                    {
                        fireLeftInvisibleTimer = 0;
                        fireTimer = 0;
                        fireBullet = 0;
                    }
                } //End of if(movingLeft == true)
            } //End of if(IsInvisible == true)

            /** ^^^IT WORKED^^^ :*) **/

        } //End of fireTimer
    }

    public boolean isGuyInRange()  
    {  
        List<Guy> list_guy_=getObjectsInRange(500,Guy.class);  
        for(Guy guy_:list_guy_)  
        {  
            fireTimer++;
        }  
        return list_guy_ != null;
    }
}
