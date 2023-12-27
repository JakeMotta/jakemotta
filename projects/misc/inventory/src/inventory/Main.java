package inventory;

import java.util.Scanner;
import java.lang.Integer;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.regex.Pattern;

public class Main {
	
	//Define global variables
	static File InventoryList = new File("./src/inventory/output.txt");
	static Scanner sc = null;
	static Scanner in = new Scanner(System.in); //Input Scanner
	static String userInput;
	static String userInput2;
	static boolean temp = false;
	static int itemCount = 0;
	static ArrayList<Item> inventory = new ArrayList<Item>();
	
	static String itemType; //what kind of item it is
	static String tag;
	static String type;
	static String name;
	static String size;
	static String serial;
	static String model;
	static String user;
	static String badge;
	static String hostName;
	static String domain;
	static String make;
	static String OS; 
	static String exitDate;
	static String recieved;
	static String given;
	static String eSign;
	static String serviceRequest;
	static boolean dataBackup;
	static String dataLocation;
	static String location;
	static String rentedBy;
	static String comment;
	static boolean available; 
	
	public static void main(String[] args)
	{				
		try 
		{
			sc = new Scanner(InventoryList); //File Scanner	
			loadItems();
			giveOptions();
		} 
		catch (FileNotFoundException e) 
		{
			print("File not found!");
		}		
	}
	
	//Load existing items in text file into current items
	public static void loadItems()
	{	
		itemCount = 0;
		
		if(sc.hasNextLine() == false)
			printHeader();
		else
		{
			String skip = sc.nextLine();
			skip = sc.nextLine();
			
			//reads whole file
			while(sc.hasNextLine())
			{		
				String line = sc.nextLine();			
				
				//reads per line
				Scanner lineScanner = new Scanner(line);
				
				//Thanks John Bollinger at StackOverflow
				Pattern alternateDelim = Pattern.compile("[\t\n]+");
				lineScanner.useDelimiter(alternateDelim);
				
				while (lineScanner.hasNext()) 
				{
					
					itemType = lineScanner.next(); //detects the item type 	
					
					String myTag = lineScanner.next();
					
					if(itemType.equalsIgnoreCase("computer"))
					{
						String myType = lineScanner.next();
						String myName = lineScanner.next();
						String mySerial = lineScanner.next();
						String myModel = lineScanner.next();
						String myUser = lineScanner.next();
						String myBadge = lineScanner.next();
						String myHostName = lineScanner.next();
						String myDomain = lineScanner.next();
						String myMake = lineScanner.next();
						String myOS = lineScanner.next(); 
						String myRecieved = lineScanner.next();
						String myGiven = lineScanner.next();
						String myESign = lineScanner.next();
						String myServiceRequest = lineScanner.next();
						String myLocation = lineScanner.next();
						String myAvailableString = lineScanner.next();
						boolean myAvailable = checkAvailable(myAvailableString);
						String myRentedBy = lineScanner.next();
						String myComment = "";
						while(lineScanner.hasNext())
						{
							myComment += lineScanner.next() + " ";
						}

						inventory.add(new Computer(itemType, myTag, myType, myName, mySerial, myModel, myUser, myBadge, myHostName, myDomain, myMake, myOS, myRecieved, myGiven, myESign, myServiceRequest, myLocation, myAvailable, myRentedBy, myComment));
						itemCount += 1;
					}
					else if(itemType.equalsIgnoreCase("item"))
					{
						String myName = lineScanner.next();
						if(myName.contains("\t"))
							print("TRUE");
						String myLocation = lineScanner.next();
						String myAvailableString = lineScanner.next();
						boolean myAvailable = checkAvailable(myAvailableString);
						String myRentedBy = lineScanner.next();
						String myComment = "";
						while(lineScanner.hasNext())
						{
							myComment += lineScanner.next() + " ";
						}

						inventory.add(new Item(itemType, myTag, myName, myLocation, myAvailable, myRentedBy, myComment));	
						itemCount += 1;
					}
					else if(itemType.equalsIgnoreCase("hdd"))
					{
						String myName = lineScanner.next();
						String mySize = lineScanner.next();
						String myUser = lineScanner.next();
						String myBadge = lineScanner.next();
						String myHostName = lineScanner.next();
						String myDomain = lineScanner.next();
						String myOS = lineScanner.next(); 
						String myExitDate = lineScanner.next();
						String boolStr = lineScanner.next();
						boolean myDataBackup = checkAvailable(boolStr);
						String myDataLocation = lineScanner.next();
						String myLocation = lineScanner.next();
						String myAvailableString = lineScanner.next();
						boolean myAvailable = checkAvailable(myAvailableString);
						String myRentedBy = lineScanner.next();
						String myComment = "";
						while(lineScanner.hasNext())
						{
							myComment += lineScanner.next() + " ";
						}

						inventory.add(new HDD(itemType, myTag, myName, mySize, myUser, myBadge, myHostName, myDomain, myOS, myExitDate, myDataBackup, myDataLocation, myLocation, myAvailable, myRentedBy, myComment));
						itemCount += 1;
					}
				}	
			}
		}		
	}
	
	//Checks if item is available by returning true or false 
	public static boolean checkAvailable(String myAvailableString)
	{
		boolean myAvailable;
		
		if(myAvailableString.equalsIgnoreCase("true"))
			myAvailable = true;
		else
			myAvailable = false;
		
		return myAvailable;
	}
	
	//Give user menu options
	public static void giveOptions()
	{
		nullReset();
		
		if(itemCount == 1)
			print("Only keeping inventory of " + itemCount + " item currently.");
		else
			print("Currently tracking " + itemCount + " items in inventory.");
		
		print("");
		print("Press 1 to add a new item");
		print("Press 2 to remove an item");
		print("Press 3 to modify an item");
		print("Press 4 to print inventory summary");
		print("Press 5 to print current inventory");
		print("Press 6 to search current inventory");
		
		userInput = in.nextLine();
		
		print("");
		
		switch (userInput)
		{
			case "1": itemSelection(); break; 
			//case "2": Search.searchTag(null); break; useless for now
			case "2": remove(); break;
			case "3": modify(); break;
			case "4": printInventorySummary(); break; 
			case "5": printInventory(); break; 
			case "6": Search.searchInventory(); break; 
			default: Search.searchTag(userInput); break;
		}
	} 
	
