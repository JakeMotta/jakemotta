package inventory;

import java.util.Scanner;

public class HDD extends Item{
	
	private String itemType;
	private String tag;
	private String name;
	private String size;
	private String user;
	private String badge;
	private String hostName;
	private String domain;
	private String OS; 
	private String exitDate;
	private boolean dataBackup;
	private String dataLocation;
	private String location;
	private boolean available;
	private String rentedBy;
	private String comment;
	 
	
	static Scanner in = new Scanner(System.in); //Input Scanner
	static String userInput;
	
	public HDD(String myItemType, String myTag, String myName, String mySize, String myUser, String myBadge, String myHostName, String myDomain, String myOS, String myExitDate, boolean myDataBackup, String myDataLocation, String myLocation, boolean myAvailable, String myRentedBy, String myComment)
	{
		super(myItemType, myTag, myName, myLocation, myAvailable, myRentedBy, myComment);
		
		//reset all global variables
		itemType=tag=name=size=user=badge=hostName=domain=OS=exitDate=location=comment=null;
		
		this.itemType = super.itemType;
		this.tag = super.tag;
		this.name = super.name;
		this.size = mySize;
		this.user = myUser;
		this.badge = myBadge;
		this.hostName = myHostName;
		this.domain = myDomain;
		this.OS = myOS;
		this.exitDate = myExitDate;
		this.dataBackup = myDataBackup;
		this.dataLocation = myDataLocation;
		this.location = super.location;
		this.available = super.available;
		this.rentedBy = super.rentedBy;
		this.comment = super.comment;
	}
	
public String getItemType() {itemType = super.getItemType(); return itemType;}
	
	public String getTag() {tag = super.getTag(); return tag;}
	
	public String getName() {return name;}
	
	public String getSize() {return size;}
			
	public String getUser() {return user;}
	
	public String getBadge() {return badge;}
	
	public String getHostName() {return hostName;}
	
	public String getDomain() {return domain;}
	
	public String getOS() {return OS;}
	
	public String getExitDate() {return exitDate;}
	
	public Boolean getDataBackup() {return dataBackup;}

	public String getDataLocation() {return dataLocation;}
	
	public String getLocation() {location = super.getLocation(); return location;}
	
	//Need to set local variable to super varialbe, otherwise it doesn't update during current runtime
	public Boolean getAvailability() {available = super.getAvailability(); return available;}
	
	public String getRentedBy() {rentedBy = super.getRentedBy(); return rentedBy;}
		
	public String getComment() {comment = super.getComment(); return comment;}
	
	public void setItemType(String myType)
	{
		super.setItemType(myType);
	}
	
	@Override
	public void setTag()
	{
		super.setTag();
	}

	public void setName()
	{
		Main.print("\nEnter a name for the HDD: (Example: Jake's M73 HDD) ");
		this.name = in.nextLine();
			
		if(this.name.equals(""))
			this.name = null;
	}
	
	public void setSize()
	{
		Main.print("\nWhat is the size of the HDD? (20GB, 500GB, 1TB): ");
		this.size = in.nextLine();
		
		boolean hasChar = false;
		if(this.size.equals(""))
			this.size = null;
		else
		{
			for(int i = 0; i < this.size.length(); i++)
			{
				char ch = this.size.charAt(i);
				if(Character.isLetter(ch))
					hasChar = true;
			}
			
			if(!hasChar)
			{
				Main.print("\nPlease select an option below: ");
				Main.print("1. " + size + "GB?");
				Main.print("2. " + size + "TB?");
				Main.print("3. Other");
				
				userInput = in.nextLine();
				Main.checkNumber(userInput, 3);
				
				switch(userInput)
				{
					case "1": this.size = this.size + "GB"; break;
					case "2": this.size = this.size + "TB"; break;
					case "3": setSize(); break;
					default: this.size = null; break;
				}
			}
			else
				this.size = this.size.toUpperCase();
		}
	}

