import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class worldOne here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class worldOne extends World
{
    int myScore; //User's game score
    boolean nextWorld; //Changes the world to the next
    int myLives; //Guy's Lives
    int gameTimer; //Game timer
    int totalTime; //Total time
    int myHp; //Guy's hp
    int lives; //Guy's lives
    int switchWolrdTimer; //Timer to switch world
    int guyStartingHp; //Guy's starting hp
    int guyStartingLives; //Guy's starting lives
    int blackOutTimer; //Timer to only make sure "blackOut" is only added to the world once
    int respawnTimer; //Timer to respawn Guy after he dies
    int gameOverTimer; //Timer for switching to gaveOver screen
    int guyX;
    int guyY;
    int addTimer;
    
    boolean respawn; //Is Guy going to respawn or not
    boolean life1Earned = false;
    boolean life2Earned = false;
    boolean life3Earned = false;
    boolean life4Earned = false;
    
    smallGameText Score; //Add Score Text
    smallGameText Time; //Add Time
    smallGameText Lives; //Add lives
    hpBar hpBar; //Add hpBar
    blackOut blackOut; //Add blackOut
    /**
     * Constructor for objects of class worldOne.
     * 
     */
    public worldOne()
    {    
        // Create a new world with 600x400 cells with a cell size of 1x1 pixels.
        super(800, 600, 1, false); 
        setPaintOrder(blackIn.class, blackOut.class, Guy.class, enemies.class, smallGameText.class, hpBar.class, bullet.class, enemyAttacks.class, ladder.class, lasers.class, ground.class);       
        
        myScore = 0; //Set initial score to 0
        nextWorld = false;
        myLives = 3;
        myHp =  100;
        lives = 0;
        gameTimer = 0;
        totalTime = 99; //Total game time per level
        switchWolrdTimer = 0;
        guyStartingHp = 100;
        guyStartingLives = 3;
        blackOutTimer = 0;
        respawnTimer = 0;
        gameOverTimer = 0;
        guyX = 0;
        guyY = 0;
        addTimer = 0;
        
        respawn = false;
        
        Greenfoot.setWorld(new gameStartWorld());
        
        populateWorld();
    }
    
    public void act()
    {
        updateTime(); //Make the game clock count down 
        checkScore(); //check score 
        if(nextWorld == true)
        {
            if(totalTime <= 0)
            {
                switchWolrdTimer += 1;
            
                if(switchWolrdTimer >= 100)
                {
                    Greenfoot.setWorld(new worldTwo(myScore, myHp, myLives, life1Earned, life2Earned, life3Earned, life4Earned));
                }
            }
        }
        
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
            guy = new Guy(Score, guyStartingHp, myLives);
            addObject(guy, 43, 544);
            
            hpBar = new hpBar(myHp);
            addObject(hpBar, 10, 54);
            
            respawnTimer = 0;
            respawn = false;
        }
        
        //If Guy is  out of lives, game over fools. 
        if(myLives <= 0)
        {
            gameOverTimer++;
             
            if(gameOverTimer == 150)
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
        populateGround();
        populateGroundEdges(); //Used to tell enemies when to turn around and move the other direction
        populateLadder();
        populateLasers();
        populateDoor();
        populateElectricFields();
        populateWorldEdges();
    }
    
    public void populateIntro()
    {
        blackIn blackIn;
        blackIn = new blackIn();
        addObject(blackIn, 400, 300);
    }
    
    public void populateHpBar(int guyHP) //Recieve Guy's hp
    {
        myHp = guyHP; //set hp equal to Guy's HP
        hpBar.setHP(myHp); //Send the hp over to the "hpBar" class
    }
    
    public void populateGuy()
    {
        Score = new smallGameText("Score: " + myScore); //Initial score
        addObject(Score, 160, 50);
        
        Time = new smallGameText("Time: "); //Initial Time
        addObject(Time, 160, 75);
        
        hpBar = new hpBar(myHp); //Initial life
        addObject(hpBar, 10, 54);
        
        Lives = new smallGameText("Lives: " + myLives); //Initial lives
        addObject(Lives, 160, 25);
        
        Guy guy;
        guy = new Guy(Score, guyStartingHp, guyStartingLives);
        addObject(guy, 43, 544);
    }
    
    public void populateFlick()
    {
        Flick flick;
        flick = new Flick();
        
        //bottom level
        addObject(new Flick(), 595, 535);
        
        //mid level
        addObject(new Flick(), 195, 335);
        addObject(new Flick(), 700, 335);
        
        //top level
        addObject(new Flick(), 400, 135);
        addObject(new Flick(), 700, 135);
    }
    
    public void populateGround()
    {
        ground ground;
        ground = new ground();
        
        //floor level ground
        addObject(new ground(), 100, 585);
        addObject(new ground(), 300, 585);
        addObject(new ground(), 600, 585);
        addObject(new ground(), 800, 585);
        
        //mid level ground
        addObject(new ground(), 100, 385);
        addObject(new ground(), 300, 385);
        addObject(new ground(), 400, 385);
        addObject(new ground(), 700, 385);
        
        //top level ground
        addObject(new ground(), 100, 185);
        addObject(new ground(), 400, 185);
        addObject(new ground(), 700, 185);
    }
    
    public void populateGroundEdges() //Used to tell enemies when to turn around and move the other direction
    {
        groundEdge groundEdge;
        groundEdge = new groundEdge();
        
        //floor level
        addObject(new groundEdge(), 495, 485);
        addObject(new groundEdge(), 730, 485);
        
        //mid level
        addObject(new groundEdge(), 805, 285);
        addObject(new groundEdge(), 595, 285);
        addObject(new groundEdge(), 505, 285);
        addObject(new groundEdge(), 65, 285);
        
        //top level
        addObject(new groundEdge(), 295, 85);
        addObject(new groundEdge(), 505, 85);
        addObject(new groundEdge(), 595, 85);
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
        
        longLaser longLaser;
        longLaser = new longLaser();
        
        //mid-shot level lasers
        addObject(new midLaser(), 253, 14);
        addObject(new longLaser(), 553, 14);
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
        addObject(door, 772, 139);
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
    
    public void populateElectricFields()
    {
        smallElectricField smallElectricField;
        smallElectricField = new smallElectricField();
        
        addObject(smallElectricField, 450, 590);
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