	public static void remove()
	{
		print("\nEnter tag of item to remove (press ENTER to go back): ");
		userInput = in.nextLine();
		
		if(userInput.equals(""))
			giveOptions();
		else
		{
			int itemLocation = Search.checkTag(userInput);
			
			if(itemLocation >= 0)
			{
				print("\nWould you like to remove the following item? y/n:");
				getItem(itemLocation);
				userInput2 = in.nextLine();
				userInput2 = checkYN(userInput2);
				
				if(userInput2.equalsIgnoreCase("y"))
				{
					inventory.remove(itemLocation);
					print("\nItem removed!"); itemCount--;
					overWrite();					
					print("\nWould you like to remove another item? y/n: ");
					userInput = in.nextLine();
					userInput = checkYN(userInput);
					
					if(userInput.equalsIgnoreCase("y"))
						remove();
					else
						giveOptions();
				}
				else
					remove();
			}
			else 
			{
				print("\nNo matching tag found!\n");
				remove();
			}
			
		}
	}
	
	public static void modify()
	{
		print("Input item tag to modify item: ");
		
		userInput = in.nextLine();
		int itemLocation = Search.checkTag(userInput);
		
		if(itemLocation >= 0)
		{
			if(inventory.get(itemLocation).getItemType().equals("item"))
			{
				modifyOptions("item", itemLocation);
			}
			else if(inventory.get(itemLocation).getItemType().equals("computer"))
				modifyOptions("computer", itemLocation);
			else if(inventory.get(itemLocation).getItemType().equals("hdd"))
			{
				modifyOptions("hdd", itemLocation);
			}
		}
		else 
		{
			print("\nNo matching tag found! Returning to menu.\n");
			giveOptions();
		}
	}
	
	public static void modifyOptions(String myType, int myLocation)
	{
		
		print("\nWhat would you like to modify?");
		
		if(myType.equalsIgnoreCase("item"))
		{
			print("\n1. Tag");
			print("2. Name");
			print("3. Location");
			print("4. Available");
			print("5. Rented By");
			print("6. Comment");
			print("7. Back to menu");
			
			userInput = in.nextLine();
			userInput = checkNumber(userInput, 7);
			
			modifyItem(myLocation);
		}
		else if(myType.equalsIgnoreCase("computer"))
		{
			print("\n1. Tag");
			print("2. Type");
			print("3. Name");
			print("4. Serial");
			print("5. Model");
			print("6. User");
			print("7. Badge");
			print("8. Host Name");
			print("9. Domain");
			print("10. Make");
			print("11. OS");
			print("12. Recieved");
			print("13. Given");
			print("14. eSign");
			print("15. Service Request");
			print("16. Location");
			print("17. Available");
			print("18. Rented By");
			print("19. Comment");
			print("20. Back to menu");
			
			userInput = in.nextLine();
			userInput = checkNumber(userInput, 20);
			
			modifyComputer(myLocation);
		}
		else if(myType.equalsIgnoreCase("hdd"))
		{
			print("\n1. Tag");
			print("2. Name");
			print("3. Size");
			print("4. User");
			print("5. Badge");
			print("6. Host Name");
			print("7. Domain");
			print("8. OS");
			print("9. Exit Date");
			print("10. Data Backup");
			print("11. Data Location");
			print("12. Location");
			print("13. Available");
			print("14. Rented By");
			print("15. Comment");
			print("16. Back To Menu");
			
			userInput = in.nextLine();
			userInput = checkNumber(userInput, 16);
			
			modifyHDD(myLocation);
		}
		
	}
	
	public static void modifyItem(int i)
	{
		int itemLocation = i;
				
		//catches a wrong input value on userInput
		switch (userInput)
		{
			case "1": 	inventory.get(itemLocation).setTag();
				tag = inventory.get(itemLocation).getTag(); 
				break; 
				
			case "2": 	inventory.get(itemLocation).setName(); 			
				name = inventory.get(itemLocation).getName(); 
				break; 	
				
			case "3": 	inventory.get(itemLocation).setLocation(); 		
				location = inventory.get(itemLocation).getLocation(); 
				break; 
				
			case "4": 	inventory.get(itemLocation).setAvailable(""); 	
				available = inventory.get(itemLocation).getAvailability();
				break;
				
			case "5": 	inventory.get(itemLocation).setRentedBy(); 		
				rentedBy = inventory.get(itemLocation).getRentedBy(); 
				break;	
				
			case "6": 	inventory.get(itemLocation).setComment(); 		
				comment = inventory.get(itemLocation).getComment(); 
				break;	
				
			case "7": overWrite(); giveOptions(); 
				break;	
		}
				
		print("\nContinue modifying? y/n: ");
		userInput = in.nextLine();
		userInput = checkYN(userInput);
		
		if(userInput.equals("y"))
			modifyOptions("item", itemLocation);
		else
		{
			overWrite();
			giveOptions();
		}
	}
	