	public void setUser()
	{	
		Main.print("\nIs there a user associated with this HDD? y/n: ");
		userInput = in.nextLine();
		
		if(userInput.equals(""))
			this.user = null;
		else
		{
			userInput = Main.checkYN(userInput);
			
			if(userInput.equalsIgnoreCase("y"))
			{
				do
				{
					Main.print("Enter the name of the user: ");
					this.user = in.nextLine();
										
					Main.print("Is '" + this.user + "' correct? y/n: ");
					userInput = in.nextLine();
					userInput = Main.checkYN(userInput);
				}
				while(userInput.equalsIgnoreCase("n"));
			}
			else
				this.user = null;
		}
	}
	
	public void setBadge()
	{
		if(this.user == null)
			this.badge = null;
		else
		{
			do
			{
				Main.print("\nEnter user's badge number: ");
				this.badge = in.nextLine();
				
				Main.print("Is '" + this.badge.toUpperCase() + "' correct? y/n: ");
				userInput = in.nextLine();
				userInput = Main.checkYN(userInput);
			}
			while(userInput.equalsIgnoreCase("n") || userInput.equalsIgnoreCase(""));
			
			this.badge = this.badge.toUpperCase();
		}
	}

	public void setHostName()
	{		
		do
		{
			Main.print("\nWhat is the hostname of the system this HDD originated from?: ");
			this.hostName = in.nextLine();
			
			if(!(this.hostName.equalsIgnoreCase("")))
			{
				Main.print("Is '" + this.hostName.toUpperCase() + "' correct? y/n: ");
				userInput = in.nextLine();
				userInput = Main.checkYN(userInput);
				
				if(userInput.equalsIgnoreCase("y"))
					this.hostName = this.hostName.toUpperCase();
				else
					setHostName();
			}
			else
			{
				this.hostName = null;
				break;
			}
		}
		while(userInput.equalsIgnoreCase("n"));
	}

	public void setDomain()
	{
		Main.print("\nIs this system in a domain? y/n: ");
		userInput = in.nextLine();
		
		if(userInput.equals(""))
			this.domain = null;
		else if(userInput.equalsIgnoreCase("y"))
		{
			userInput = Main.checkYN(userInput);
			
			if(userInput.equalsIgnoreCase("y"))
			{
				Main.print("\nEnter the domain: ");
				Main.print("1. mchp-main.com");
				Main.print("2. workgroup");
				Main.print("3. Other");
					
				userInput = in.nextLine();
				userInput = Main.checkNumber(userInput, 3);
				
				switch (userInput)
				{
					case "1": this.domain = "mchp-main.com"; break;
					case "2": this.domain = "workgroup"; break;
					case "3":
					{
						do
						{
							Main.print("Enter domain: ");
							this.domain = in.nextLine();
							
							Main.print("Is '" + this.domain + "' correct? y/n: ");
							userInput = in.nextLine();
							userInput = Main.checkYN(userInput);
						}
						while(userInput.equalsIgnoreCase("n"));
					}
				}
			}
		}
		else
			this.domain = "workgroup";
	}
	
