import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class worldOne here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class worldTwo extends World
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
    
    /**
     * Constructor for objects of class worldOne.
     * 
     */
    public worldTwo(int previousScore, int previousHp, int previousLives, boolean islife1Earned, boolean islife2Earned, boolean islife3Earned, boolean islife4Earned)
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
                    Greenfoot.setWorld(new worldThree(myScore, myHp, myLives, life1Earned, life2Earned, life3Earned, life4Earned));
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
            addObject(guy, 35, 144);
            
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
        populateGround();
        populateGroundEdges(); //Used to tell enemies when to turn around and move the other direction
        //populateLadder();
        populateLasers();
        populateDoor();
        populateTimedBlocks();
        populateElectricFields(guyHasKey);
        populateWorldEdges();
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
        
        key = new key();
        addObject(key, 775, 140);
                      
        Guy guy;
        guy = new Guy(Score, myHp, myLives);
        addObject(guy, 35, 135);
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
        
        //bottom level
        addObject(new Flick(), 595, 535);
        addObject(new Flick(), 150, 535);
        
        //mid level
        addObject(new Flick(), 195, 335);
        addObject(new Flick(), 700, 335);     
    }
    
    public void populateSkuddle()
    {
        Skuddle Skuddle;
        Skuddle = new Skuddle();
        
        addObject(new Skuddle(), 420, 562);
        addObject(new Skuddle(), 562, 362);
    }
    
    public void populateGround()
    {
        ground ground;
        ground = new ground();
        
        //floor level ground
        addObject(new ground(), 100, 585);
        addObject(new ground(), 300, 585);
        addObject(new ground(), 500, 585);
        addObject(new ground(), 700, 585);
        
        //mid level ground
        addObject(new ground(), 200, 385);
        addObject(new ground(), 500, 385);
        addObject(new ground(), 700, 385);
        
        //top level ground
        addObject(new ground(), 50, 185);
        addObject(new ground(), 850, 185);
    }
    
    public void populateGroundEdges() //Used to tell enemies when to turn around and move the other direction
    {
        groundEdge groundEdge;
        groundEdge = new groundEdge();
        
        //floor level
        addObject(new groundEdge(), -5, 485);
        addObject(new groundEdge(), 805, 485);
        
        //mid level
        addObject(new groundEdge(), 805, 285);
        addObject(new groundEdge(), 395, 285);
        addObject(new groundEdge(), 305, 285);
        addObject(new groundEdge(), 95, 285);    
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
        shortLaser shortLaser;
        shortLaser = new shortLaser();
        
        longLaser longLaser;
        longLaser = new longLaser();
        
        //top level lasers
        addObject(new midLaser(), 240, 14);
        
        //bottom level lasers
        addObject(new shortLaser(), 432, 414);
        addObject(new shortLaser(), 532, 414);
        addObject(new shortLaser(), 632, 414);
        addObject(new shortLaser(), 732, 414);
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
        addObject(new door(), 772, 539);
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
    
    public void populateTimedBlocks()
    {
        timedBlockSetOne timedBlockSetOne;
        timedBlockSetOne = new timedBlockSetOne();
        addObject(timedBlockSetOne, -10, -10);
    }
    
    public void populateElectricFields(boolean recievedKey)
    {
        guyHasKey = recievedKey; //Set equal 
        
        //Stops from adding more electricFields when the key is grabbed. Tries to run the method twice. This stops a double add
        if(addOnceTimer == 0) 
        {
            addOnceTimer++;
            
            electricField = new electricField();
        
            smallElectricField smallElectricField;
            smallElectricField = new smallElectricField();
        
            addObject(electricField, 400, 290);
            addObject(smallElectricField, 350, 390);
        }   
        
        //If Guy has grabbed the key, tell electricField
        if(guyHasKey == true)
        {
            electricField.checkKey(guyHasKey);
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
    
    public void updateGuyPosition(int x, int y)
    {
        guyX = x;
        guyY = y;
    }
}