	public static void modifyComputer(int i)
	{
		int itemLocation = i;
				
		//catches a wrong input value on userInput
		switch (userInput)
		{
			 case "1": 	inventory.get(itemLocation).setTag(); 							
			 	tag = inventory.get(itemLocation).getTag();; 
			 	break; 
			 							
			 case "2": ((Computer) inventory.get(itemLocation)).setType(); 				
				type = ((Computer) inventory.get(itemLocation)).getType(); 
				break; 	
										
			 case "3": inventory.get(itemLocation).setName(); 							
				name = inventory.get(itemLocation).getName(); 
				break; 
										
			 case "4": ((Computer) inventory.get(itemLocation)).setSerial(); 			
				serial = ((Computer) inventory.get(itemLocation)).getSerial(); 
				break;
										
			 case "5": 	((Computer) inventory.get(itemLocation)).setModel(); 			
			 	model = ((Computer) inventory.get(itemLocation)).getModel(); 
			 	break;	
			 
		 	 case "6": ((Computer) inventory.get(itemLocation)).setUser(); 				
		 	 	user = ((Computer) inventory.get(itemLocation)).getUser(); 
		 	 	break; 
		 	 
		 	 case "7": ((Computer) inventory.get(itemLocation)).setBadge(); 			
		 	 	badge = ((Computer) inventory.get(itemLocation)).getBadge(); 
		 	 	break;
		 	 
			 case "8": ((Computer) inventory.get(itemLocation)).setHostName(); 			
			 	hostName = ((Computer) inventory.get(itemLocation)).getHostName(); 
			 	break; 
			 
			 case "9": ((Computer) inventory.get(itemLocation)).setDomain(); 			
			 	domain = ((Computer) inventory.get(itemLocation)).getDomain(); 
			 	break;
			 
			case "10": ((Computer) inventory.get(itemLocation)).setMake(); 				
				make = ((Computer) inventory.get(itemLocation)).getMake(); 
				break;
			
			case "11": ((Computer) inventory.get(itemLocation)).setOS(); 				
				OS = ((Computer) inventory.get(itemLocation)).getOS();  
				break;
			
			case "12": ((Computer) inventory.get(itemLocation)).setRecieved(); 			
				recieved = ((Computer) inventory.get(itemLocation)).getRecieved(); 
				break; 
			
			case "13": ((Computer) inventory.get(itemLocation)).setGiven(); 			
				given = ((Computer) inventory.get(itemLocation)).getGiven(); 
				break; 
			
			case "14": ((Computer) inventory.get(itemLocation)).setESign(); 			
				eSign = ((Computer) inventory.get(itemLocation)).getESign(); 
				break; 
			
			case "15": ((Computer) inventory.get(itemLocation)).setServiceRequest();	
				serviceRequest = ((Computer) inventory.get(itemLocation)).getServiceRequest(); 
				break;
			
			case "16": inventory.get(itemLocation).setLocation(); 						
				location = inventory.get(itemLocation).getLocation(); 
				break;
			
			case "17": inventory.get(itemLocation).setAvailable(null); 					
				available = inventory.get(itemLocation).getAvailability(); 
				break; 
				
			case "18": inventory.get(itemLocation).setRentedBy(); 					
				rentedBy = inventory.get(itemLocation).getRentedBy(); 
				break; 
				
			case "19": inventory.get(itemLocation).setComment(); 					
				comment = inventory.get(itemLocation).getComment(); 
				break; 
			
			case "20": overWrite(); giveOptions(); 
				break; 
		}
		
		print("\nContinue modifying? y/n: ");
		userInput = in.nextLine();
		userInput = checkYN(userInput);
		
		if(userInput.equals("y"))
			modifyOptions("computer", itemLocation);
		else
		{
			overWrite();
			giveOptions();
		}
	}
		
	public static void modifyHDD(int i)
	{
		int itemLocation = i;
					
		//catches a wrong input value on userInput
		switch (userInput)
		{
			 case "1": 	inventory.get(itemLocation).setTag(); 							
			 	tag = inventory.get(itemLocation).getTag();; 
			 	break; 
										
			 case "2": inventory.get(itemLocation).setName(); 							
				name = inventory.get(itemLocation).getName(); 
				break; 
			 
		 	 case "3": ((HDD) inventory.get(itemLocation)).setSize(); 				
		 	 	size = ((HDD) inventory.get(itemLocation)).getSize(); 
		 	 	break; 
		 	 	
		 	case "4": ((HDD) inventory.get(itemLocation)).setUser(); 				
		 	 	user = ((HDD) inventory.get(itemLocation)).getUser(); 
		 	 	break; 
		 	 
		 	 case "5": ((HDD) inventory.get(itemLocation)).setBadge(); 			
		 	 	badge = ((HDD) inventory.get(itemLocation)).getBadge(); 
		 	 	break;
		 	 
			 case "6": ((HDD) inventory.get(itemLocation)).setHostName(); 			
			 	hostName = ((HDD) inventory.get(itemLocation)).getHostName(); 
			 	break; 
			 
			 case "7": ((HDD) inventory.get(itemLocation)).setDomain(); 			
			 	domain = ((HDD) inventory.get(itemLocation)).getDomain(); 
			 	break;
			
			case "8": ((HDD) inventory.get(itemLocation)).setOS(); 				
				OS = ((HDD) inventory.get(itemLocation)).getOS();  
				break;
				
			case "9": ((HDD) inventory.get(itemLocation)).setExitDate(); 				
				exitDate = ((HDD) inventory.get(itemLocation)).getExitDate();  
				break;
				
			case "10": ((HDD) inventory.get(itemLocation)).setDataBackup(); 				
				dataBackup = ((HDD) inventory.get(itemLocation)).getDataBackup();  
				break;
			
			case "11": ((HDD) inventory.get(itemLocation)).setDataLocation(); 				
				dataLocation = ((HDD) inventory.get(itemLocation)).getDataLocation();  
				break;
			
			case "12": inventory.get(itemLocation).setLocation(); 						
				location = inventory.get(itemLocation).getLocation(); 
				break;
			
			case "13": inventory.get(itemLocation).setAvailable(null); 					
				available = inventory.get(itemLocation).getAvailability(); 
				break; 
				
			case "14": inventory.get(itemLocation).setRentedBy(); 					
				rentedBy = inventory.get(itemLocation).getRentedBy(); 
				break; 
				
			case "15": inventory.get(itemLocation).setComment(); 					
				comment = inventory.get(itemLocation).getComment(); 
				break; 
			
			case "16": overWrite(); giveOptions(); 
				break; 
		}
		
		print("\nContinue modifying? y/n: ");
		userInput = in.nextLine();
		userInput = checkYN(userInput);
		
		if(userInput.equals("y"))
			modifyOptions("hdd", itemLocation);
		else
		{
			overWrite();
			giveOptions();
		}
	}
	
