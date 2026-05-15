import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class howToWorld here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class howToWorld extends World
{
    int switchWorldTimer; //Timer to switch worlds
    int blackOutTimer;
    boolean startGame; //Back out yes or no
    boolean openInfo;
    
    blackOut blackOut;
    blackIn blackIn;
    /**
     * Constructor for objects of class howToWorld.
     * 
     */
    public howToWorld()
    {    
        // Create a new world with 600x400 cells with a cell size of 1x1 pixels.
        super(800, 600, 1); 
        
        setPaintOrder(blackIn.class, blackOut.class, backButton.class);
        
        switchWorldTimer = 0;
        blackOutTimer = 0;
        
        startGame = false;
        openInfo = false;
        
        populateIntro();
        populateBackButton();
    }
    
    public void populateIntro()
    {
        blackIn = new blackIn();
        addObject(blackIn, 400, 300);
    }
    
    public void act()
    {
        if(startGame == true) //Start the game!
        {
            switchWorldTimer++;
            blackOutTimer++;
            
            if(blackOutTimer == 1) //Just to make sure blackOut isn't added multiple times. Insane lag otherwise. 
            {
                blackOut = new blackOut();
                addObject(blackOut, 400, 300);
            }
            
            if(switchWorldTimer >= 100)
            {
                Greenfoot.setWorld(new worldOne());
            }
        }
        
        if(openInfo == true) //Start the game!
        {
            switchWorldTimer++;
            blackOutTimer++;
            
            if(blackOutTimer == 1) //Just to make sure blackOut isn't added multiple times. Insane lag otherwise. 
            {
                blackOut = new blackOut();
                addObject(blackOut, 400, 300);
            }
            
            if(switchWorldTimer >= 100)
            {
                Greenfoot.setWorld(new gameInfoWorld());
            }
        }
    }
    
    public void populateBackButton()
    {
        Start Start;
        Start = new Start();
        addObject(Start, 680, 340);     
        
        gameInfoButton gameInfoButton;
        gameInfoButton = new gameInfoButton();
        addObject(gameInfoButton, 680, 440);
    }
    
    public void startGame(boolean isStart) //Receive boolean to start from Start class
    {
        startGame = isStart;
    }
    
    public void openGameInfo(boolean isInfo) //Receive boolean to start from Start class
    {
        openInfo = isInfo;
    }
}
