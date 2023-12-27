import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class gameStartWorld here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class gameStartWorld extends World
{
    GreenfootImage gameStartScreen1;
    GreenfootImage gameStartScreen2;
    GreenfootImage gameStartScreen3;
    GreenfootImage gameStartScreen4;
    GreenfootImage gameStartScreen5;
    GreenfootImage gameStartScreen6;
    GreenfootImage gameStartScreen7;
    GreenfootImage gameStartScreen8;
    GreenfootImage gameStartScreen9;
    GreenfootImage gameStartScreen10;
    GreenfootImage gameStartScreen11;
    GreenfootImage gameStartScreenNew1;
    
    GreenfootSound song1;
    GreenfootSound song2;
    GreenfootSound song3;
    GreenfootSound song4;
    GreenfootSound song5;
    GreenfootSound song6;
    
    int imageTimer; //Timer to chage the world's images
    int blackOutTimer; //Timer for the blackOut
    int switchWorldTimer; //Timer to switch world
    int musicTimer;
    int randomSong;
    int titleRotationTimer;
    int yLocation;
    
    boolean startGame; //Start game or not
    boolean openHowTo; //Open the HowTo world
    boolean isMusic;
    
    blackOut blackOut; //Add blackOut
    blackIn blackIn; //Add blackIn
    medGameText songTitle;
    
    /**
     * Constructor for objects of class gameStartWorld.
     * 
     */
    public gameStartWorld()
    {    
        // Create a new world with 600x400 cells with a cell size of 1x1 pixels.
        super(800, 600, 1); 
        
        setPaintOrder(blackOut.class, blackIn.class, Start.class, howToButton.class);
        
        gameStartScreen1 = new GreenfootImage("gameStartScreen1.png");
        gameStartScreen2 = new GreenfootImage("gameStartScreen2.png");
        gameStartScreen3 = new GreenfootImage("gameStartScreen3.png");
        gameStartScreen4 = new GreenfootImage("gameStartScreen4.png");
        gameStartScreen5 = new GreenfootImage("gameStartScreen5.png");
        gameStartScreen6 = new GreenfootImage("gameStartScreen6.png");
        gameStartScreen7 = new GreenfootImage("gameStartScreen7.png");
        gameStartScreen8 = new GreenfootImage("gameStartScreen8.png");
        gameStartScreen9 = new GreenfootImage("gameStartScreen9.png");
        gameStartScreen10 = new GreenfootImage("gameStartScreen10.png");
        gameStartScreen11 = new GreenfootImage("gameStartScreen11.png");
        gameStartScreenNew1 = new GreenfootImage("gameStartScreenNew1.png");
        

        song1 = new GreenfootSound("song1.mp3");
        song2 = new GreenfootSound("song2.mp3");
        song3 = new GreenfootSound("song3.mp3");
        song4 = new GreenfootSound("song4.mp3");
        song5 = new GreenfootSound("song5.mp3");
        song6 = new GreenfootSound("song6.mp3");
        
        song1.setVolume(50);
        song2.setVolume(50);
        song3.setVolume(50);
        song4.setVolume(50);
        song5.setVolume(50);
        
        imageTimer = 0;
        blackOutTimer = 0;
        switchWorldTimer = 0;
        musicTimer = 0;
        randomSong = Greenfoot.getRandomNumber(6);
        titleRotationTimer = 0;
        yLocation = 0;
        
        startGame = false;
        openHowTo = false;
        isMusic = true;
        
        populateIntro();
        populateStart();
        populateHowTo();
        
        
    }
    
    public void populateIntro()
    {
        blackIn = new blackIn();
        addObject(blackIn, 400, 300);
    }
    
    public void populateStart()
    {
        Start Start;
        Start = new Start();
        addObject(Start, 680, 240);     
    }
    
    public void populateHowTo()
    {
        howToButton howToButton;
        howToButton = new howToButton();
        addObject(howToButton, 680, 340);  
      
        smallElectricField smallElectricField;
        smallElectricField = new smallElectricField();
        addObject(smallElectricField, 360, 150);
    }
    
    public void act()
    {
        //switchImage();
        addMusic();
        titleRotationTimer++;
        
        if(titleRotationTimer == 2 & yLocation <= 19)
        {
            yLocation++;
            songTitle.setLocation(songTitle.getX(), songTitle.getY()+1);
            titleRotationTimer = 0;
        }
        if(yLocation >= 20)
        {
            if(yLocation <= 39)
            {
                if(titleRotationTimer == 2)
                {
                    yLocation++;
                    songTitle.setLocation(songTitle.getX(), songTitle.getY()-1);
                    titleRotationTimer = 0;
                }
            }
        }
        
        if(yLocation == 40)
        {
            yLocation = 0;
        }
        
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
    }
    
    public void addMusic()
    {
        musicTimer++;
        
        if(musicTimer == 1)
        {
            if(randomSong == 0)
            {
                song1.playLoop();
                songTitle = new medGameText("The Orbitors - The Things You Do");
            }
            else if(randomSong == 1)
            {
                song2.playLoop();
                songTitle = new medGameText("The Orbitors - Don't Go");
            }
            else if(randomSong == 2)
            {
                song3.playLoop();
                songTitle = new medGameText("The Orbitors - My Blues");
            }
            else if(randomSong == 3)
            {
                song4.playLoop();
                songTitle = new medGameText("Tiesto & Allure - Pair of Dice (Original Mix)");
            }
            else if(randomSong == 4)
            {
                song5.playLoop();
                songTitle = new medGameText("Trampboat & Soulero - Killer");
            }
            else if(randomSong == 5)
            {
                song6.playLoop();
                songTitle = new medGameText("AdhesiveWombat - 8 Bit Adventure");
            }
            
            addObject(songTitle, 640, 510);
        }
    }
    
    public void startGame(boolean isStart) //Receive boolean to start from Start class
    {
        startGame = isStart;
    }
    
    public void openHowTo(boolean isHowTo) //Receive boolean to start from Start class
    {
        openHowTo = isHowTo;
    }
    
    public void checkMusic(boolean shouldMusic)
    {
        isMusic = shouldMusic;
    }
    
    public void switchImage()
    {
        imageTimer++;
        
        if(imageTimer >= 1)
        {
            if(imageTimer <= 2)
            {
                setBackground(gameStartScreen1);
            }
        }
        if(imageTimer >= 3)
        {
            if(imageTimer <= 4)
            {
                setBackground(gameStartScreen2);
            }
        }
        if(imageTimer >= 5)
        {
            if(imageTimer <= 6)
            {
                setBackground(gameStartScreen3);
            }
        }
        if(imageTimer >= 7)
        {
            if(imageTimer <= 8)
            {
                setBackground(gameStartScreen4);
            }
        }
        if(imageTimer >= 9)
        {
            if(imageTimer <= 10)
            {
                setBackground(gameStartScreen5);
            }
        }
        if(imageTimer >= 11)
        {
            if(imageTimer <= 12)
            {
                setBackground(gameStartScreen6);
            }
        }
        if(imageTimer >= 13)
        {
            if(imageTimer <= 14)
            {
                setBackground(gameStartScreen7);
            }
        }
        if(imageTimer >= 15)
        {
            if(imageTimer <= 16)
            {
                setBackground(gameStartScreen8);
            }
        }
        if(imageTimer >= 17)
        {
            if(imageTimer <= 18)
            {
                setBackground(gameStartScreen9);
            }
        }
        if(imageTimer >= 19)
        {
            if(imageTimer <= 20)
            {
                setBackground(gameStartScreen10);
            }
        }
        if(imageTimer >= 21)
        {
            if(imageTimer <= 155)
            {
                setBackground(gameStartScreen11);
            }
        }
        if(imageTimer == 155)
        {
            imageTimer = 1;
        }
    }
}