	//Rewrites current inventory list. Selects proper item type to write and then calls on specific method to do so
	public static void overWrite()
	{
		
		PrintWriter printwriter;
		
		try 
		{	
			printwriter = new PrintWriter(new FileWriter(InventoryList));
			
			printHeader();
			printwriter.close();
		} 
		catch (IOException e)
		{ 
			e.printStackTrace();
		}
		
		for(int i = 0; i < inventory.size(); i++)
		{
			if(inventory.get(i).getItemType().equalsIgnoreCase("item"))
				overWriteItem(i);
			if(inventory.get(i).getItemType().equalsIgnoreCase("computer"))
				overWriteComputer(i);
			if(inventory.get(i).getItemType().equalsIgnoreCase("hdd"))
				overWriteHDD(i);
		}
		sc.close();
	}
	
	//Writes an item
	public static void overWriteItem(int i)
	{
		PrintWriter printwriter;

		try 
		{
			printwriter = new PrintWriter(new FileWriter(InventoryList, true));
			printwriter.print(inventory.get(i).getItemType());
			printwriter.print(tab(1) + inventory.get(i).getTag());
			printwriter.print(tab(2) + inventory.get(i).getName());
			printwriter.print(tab(17) + inventory.get(i).getLocation());
			printwriter.print(tab(1) + inventory.get(i).getAvailability());
			printwriter.print(tab(1) + inventory.get(i).getRentedBy());
			printwriter.print(tab(1) + inventory.get(i).getComment());
			printwriter.println();
			printwriter.close();
		} 
		catch (IOException e) 
		{
			e.printStackTrace();
		}	
	}
	
	//Writes a computer
	public static void overWriteComputer(int i)
	{
		PrintWriter printwriter;

		try 
		{
			printwriter = new PrintWriter(new FileWriter(InventoryList, true));
			printwriter.print(inventory.get(i).getItemType());
			printwriter.print(tab(1) + inventory.get(i).getTag());
			printwriter.print(tab(1) + ((Computer) inventory.get(i)).getType());
			printwriter.print(tab(1) + inventory.get(i).getName());
			printwriter.print(tab(1) + ((Computer) inventory.get(i)).getSerial());
			printwriter.print(tab(1) + ((Computer) inventory.get(i)).getModel());
			printwriter.print(tab(2) + ((Computer) inventory.get(i)).getUser());
			printwriter.print(tab(1) + ((Computer) inventory.get(i)).getBadge());
			printwriter.print(tab(1) + ((Computer) inventory.get(i)).getHostName());
			printwriter.print(tab(1) + ((Computer) inventory.get(i)).getDomain());
			printwriter.print(tab(1) + ((Computer) inventory.get(i)).getMake());
			printwriter.print(tab(1) + ((Computer) inventory.get(i)).getOS());
			printwriter.print(tab(2) + ((Computer) inventory.get(i)).getRecieved());
			printwriter.print(tab(1) + ((Computer) inventory.get(i)).getGiven());
			printwriter.print(tab(1) + ((Computer) inventory.get(i)).getESign());
			printwriter.print(tab(1) + ((Computer) inventory.get(i)).getServiceRequest());
			printwriter.print(tab(3) + inventory.get(i).getLocation());
			printwriter.print(tab(1) + inventory.get(i).getAvailability());
			printwriter.print(tab(1) + inventory.get(i).getRentedBy());
			printwriter.print(tab(1) + inventory.get(i).getComment());
			printwriter.println();
			printwriter.close();
		} 
		catch (IOException e) 
		{
			e.printStackTrace();
		}	
	}
	
	//Writes a hdd
	public static void overWriteHDD(int i)
	{
		PrintWriter printwriter;

		try 
		{
			printwriter = new PrintWriter(new FileWriter(InventoryList, true));
			printwriter.print(inventory.get(i).getItemType());
			printwriter.print(tab(1) + inventory.get(i).getTag());
			printwriter.print(tab(2) + inventory.get(i).getName());
			printwriter.print(tab(3) + ((HDD) inventory.get(i)).getSize());
			printwriter.print(tab(1) + ((HDD) inventory.get(i)).getUser());
			printwriter.print(tab(1) + ((HDD) inventory.get(i)).getBadge());
			printwriter.print(tab(1) + ((HDD) inventory.get(i)).getHostName());
			printwriter.print(tab(1) + ((HDD) inventory.get(i)).getDomain());
			printwriter.print(tab(2) + ((HDD) inventory.get(i)).getOS());
			printwriter.print(tab(1) + ((HDD) inventory.get(i)).getExitDate());
			printwriter.print(tab(5) + ((HDD) inventory.get(i)).getDataBackup());
			printwriter.print(tab(1) + ((HDD) inventory.get(i)).getDataLocation());
			printwriter.print(tab(1) + inventory.get(i).getLocation());
			printwriter.print(tab(1) + inventory.get(i).getAvailability());
			printwriter.print(tab(1) + inventory.get(i).getRentedBy());
			printwriter.print(tab(1) + inventory.get(i).getComment());
			printwriter.println();
			printwriter.close();
		} 
		catch (IOException e) 
		{
			e.printStackTrace();
		}	
	}
		
	//Sends the current inventory to whoever wants it
	public static ArrayList<Item> getInventory()
	{
		return inventory;
	}
	
	//Resets all variables
	public static void nullReset()
	{
		tag=type=name=size=serial=model=user=badge=hostName=domain=make=OS=exitDate=recieved=given=eSign=serviceRequest=dataLocation=location=comment=itemType=null;
		available=dataBackup=false;
	}
	
	public static void itemOptions(int i)
	{
		int itemLocation = i;
		
		print("\nWhat would you like to do?");
		print("1. Check current item in/out");
		print("2. Modify current item");
		print("3. Main Menu");
		
		userInput = in.nextLine();
		userInput = checkNumber(userInput, 3);
		
		switch(userInput)
		{
			case "1":
			{
				itemCheckOut(itemLocation);
				break;
			}
			case "2":
			{
				modifyOptions(inventory.get(itemLocation).getItemType(), itemLocation);
				break;
			}
			case "3":
			{
				giveOptions();
				break;
			}
			default:
			{
				giveOptions();
				break;
			}
		}
	}
	