	public void setOS()
	{
		Main.print("\nWhat is the system's OS?");

		Main.print("1. Windows 7 Pro SP1");
		Main.print("2. Windows XP Pro SP1");
		Main.print("3. Windows XP Pro SP3");
		Main.print("4. Other");
			
		userInput = in.nextLine();
		userInput = Main.checkNumber(userInput, 4);
				
		if(!(userInput == null))
		{
			if(userInput.equalsIgnoreCase("4"))
			{
				do
				{
					Main.print("Please specify the system's OS: ");
					this.OS = in.nextLine();

					Main.print("Is '" + this.OS + "' correct? y/n: ");
					userInput = in.nextLine();
					userInput = Main.checkYN(userInput);
				}
				while(userInput.equalsIgnoreCase("n"));		
			}
			else
			{
				switch(userInput)
				{
					case "1": this.OS = "Windows 7 Pro SP1"; break;
					case "2": this.OS = "Windows XP Pro SP1"; break;
					case "3": this.OS = "Windows XP Pro SP3"; break;
				}
			}
				
			Main.print("Is the system 32bit or 64 bit? ");
			Main.print("1. 32bit");
			Main.print("2. 64bit");
				
			userInput = in.nextLine();
			userInput = Main.checkNumber(userInput, 2);
				
			if(!(userInput == null))
			{
				switch(userInput)
				{
					case "1": this.OS += " - 32bit"; break;
					case "2": this.OS += " - 64bit"; break;
				}
			}

			Main.print(this.OS + " : Is this correct (y/n)?  ");
			userInput = in.nextLine();
			userInput = Main.checkYN(userInput);
			
			if(userInput.equalsIgnoreCase("n"))
				setOS();
		}
		else
			this.OS = null;
	}
	
	public void setExitDate()
	{
		String month, day = null, year = null, temp;
		
		Main.print("\nIs this user Alumni? y/n: ");
		userInput = in.nextLine();
		
		Main.checkYN(userInput);
		
		if(userInput.equalsIgnoreCase("y"))
		{
			Main.print("\nEnter the exit month (1-12): ");
			month = in.nextLine();	
			month = Main.checkNumber(month, 12);
								
			if(month.length() < 2)
			{
				temp = month;
				month = "0" + temp;
			}
					
			Main.print("\nEnter the exit day (1-31): ");
			day = in.nextLine();
			day = Main.checkNumber(day,31);
				
			if(day.length() < 2)
			{
				temp = day;
				day = "0" + temp;
			}
					
			Main.print("\nEnter the exit year (14, 15..): ");
			year = in.nextLine();
			year = Main.checkNumber(year, 18);
					
			if(year.length() < 2)
			{
				temp = year;
				year = "0" + temp;
			}
					
			this.exitDate = month + "/" + day + "/" + year;
					
			Main.print("Is " + this.exitDate + " correct? y/n");
			userInput = in.nextLine();
			userInput = Main.checkYN(userInput);
				
			if(userInput.equalsIgnoreCase("n"))
				setExitDate();
		}	
		else
			this.exitDate = null;	
	}
	
	public void setDataBackup()
	{
		Main.print("\nHas this HDD already been backed up? y/n: ");
		userInput = in.nextLine();
		Main.checkYN(userInput);
		
		if(userInput.equalsIgnoreCase("y"))
			dataBackup = true;		
		else
			dataBackup = false;
	}
	
	public void setDataLocation()
	{
		Main.print("\nPlease specify data backup location: ");
		dataLocation = in.nextLine();	
	}
	
	@Override
	public void setLocation()
	{
		super.setLocation();
	}
	
	@Override
	public void setAvailable(String isAvailable)
	{
		super.setAvailable(isAvailable);
	}
	
	@Override
	public void setRentedBy()
	{
		super.setRentedBy();
	}
	
	@Override
	public void setRentedByDefault()
	{
		super.setRentedByDefault();
	}

	@Override
	public void setComment()
	{
		super.setComment();				
	}
	
	@Override
	public String toString() {
		return "\tTag: " + tag + "\n" + "\tName: " + name + "\n" + "\tSize: " + size + "\n"  + "\tUser: " + user + "\n" + "\tBadge: " + badge +"\n" + "\tHost Name: " + hostName + "\n" + "\tDomain: " + domain + "\n" + "\tOS: " + OS + "\n" + "\tExit Date: " + exitDate + "\n" + "\tData Backup: " + dataBackup + "\n" + "\tData Location: " + dataLocation + "\n" + "\tLocation: " + location + "\n" + "\tAvailable: " + available + "\n" + "\tRented By: " + rentedBy + "\n" + "\tComment: " + comment + "\n";
	}  

}
