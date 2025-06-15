import greenfoot.*;  // (World, Actor, GreenfootImage, Greenfoot and MouseInfo)

/**
 * Write a description of class TrainingVille here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class TrainingVille extends World
{

    /**
     * Constructor for objects of class TrainingVille.
     * 
     */
    public TrainingVille()
    {    
        // Create a new world with 600x400 cells with a cell size of 1x1 pixels.
        super(800, 600, 1); 

        Greenfoot.setSpeed(45);
        
        setPaintOrder(Ash.class, ClosedSign.class, Rock.class, Tree.class, WaterRock.class, Water.class, PokeCenter.class, Market.class, Plant.class, Flowers.class, Fountain.class, TallGrass.class);
        
        PopulateAsh();
        PopulateTrees();
        PopulateRocks();
        PopulateWater();
        PopulateTallGrass();
        PopulateStores();
        PopulatePlants();
        PopulateFlowers();
        PopulateFountain();
        
    }
    
    public void PopulateAsh()
    {
        addObject(new Ash(), 70, 80);
    }
    
    public void PopulateFountain()
    {
        addObject(new Fountain(), 320, 355);
    }
    
    public void PopulateFlowers()
    {
        addObject(new Flowers(), 272, 280);
        addObject(new Flowers(), 302, 277);
        addObject(new Flowers(), 332, 280);
        addObject(new Flowers(), 356, 282);
        
        //new row
        addObject(new Flowers(), 280, 300);
        addObject(new Flowers(), 315, 296);
        addObject(new Flowers(), 342, 300);
        
        //new row
        addObject(new Flowers(), 267, 320);
        addObject(new Flowers(), 296, 322);
        addObject(new Flowers(), 325, 317);
        addObject(new Flowers(), 353, 322);
        
        //new row
        addObject(new Flowers(), 282, 340);
        addObject(new Flowers(), 348, 342);
        
        //new row
        addObject(new Flowers(), 276, 360);
        addObject(new Flowers(), 362, 362);
        
        //new row
        addObject(new Flowers(), 283, 380);
        addObject(new Flowers(), 317, 379);
        addObject(new Flowers(), 347, 380);
    }
    
    public void PopulatePlants()
    {
        //left side of PokeCenter
        addObject(new Plant(), 60, 420);
        addObject(new Plant(), 60, 450);
        
        //right side of PokeCenter
        addObject(new Plant(), 158, 420);
        addObject(new Plant(), 158, 450);
        
        //left side of Market
        addObject(new Plant(), 260, 420);
        addObject(new Plant(), 260, 450);
        
        //right side of Market
        addObject(new Plant(), 340, 420);
        addObject(new Plant(), 340, 450);
        
    }
    
    public void PopulateStores()
    {
        addObject(new PokeCenter(), 109, 442);
        addObject(new Market(), 300, 436);
        addObject(new Store(), 318, 183);
    }
    
    public void PopulateWater()
    {
        addObject(new WaterRock(), 132, 151);
        addObject(new Water(), 82, 259);
    }
    
    public void PopulateTallGrass()
    {
        //Grass on Bridge
        addObject(new TallGrass(), 186, 155);
        addObject(new TallGrass(), 201, 155);
        addObject(new TallGrass(), 216, 155);
        addObject(new TallGrass(), 231, 155);
        addObject(new TallGrass(), 186, 172);
        addObject(new TallGrass(), 201, 172);
        addObject(new TallGrass(), 216, 172);
        addObject(new TallGrass(), 231, 172);
        addObject(new TallGrass(), 186, 189);
        addObject(new TallGrass(), 201, 189);
        addObject(new TallGrass(), 216, 189);
        addObject(new TallGrass(), 231, 189);
        addObject(new TallGrass(), 186, 206);
        addObject(new TallGrass(), 201, 206);
        addObject(new TallGrass(), 216, 206);
        addObject(new TallGrass(), 231, 206);
        addObject(new TallGrass(), 186, 223);
        addObject(new TallGrass(), 201, 223);
        addObject(new TallGrass(), 216, 223);
        addObject(new TallGrass(), 231, 223);
        addObject(new TallGrass(), 186, 240);
        addObject(new TallGrass(), 201, 240);
        addObject(new TallGrass(), 216, 240);
        addObject(new TallGrass(), 231, 240);
        addObject(new TallGrass(), 186, 257);
        addObject(new TallGrass(), 201, 257);
        addObject(new TallGrass(), 216, 257);
        addObject(new TallGrass(), 231, 257);
        addObject(new TallGrass(), 186, 274);
        addObject(new TallGrass(), 201, 274);
        addObject(new TallGrass(), 216, 274);
        addObject(new TallGrass(), 231, 274);
        addObject(new TallGrass(), 186, 291);
        addObject(new TallGrass(), 201, 291);
        addObject(new TallGrass(), 216, 291);
        addObject(new TallGrass(), 231, 291);
        addObject(new TallGrass(), 186, 308);
        addObject(new TallGrass(), 201, 308);
        addObject(new TallGrass(), 216, 308);
        addObject(new TallGrass(), 231, 308);
        addObject(new TallGrass(), 186, 325);
        addObject(new TallGrass(), 201, 325);
        addObject(new TallGrass(), 216, 325);
        addObject(new TallGrass(), 231, 325);
        addObject(new TallGrass(), 186, 342);
        addObject(new TallGrass(), 201, 342);
        addObject(new TallGrass(), 216, 342);
        addObject(new TallGrass(), 231, 342);
        addObject(new TallGrass(), 186, 359);
        addObject(new TallGrass(), 201, 359);
        addObject(new TallGrass(), 216, 359);
        addObject(new TallGrass(), 231, 359);
        addObject(new TallGrass(), 186, 376);
        addObject(new TallGrass(), 201, 376);
        addObject(new TallGrass(), 216, 376);
        addObject(new TallGrass(), 231, 376);
        addObject(new TallGrass(), 186, 393);
        addObject(new TallGrass(), 201, 393);
        addObject(new TallGrass(), 216, 393);
        addObject(new TallGrass(), 231, 393);
        
        //Grass at the Top
        addObject(new TallGrass(), 281, 108);
        addObject(new TallGrass(), 281, 91);
        addObject(new TallGrass(), 281, 74);
        addObject(new TallGrass(), 281, 57);
        addObject(new TallGrass(), 296, 91);
        addObject(new TallGrass(), 296, 74);
        addObject(new TallGrass(), 296, 57);
        addObject(new TallGrass(), 296, 108);
        addObject(new TallGrass(), 311, 57);
        addObject(new TallGrass(), 311, 108);
        addObject(new TallGrass(), 311, 91);
        addObject(new TallGrass(), 311, 74);
        addObject(new TallGrass(), 326, 108);
        addObject(new TallGrass(), 326, 91);
        addObject(new TallGrass(), 326, 74);
        addObject(new TallGrass(), 326, 57);
        addObject(new TallGrass(), 341, 108);
        addObject(new TallGrass(), 341, 91);
        addObject(new TallGrass(), 341, 74);
        addObject(new TallGrass(), 341, 57);
       
        addObject(new TallGrass(), 356, 57);
        addObject(new TallGrass(), 356, 108);
        addObject(new TallGrass(), 356, 91);
        addObject(new TallGrass(), 356, 74);
        addObject(new TallGrass(), 371, 108);
        addObject(new TallGrass(), 371, 91);
        addObject(new TallGrass(), 371, 74);
        addObject(new TallGrass(), 371, 57);
        addObject(new TallGrass(), 386, 108);
        addObject(new TallGrass(), 386, 91);
        addObject(new TallGrass(), 386, 74);
        addObject(new TallGrass(), 386, 57);
     
        addObject(new TallGrass(), 401, 57);
        addObject(new TallGrass(), 401, 108);
        addObject(new TallGrass(), 401, 91);
        addObject(new TallGrass(), 401, 74);
        addObject(new TallGrass(), 416, 108);
        addObject(new TallGrass(), 416, 91);
        addObject(new TallGrass(), 416, 74);
        addObject(new TallGrass(), 416, 57);
        addObject(new TallGrass(), 431, 108);
        addObject(new TallGrass(), 431, 91);
        addObject(new TallGrass(), 431, 74);
        addObject(new TallGrass(), 431, 57);
        
        addObject(new TallGrass(), 446, 57);
        addObject(new TallGrass(), 446, 108);
        addObject(new TallGrass(), 446, 91);
        addObject(new TallGrass(), 446, 74);
        addObject(new TallGrass(), 461, 108);
        addObject(new TallGrass(), 461, 91);
        addObject(new TallGrass(), 461, 74);
        addObject(new TallGrass(), 461, 57);
        addObject(new TallGrass(), 476, 108);
        addObject(new TallGrass(), 476, 91);
        addObject(new TallGrass(), 476, 74);
        addObject(new TallGrass(), 476, 57);
        
        addObject(new TallGrass(), 491, 57);
        addObject(new TallGrass(), 491, 108);
        addObject(new TallGrass(), 491, 91);
        addObject(new TallGrass(), 491, 74);
        addObject(new TallGrass(), 506, 108);
        addObject(new TallGrass(), 506, 91);
        addObject(new TallGrass(), 506, 74);
        addObject(new TallGrass(), 506, 57);
        addObject(new TallGrass(), 521, 108);
        addObject(new TallGrass(), 521, 91);
        addObject(new TallGrass(), 521, 74);
        addObject(new TallGrass(), 521, 57);
        
        addObject(new TallGrass(), 536, 57);
        addObject(new TallGrass(), 536, 108);
        addObject(new TallGrass(), 536, 91);
        addObject(new TallGrass(), 536, 74);
        addObject(new TallGrass(), 551, 108);
        addObject(new TallGrass(), 551, 91);
        addObject(new TallGrass(), 551, 74);
        addObject(new TallGrass(), 551, 57);
        addObject(new TallGrass(), 566, 108);
        addObject(new TallGrass(), 566, 91);
        addObject(new TallGrass(), 566, 74);
        addObject(new TallGrass(), 566, 57);
        
        addObject(new TallGrass(), 581, 57);
        addObject(new TallGrass(), 581, 108);
        addObject(new TallGrass(), 581, 91);
        addObject(new TallGrass(), 581, 74);
        addObject(new TallGrass(), 596, 108);
        addObject(new TallGrass(), 596, 91);
        addObject(new TallGrass(), 596, 74);
        addObject(new TallGrass(), 596, 57);
        addObject(new TallGrass(), 611, 108);
        addObject(new TallGrass(), 611, 91);
        addObject(new TallGrass(), 611, 74);
        addObject(new TallGrass(), 611, 57);
        
        addObject(new TallGrass(), 626, 57);
        addObject(new TallGrass(), 626, 108);
        addObject(new TallGrass(), 626, 91);
        addObject(new TallGrass(), 626, 74);
        addObject(new TallGrass(), 641, 108);
        addObject(new TallGrass(), 641, 91);
        addObject(new TallGrass(), 641, 74);
        addObject(new TallGrass(), 641, 57);
        addObject(new TallGrass(), 656, 108);
        addObject(new TallGrass(), 656, 91);
        addObject(new TallGrass(), 656, 74);
        addObject(new TallGrass(), 656, 57);
        
        addObject(new TallGrass(), 671, 57);
        addObject(new TallGrass(), 671, 108);
        addObject(new TallGrass(), 671, 91);
        addObject(new TallGrass(), 671, 74);
        addObject(new TallGrass(), 686, 108);
        addObject(new TallGrass(), 686, 91);
        addObject(new TallGrass(), 686, 74);
        addObject(new TallGrass(), 686, 57);
        addObject(new TallGrass(), 701, 108);
        addObject(new TallGrass(), 701, 91);
        addObject(new TallGrass(), 701, 74);
        addObject(new TallGrass(), 701, 57);
        
        addObject(new TallGrass(), 716, 57);
        addObject(new TallGrass(), 716, 108);
        addObject(new TallGrass(), 716, 91);
        addObject(new TallGrass(), 716, 74);
        addObject(new TallGrass(), 731, 108);
        addObject(new TallGrass(), 731, 91);
        addObject(new TallGrass(), 731, 74);
        addObject(new TallGrass(), 731, 57);
        addObject(new TallGrass(), 746, 108);
        addObject(new TallGrass(), 746, 91);
        addObject(new TallGrass(), 746, 74);
        addObject(new TallGrass(), 746, 57);
        
        //TallGrass outside the C
        addObject(new TallGrass(), 521, 125);
        addObject(new TallGrass(), 521, 142);
        addObject(new TallGrass(), 521, 159);
        addObject(new TallGrass(), 521, 176);
        addObject(new TallGrass(), 536, 125);
        addObject(new TallGrass(), 536, 142);
        addObject(new TallGrass(), 536, 159);
        addObject(new TallGrass(), 536, 176);
        addObject(new TallGrass(), 551, 125);
        addObject(new TallGrass(), 551, 142);
        addObject(new TallGrass(), 551, 159);
        addObject(new TallGrass(), 551, 176);
        addObject(new TallGrass(), 566, 125);
        addObject(new TallGrass(), 566, 142);
        addObject(new TallGrass(), 566, 159);
        addObject(new TallGrass(), 566, 176);
        
        addObject(new TallGrass(), 521, 193);
        addObject(new TallGrass(), 521, 210);
        addObject(new TallGrass(), 521, 227);
        addObject(new TallGrass(), 521, 244);
        addObject(new TallGrass(), 536, 193);
        addObject(new TallGrass(), 536, 210);
        addObject(new TallGrass(), 536, 227);
        addObject(new TallGrass(), 536, 244);
        addObject(new TallGrass(), 551, 193);
        addObject(new TallGrass(), 551, 210);
        addObject(new TallGrass(), 551, 227);
        addObject(new TallGrass(), 551, 244);
        addObject(new TallGrass(), 566, 193);
        addObject(new TallGrass(), 566, 210);
        addObject(new TallGrass(), 566, 227);
        addObject(new TallGrass(), 566, 244);
        
        addObject(new TallGrass(), 521, 261);
        addObject(new TallGrass(), 521, 278);
        addObject(new TallGrass(), 521, 295);
        addObject(new TallGrass(), 521, 312);
        addObject(new TallGrass(), 536, 261);
        addObject(new TallGrass(), 536, 278);
        addObject(new TallGrass(), 536, 295);
        addObject(new TallGrass(), 536, 312);
        addObject(new TallGrass(), 551, 261);
        addObject(new TallGrass(), 551, 278);
        addObject(new TallGrass(), 551, 295);
        addObject(new TallGrass(), 551, 312);
        addObject(new TallGrass(), 566, 261);
        addObject(new TallGrass(), 566, 278);
        addObject(new TallGrass(), 566, 295);
        addObject(new TallGrass(), 566, 312);
        
        addObject(new TallGrass(), 521, 329);
        addObject(new TallGrass(), 521, 346);
        addObject(new TallGrass(), 521, 363);
        addObject(new TallGrass(), 521, 380);
        addObject(new TallGrass(), 536, 329);
        addObject(new TallGrass(), 536, 346);
        addObject(new TallGrass(), 536, 363);
        addObject(new TallGrass(), 536, 380);
        addObject(new TallGrass(), 551, 329);
        addObject(new TallGrass(), 551, 346);
        addObject(new TallGrass(), 551, 363);
        addObject(new TallGrass(), 551, 380);
        addObject(new TallGrass(), 566, 329);
        addObject(new TallGrass(), 566, 346);
        addObject(new TallGrass(), 566, 363);
        addObject(new TallGrass(), 566, 380);        
        addObject(new TallGrass(), 521, 397);
        addObject(new TallGrass(), 536, 397);
        addObject(new TallGrass(), 551, 397);
        addObject(new TallGrass(), 566, 397);
        
        //Outside C, same row, down to bottom
        addObject(new TallGrass(), 521, 414);
        addObject(new TallGrass(), 536, 414);
        addObject(new TallGrass(), 551, 414);
        addObject(new TallGrass(), 566, 414);
        addObject(new TallGrass(), 521, 431);
        addObject(new TallGrass(), 536, 431);
        addObject(new TallGrass(), 551, 431);
        addObject(new TallGrass(), 566, 431);
        addObject(new TallGrass(), 521, 448);
        addObject(new TallGrass(), 536, 448);
        addObject(new TallGrass(), 551, 448);
        addObject(new TallGrass(), 566, 448);
        addObject(new TallGrass(), 521, 465);
        addObject(new TallGrass(), 536, 465);
        addObject(new TallGrass(), 551, 465);
        addObject(new TallGrass(), 566, 465);
        
        addObject(new TallGrass(), 521, 482);
        addObject(new TallGrass(), 536, 482);
        addObject(new TallGrass(), 551, 482);
        addObject(new TallGrass(), 566, 482);
        addObject(new TallGrass(), 521, 499);
        addObject(new TallGrass(), 536, 499);
        addObject(new TallGrass(), 551, 499);
        addObject(new TallGrass(), 566, 499);
        addObject(new TallGrass(), 521, 516);
        addObject(new TallGrass(), 536, 516);
        addObject(new TallGrass(), 551, 516);
        addObject(new TallGrass(), 566, 516);
        addObject(new TallGrass(), 521, 533);
        addObject(new TallGrass(), 536, 533);
        addObject(new TallGrass(), 551, 533);
        addObject(new TallGrass(), 566, 533);
        addObject(new TallGrass(), 521, 550);
        addObject(new TallGrass(), 536, 550);
        addObject(new TallGrass(), 551, 550);
        addObject(new TallGrass(), 566, 550);
        
        //TallGrass inside the C
        addObject(new TallGrass(), 386, 142);
        addObject(new TallGrass(), 401, 159);
        addObject(new TallGrass(), 416, 142);
        addObject(new TallGrass(), 431, 159);
        addObject(new TallGrass(), 446, 142);
        addObject(new TallGrass(), 461, 159);
        addObject(new TallGrass(), 476, 142);
        addObject(new TallGrass(), 491, 159);
        addObject(new TallGrass(), 506, 142);
        
        addObject(new TallGrass(), 386, 176);
        addObject(new TallGrass(), 401, 193);
        addObject(new TallGrass(), 416, 176);
        addObject(new TallGrass(), 431, 193);
        addObject(new TallGrass(), 446, 176);
        addObject(new TallGrass(), 461, 193);
        addObject(new TallGrass(), 476, 176);
        addObject(new TallGrass(), 491, 193);
        addObject(new TallGrass(), 506, 176);
        
        addObject(new TallGrass(), 386, 210);
        addObject(new TallGrass(), 401, 227);
        addObject(new TallGrass(), 416, 210);
        addObject(new TallGrass(), 431, 227);
        addObject(new TallGrass(), 446, 210);
        addObject(new TallGrass(), 461, 227);
        addObject(new TallGrass(), 476, 210);
        addObject(new TallGrass(), 491, 227);
        addObject(new TallGrass(), 506, 210);
        
        addObject(new TallGrass(), 386, 244);
        addObject(new TallGrass(), 401, 261);
        addObject(new TallGrass(), 416, 244);
        addObject(new TallGrass(), 431, 261);
        addObject(new TallGrass(), 446, 244);
        addObject(new TallGrass(), 461, 261);
        addObject(new TallGrass(), 476, 244);
        addObject(new TallGrass(), 491, 261);
        addObject(new TallGrass(), 506, 244);
        
        addObject(new TallGrass(), 386, 278);
        addObject(new TallGrass(), 401, 295);
        addObject(new TallGrass(), 416, 278);
        addObject(new TallGrass(), 431, 295);
        addObject(new TallGrass(), 446, 278);
        addObject(new TallGrass(), 461, 295);
        addObject(new TallGrass(), 476, 278);
        addObject(new TallGrass(), 491, 295);
        addObject(new TallGrass(), 506, 278);
        
        addObject(new TallGrass(), 386, 312);
        addObject(new TallGrass(), 401, 329);
        addObject(new TallGrass(), 416, 312);
        addObject(new TallGrass(), 431, 329);
        addObject(new TallGrass(), 446, 312);
        addObject(new TallGrass(), 461, 329);
        addObject(new TallGrass(), 476, 312);
        addObject(new TallGrass(), 491, 329);
        addObject(new TallGrass(), 506, 312);
        
        addObject(new TallGrass(), 386, 346);
        addObject(new TallGrass(), 401, 363);
        addObject(new TallGrass(), 416, 346);
        addObject(new TallGrass(), 431, 363);
        addObject(new TallGrass(), 446, 346);
        addObject(new TallGrass(), 461, 363);
        addObject(new TallGrass(), 476, 346);
        addObject(new TallGrass(), 491, 363);
        addObject(new TallGrass(), 506, 346);
        
        addObject(new TallGrass(), 386, 380);
        addObject(new TallGrass(), 416, 380);
        addObject(new TallGrass(), 446, 380);
        addObject(new TallGrass(), 461, 397);
        addObject(new TallGrass(), 476, 380);
        addObject(new TallGrass(), 491, 397);
        addObject(new TallGrass(), 506, 380);
        
        //Grass, right side of the map
        addObject(new TallGrass(), 581, 125);
        addObject(new TallGrass(), 581, 142);
        addObject(new TallGrass(), 581, 159);
        addObject(new TallGrass(), 581, 176);
        addObject(new TallGrass(), 596, 125);
        addObject(new TallGrass(), 596, 142);
        addObject(new TallGrass(), 596, 159);
        addObject(new TallGrass(), 596, 176);
        addObject(new TallGrass(), 611, 125);
        addObject(new TallGrass(), 611, 142);
        addObject(new TallGrass(), 611, 159);
        addObject(new TallGrass(), 611, 176);
        addObject(new TallGrass(), 626, 125);
        addObject(new TallGrass(), 626, 142);
        addObject(new TallGrass(), 626, 159);
        addObject(new TallGrass(), 626, 176);
        
        addObject(new TallGrass(), 641, 125);
        addObject(new TallGrass(), 641, 142);
        addObject(new TallGrass(), 641, 159);
        addObject(new TallGrass(), 641, 176);
        addObject(new TallGrass(), 656, 125);
        addObject(new TallGrass(), 656, 142);
        addObject(new TallGrass(), 656, 159);
        addObject(new TallGrass(), 656, 176);
        addObject(new TallGrass(), 671, 125);
        addObject(new TallGrass(), 671, 142);
        addObject(new TallGrass(), 671, 159);
        addObject(new TallGrass(), 671, 176);
        addObject(new TallGrass(), 686, 125);
        addObject(new TallGrass(), 686, 142);
        addObject(new TallGrass(), 686, 159);
        addObject(new TallGrass(), 686, 176);
        
        addObject(new TallGrass(), 701, 125);
        addObject(new TallGrass(), 701, 142);
        addObject(new TallGrass(), 701, 159);
        addObject(new TallGrass(), 701, 176);
        addObject(new TallGrass(), 716, 125);
        addObject(new TallGrass(), 716, 142);
        addObject(new TallGrass(), 716, 159);
        addObject(new TallGrass(), 716, 176);
        addObject(new TallGrass(), 731, 125);
        addObject(new TallGrass(), 731, 142);
        addObject(new TallGrass(), 731, 159);
        addObject(new TallGrass(), 731, 176);
        addObject(new TallGrass(), 746, 125);
        addObject(new TallGrass(), 746, 142);
        addObject(new TallGrass(), 746, 159);
        addObject(new TallGrass(), 746, 176);
        
        //new row
        addObject(new TallGrass(), 581, 193);
        addObject(new TallGrass(), 581, 210);
        addObject(new TallGrass(), 581, 227);
        addObject(new TallGrass(), 581, 244);
        addObject(new TallGrass(), 596, 193);
        addObject(new TallGrass(), 596, 210);
        addObject(new TallGrass(), 596, 227);
        addObject(new TallGrass(), 596, 244);
        addObject(new TallGrass(), 611, 193);
        addObject(new TallGrass(), 611, 210);
        addObject(new TallGrass(), 611, 227);
        addObject(new TallGrass(), 611, 244);
        addObject(new TallGrass(), 626, 193);
        addObject(new TallGrass(), 626, 210);
        addObject(new TallGrass(), 626, 227);
        addObject(new TallGrass(), 626, 244);
        
        addObject(new TallGrass(), 641, 193);
        addObject(new TallGrass(), 641, 210);
        addObject(new TallGrass(), 641, 227);
        addObject(new TallGrass(), 641, 244);
        addObject(new TallGrass(), 656, 193);
        addObject(new TallGrass(), 656, 210);
        addObject(new TallGrass(), 656, 227);
        addObject(new TallGrass(), 656, 244);
        addObject(new TallGrass(), 671, 193);
        addObject(new TallGrass(), 671, 210);
        addObject(new TallGrass(), 671, 227);
        addObject(new TallGrass(), 671, 244);
        addObject(new TallGrass(), 686, 193);
        addObject(new TallGrass(), 686, 210);
        addObject(new TallGrass(), 686, 227);
        addObject(new TallGrass(), 686, 244);
        
        addObject(new TallGrass(), 701, 193);
        addObject(new TallGrass(), 701, 210);
        addObject(new TallGrass(), 701, 227);
        addObject(new TallGrass(), 701, 244);
        addObject(new TallGrass(), 716, 193);
        addObject(new TallGrass(), 716, 210);
        addObject(new TallGrass(), 716, 227);
        addObject(new TallGrass(), 716, 244);
        addObject(new TallGrass(), 731, 193);
        addObject(new TallGrass(), 731, 210);
        addObject(new TallGrass(), 731, 227);
        addObject(new TallGrass(), 731, 244);
        addObject(new TallGrass(), 746, 193);
        addObject(new TallGrass(), 746, 210);
        addObject(new TallGrass(), 746, 227);
        addObject(new TallGrass(), 746, 244);
       
        //new row
        addObject(new TallGrass(), 581, 261);
        addObject(new TallGrass(), 581, 278);
        addObject(new TallGrass(), 581, 295);
        addObject(new TallGrass(), 581, 312);
        addObject(new TallGrass(), 596, 261);
        addObject(new TallGrass(), 596, 278);
        addObject(new TallGrass(), 596, 295);
        addObject(new TallGrass(), 596, 312);
        addObject(new TallGrass(), 611, 261);
        addObject(new TallGrass(), 611, 278);
        addObject(new TallGrass(), 611, 295);
        addObject(new TallGrass(), 611, 312);
        addObject(new TallGrass(), 626, 261);
        addObject(new TallGrass(), 626, 278);
        addObject(new TallGrass(), 626, 295);
        addObject(new TallGrass(), 626, 312);
        
        addObject(new TallGrass(), 641, 261);
        addObject(new TallGrass(), 641, 278);
        addObject(new TallGrass(), 641, 295);
        addObject(new TallGrass(), 641, 312);
        addObject(new TallGrass(), 656, 261);
        addObject(new TallGrass(), 656, 278);
        addObject(new TallGrass(), 656, 295);
        addObject(new TallGrass(), 656, 312);
        addObject(new TallGrass(), 671, 261);
        addObject(new TallGrass(), 671, 278);
        addObject(new TallGrass(), 671, 295);
        addObject(new TallGrass(), 671, 312);
        addObject(new TallGrass(), 686, 261);
        addObject(new TallGrass(), 686, 278);
        addObject(new TallGrass(), 686, 295);
        addObject(new TallGrass(), 686, 312);
        
        addObject(new TallGrass(), 701, 261);
        addObject(new TallGrass(), 701, 278);
        addObject(new TallGrass(), 701, 295);
        addObject(new TallGrass(), 701, 312);
        addObject(new TallGrass(), 716, 261);
        addObject(new TallGrass(), 716, 278);
        addObject(new TallGrass(), 716, 295);
        addObject(new TallGrass(), 716, 312);
        addObject(new TallGrass(), 731, 261);
        addObject(new TallGrass(), 731, 278);
        addObject(new TallGrass(), 731, 295);
        addObject(new TallGrass(), 731, 312);
        addObject(new TallGrass(), 746, 261);
        addObject(new TallGrass(), 746, 278);
        addObject(new TallGrass(), 746, 295);
        addObject(new TallGrass(), 746, 312);
        
        //new row
        addObject(new TallGrass(), 581, 329);
        addObject(new TallGrass(), 581, 346);
        addObject(new TallGrass(), 581, 363);
        addObject(new TallGrass(), 581, 380);
        addObject(new TallGrass(), 596, 329);
        addObject(new TallGrass(), 596, 346);
        addObject(new TallGrass(), 596, 363);
        addObject(new TallGrass(), 596, 380);
        addObject(new TallGrass(), 611, 329);
        addObject(new TallGrass(), 611, 346);
        addObject(new TallGrass(), 611, 363);
        addObject(new TallGrass(), 611, 380);
        addObject(new TallGrass(), 626, 329);
        addObject(new TallGrass(), 626, 346);
        addObject(new TallGrass(), 626, 363);
        addObject(new TallGrass(), 626, 380);
        
        addObject(new TallGrass(), 641, 329);
        addObject(new TallGrass(), 641, 346);
        addObject(new TallGrass(), 641, 363);
        addObject(new TallGrass(), 641, 380);
        addObject(new TallGrass(), 656, 329);
        addObject(new TallGrass(), 656, 346);
        addObject(new TallGrass(), 656, 363);
        addObject(new TallGrass(), 656, 380);
        addObject(new TallGrass(), 671, 329);
        addObject(new TallGrass(), 671, 346);
        addObject(new TallGrass(), 671, 363);
        addObject(new TallGrass(), 671, 380);
        addObject(new TallGrass(), 686, 329);
        addObject(new TallGrass(), 686, 346);
        addObject(new TallGrass(), 686, 363);
        addObject(new TallGrass(), 686, 380);
        
        addObject(new TallGrass(), 701, 329);
        addObject(new TallGrass(), 701, 346);
        addObject(new TallGrass(), 701, 363);
        addObject(new TallGrass(), 701, 380);
        addObject(new TallGrass(), 716, 329);
        addObject(new TallGrass(), 716, 346);
        addObject(new TallGrass(), 716, 363);
        addObject(new TallGrass(), 716, 380);
        addObject(new TallGrass(), 731, 329);
        addObject(new TallGrass(), 731, 346);
        addObject(new TallGrass(), 731, 363);
        addObject(new TallGrass(), 731, 380);
        addObject(new TallGrass(), 746, 329);
        addObject(new TallGrass(), 746, 346);
        addObject(new TallGrass(), 746, 363);
        addObject(new TallGrass(), 746, 380);
        
        addObject(new TallGrass(), 581, 397);
        addObject(new TallGrass(), 596, 397);
        addObject(new TallGrass(), 611, 397);
        addObject(new TallGrass(), 626, 397);
        addObject(new TallGrass(), 641, 397);
        addObject(new TallGrass(), 656, 397);
        addObject(new TallGrass(), 671, 397);
        addObject(new TallGrass(), 686, 397);
        addObject(new TallGrass(), 701, 397);
        addObject(new TallGrass(), 716, 397);
        addObject(new TallGrass(), 731, 397);
        addObject(new TallGrass(), 746, 397);
        
        //Bottom of the C to the Bottom of the map
        addObject(new TallGrass(), 581, 414);
        addObject(new TallGrass(), 596, 414);
        addObject(new TallGrass(), 611, 414);
        addObject(new TallGrass(), 626, 414);
        addObject(new TallGrass(), 641, 414);
        addObject(new TallGrass(), 656, 414);
        addObject(new TallGrass(), 671, 414);
        addObject(new TallGrass(), 686, 414);
        addObject(new TallGrass(), 701, 414);
        addObject(new TallGrass(), 716, 414);
        addObject(new TallGrass(), 731, 414);
        addObject(new TallGrass(), 746, 414);
        
        addObject(new TallGrass(), 581, 431);
        addObject(new TallGrass(), 596, 431);
        addObject(new TallGrass(), 611, 431);
        addObject(new TallGrass(), 626, 431);
        addObject(new TallGrass(), 641, 431);
        addObject(new TallGrass(), 656, 431);
        addObject(new TallGrass(), 671, 431);
        addObject(new TallGrass(), 686, 431);
        addObject(new TallGrass(), 701, 431);
        addObject(new TallGrass(), 716, 431);
        addObject(new TallGrass(), 731, 431);
        addObject(new TallGrass(), 746, 431);
        
        addObject(new TallGrass(), 581, 448);
        addObject(new TallGrass(), 596, 448);
        addObject(new TallGrass(), 611, 448);
        addObject(new TallGrass(), 626, 448);
        addObject(new TallGrass(), 641, 448);
        addObject(new TallGrass(), 656, 448);
        addObject(new TallGrass(), 671, 448);
        addObject(new TallGrass(), 686, 448);
        addObject(new TallGrass(), 701, 448);
        addObject(new TallGrass(), 716, 448);
        addObject(new TallGrass(), 731, 448);
        addObject(new TallGrass(), 746, 448);
        
        addObject(new TallGrass(), 581, 465);
        addObject(new TallGrass(), 596, 465);
        addObject(new TallGrass(), 611, 465);
        addObject(new TallGrass(), 626, 465);
        addObject(new TallGrass(), 641, 465);
        addObject(new TallGrass(), 656, 465);
        addObject(new TallGrass(), 671, 465);
        addObject(new TallGrass(), 686, 465);
        addObject(new TallGrass(), 701, 465);
        addObject(new TallGrass(), 716, 465);
        addObject(new TallGrass(), 731, 465);
        addObject(new TallGrass(), 746, 465);
        
        addObject(new TallGrass(), 581, 482);
        addObject(new TallGrass(), 596, 482);
        addObject(new TallGrass(), 611, 482);
        addObject(new TallGrass(), 626, 482);
        addObject(new TallGrass(), 641, 482);
        addObject(new TallGrass(), 656, 482);
        addObject(new TallGrass(), 671, 482);
        addObject(new TallGrass(), 686, 482);
        addObject(new TallGrass(), 701, 482);
        addObject(new TallGrass(), 716, 482);
        addObject(new TallGrass(), 731, 482);
        addObject(new TallGrass(), 746, 482);
        
        addObject(new TallGrass(), 581, 499);
        addObject(new TallGrass(), 596, 499);
        addObject(new TallGrass(), 611, 499);
        addObject(new TallGrass(), 626, 499);
        addObject(new TallGrass(), 641, 499);
        addObject(new TallGrass(), 656, 499);
        addObject(new TallGrass(), 671, 499);
        addObject(new TallGrass(), 686, 499);
        addObject(new TallGrass(), 701, 499);
        addObject(new TallGrass(), 716, 499);
        addObject(new TallGrass(), 731, 499);
        addObject(new TallGrass(), 746, 499);
        
        addObject(new TallGrass(), 581, 516);
        addObject(new TallGrass(), 596, 516);
        addObject(new TallGrass(), 611, 516);
        addObject(new TallGrass(), 626, 516);
        addObject(new TallGrass(), 641, 516);
        addObject(new TallGrass(), 656, 516);
        addObject(new TallGrass(), 671, 516);
        addObject(new TallGrass(), 686, 516);
        addObject(new TallGrass(), 701, 516);
        addObject(new TallGrass(), 716, 516);
        addObject(new TallGrass(), 731, 516);
        addObject(new TallGrass(), 746, 516);
        
        addObject(new TallGrass(), 581, 533);
        addObject(new TallGrass(), 596, 533);
        addObject(new TallGrass(), 611, 533);
        addObject(new TallGrass(), 626, 533);
        addObject(new TallGrass(), 641, 533);
        addObject(new TallGrass(), 656, 533);
        addObject(new TallGrass(), 671, 533);
        addObject(new TallGrass(), 686, 533);
        addObject(new TallGrass(), 701, 533);
        addObject(new TallGrass(), 716, 533);
        addObject(new TallGrass(), 731, 533);
        addObject(new TallGrass(), 746, 533);
        
        addObject(new TallGrass(), 581, 550);
        addObject(new TallGrass(), 596, 550);
        addObject(new TallGrass(), 611, 550);
        addObject(new TallGrass(), 626, 550);
        addObject(new TallGrass(), 641, 550);
        addObject(new TallGrass(), 656, 550);
        addObject(new TallGrass(), 671, 550);
        addObject(new TallGrass(), 686, 550);
        addObject(new TallGrass(), 701, 550);
        addObject(new TallGrass(), 716, 550);
        addObject(new TallGrass(), 731, 550);
        addObject(new TallGrass(), 746, 550);
        
        //Grass at Bottom of the C
        addObject(new TallGrass(), 341, 516);
        addObject(new TallGrass(), 341, 533);
        addObject(new TallGrass(), 341, 550);
        
        addObject(new TallGrass(), 356, 516);
        addObject(new TallGrass(), 356, 533);
        addObject(new TallGrass(), 356, 550);  

        addObject(new TallGrass(), 371, 516);
        addObject(new TallGrass(), 371, 533);
        addObject(new TallGrass(), 371, 550);
        
        addObject(new TallGrass(), 386, 516);
        addObject(new TallGrass(), 386, 533);
        addObject(new TallGrass(), 386, 550);
        
        addObject(new TallGrass(), 401, 499);
        addObject(new TallGrass(), 401, 516);
        addObject(new TallGrass(), 401, 533);
        addObject(new TallGrass(), 401, 550);
        
        addObject(new TallGrass(), 416, 482);
        addObject(new TallGrass(), 416, 499);
        addObject(new TallGrass(), 416, 516);
        addObject(new TallGrass(), 416, 533);
        addObject(new TallGrass(), 416, 550);

        addObject(new TallGrass(), 431, 465);
        addObject(new TallGrass(), 431, 482);
        addObject(new TallGrass(), 431, 499);
        addObject(new TallGrass(), 431, 516);
        addObject(new TallGrass(), 431, 533);
        addObject(new TallGrass(), 431, 550);
        
        addObject(new TallGrass(), 446, 414);
        addObject(new TallGrass(), 446, 448);
        addObject(new TallGrass(), 446, 465);
        addObject(new TallGrass(), 446, 482);
        addObject(new TallGrass(), 446, 499);
        addObject(new TallGrass(), 446, 516);
        addObject(new TallGrass(), 446, 533);
        addObject(new TallGrass(), 446, 550);
        
        addObject(new TallGrass(), 461, 431);
        addObject(new TallGrass(), 461, 448);
        addObject(new TallGrass(), 461, 465);
        addObject(new TallGrass(), 461, 482);
        addObject(new TallGrass(), 461, 499);
        addObject(new TallGrass(), 461, 516);
        addObject(new TallGrass(), 461, 533);
        addObject(new TallGrass(), 461, 550);
        
        addObject(new TallGrass(), 476, 414);
        addObject(new TallGrass(), 476, 448);
        addObject(new TallGrass(), 476, 465);
        addObject(new TallGrass(), 476, 482);
        addObject(new TallGrass(), 476, 499);
        addObject(new TallGrass(), 476, 516);
        addObject(new TallGrass(), 476, 533);
        addObject(new TallGrass(), 476, 550);
        
        addObject(new TallGrass(), 491, 431);
        addObject(new TallGrass(), 491, 448);
        addObject(new TallGrass(), 491, 465);
        addObject(new TallGrass(), 491, 482);
        addObject(new TallGrass(), 491, 499);
        addObject(new TallGrass(), 491, 516);
        addObject(new TallGrass(), 491, 533);
        addObject(new TallGrass(), 491, 550);
        
        addObject(new TallGrass(), 506, 414);
        addObject(new TallGrass(), 506, 431);
        addObject(new TallGrass(), 506, 448);
        addObject(new TallGrass(), 506, 465);
        addObject(new TallGrass(), 506, 482);
        addObject(new TallGrass(), 506, 499);
        addObject(new TallGrass(), 506, 516);
        addObject(new TallGrass(), 506, 533);
        addObject(new TallGrass(), 506, 550);
    }
    
    public void PopulateRocks()
    {
        //rocks at start
        addObject(new Rock(), 9, 125);
        addObject(new Rock(), 25, 125);
        addObject(new Rock(), 41, 125);
        addObject(new Rock(), 57, 125);
        addObject(new Rock(), 73, 125);
        addObject(new Rock(), 89, 125);
        addObject(new Rock(), 105, 125);
        addObject(new Rock(), 121, 125);
        addObject(new Rock(), 137, 125);
        addObject(new Rock(), 153, 125);
        addObject(new Rock(), 169, 125);
       
        //rocks at first break
        addObject(new Rock(), 249, 125);
        addObject(new Rock(), 265, 125);
        addObject(new Rock(), 281, 125);
        addObject(new Rock(), 297, 125);
        addObject(new Rock(), 313, 125);
        addObject(new Rock(), 329, 125);
        addObject(new Rock(), 345, 125);
        addObject(new Rock(), 361, 125);
        addObject(new Rock(), 377, 125);
        addObject(new Rock(), 393, 125);
        addObject(new Rock(), 409, 125);
        addObject(new Rock(), 425, 125);
        addObject(new Rock(), 441, 125);
        addObject(new Rock(), 457, 125);
        addObject(new Rock(), 473, 125);
        addObject(new Rock(), 489, 125);
        addObject(new Rock(), 505, 125);
        
        //rocks by the water, left side
        addObject(new Rock(), 169, 140);
        addObject(new Rock(), 169, 155);
        addObject(new Rock(), 169, 170);
        addObject(new Rock(), 169, 185);
        addObject(new Rock(), 169, 200);
        addObject(new Rock(), 169, 215);
        addObject(new Rock(), 169, 230);
        addObject(new Rock(), 169, 245);
        addObject(new Rock(), 169, 260);
        addObject(new Rock(), 169, 275);
        addObject(new Rock(), 169, 290);
        addObject(new Rock(), 169, 305);
        addObject(new Rock(), 169, 320);
        addObject(new Rock(), 169, 335);
        addObject(new Rock(), 169, 350);
        addObject(new Rock(), 169, 365);
        addObject(new Rock(), 169, 380);
        
        //rocks by the water, bottom
        addObject(new Rock(), 9, 395);
        addObject(new Rock(), 25, 395);
        addObject(new Rock(), 41, 395);
        addObject(new Rock(), 57, 395);
        addObject(new Rock(), 73, 395);
        addObject(new Rock(), 89, 395);
        addObject(new Rock(), 105, 395);
        addObject(new Rock(), 121, 395);
        addObject(new Rock(), 137, 395);
        addObject(new Rock(), 153, 395);
        addObject(new Rock(), 169, 395);
        
        //rocks by the water, right side
        addObject(new Rock(), 249, 140);
        addObject(new Rock(), 249, 155);
        addObject(new Rock(), 249, 170);
        addObject(new Rock(), 249, 185);
        addObject(new Rock(), 249, 200);
        addObject(new Rock(), 249, 215);
        addObject(new Rock(), 249, 230);
        addObject(new Rock(), 249, 245);
        addObject(new Rock(), 249, 260);
        addObject(new Rock(), 249, 275);
        addObject(new Rock(), 249, 290);
        addObject(new Rock(), 249, 305);
        addObject(new Rock(), 249, 320);
        addObject(new Rock(), 249, 335);
        addObject(new Rock(), 249, 350);
        addObject(new Rock(), 249, 365);
        addObject(new Rock(), 249, 380);
        
        //rocks, bottom right of the I
        addObject(new Rock(), 249, 395);
        addObject(new Rock(), 265, 395);
        addObject(new Rock(), 281, 395);
        addObject(new Rock(), 297, 395);
        addObject(new Rock(), 313, 395);
        addObject(new Rock(), 329, 395);
        addObject(new Rock(), 345, 395);
        addObject(new Rock(), 361, 395);
        addObject(new Rock(), 377, 395);
        addObject(new Rock(), 393, 395);
        addObject(new Rock(), 409, 395);
        addObject(new Rock(), 425, 395);
        
    }

    public void PopulateTrees()
    {
        //trees top
        addObject(new Tree(), 60, 20);
        addObject(new Tree(), 100, 20);
        addObject(new Tree(), 140, 20);
        addObject(new Tree(), 180, 20);
        addObject(new Tree(), 220, 20);
        addObject(new Tree(), 260, 20);
        addObject(new Tree(), 300, 20);
        addObject(new Tree(), 340, 20);
        addObject(new Tree(), 380, 20);
        addObject(new Tree(), 420, 20);
        addObject(new Tree(), 460, 20);
        addObject(new Tree(), 500, 20);
        addObject(new Tree(), 540, 20);
        addObject(new Tree(), 580, 20);
        addObject(new Tree(), 620, 20);
        addObject(new Tree(), 660, 20);
        addObject(new Tree(), 700, 20);
        addObject(new Tree(), 740, 20);
        addObject(new Tree(), 780, 20);
        
        //trees bottom
        addObject(new Tree(), 60, 580);
        addObject(new Tree(), 100, 580);
        addObject(new Tree(), 140, 580);
        addObject(new Tree(), 180, 580);
        addObject(new Tree(), 220, 580);
        addObject(new Tree(), 260, 580);
        addObject(new Tree(), 300, 580);
        addObject(new Tree(), 340, 580);
        addObject(new Tree(), 380, 580);
        addObject(new Tree(), 420, 580);
        addObject(new Tree(), 460, 580);
        addObject(new Tree(), 500, 580);
        addObject(new Tree(), 540, 580);
        addObject(new Tree(), 580, 580);
        addObject(new Tree(), 620, 580);
        addObject(new Tree(), 660, 580);
        addObject(new Tree(), 700, 580);
        addObject(new Tree(), 740, 580);
        addObject(new Tree(), 780, 580);
        
        //trees left side
        addObject(new Tree(), 24, 20);
        addObject(new Tree(), 24, 60);
        addObject(new Tree(), 24, 100);       
        addObject(new Tree(), 24, 420);
        addObject(new Tree(), 24, 460);
        addObject(new Tree(), 24, 500);
        addObject(new Tree(), 24, 540);
        addObject(new Tree(), 24, 580);
        
        //trees right side
        addObject(new Tree(), 776, 20);
        addObject(new Tree(), 776, 60);
        addObject(new Tree(), 776, 100);
        addObject(new Tree(), 776, 140);
        addObject(new Tree(), 776, 180);
        addObject(new Tree(), 776, 220);
        addObject(new Tree(), 776, 260);
        addObject(new Tree(), 776, 300);
        addObject(new Tree(), 776, 340);
        addObject(new Tree(), 776, 380);
        addObject(new Tree(), 776, 420);
        addObject(new Tree(), 776, 460);
        addObject(new Tree(), 776, 500);
        addObject(new Tree(), 776, 540);
        addObject(new Tree(), 776, 580);

    }
}
