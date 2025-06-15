import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class worldOne here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class worldOne extends World
{

    /**
     * Constructor for objects of class worldOne.
     * 
     */
    public worldOne()
    {    
        // Create a new world with 600x400 cells with a cell size of 1x1 pixels.
        super(800, 600, 1, false); 
        setPaintOrder(Guy.class, ladder.class, lasers.class, ground.class);
        
        populateWorld();
    }
    
    public void populateWorld()
    {
        populateGuy();
        populateGround();
        populateLadder();
        populateLasers();
    }
    
    public void populateGuy()
    {
        Guy guy;
        guy = new Guy();
        addObject(guy, 43, 544);
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
        addObject(new ground(), 500, 385);
        addObject(new ground(), 700, 385);
        
        //top level ground
        addObject(new ground(), 100, 185);
        addObject(new ground(), 400, 185);
        addObject(new ground(), 700, 185);
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
        
        //mid-shot level lasers
        addObject(new midLaser(), 253, 14);
        addObject(new midLaser(), 553, 14);
    }
}
