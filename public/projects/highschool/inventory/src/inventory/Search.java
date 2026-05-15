package inventory;

import java.util.Scanner;
import java.util.ArrayList;

public class Search {
	
	static Scanner in = new Scanner(System.in); //Input Scanner
	static String userInput;
	static String userInput2;
	static boolean temp = false;
	
	//Search category selection
	public static void searchInventory()
	{
		Main.print("Would like like to search a specific category, or all categories?: ");
		Main.print("1. Tag");
		Main.print("2. Name");
		Main.print("3. Type");
		Main.print("4. Serial");
		Main.print("5. Model");
		Main.print("6. Location");
		Main.print("7. Comment");
		Main.print("8. Availability");
		Main.print("9. All");
		
		userInput = in.nextLine(); 
		userInput = Main.checkNumber(userInput, 9);
		
		switch (userInput)
		{
			case "1": searchTag(null); break; 
			case "2": break; 
			case "3": break; 
			case "4": break; 
			case "5": break; 
			case "6": break; 
			case "7": break; 
			case "8": break;
		}
	}
	
	//Searches for tag, and gives options accordingly. Check tag and search tag differ in their options
	public static void searchTag(String input)
	{
		int itemLocation = -1; //location of the found item
		
		//Creates temporary inventory
		ArrayList<Item> inventory = new ArrayList<Item>();
		inventory = Main.getInventory();
		
		if(input == null) //User manually selected to search
		{
			Main.print("\nEnter Tag to check for: ");
			userInput = in.nextLine();
		} 
		else //User input search directly at startup
			userInput = input;
			
		boolean itemFound = false;
			
		for(int i = 0; i < inventory.size(); i++)
		{
			if(userInput.equalsIgnoreCase(inventory.get(i).getTag()))
			{
				itemLocation = i;
				Main.print("Item Found!");
				
				Main.getItem(i);
				itemFound = true;
			}
		}
			
		if(!itemFound)
		{
			Main.print("\nNo item with the tag '" + userInput + "' was found. Would you like to add this item? y/n: ");
			userInput2 = in.nextLine();
			userInput2 = Main.checkYN(userInput2); //checks y/n input 
			
			if(userInput2.equalsIgnoreCase("y"))
			{
				Main.tag = input;
				Main.itemSelection();
			}
			else
				Main.giveOptions();
		}
		else
			Main.itemOptions(itemLocation);
			//Main.itemCheckOut(itemLocation);
	}
	
	//Checks items for existing tags and returns location
	public static int checkTag(String newTag)
	{
		int itemLocation = -1; //location of potential item
		
		ArrayList<Item> inventory = new ArrayList<Item>();
		inventory = Main.getInventory();

		if(newTag == null)
		{
			Main.print("Enter Tag to check for: ");
			userInput = in.nextLine();
		}
		else
			userInput = newTag;
					
		for(int i = 0; i < inventory.size(); i++)
			if(userInput.equalsIgnoreCase(inventory.get(i).getTag()))
				itemLocation = i;
		
		return itemLocation;
	}

	//needs to be able to take purely type item, as it is superclass
	public static void existingTagFound(int i, Item item)
	{
		Main.print("\nAn item with this tag already exists!");

		Main.getItem(i);
		Main.print("What would you like to do?");
		Main.print("1. Modify existing item's tag");
		Main.print("2. Modify current item's tag");
				
		userInput = in.nextLine();
		userInput = Main.checkNumber(userInput,2);
				
		if(userInput.equals("1")){}
			//modifyItem(i);
		else
		{
			item.setTag();
			Main.tag = item.getTag();

			//stops tag check if user tries to skip parameter by pressing enter
			if(!(Main.tag == null))
			{
				int x = Search.checkTag(Main.tag);
						
				if(x >= 0)
					Search.existingTagFound(x, item);
			}
			
			userInput2 = item.getTag();	
			temp = true; //using as a fix for tag not updating after user fixes their preexisting tag 
			
			//Fix for tag not updating when user fixes a preexisting tag
			if(temp == true)
				Main.tag = userInput2;
			temp = false; //reset temp;
		}
	}
}