	//Method to check items in/out
	public static void itemCheckOut(int itemLocation)
	{
		if(inventory.get(itemLocation).getAvailability() == true)
		{
			print("This item is currently available.");
			print("\nWould you like to check this item out? y/n: ");
			userInput2 = in.nextLine();
			userInput2 = checkYN(userInput2); //checks y/n input 
			
			if(userInput2.equalsIgnoreCase("y"))
			{
				if(inventory.get(itemLocation).getItemType().equalsIgnoreCase("computer"))
				{
					((Computer) inventory.get(itemLocation)).setName();
					((Computer) inventory.get(itemLocation)).setUser();
					((Computer) inventory.get(itemLocation)).setBadge();
					((Computer) inventory.get(itemLocation)).setHostName();
					((Computer) inventory.get(itemLocation)).setDomain();
					((Computer) inventory.get(itemLocation)).setLocation();
					((Computer) inventory.get(itemLocation)).setRentedBy();
					((Computer) inventory.get(itemLocation)).setAvailable("false");
				}
				else
				{
					inventory.get(itemLocation).setRentedBy();
					inventory.get(itemLocation).setAvailable("false");
					available = inventory.get(itemLocation).getAvailability();
				}
				print("\nThis item has been checked out! Enjoy!\n");
			}		
		}
		else
		{
			print("This item is not currently available...");
			print("\nWould you like to check this item in? y/n: ");
			userInput2 = in.nextLine();
			userInput2 = checkYN(userInput2); //checks y/n input 
			
			if(userInput2.equalsIgnoreCase("y"))
			{
				inventory.get(itemLocation).setRentedByDefault();
				inventory.get(itemLocation).setAvailable("true");
				available = inventory.get(itemLocation).getAvailability();
				print("\nThis item has been checked in! Thank you!\n");
			}
		}
		
		overWrite();
		giveOptions();
	}
	
	//Shortcut to checking if a user's input was either 'y' or 'n'
	public static String checkYN(String choice)
	{
		switch (choice)
		{
			case "y": break; case "Y": break; case "n": break; case "N": break; case "": choice = null; break;
			default:
			{
				do
				{
					Main.print("You input '" + choice + "'. That was not an option. Select either 'y' or 'n': ");
					choice = in.nextLine();
				}
				while(!(choice.equalsIgnoreCase("y") || choice.equalsIgnoreCase("n")));
				break;
			}
		}
		
		return choice;
	}
	
	//Shortcut to checking if a number is within bounds for an option set
	public static String checkNumber(String choice, int options)
	{
		boolean correctChoice = false;
		
		if((choice.length() == 1 || choice.length() == 2) && !(choice.equals("")))
		{
			try
			{
				for(int i = 1; i <= options; i++)
				{
					if((Integer.parseInt(choice) == i))
					{
						correctChoice = true;
						break;
					}
				}
			}
			catch(Exception e)
			{
			}	
		}
		
		if(choice.equals(""))
			return null;
		
		if(correctChoice == true)
			return choice;
		else
		{
			Main.print("You chose '" + choice + "'. That was not an option. Pick a number between 1 - " + options);
			choice = in.nextLine();
			choice = checkNumber(choice, options);
		}

		return choice;
	}
			
	//Prompts user to select the kind of item they are creating (item, computer HDD...)
	public static void itemSelection()
	{
		print("\nWhat type of item are you adding? ");
		print("1. Add Item");
		print("2. Add System");
		print("3. Add HDD");
		
		itemType = in.nextLine();
		itemType = checkNumber(itemType, 3);
		
		try
		{
			switch(itemType) 
			{
				case "1": createItem(); break;
				case "2": createComputer(); break;
				case "3": createHDD(); break;
				default: itemSelection(); break;	
			}
		}
		catch(Exception e) //By the power of Grayskull, this solved my error
		{
			print("That was not an option!");
			itemSelection();
		}

	}
	
	//Calls all the methods to create and review an item
	public static void createItem()
	{			
		itemType = "item";
		Item item = new Item(itemType, tag, name, location, available, rentedBy, comment);

		//Call tagInfo only if user didn't start item creation with tag search
		if(tag == null)
		{
			item.setTag();
			tag = item.getTag();

			//stops tag check if user tries to skip parameter by pressing enter
			if(!(tag == null))
			{
				int i = Search.checkTag(tag);
						
				if(i >= 0)
					Search.existingTagFound(i, item);
			}
		}
		
		item.setItemType(itemType);
		itemType = item.getItemType();
				
		item.setName();
		name = item.getName();
				
		item.setLocation();
		location = item.getLocation();
				
		item.setAvailable(null);
		available = item.getAvailability();
		
		if(available == false)
		{
			item.setRentedBy();
			rentedBy = item.getRentedBy();
		}
		else
			item.setRentedByDefault();

		item.setComment();
		comment = item.getComment();
				
		//Call method that has user review their input information
		reviewItemInfo(item);
	}

