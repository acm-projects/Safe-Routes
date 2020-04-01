import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;


public class Test 
{
	public static void main(String []args)
	{
		Scanner sc = new Scanner(System.in);
		
		System.out.println("What is the state number based on alphabetical order");
		String statenum=sc.next();
		
		System.out.println("What is the county number based on alphabetical order");
		String countynum=sc.next();
				
		getCrashes(statenum,countynum);
	}

	public static void getCrashes(String state, String county)
	{
		
		  String input=" ";
	  try
	  {
		  //create endpoint 
    	  String endpoint = "https://crashviewer.nhtsa.dot.gov/CrashAPI/";
      	  endpoint += "crashes/GetCrashesByLocation?fromCaseYear=2018&toCaseYear=2019&state=";
      	  endpoint += state;
      	  endpoint += "&county=";
      	  endpoint += county;
      	  endpoint += "&format=json";
      	  
      	  //based on powerpoint, create URL and HTTP objects, set request method
      	  //then create a BR and SB object, and put the input into a String 
      	  URL url = new URL(endpoint);
          HttpURLConnection con = (HttpURLConnection) url.openConnection();
          con.setRequestMethod("GET");
          
          /*BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
          StringBuffer resultbuff = new StringBuffer();
          
          String input;
          while((input=in.readLine()) != null)
          {
          	resultbuff.append(input);
          }
          in.close();
          con.disconnect();*/
          
          con.connect();
          int code = con.getResponseCode();
          //code error checking to get response code 
          if(code != 200)
        	  System.out.println("Code is " + code);
          else
          {
        	  Scanner sc = new Scanner(url.openStream());
              while(sc.hasNext())
              {
            	  input+=sc.nextLine();
              }
              sc.close();
          }
          
          
          
          //parse json array and get address for each crash 
          JSONParser parser = new JSONParser();
          JSONObject obj1 = (JSONObject)parser.parse(input);
          JSONArray results = (JSONArray)obj1.get("Results");
          for(int i=0; i<results.size(); i++)
          {
        	  JSONObject obj2 = (JSONObject)results.get(i);
        	  String address = (String)obj2.get("TWAY_ID2");
        	  System.out.println(address);
          }
          //String result = resultbuff.toString();
          
          //parse String through Json parser, and then invoke JSon tree model to return String 
          /*JsonElement jsonTree=parser.parse(result);
          if(jsonTree.isJsonObject())
          {
          	JsonObject jsonObject = jsonTree.getAsJsonObject();
          	JsonElement count = jsonObject.get("Results");     
          	
          	String crashes=count.toString();
          	JsonElement jsonTree2=parser.parse(crashes);
        	if(jsonTree2.isJsonObject())
        	{
        		JsonObject jsonObject2 = jsonTree2.getAsJsonObject();
            	JsonElement road = jsonObject2.get("TWAY_ID2");
            	
            	String street= road.toString();
            	return street;
        	}
        	else
        	{
        		return "error else";
        	}
          }
          else
          {
        	  return "error else";
          }*/
          
          
		
          con.disconnect();
	  }
	  catch(Exception e1)
	  {
		  e1.printStackTrace();
		  System.out.println("error");
	  }

	}
}
