package inventory;

import java.util.Scanner;

/**
 * 
 * @author Jake
 *
 *When adding a parameter, be sure to update ALL of the following methods. 
 *
 *Main:
 *	-global variable (add the new parameter)
 *	-currentItem()
 *	-reviewComputer()
 *	-addComputer()
 *	-nullReset()
 *	-overWriteComputer()
 *	-loadItems()
 *	-modify()
 *	
 *Computer:
 *	-global variable
 *	-Constructor parameter
 *	-get method
 *	-set method
 *	-toString()
 *
 */

public class Computer extends Item {
	
	private String itemType;
	private String tag;
	private String type;
	private String name;
	private String serial;
	private String model;
	private String user;
	private String badge;
	private String hostName;
	private String domain;
	private String make;
	private String OS; 
	private String recieved;
	private String given;
	private String eSign;
	private String serviceRequest;
	private String location;
	private boolean available; 
	private String rentedBy;
	private String comment;
	
	static Scanner in = new Scanner(System.in); //Input Scanner
	static String userInput;
	
	public Computer(String myItemType, String myTag, String myType, String myName, String mySerial, String myModel, String myUser, String myBadge, String myHostName, String myDomain, String myMake, String myOS, String myRecieved, String myGiven, String myESign, String myServiceRequest, String myLocation, boolean myAvailable, String myRentedBy, String myComment)
	{
		super(myItemType, myTag, myName, myLocation, myAvailable, myRentedBy, myComment);
		
		//reset all global variables
		itemType=tag=type=name=serial=model=user=badge=hostName=make=OS=recieved=given=eSign=serviceRequest=location=myRentedBy=comment=null;
		
		this.itemType = super.itemType;
		this.tag = super.tag;
		this.type = myType;
		this.name = super.name;
		this.serial = mySerial;
		this.model = myModel;
		this.user = myUser;
		this.badge = myBadge;
		this.hostName = myHostName;
		this.domain = myDomain;
		this.OS = myOS;
		this.recieved = myRecieved;
		this.given = myGiven;
		this.eSign = myESign;
		this.serviceRequest = myServiceRequest;
		this.location = super.location;
		this.available = super.available;
		this.rentedBy = super.rentedBy;
		this.comment = super.comment;	
	}
	
	public String getItemType() {itemType = super.getItemType(); return itemType;}
	
	public String getTag() {tag = super.getTag(); return tag;}
	
	public String getName() {name = super.getName(); return name;}
		
	public String getType() {return type;}
			
	public String getSerial() {return serial;}
	
	public String getModel() {return model;}
	
	public String getUser() {return user;}
	
	public String getBadge() {return badge;}
	
	public String getHostName() {return hostName;}
	
	public String getDomain() {return domain;}
	
	public String getMake() {return make;}
	
	public String getOS() {return OS;}
	
	public String getRecieved() {return recieved;}
	
	public String getGiven() {return given;}
	
	public String getESign() {return eSign;}
	
	public String getServiceRequest() {return serviceRequest;}
	
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

	@Override
	public void setName()
	{
		super.setName();
	}
		
	public void setType()
	{		
		Main.print("\nEnter the type of product: ");
		Main.print("1. Laptop");
		Main.print("2. Desktop");
		Main.print("3. Tablet");
		Main.print("4. Other");
		
		userInput = in.nextLine();
		userInput = Main.checkNumber(userInput, 4);
			
		if(!(userInput == null))
		{			
			//catches a wrong input value on product type
			switch (userInput)
			{
				case "1": this.type = "Laptop"; break; 
				case "2": this.type = "Desktop"; break; 			
				case "3": this.type = "Tablet"; break; 			
				case "4": //Have user define the type of product if it's not already predefined
				{
					do
					{
						Main.print("Please specify the type of device: ");
						this.type = in.nextLine();
						Main.print("Is '" + this.type + "' correct? y/n: ");
						userInput = in.nextLine();
						userInput = Main.checkYN(userInput);
					}
					while(userInput.equalsIgnoreCase("n"));	
					break;
				}
				default: Main.print("There has been an error! Sorry about that...");
			}
		}
		else
			this.type = null;
	}
	