	//Calls all the methods to create and review an system
	public static void createComputer()
	{
		Computer computer = new Computer(itemType, tag,type,name,serial,model,user,badge,hostName,domain,make,OS,recieved,given,eSign,serviceRequest,location,available,rentedBy,comment);
		itemType = "computer";

		//Call tagInfo only if user didn't start item creation with tag search
		if(tag == null)
		{
			computer.setTag();
			tag = computer.getTag();

			//stops tag check if user tries to skip parameter by pressing enter
			if(!(tag == null))
			{
				int i = Search.checkTag(tag);
				
				if(i >= 0)
					Search.existingTagFound(i, computer);
			}
		}
		
		computer.setItemType(itemType);
		itemType = computer.getItemType();
						
		computer.setName();
		name = computer.getName();
								
		computer.setType();
		type = computer.getType();
		
		computer.setSerial();
		serial = computer.getSerial();
		
		computer.setModel();
		model = computer.getModel();
		
		computer.setUser();
		user = computer.getUser();
		
		computer.setBadge();
		badge = computer.getBadge();
		
		computer.setHostName();
		hostName = computer.getHostName();
		
		computer.setDomain();
		hostName = computer.getDomain();
		
		computer.setMake();
		make = computer.getMake();
		
		computer.setOS();
		OS = computer.getOS(); 
		
		computer.setRecieved();
		recieved = computer.getRecieved();
		
		computer.setGiven();
		given = computer.getGiven();
		
		computer.setESign();
		eSign = computer.getESign();
		
		computer.setServiceRequest();
		serviceRequest = computer.getServiceRequest();
		
		computer.setLocation();
		location = computer.getLocation();
						
		computer.setAvailable(null);
		available = computer.getAvailability();	
		
		if(available == false)
		{
			rentedBy = computer.getBadge();
		}
		else
			computer.setRentedByDefault();
		
		computer.setComment();
		comment = computer.getComment();
		
		//Call method that has user review their input information
		reviewComputerInfo(computer);
	}
	
	//Calls all the methods to create and review an system
	public static void createHDD()
	{
		HDD hdd = new HDD(itemType,tag,name,size,user,badge,hostName,domain,OS,exitDate,dataBackup,dataLocation,location,available,rentedBy,comment);
		itemType = "hdd";

		//Call tagInfo only if user didn't start item creation with tag search
		if(tag == null)
		{
			hdd.setTag();
			tag = hdd.getTag();

			//stops tag check if user tries to skip parameter by pressing enter
			if(!(tag == null))
			{
				int i = Search.checkTag(tag);
				
				if(i >= 0)
					Search.existingTagFound(i, hdd);
			}
		}
				
		hdd.setItemType(itemType);
		itemType = hdd.getItemType();
								
		hdd.setName();
		name = hdd.getName();
		
		hdd.setSize();
		size = hdd.getSize();
										
		hdd.setUser();
		user = hdd.getUser();
				
		hdd.setBadge();
		badge = hdd.getBadge();
				
		hdd.setHostName();
		hostName = hdd.getHostName();
				
		hdd.setDomain();
		domain = hdd.getDomain();
				
		hdd.setOS();
		OS = hdd.getOS();
				
		hdd.setExitDate();
		exitDate = hdd.getExitDate();
		
		hdd.setDataBackup();
		dataBackup = hdd.getDataBackup();
		
		if(dataBackup == true)
		{
			hdd.setDataLocation();
			dataLocation = hdd.getDataLocation();
		}
		else
			dataLocation = null;
				
		hdd.setLocation();
		location = hdd.getLocation();
								
		hdd.setAvailable(null);
		available = hdd.getAvailability();
		
		if(available == false)
		{
			hdd.setRentedBy();
			rentedBy = hdd.getRentedBy();
		}
		else
			hdd.setRentedByDefault();
								
		hdd.setComment();
		comment = hdd.getComment();
				
		//Call method that has user review their input information
		reviewHDDInfo(hdd);
	}

	//Lists all fields of the object to the user and has them confirm/modify before adding item
	public static void reviewItemInfo(Item item)
	{
		print("\nPlease review the following information for this item: ");
		currentItem();
		
		print("\nIs this information correct? y/n: ");
		userInput = in.nextLine();
		
		//catches a wrong input value on user input for y/n
		userInput = checkYN(userInput);

		if(userInput.equalsIgnoreCase("y"))
			addItem(item);		
		else
		{
			print("Please input the number of the category you wish to modify: ");
			print("");
			print("1. Tag");
			print("2. Name");
			print("3. Location");
			print("4. Available");
			print("5. Rented By");
			print("6. Comment");
			print("7. All information is correct");
			userInput = in.nextLine();
			userInput = checkNumber(userInput, 7);
		}
			
		//catches a wrong input value on userInput
		switch (userInput)
		{
			case "1": item.setTag(); tag = item.getTag(); break; 
			case "2": item.setName(); name = item.getName(); break; 						
			case "3": item.setLocation(); location = item.getLocation(); break; 
			case "4": item.setAvailable(""); available = item.getAvailability(); break;
			case "5": item.setRentedBy(); rentedBy = item.getRentedBy(); break;
			case "6": item.setComment(); comment = item.getComment(); break;	
			case "7": addItem(item); break;	
		}
		
		reviewItemInfo(item);
	}
	
	//Lists all fields of the object to the user and has them confirm/modify before adding computer
	public static void reviewComputerInfo(Computer computer)
	{
		print("\nPlease review the following information for this item: ");
		currentItem();
			
		print("\nIs this information correct? y/n: ");
		userInput = in.nextLine();
			
		//catches a wrong input value on user input for y/n
		userInput = checkYN(userInput);
			
		if(userInput.equalsIgnoreCase("y"))
			addComputer(computer);		
		else
		{
			print("Please input the number of the category you wish to modify: ");
			print("");
			print("1. Tag");
			print("2. Type");
			print("3. Name");
			print("4. Serial");
			print("5. Model");
			print("6. User");
			print("7. Badge");
			print("8. Host Name");
			print("9. Domain");
			print("10. Make");
			print("11. OS");
			print("12. Recieved");
			print("13. Given");
			print("14. eSign");
			print("15. Service Request");
			print("16. Location");
			print("17. Available");
			print("18. Rented By");
			print("19. Comment");
			print("20. All information is correct");
			userInput = in.nextLine();
			userInput = checkNumber(userInput, 20);
		}
				
		//catches a wrong input value on userInput
		switch (userInput)
		{
			case "1": computer.setTag(); tag = computer.getTag();; break; 
			case "2": computer.setType(); type = computer.getType(); break; 						
			case "3": computer.setName(); name = computer.getName(); break; 
			case "4": computer.setSerial(); serial = computer.getSerial(); break;
			case "5": computer.setModel(); model = computer.getModel(); break;	
			case "6": computer.setUser(); user = computer.getUser(); break; 
			case "7": computer.setBadge(); badge = computer.getBadge(); break; 						
			case "8": computer.setHostName(); hostName = computer.getHostName(); break; 
			case "9": computer.setDomain(); domain = computer.getDomain(); break;
			case "10": computer.setMake(); make = computer.getMake(); break;
			case "11": computer.setOS(); OS = computer.getOS();  break;
			case "12": computer.setRecieved(); recieved = computer.getRecieved(); break; 
			case "13": computer.setGiven(); given = computer.getGiven(); break; 						
			case "14": computer.setESign(); eSign = computer.getESign(); break; 
			case "15": computer.setServiceRequest(); serviceRequest = computer.getServiceRequest(); break;
			case "16": computer.setLocation(); location = computer.getLocation(); break;
			case "17": computer.setAvailable(""); available = computer.getAvailability(); break; 
			case "18": computer.setRentedBy(); rentedBy = computer.getRentedBy(); break; 			
			case "19": computer.setComment(); comment = computer.getComment(); break; 						
			case "20": addComputer(computer); break; 
		}
		
		reviewComputerInfo(computer);
	}
		
