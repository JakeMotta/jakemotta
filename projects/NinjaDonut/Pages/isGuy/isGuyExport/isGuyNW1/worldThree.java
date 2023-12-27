import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class worldOne here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class worldThree extends World
{
    int myScore; //User's game score
    int myHp; //Guy's hp
    boolean nextWorld; //Changes the world to the next
    int myLives; //Guy's Lives
    
    int gameTimer; //Game timer
    int totalTime; //Total time
    int lives; //Guy's lives
    int switchWolrdTimer; //Timer to switch world
    int respawnTimer; //Timer to respawn Guy after he dies
    int blackOutTimer; //Timer of some sort..
    int singleLifeDecreaseTimer; //Timer to make sure that only one life is subracted after death
    int addOnceTimer; //Timer to make electricFields stop duplicating at key
    int gameOverTimer; //Timer before gameOver Screen
    int addTimer;
    
    int guyX;
    int guyY;
    
    boolean respawn; //Is Guy going to respawn or not
    boolean guyHasKey; //Has Guy grabbed the key?
    
    boolean life1Earned;
    boolean life2Earned;
    boolean life3Earned;
    boolean life4Earned;
    
    smallGameText Score; //Add Score Text
    smallGameText Time; //Add Time
    smallGameText Lives; //Add lives
    hpBar hpBar; //Add hpBar
    key key; //Add key
    electricField electricField; //Add electricField
    blackOut blackOut; //Add blackOut
    ufo ufo;
    
    /**
     * Constructor for objects of class worldOne.
     * 
     */
    public worldThree(int previousScore, int previousHp, int previousLives, boolean islife1Earned, boolean islife2Earned, boolean islife3Earned, boolean islife4Earned)
    {    
        // Create a new world with 600x400 cells with a cell size of 1x1 pixels.
        super(800, 600, 1, false); 
        setPaintOrder(blackIn.class, blackOut.class, Guy.class, enemies.class, smallGameText.class, hpBar.class, bullet.class, enemyAttacks.class, ladder.class, lasers.class, ground.class);
        
        myScore = previousScore; //Set initial score to 0
        myHp = previousHp; //Set hp equal to what it was last world
        myLives = previousLives; //Set lives equal to the previous amount of lives
        
        nextWorld = false;
        lives = 0;
        gameTimer = 0;
        totalTime = 99; //Total game time per level
        switchWolrdTimer = 0;
        respawnTimer = 0;
        blackOutTimer = 0;
        singleLifeDecreaseTimer = 0;
        addOnceTimer = 0;
        gameOverTimer = 0;
        addTimer = 0;
        
        guyX = 0;
        guyY = 0;
        
        respawn = false;
        guyHasKey = false;
        
        life1Earned = islife1Earned;
        life2Earned = islife2Earned;
        life3Earned = islife3Earned;
        life4Earned = islife4Earned;
        
        populateWorld();
    }
    
    public void act()
    {
        updateTime(); //Make the game clock count down  
        checkScore();
        if(nextWorld == true)
        {
            if(totalTime <= 0)
            {
                switchWolrdTimer += 1;
            
                if(switchWolrdTimer >= 100)
                {
                    Greenfoot.setWorld(new worldFour(myScore, myHp, myLives, life1Earned, life2Earned, life3Earned, life4Earned));
                }
            }
        }
        
        //If Guy has no HP, and still have more lives, set Guy's HP to 100.
        if(myHp <= 0 & myLives >= 1)
        {
            myHp = 100;
        }
        
        if(respawn == true)
        {
            respawnTimer++;
        }
        if(respawnTimer == 250 & myLives >= 1)
        {
            Guy guy;
            guy = new Guy(Score, myHp, myLives);
            addObject(guy, 35, 544);
            
            hpBar = new hpBar(myHp);
            addObject(hpBar, 10, 54);
            
            respawnTimer = 0;
            respawn = false;
        }
        
        //If Guy is  out of lives, game over fools. 
        if(myLives <= 0)
        {
            gameOverTimer++;
            
            if(gameOverTimer >= 150)
            {
                blackOutTimer++;
                if(blackOutTimer == 1) //Just to make sure blackOut isn't added multiple times. Insane lag otherwise. 
                {
                    blackOut = new blackOut();
                    addObject(blackOut, 400, 300);
                }
            }
            
            if(gameOverTimer >= 250)
            {
                Greenfoot.setWorld(new gameOverWorld(myScore));
            }
        }  
    }
    
    public void checkScore()
    {
        //Gives Guy and extra life every 100 points
        if(myScore >= 100 & life1Earned == false)
        {
            myLives += 1;
            updateLives(myLives);
            life1Earned = true;
        }
        if(myScore >= 200 & life2Earned == false)
        {
            myLives += 1;
            updateLives(myLives);
            life2Earned = true;   
        }
        if(myScore >= 300 & life3Earned == false)
        {
            myLives += 1;
            updateLives(myLives);
            life3Earned = true;
        }
        if(myScore >= 400 & life4Earned == false)
        {
            myLives += 1;
            updateLives(myLives);
            life4Earned = true;
        }
    }
    
    public void populateWorld()
    {
        populateIntro();
        populateGuy();
        populateFlick();
        populateSkuddle();
        //populateUfo();
        populateGround();
        populateGroundEdges(); //Used to tell enemies when to turn around and move the other direction
        populateLadder();
        populateLasers();
        populateDoor();
        populateWorldEdges();
        populateMovingPlatforms();
    }
    
    public void populateIntro()
    {
        blackIn blackIn;
        blackIn = new blackIn();
        addObject(blackIn, 400, 300);
    }
    
    public void populateGuy()
    {
        Score = new smallGameText("Score: " + myScore); //Initial text
        addObject(Score, 160, 50);
        
        Time = new smallGameText("Time: ");
        addObject(Time, 160, 75);
        
        hpBar = new hpBar(myHp);
        addObject(hpBar, 10, 54);
        
        Lives = new smallGameText("Lives: " + myLives); //Initial text
        addObject(Lives, 160, 25);
                      
        Guy guy;
        guy = new Guy(Score, myHp, myLives);
        addObject(guy, 35, 545);
    }
    
    public void populateHpBar(int guyHP) //Recieve Guy's hp
    {
        myHp = guyHP; //set hp equal to Guy's HP
        hpBar.setHP(myHp); //Send the hp over to the "hpBar" class
    }
    
    public void populateFlick()
    {
        Flick flick;
        flick = new Flick();
        
        //top level
        addObject(new Flick(), 150, 135);
        addObject(new Flick(), 426, 135);
        addObject(new Flick(), 595, 135);
        addObject(new Flick(), 732, 135);
        
        //mid level
        addObject(new Flick(), 195, 335);
        addObject(new Flick(), 356, 335); 
        addObject(new Flick(), 700, 335);   
        
        //bottom level
        addObject(new Flick(), 680, 535);
    }
    
    public void populateSkuddle()
    {
        Skuddle Skuddle;
        Skuddle = new Skuddle();
        
        //top level
        addObject(new Skuddle(), 105, 162);
        addObject(new Skuddle(), 219, 162);
        addObject(new Skuddle(), 438, 162);
        addObject(new Skuddle(), 657, 162);
        
        //mid level
        addObject(new Skuddle(), 219, 362);
        addObject(new Skuddle(), 438, 362);
        addObject(new Skuddle(), 657, 362);
    }
    
    public void populateUfo()
    {
        ufo = new ufo();
        addObject(new ufo(), 500, 221);
        addObject(new ufo(), 700, 21);
    }
    
    public void populateGround()
    {
        ground ground;
        ground = new ground();
        
        //floor level ground
        addObject(new ground(), 100, 585);
        addObject(new ground(), 700, 585);
        
        //mid level ground
        addObject(new ground(), 0, 385);
        addObject(new ground(), 200, 385);
        addObject(new ground(), 400, 385);
        addObject(new ground(), 600, 385);
        addObject(new ground(), 800, 385);
        
        //top level ground
        addObject(new ground(), 0, 185);
        addObject(new ground(), 200, 185);
        addObject(new ground(), 400, 185);
        addObject(new ground(), 600, 185);
        addObject(new ground(), 800, 185);
    }
    
    public void populateGroundEdges() //Used to tell enemies when to turn around and move the other direction
    {
        groundEdge groundEdge;
        groundEdge = new groundEdge();
        
        //floor level
        addObject(new groundEdge(), 595, 485);
        addObject(new groundEdge(), 805, 485);
        
        //mid level
        addObject(new groundEdge(), -5, 285);
        addObject(new groundEdge(), 805, 285);
        
        //top level
        addObject(new groundEdge(), -5, 85);
        addObject(new groundEdge(), 805, 85);
    }
    
    public void populateLadder()
    {
        ladder ladder;
        ladder = new ladder();
        
        //ground ladder
        addObject(new ladder(), 745, 475);
        
        //mid ladder
        addObject(new ladder(), 50, 275);
    }
    
    public void populateLasers()
    {
        midLaser midLaser;
        midLaser = new midLaser();
  
        //bottom level lasers
        addObject(new midLaser(), 270, 414);
        addObject(new midLaser(), 390, 414);
        addObject(new midLaser(), 510, 414);
    }

    public void updateScore(int scoreCount) //Recieve score from Guy
    {
        myScore = myScore + scoreCount;
        Score.setGameText("Score: " + myScore);
    }
    
    public void updateLives(int lifeCount) //Recieve lives from Guy
    {
        myLives = lifeCount;
        Lives.setGameText("Lives: " + myLives);
    }
    
    public void updateTime()
    {
        gameTimer++; //Increase timer
        
        if(gameTimer == 60 & totalTime != 0) //Every 60 counts, decrease 1 from the total time. Like a clock essentially. More or less a second.
        {
            totalTime--; //Subtract a second from the total time
            gameTimer = 0; //Reset the timer
        }
        
        Time.setGameText("Time: " + totalTime); //Convey the time
    }
    
    public void populateDoor()
    {
        door door;
        door = new door();
        addObject(new door(), 772, 139);
    }
    
    public void changeWorld(boolean levelEnd)
    {
        nextWorld = levelEnd;
        
        if(nextWorld = true)
        {
            if(totalTime >= 0)
            {
                myScore = myScore + totalTime;
                Score.setGameText("Score: " + myScore);
                
                totalTime = 0;
                Time.setGameText("Time: " + totalTime); 
            }
            if(totalTime == 0)
            {
                blackOutTimer++;
                
                if(blackOutTimer == 1) //Just to make sure blackOut isn't added multiple times. Insane lag otherwise. 
                {
                    blackOut = new blackOut();
                    addObject(blackOut, 400, 300);
                }
            }
        }
    }
    
    public void respawnGuy(boolean guyDead)
    {
        respawn = guyDead;  
    }
    
    public void populateWorldEdges()
    {
        worldEdge worldEdge;
        worldEdge = new worldEdge();
        
        addObject(new worldEdge(), -15, 400);
        addObject(new worldEdge(), 815, 400);
    }
    
    public void populateMovingPlatforms()
    {
        movingLeftPlatform movingLeftPlatform;
        movingLeftPlatform = new movingLeftPlatform();
        
        movingRightPlatform movingRightPlatform;
        movingRightPlatform = new movingRightPlatform();
        
        addObject(new movingRightPlatform(), 225, 577);
        addObject(new movingLeftPlatform(), 575, 577);
    }
    
    public void updateGuyPosition(int x, int y)
    {
        guyX = x;
        guyY = y;
    }
}
