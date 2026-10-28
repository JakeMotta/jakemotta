import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class levelOne here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class levelOne extends SWorld
{
    int ninjaX = 0;
    int ninjaY = 0;
    int ninjaDirection = 0;
    
    int enemyTimer = 0;
    int enemySpawnTimer = Greenfoot.getRandomNumber(300)+50;
    int enemies = 32000; //Enemies per level
    int enemyCount = 0;
    
    int myPoints = 0;
    int t = 0;
    
    tie tie;
    Sword sword;
    Ninja ninja;
    Enemy enemy;
    smallText points; 
    /**
     * Constructor for objects of class levelOne.
     * 
     */
    public levelOne()
    {    
        super(960, 400, 1, 2000); 
        
        ninja = new Ninja();
        setMainActor(ninja, 480, 200);
        
        tie = new tie();
        addObject(tie, ninja.getX()-35, ninja.getY()-22);
        
        sword = new Sword();
        addObject(sword, ninja.getX(), ninja.getY());
        sword.setRotation(-45);
        
        GreenfootImage bg = new GreenfootImage("cityBackground2.gif");
        //setScrollingBackground(bg);
        
        backdrop backdrop;
        backdrop = new backdrop();
        addObject(backdrop, 480, 200);
        
        sky sky;
        sky = new sky();
        addObject(sky, 480, 200, false);

        setPaintOrder(Ninja.class, ninjaStar.class, Sword.class, tie.class, Blood.class, Enemies.class, GameText.class, backdrop.class, sky.class);
        
        populateText();
    }
    
    public void act()
    {
        super.act();
        updateFollowers();
        enemyTimer++;
        giveNinjaInfo();

        if(enemies != 0)
            if(enemyTimer == enemySpawnTimer)
                populateEnemy();
    }
    
    public void giveNinjaInfo()
    {
        
    }
    
    public void updateFollowers()
    {
        sword.ninjaInfo(ninjaX, ninjaY);
        tie.ninjaInfo(ninjaX, ninjaY);
        
        if(enemyCount >= 1)
        {
                enemy.getInfo(ninjaX, ninjaY);
                //System.out.println("ninjaX: " + ninjaX);
           
        }
    }
    
    public void populateText()
    {
        points = new smallText("Score: " + myPoints);
        addObject(points, 155, 30, false);
    }
    
    public void populateEnemy()
    {
        int x = Greenfoot.getRandomNumber(2);
        int X = 0;
        int Y = Greenfoot.getRandomNumber(300)+50;

        enemy = new Enemy(x);
          
        if(x == 1)
            X = -40;
        else
            X = 1000;
            
        addObject(new Enemy(x), X, Y);
        enemies--;
        enemyCount++;
        enemyTimer = 0;
    }
    
    public void enemyCount()
    {
        enemyCount--;
    }
    
    public void updatePoints(int p)
    {
        myPoints = myPoints + p;
        points.setGameText("Score: " + myPoints);
    }
    
    public void updateNinjaPosition(int x, int y)
    {
        ninjaX = x;
        ninjaY = y;
    }
    
    public void updateNinjaDirection(int nDirection)
    {
        ninjaDirection = nDirection;
        points.setGameText("Score: " + myPoints);
    }
}