	//Lists all fields of the object to the user and has them confirm/modify before adding hdd
	public static void reviewHDDInfo(HDD hdd)
	{
		print("\nPlease review the following information for this item: ");
		currentItem();
					
		print("\nIs this information correct? y/n: ");
		userInput = in.nextLine();
					
		//catches a wrong input value on user input for y/n
		userInput = checkYN(userInput);
					
		if(userInput.equalsIgnoreCase("y"))
			addHDD(hdd);		
		else
		{
			print("Please input the number of the category you wish to modify: \n");
			print("1. Tag");
			print("2. Name");
			print("3. Size");
			print("4. User");
			print("5. Badge");
			print("6. Host Name");
			print("7. Domain");
			print("8. OS");
			print("9. Exit Date");
			print("10. Data Backup");
			print("11. Data Location");
			print("12. Location");
			print("13. Available");
			print("14. Rented By");
			print("15. Comment");
			print("16. All information is correct");
			userInput = in.nextLine();
			userInput = checkNumber(userInput, 16);
		}
						
		//catches a wrong input value on userInput
		switch (userInput)
		{
			case "1": hdd.setTag(); tag = hdd.getTag();; break; 
			case "2": hdd.setName(); name = hdd.getName(); break; 
			case "3": hdd.setSize(); size = hdd.getSize(); break; 
			case "4": hdd.setUser(); user = hdd.getUser(); break; 
			case "5": hdd.setBadge(); badge = hdd.getBadge(); break; 						
			case "6": hdd.setHostName(); hostName = hdd.getHostName(); break; 
			case "7": hdd.setDomain(); domain = hdd.getDomain(); break;
			case "8": hdd.setOS(); OS = hdd.getOS();  break;
			case "9": hdd.setExitDate(); exitDate = hdd.getExitDate();  break;
			case "10": hdd.setDataBackup(); dataBackup = hdd.getDataBackup(); break;
			case "11": hdd.setDataLocation(); dataLocation = hdd.getDataLocation(); break;
			case "12": hdd.setLocation(); location = hdd.getLocation(); break;
			case "13": hdd.setAvailable(""); available = hdd.getAvailability(); break; 
			case "14": hdd.setRentedBy(); rentedBy = hdd.getRentedBy(); break; 				
			case "15": hdd.setComment(); comment = hdd.getComment(); break; 	
			case "16": addHDD(hdd); break; 
		}
				
		reviewHDDInfo(hdd);
		}
	
	public static String tab(int x)
	{
		String tabResult = "";
		for(int i = 0; i < x; i++)
			tabResult += "\t";
		return tabResult;
	}
	//Creates a new item in full, after all modifications have been made to the item
	public static void addItem(Item item)
	{
		inventory.add(item);
		
		PrintWriter printwriter;
		try 
		{
			printwriter = new PrintWriter(new FileWriter(InventoryList, true));
			printwriter.print(item.getItemType());
			printwriter.print(tab(1) + item.getTag());
			printwriter.print(tab(2) + item.getName());
			printwriter.print(tab(17) + item.getLocation());
			printwriter.print(tab(1) + item.getAvailability());
			printwriter.print(tab(1) + item.getRentedBy());
			printwriter.print(tab(1) + item.getComment());
			printwriter.println();
			printwriter.close();
			sc.close();
			
			print("Item added!\n");
			itemCount++;
		} 
		catch (IOException e) 
		{
			e.printStackTrace();
		}	
		
		giveOptions();
	}
	
	//Creates a new system in full, after all modifications have been made to the system
	public static void addComputer(Computer computer)
	{
		inventory.add(computer);
		
		PrintWriter printwriter;
		try 
		{
			printwriter = new PrintWriter(new FileWriter(InventoryList, true));
			printwriter.print(computer.getItemType());
			printwriter.print(tab(1) + computer.getTag());
			printwriter.print(tab(1) + computer.getType());
			printwriter.print(tab(1) + computer.getName());
			printwriter.print(tab(1) + computer.getSerial());
			printwriter.print(tab(1) + computer.getModel());
			printwriter.print(tab(2) + computer.getUser());
			printwriter.print(tab(1) + computer.getBadge());
			printwriter.print(tab(1) + computer.getHostName());
			printwriter.print(tab(1) + computer.getDomain());
			printwriter.print(tab(1) + computer.getMake());
			printwriter.print(tab(1) + computer.getOS());
			printwriter.print(tab(2) + computer.getRecieved());
			printwriter.print(tab(1) + computer.getGiven());
			printwriter.print(tab(1) + computer.getESign());
			printwriter.print(tab(1) + computer.getServiceRequest());
			printwriter.print(tab(3) + computer.getLocation());
			printwriter.print(tab(1) + computer.getAvailability());
			printwriter.print(tab(1) + computer.getRentedBy());
			printwriter.print(tab(1) + computer.getComment());
			printwriter.println();
			printwriter.close();
			sc.close();
				
			print("Computer added!\n");
			itemCount++;
		} 
		catch (IOException e) 
		{
			e.printStackTrace();
		}	
		
		giveOptions();
	}
	
