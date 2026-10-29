import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class SurvivalWorld here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class SurvivalWorld extends World
{
    int vSpawnTimer;

    boolean spawnEnemy;
    /**
     * Constructor for objects of class SurvivalWorld.
     * 
     */
    public SurvivalWorld()
    {    
        // Create a new world with 600x400 cells with a cell size of 1x1 pixels.
        super(800, 600, 1); 
        setPaintOrder(PL.class, PR.class, Hero.class, Villain.class);
        //villain spawn timer
        vSpawnTimer = 0;
        
        spawnEnemy = true;
        
        //add string lifeText
        GameText lifeText;
        lifeText = new GameText("Life: ");
        addObject(lifeText, 60, 20);
        
        //add string killText
        GameText killText;
        killText = new GameText("Kills: ");
        addObject(killText, 70, 60);

        //spawn hero with strings
        Hero hero;
        hero = new Hero(lifeText, killText);
        addObject(hero, 200, 400);
                 
        //portal left/right spawns
        PL();
        PR();       
    }

    public void act()
    {
         VillainSpawn();
    }
    
    public void VillainSpawn()
    {     
    vSpawnTimer++;    
    if(vSpawnTimer/10 == 10)
    {
        int x = Greenfoot.getRandomNumber(10);
        int y = Greenfoot.getRandomNumber(190);
        if(x < 5)
        {
        Villain villain;
        villain = new Villain();
        addObject(villain, 0, 205+y);
        }
        else
        {
        Villain villain;
        villain = new Villain();
        addObject(villain, 800, 205+y);
        } 
        vSpawnTimer = 0;
    }
    
    } 
    
    public void PL()
    {
        PL pL;
        pL = new PL();
        addObject(pL, 2, 300);
    }
    public void PR()
    {
        PR pR;
        pR = new PR();
        addObject(pR, 798, 300);
    }
}
