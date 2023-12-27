import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class Music here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class Music extends Actor
{
    GreenfootSound song1;
    GreenfootSound song2;
    GreenfootSound song3;
    GreenfootSound song4;
    
    int musicTimer;
    int randomSong;
    
    boolean gameOver;
    
    public Music()
    {
        song1 = new GreenfootSound("song1.mp3");
        song2 = new GreenfootSound("song2.mp3");
        song3 = new GreenfootSound("song3.mp3");
        song4 = new GreenfootSound("song4.mp3");
        
        song1.setVolume(50);
        song2.setVolume(50);
        song3.setVolume(50);
        song4.setVolume(50);
        
        gameOver = false;
        
        song4.stop();
        
        musicTimer = 0;
        randomSong = Greenfoot.getRandomNumber(2)+1;
    }
    
    /**
     * Act - do whatever the Music wants to do. This method is called whenever
     * the 'Act' or 'Run' button gets pressed in the environment.
     */
    public void act() 
    {
        playMusic();
    }    
    
    public void checkGameOver(boolean isGameOver)
    {
        gameOver = isGameOver;
    }
    
    public void playMusic()
    {
        musicTimer++;
        if(musicTimer >= 1)
        {
            song4.playLoop();
        }
    }
}
