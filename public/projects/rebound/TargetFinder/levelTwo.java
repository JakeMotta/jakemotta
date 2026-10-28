import greenfoot.*;

/**
 * Class MyWorld: sample world to show how to make use of my world super-class SWorld
 */
public class levelTwo extends SWorld
{
    int rTimer = 0;
    int shapeTimer = 0;
    int rNumber = Greenfoot.getRandomNumber(50)+5;

    int maxShots = 3;
    int myScore = 0;
    int rShots = maxShots;

    boolean retry = false; //screen
    
    player player = new player();
    MouseInfo mouse = Greenfoot.getMouseInfo();
    shapes shapes = new shapes();
    dimScreen dScreen = new dimScreen();
    retryScreen rScreen = new retryScreen();
    GameTextMed Score;
    GameTextMed Shots;

    /**
     * Creates a scrolling world using a main actor, a background, some obstacles, and a non-scrolling score.
     */
    public levelTwo(int score)
    {    
        super(600, 400, 1, 1200); // scroll world constructor call; last parameter is scroll width
        // in the following statement, the main actor is placed in the center of the window

        setPaintOrder(retryScreen.class, dimScreen.class, GameText.class, Ball.class, Arrow.class, trail.class, Target.class, barriersLong.class, barriersFlat.class, shapes.class, player.class);

        myScore = score;
        
        Score = new GameTextMed("Score: " + myScore);
        addObject(Score, 100, 50);

        Shots = new GameTextMed("Remaining Shots: " + rShots);
        addObject(Shots, 200, 75);

        addPlayer();
        addText();
        prepare();
    }

    public void act()
    {
        super.act();

        addShapes();
        checkRetry();
    }

    public void addPlayer()
    {
        Ball Ball = new Ball(maxShots, myScore);
        addObject(Ball, 75, 275);
        setMainActor(player, 300, 200);
    }

    public void addText()
    {

    }

    public void updateScore(int ballScore)
    {
        myScore = ballScore;
        Score.setGameText("Score: " + myScore);
    }

    public void updateShots(int shots)
    {
        rShots = shots;
        Shots.setGameText("Remaining Shots: " + rShots);
    }

    public void levelFailed()
    {
        addObject(dScreen, 300, -200, false);
        retry = true;
    }

    public void checkRetry()
    {
        if(retry == true)
        {
            rTimer++;

            if(rTimer == 100)
            {
                addObject(rScreen, -200, 200, false);
            }
        }
        else
        {
            rTimer = 0;
        }
    }
    
    public void addShapes()
    {
        shapeTimer++;

        int x = Greenfoot.getRandomNumber(600);

        if(shapeTimer == 30 + rNumber)
        {
            addObject(new shapes(), x, -200);
            shapeTimer = 0;
        }
    }

    public void prepare()
    {
        //borders
        addObject(new bL(), 10, 200);
        addObject(new bL(), 790, 200);
        addObject(new bF(), 250, 10);
        addObject(new bF(), 250, 390);
        addObject(new bF(), 550, 10);
        addObject(new bF(), 550, 390);

        //obsticles
        addObject(new bLM(), 150, 342);
        addObject(new bLM(), 150, 268);
        addObject(new bLM(), 150, 193);
        
        addObject(new bLM(), 350, 57);
        addObject(new bLM(), 350, 132);
        addObject(new bLM(), 350, 207);
        
        addObject(new bLM(), 550, 342);
        addObject(new bLM(), 550, 268);
        addObject(new bLM(), 550, 119);
        
        addObject(new bFM(), 715, 119);
        addObject(new bFM(), 635, 119);

        addObject(new Target(), 700, 300);
    }
}
