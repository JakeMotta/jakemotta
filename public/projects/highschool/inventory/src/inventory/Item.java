package inventory;

import java.util.Scanner;

public class Item {
	
	protected String itemType;
	protected String tag;
	protected String name;
	protected String location;
	protected boolean available; 
	protected String rentedBy;
	protected String comment;
	
	static Scanner in = new Scanner(System.in); //Input Scanner
	static String userInput;
	
	public Item(String myItemType, String myTag, String myName, String myLocation,  boolean myAvailable, String myRentedBy, String myComment)
	{
		itemType=tag=name=location=comment=null;
		this.itemType = myItemType;
		this.tag = myTag;
		this.name = myName;
		this.location = myLocation;
		this.rentedBy= myRentedBy;
		this.available = myAvailable;
		this.comment = myComment;	
	}
	
	public String getItemType() {return itemType;}
	
	public String getTag() {return tag;}
		
	public String getName() {return name;}
	
	public String getLocation() {return location;}
	
	public Boolean getAvailability() {return available;}
	
	public String getRentedBy() {return rentedBy;}
	
	public String getComment() {return comment;}
		
	public void setItemType(String myType)
	{
		this.itemType = myType;
	}
	
	public void setTag()
	{
		Main.print("\nEnter unique tag for item (scan tag): ");
		this.tag = in.nextLine();

		if(this.tag.equals(""))
			this.tag = null;
	}
		
	public void setName()
	{
		Main.print("\nEnter the name of the product: ");
		this.name = in.nextLine();
			
		if(this.name.equals(""))
			this.name = null;
	}
		
	public void setLocation()
	{
		Main.print("\nEnter the rack number below: ");
		Main.print("1. Rack 1");
		Main.print("2. Rack 2");
		Main.print("3. Rack 3");
		Main.print("4. Ground");
		Main.print("5. Other");
		
		this.location = in.nextLine();
		this.location = Main.checkNumber(this.location, 5);
			
		if(!(this.location == null))
		{		
			Main.print("");
				
			String shelf = "";
			String other = null;
				
			//ask for shelf number if it's on a shelf (1-3)
			if(!this.location.equals("4") && !this.location.equals("5"))
			{
				Main.print("\nEnter the shelf number below:");
			}			
						
			//Give the shelf rows or message options per rack
			switch (this.location)
			{
				case "1":
				{
					for(int i = 1; i <= 5; i++)
						Main.print(i + ". Shelf " + i);
					shelf = in.nextLine();
					shelf = Main.checkNumber(shelf, 5);
						
					break;
				}
				case "2":
				{
					for(int i = 1; i <= 4; i++)
						Main.print(i + ". Shelf " + i);
					shelf = in.nextLine();
					shelf = Main.checkNumber(shelf, 4);
						
					break;
				}
				case "3":
				{
					for(int i = 1; i <= 4; i++)
						Main.print(i + ". Shelf " + i);
					shelf = in.nextLine();
					shelf = Main.checkNumber(shelf, 4);
						
					break;
				}
				case "4": break;
				case "5":
				{
					Main.print("Enter a location to find this item: ");
					other = in.nextLine();
					break;
				}		
			}
				
			if(other != null)
				this.location = other;
			else if(this.location.equals("4"))
				this.location = "Ground";
			else
				this.location = "Rack " + this.location + " - Shelf " + shelf;
		}
	}
	
	public void setAvailable(String isAvailable)
	{
		//Not enter key, but passing no parameter as a null
		if(isAvailable == null)
		{			
			Main.print("\nIs this item available? y/n: ");
			userInput = in.nextLine();

			//if user wants to skip parameter
			if(userInput.equals(""))
				this.available = true;	
			else
			{
				userInput = Main.checkYN(userInput);
				
				if(userInput.equalsIgnoreCase("y"))
					this.available = true;
				else
					this.available = false;
			}
		}	
		else if(isAvailable.equalsIgnoreCase("true"))
			this.available = true;
		else
			this.available = false;	
	}
	
	public void setRentedBy()
	{
		Main.print("\nEnter badge# of user checking out this item: ");
		this.rentedBy = in.nextLine();
		
		if(rentedBy.equals(""))
			this.rentedBy = null;
		else
		{
			Main.print("Is '" + this.rentedBy.toUpperCase() + "' correct? y/n: ");
			userInput = in.nextLine();
			
			userInput = Main.checkYN(userInput);
			
			if(userInput.equalsIgnoreCase("y"))
				this.rentedBy = this.rentedBy.toUpperCase();	
			else
				setRentedBy();
		}
	}
	
	public void setRentedByDefault()
	{
		this.rentedBy = null;
	}

	public void setComment()
	{
		Main.print("\nDo you have any comments to make? y/n: ");
		userInput = in.nextLine();
			
		if(userInput.equals(""))
			this.comment = "No Comment";
		else
		{
			//catches a wrong input value on user input for y/n
			userInput = Main.checkYN(userInput);
				
			if(userInput.equalsIgnoreCase("y"))
				this.comment = in.nextLine();		
			else
				this.comment = "No Comment";
		}					
	}
			
	@Override
	public String toString() {
		return "\tTag: " + tag + "\n" + "\tName: " + name + "\n" + "\tLocation: " + location + "\n" + "\tAvailable: " + available + "\n" + "\tRented By: " + rentedBy + "\n" + "\tComment: " + comment;
	}

}
