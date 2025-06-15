import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class gameOverWorld here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class gameOverWorld extends World
{
    int finalScore; //Final Game Score!
    int randomNumber; //Random number to select a quote
    int switchWorldTimer; //Timer to switch worlds
    int blackOutTimer; //Timer for blackOut
    
    boolean isReplay; //Replay clicked
    boolean openHowTo; //Menu clicked
    boolean openInfo;
    
    largeGameText myScore;
    medGameText myQuote;
    blackIn blackIn; //Add blackIn
    blackOut blackOut; //Add blackOut
    Music Music;
    
    /**
     * Constructor for objects of class gameOverWorld.
     * 
     */
    public gameOverWorld(int endGameScore) //Recieves the final game score
    {    
        // Create a new world with 600x400 cells with a cell size of 1x1 pixels.
        super(800, 600, 1); 
        
        setPaintOrder(blackOut.class, blackIn.class);
        
        finalScore = endGameScore;
        randomNumber = Greenfoot.getRandomNumber(11);
        
        blackOutTimer = 0;
        switchWorldTimer = 0;
        
        isReplay = false;
        openHowTo = false;
        openInfo = false;
        
        addBlackIn();
        addScore();
        addQuote();
        addButtons();
    }
    
    public void act()
    {
        if(isReplay == true)
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
        
        if(openHowTo == true) //Open the "How to Play" menu
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
                Greenfoot.setWorld(new howToWorld());
            }
        }
        
        if(openInfo == true) //Open the "How to Play" menu
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
    
    public void addBlackIn()
    {
        blackIn = new blackIn();
        addObject(blackIn, 400, 300);
    }
    
    public void addScore()
    {
        myScore = new largeGameText("Final Score: " + finalScore);
        addObject(myScore, 325, 290);
    }
    
    public void addButtons()
    {
        replayButton replayButton;
        replayButton = new replayButton();
        addObject(replayButton, 415, 450);
        
        howToButton howToButton;
        howToButton = new howToButton();
        addObject(howToButton, 415, 510);  
        
        gameInfoButton gameInfoButton;
        gameInfoButton = new gameInfoButton();
        addObject(gameInfoButton, 415, 570);
    }
    
    public void checkReplay(boolean replay)
    {
        isReplay = replay;
    }
    
    public void openHowTo(boolean isHowTo) //Receive boolean to start from Start class
    {
        openHowTo = isHowTo;
    }
    
    public void openGameInfo(boolean isInfo) //Receive boolean to start from Start class
    {
        openInfo = isInfo;
    }
    
    public void addQuote()
    {
        //End game text
        if(randomNumber == 0)
        {
            myQuote = new medGameText("I'm always prepared to die, but I'll never be prepared to lose.");
        }
        else if(randomNumber == 1)
        {
            myQuote = new medGameText("This game took me about a month to code. Time well spent.");
        }
        else if(randomNumber == 2)
        {
            myQuote = new medGameText("I hate doing my own graphics, and sprites are annoying. I lose.");
        }
        else if(randomNumber == 3)
        {
            myQuote = new medGameText("They are not glitches, you're just bad.");
        }
        else if(randomNumber == 4)
        {
            myQuote = new medGameText("Techno everyday keeps a bad mood away.");
        }
        else if(randomNumber == 5)
        {
            myQuote = new medGameText("If your speakers are not blasting this music, you're not living.");
        }
        else if(randomNumber == 6)
        {
            myQuote = new medGameText("NinjaDonut.net! Feel the love.");
        }
        else if(randomNumber == 7)
        {
            myQuote = new medGameText("Jake Motta, professional bum.");
        }
        else if(randomNumber == 8)
        {
            myQuote = new medGameText("Sleep through the day, code through the night.");
        }
        else if(randomNumber == 9)
        {
            myQuote = new medGameText("I'd like to thank food for helping me make it through this.");
        }
        else if(randomNumber == 10)
        {
            myQuote = new medGameText("Why not play again? You might win a prize. Or not. Either way.");
        }
        
        addObject(myQuote, 400, 330);
    }
}