	public void setSerial()
	{		
		Main.print("\nEnter the product's serial number: ");
		this.serial = in.nextLine();
			
		if(this.serial.equals(""))
			this.serial = null;
		else
		{
			Main.print("Is '" + this.serial + "' correct? y/n: ");
			userInput = in.nextLine();
			userInput = Main.checkYN(userInput);
			
			if(userInput.equalsIgnoreCase("n"))
				setSerial();
		}			
	}
	
	public void setModel()
	{	
		Main.print("\nEnter the product's model number: ");
		this.model = in.nextLine();
			
		if(this.model.equals(""))
			this.model = null;
		else
		{
			Main.print("Is '" + this.model + "' correct? y/n: ");
			userInput = in.nextLine();
			userInput = Main.checkYN(userInput);
			
			if(userInput.equalsIgnoreCase("n"))
				setModel();
		}
	}
	
	public void setUser()
	{	
		Main.print("\nIs there anyone assigned to this system? y/n: ");
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
			while(userInput.equalsIgnoreCase("n"));
			
			this.badge = this.badge.toUpperCase();
		}
	}

	public void setHostName()
	{
		Main.print("\nDoes this system have a host name? y/n: ");
		userInput = in.nextLine();
		
		if(userInput.equals(""))
			this.hostName = null;
		else
		{
			userInput = Main.checkYN(userInput);
			
			if(userInput.equalsIgnoreCase("y"))
			{
				do
				{
					Main.print("\nWhat is this system's host name? ");
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
				
				this.hostName =  this.hostName.toUpperCase();
			}	
		}	
	}

	public void setDomain()
	{
		Main.print("\nIs this system in a domain? y/n: ");
		userInput = in.nextLine();
		
		if(userInput.equals(""))
			this.domain = "workgroup";
		else
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
	}
	
	public void setMake()
	{
		Main.print("\nWhat is the system's make? ");
		
		if(this.type != null)
		{
			if(this.type.equals("Laptop")) //Laptop system
			{
				Main.print("1. X1");
				Main.print("2. T440S");
				Main.print("3. W540");
				Main.print("4. MAC OSX");
				Main.print("5. Other");
				
				this.make = in.nextLine();
				this.make = Main.checkNumber(this.make, 5);
			}
			else if(this.type.equals("Desktop")) //Desktop system
			{
				Main.print("1. M73");
				Main.print("2. OptiPlex");
				Main.print("3. Other");
				
				this.make = in.nextLine();
				this.make = Main.checkNumber(this.make, 3);
			}
			else //Tablet or other device
			{
				this.make = Main.other("Type make below: ", this.make);
			}
		
			if(this.make.equals(""))
				this.make = null;
			else
			{			
					if(this.type.equals("Laptop"))
					{
						switch (this.make)
						{
							case "1": this.make = "X1"; break;
							case "2": this.make = "T440S"; break;
							case "3": this.make = "W540"; break;
							case "4": this.make = "MAC OSX"; break;
							case "5": 
							{
								this.make = Main.other("Type make below: ", this.make);
							}
						}
					}
					else if(this.type.equals("Desktop"))
					{
						switch (this.make)
						{
							case "1": this.make = "M73"; break;
							case "2": this.make = "OptiPlex"; break;
							case "3": 
							{
								this.make = Main.other("Type make below: ", this.make);
							}
						}
					}
					else{};
			}
		}
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
	
	public void setRecieved()
	{
		String month, day = null, year = null, temp;
		
		Main.print("\nEnter the month this system was recieved (1-12): ");
		month = in.nextLine();
		month = Main.checkNumber(month, 12);
				
		if(!(month == null))
		{				
			if(month.length() < 2)
			{
				temp = month;
				month = "0" + temp;
			}
				
			Main.print("\nEnter the day this system was recieved (1-31): ");
			day = in.nextLine();
			day = Main.checkNumber(day,31);
				
			if(day.length() < 2)
			{
				temp = day;
				day = "0" + temp;
			}
				
			Main.print("\nEnter the year this system was recieved (14, 15..): ");
			year = in.nextLine();
			year = Main.checkNumber(year, 18);
				
			if(year.length() < 2)
			{
				temp = year;
				year = "0" + temp;
			}
				
			this.recieved = month + "/" + day + "/" + year;
				
			Main.print("Is " + this.recieved + " correct? y/n");
			userInput = in.nextLine();
			userInput = Main.checkYN(userInput);
			
			if(userInput.equalsIgnoreCase("n"))
				setRecieved();
		}
		else
			this.recieved = null;
	}
	
	public void setGiven()
	{
		String month, day = null, year = null, temp;

		if(getUser() == null)
			this.given = null;
		else
		{
			Main.print("\nEnter the month this system was assigned to a user (1-12): ");
			month = in.nextLine();	
			month = Main.checkNumber(month, 12);
				
			if(!(month == null))
			{					
				if(month.length() < 2)
				{
					temp = month;
					month = "0" + temp;
				}
					
				Main.print("\nEnter the day this system was assigned to a user (1-31): ");
				day = in.nextLine();
				day = Main.checkNumber(day,31);
					
				if(day.length() < 2)
				{
					temp = day;
					day = "0" + temp;
				}
					
				Main.print("\nEnter the year this system was assigned to a user (14, 15..): ");
				year = in.nextLine();
				year = Main.checkNumber(year, 18);
					
				if(year.length() < 2)
				{
					temp = year;
					year = "0" + temp;
				}
					
				this.given = month + "/" + day + "/" + year;
					
				Main.print("Is " + this.given + " correct? y/n");
				userInput = in.nextLine();
				userInput = Main.checkYN(userInput);
				
				if(userInput.equalsIgnoreCase("n"))
					setGiven();
			}
		}	
	}
	
	public void setESign()
	{
		Main.print("\nDoes this system have an eSign number? y/n: ");
		userInput = in.nextLine();
		
		if(userInput.equals(""))
			this.eSign = null;
		else
		{
			userInput = Main.checkYN(userInput);
			
			if(userInput.equalsIgnoreCase("y"))
			{
				Main.print("Enter eSign number: ");
				do
				{
					this.eSign = in.nextLine();
					Main.print("Is '" + this.eSign + "' correct? y/n: ");
					userInput = in.nextLine();
					userInput = Main.checkYN(userInput);
				}
				while(userInput.equalsIgnoreCase("n"));
			}
			else
				this.eSign = null;
		}	
	}
	
	public void setServiceRequest()
	{
		Main.print("\nDoes this system have a Service Desk number? y/n: ");
		userInput = in.nextLine();
		
		if(userInput.equals(""))
			this.serviceRequest = null;
		else
		{
			userInput = Main.checkYN(userInput);
			
			if(userInput.equalsIgnoreCase("y"))
			{
				Main.print("Enter Service Desk number: ");
				do
				{
					this.serviceRequest = in.nextLine();
					Main.print("Is '" + this.serviceRequest + "' correct? y/n: ");
					userInput = in.nextLine();
					userInput = Main.checkYN(userInput);
				}
				while(userInput.equalsIgnoreCase("n"));
			}
			else
				this.serviceRequest = null;
		}
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
		if(this.badge != null)
			this.rentedBy = this.badge;
		else
			this.recieved = "dammit";
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
		return "\tTag: " + tag + "\n" + "\tType: " + type + "\n" + "\tName: " + name + "\n" + "\tSerial: " + serial + "\n" + "\tModel: " + model + "\n" + "\tUser: " + user + "\n" + "\tBadge: " + badge +"\n" + "\tHost Name: " + hostName + "\n" + "\tDomain: " + domain + "\n" + "\tMake: " + make + "\n" + "\tOS: " + OS + "\n" + "\tRecieved: " + recieved + "\n" + "\tGiven: " + given + "\n" + "\teSign: " + eSign + "\n" + "\tService Request: " + serviceRequest + "\n" + "\tLocation: " + location + "\n" + "\tAvailable: " + available + "\n" + "\tRented By: " + rentedBy + "\n" + "\tComment: " + comment + "\n";
	}  

}
