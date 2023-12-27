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

        setPaintOrder(Rock.class, Tree.class, Water.class);
        
        PopulateTrees();
        PopulateRocks();
        PopulateWater();
        PopulateTallGrass();
        
    }
    
    public void PopulateWater()
    {
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
        
        //TallGrass inside the C
        addObject(new TallGrass(), 386, 142);
        addObject(new TallGrass(), 401, 159);
        addObject(new TallGrass(), 416, 176);
        addObject(new TallGrass(), 431, 142);
        addObject(new TallGrass(), 446, 159);
        addObject(new TallGrass(), 461, 176);
        addObject(new TallGrass(), 476, 142);
        addObject(new TallGrass(), 491, 159);
        addObject(new TallGrass(), 506, 176);
        
        addObject(new TallGrass(), 386, 193);
        addObject(new TallGrass(), 401, 210);
        addObject(new TallGrass(), 416, 227);
        addObject(new TallGrass(), 431, 244);
        addObject(new TallGrass(), 446, 193);
        addObject(new TallGrass(), 461, 210);
        addObject(new TallGrass(), 476, 227);
        addObject(new TallGrass(), 491, 244);
        addObject(new TallGrass(), 386, 193);
        addObject(new TallGrass(), 401, 210);
        addObject(new TallGrass(), 416, 227);
        addObject(new TallGrass(), 431, 244);
        addObject(new TallGrass(), 446, 193);
        addObject(new TallGrass(), 461, 210);
        addObject(new TallGrass(), 476, 227);
        addObject(new TallGrass(), 491, 244);
        
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