	//Creates a new system in full, after all modifications have been made to the system
	public static void addHDD(HDD hdd)
	{
		inventory.add(hdd);
				
		PrintWriter printwriter;
		try 
		{
			printwriter = new PrintWriter(new FileWriter(InventoryList, true));
			printwriter.print(hdd.getItemType());
			printwriter.print(tab(1) + hdd.getTag());
			printwriter.print(tab(2) + hdd.getName());
			printwriter.print(tab(3) + hdd.getSize());
			printwriter.print(tab(1) + hdd.getUser());
			printwriter.print(tab(1) + hdd.getBadge());
			printwriter.print(tab(1) + hdd.getHostName());
			printwriter.print(tab(1) + hdd.getDomain());
			printwriter.print(tab(2) + hdd.getOS());
			printwriter.print(tab(1) + hdd.getExitDate());
			printwriter.print(tab(5) + hdd.getDataBackup());
			printwriter.print(tab(1) + hdd.getDataLocation());
			printwriter.print(tab(1) + hdd.getLocation());
			printwriter.print(tab(1) + hdd.getAvailability());
			printwriter.print(tab(1) + hdd.getRentedBy());
			printwriter.print(tab(1) + hdd.getComment());
			printwriter.println();
			printwriter.close();
			sc.close();
						
			print("HDD added!\n");
			itemCount++;
		} 
		catch (IOException e) 
		{
			e.printStackTrace();
		}	
				
		giveOptions();
	}
			
	//Prints initial header
	public static void printHeader()
	{		
		PrintWriter printwriter;
		try 
		{
			printwriter = new PrintWriter(new FileWriter(InventoryList, true));
			printwriter.println("@Version 1.5" + "\n");
			printwriter.println(allVariables());
			printwriter.close();
			printwriter.println();
			sc.close();
		} 
		catch (IOException e) 
		{
			e.printStackTrace();
		}	
	}
	
	//prints the info on an item currently being created
	public static void currentItem()
	{
		print("");
		
		if(itemType.equalsIgnoreCase("item"))
		{
				print("Tag: " + tag);
				print("Name: " + name);
				print("Location: " + location);
				print("Available: " + available);
				print("Rented By: " + rentedBy);
				print("Comment: " + comment);
				print("");
		}
		else if(itemType.equalsIgnoreCase("computer"))
		{
				print("Tag: " + tag);
				print("Type: " + type);
				print("Name: " + name);
				print("Serial: " + serial);
				print("Model: " + model);
				print("User: " + user);
				print("Badge: " + badge);
				print("Host Name: " + hostName);
				print("Domain: " + domain);
				print("Make: " + make);
				print("OS: " + OS);
				print("Recieved: " + recieved);
				print("Given: " + given);
				print("eSign: " + eSign);
				print("Service Request: " + serviceRequest);
				print("Location: " + location);
				print("Available: " + available);
				print("Rented By: " + rentedBy);
				print("Comment: " + comment);
				print("");
		}
		else if(itemType.equalsIgnoreCase("hdd"))
		{
				print("Tag: " + tag);
				print("Name: " + name);
				print("Size: " + size);
				print("User: " + user);
				print("Badge: " + badge);
				print("Host Name: " + hostName);
				print("Domain: " + domain);
				print("OS: " + OS);
				print("Exit Date: " + exitDate);
				print("Data Backup: " + dataBackup);
				print("Data Location: " + dataLocation);
				print("Location: " + location);
				print("Available: " + available);
				print("Rented By: " + rentedBy);
				print("Comment: " + comment);
				print("");
		}	
	}
	
	public static void printInventorySummary()
	{
		print("<-----------------------START---------------------------->");
		for(int i = 0; i < inventory.size(); i++)
		{
			print(inventory.get(i).getTag() + " | " + inventory.get(i).getName() + " | " + inventory.get(i).getLocation()  + " | " + inventory.get(i).getAvailability() + " | " + inventory.get(i).getRentedBy()  + " | " +  inventory.get(i).getComment());
			print("------------------------------------------");
		}
		print("<-----------------------END------------------------------>\n");
		
		giveOptions();
	}
	//Prints all stored inventory information
	public static void printInventory()
	{
		print("<-----------------------START---------------------------->");
		for(int i = 0; i < inventory.size(); i++)
		{	
			print(inventory.get(i).toString());	
			print("--------------------------------------------------------");
		}
		
		print("<-----------------------END------------------------------>");
		print("");
		
		giveOptions();
	}
	
	//Prints the item info for a specified inventory index (passing parameter i) 
	public static void getItem(int i)
	{	
		print("\n---------------------------------------------------");
		print(inventory.get(i).toString());
		print("---------------------------------------------------\n");
	}
	
	//console print shortcut
	public static void print(String text)
	{
		if(!text.equals(""))
			System.out.println(text);
		else
			System.out.println();
	}
	
	//Use this for any "other" options. 1 liners rock
	public static String other(String text, String var)
	{
		do
		{
			print(text); //prints unique output message
			var = in.nextLine(); //passed in variable
			
			if(var.equals(""))
				break;
			else
			{
				print("Is '" + var + "' correct? y/n: ");
				userInput = in.nextLine();
				userInput = checkYN(userInput);
			}								
		}
		while(userInput.equalsIgnoreCase("n"));
		
		return var;
	}
	
	public static String allVariables()
	{
		return "Item Type" + "\tTag" + "\tType" + "\tName" + "\tSerial"  + "\tModel" + "\tSize" + "\tUser"  + "\tBadge" + "\tHost Name" + "\tDomain"  + "\tMake" + "\tOS" + "\tExit Date" + "\tRecieved" + "\tGiven" + "\teSign" + "\tService Request" + "\tData Backup" + "\tData Location" + "\tLocation" + "\tAvailable" + "\tRented By"+ "\tComment";
	}
}
