# Safe Routes
The navigation app that prioritizes safety. Erase doubts with Safe Routes.
## Watch our team's final presentation of the app here!
https://youtu.be/3sWeisjQnYk?t=2340
## Features
**Geocoding**

Search for your origin and destination by typing in a simple description. Powered by the Google Maps Geocoding API (https://developers.google.com/maps/documentation/geocoding/start)

**Routes**
- Choose from multiple routes delivered by the Google Maps Directions API (https://developers.google.com/maps/documentation/directions/intro)
- Search for routes that avoid highways with just one tap
- View historic accident and fatality tallies

**Step-by-step navigation**
- View the duration, length, and a short description of each step of your route
- See the step up close on the map

**Safety Ratings**
- Each route's safety is analyzed and given a letter grade ranging from F to A+
- Influenced by historic fatalities along a route from the NHTSA FARS API (https://crashviewer.nhtsa.dot.gov/CrashAPI)
- Influenced by live traffic events from the MapQuest Traffic API (https://developer.mapquest.com/documentation/traffic-api/)

**Eye Candy**

From the color scheme to the layout, every bit of the user interface was designed to look as beautiful as it is functional.

**Built with React Native**

## Authors
- Ishani Chowdhury
- Deesha Kumbham
- Leo Bala

## Objective:
Safe Routes is a mobile application that determines a driving route between two locations, taking into account the safety of the route options, rather than just the time of the trip. Safe Routes will take into account a variety of factors that may affect the safety of a route, such as historical crash data, traffic, and poor road conditions. At the end of the trip, the user can rate and save routes to improve future recommended routes. This app is aimed at preventing car accidents and would be especially useful for inexperienced drivers wanting to avoid difficult driving conditions.
## Minimum viable product goals:
-	The application presents multiple possible routes between two locations
-	A safety rating is assigned to each potential route by analyzing previous crash data along the route, the speed limits, and current traffic
-	The user is able to choose a route after viewing the safety rating and the expected length of the trip
-	The user can store and rate a route for future reference
## Stretch Goals:
- Allow for account creation and user authentication
- Allow users to share routes with other users
- Consider weather conditions in analysis
- Consider time of day in analysis
## Learning Resources:
-   [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
-	[Choosing between React Native and Flutter](https://hackr.io/blog/react-native-vs-flutter)
-	[Getting started with React](https://facebook.github.io/react-native/docs/getting-started)
-	[Getting started with Flutter](https://flutter.dev/docs/get-started/install)
-	[Comparing top databases](https://dzone.com/articles/firebase-vs-mongodb-which-database-to-use-for-your)
-	[Connecting Flutter and Firebase](https://firebase.google.com/docs/flutter/setup)
-	[Connecting React Native and Firebase](https://blog.jscrambler.com/integrating-firebase-with-react-native/)
-	[Choosing between Map APIs](https://madappgang.com/blog/mapbox-vs-google-maps-choosing-a-map-for-your-app)
-	[Guide to the Google Directions API](https://developers.google.com/maps/documentation/directions/intro)
-	[Overview of making API calls](https://snipcart.com/blog/apis-integration-usage-benefits) (will be useful for making API calls to the NHTSA database, which has limited documentation)
## Links to development tools
**Potential IDEs:**
- [Android Studio](https://developer.android.com/studio)
- [Visual Studio Code](https://code.visualstudio.com/)

**Potential mobile application frameworks:**
- [React Native](https://facebook.github.io/react-native/)
- [Flutter](https://flutter.dev/)

**Potential Map APIs:**
-	[Google Maps Platform](https://cloud.google.com/maps-platform/)
    - Includes variety of map-related APIs, such as a Directions API and a Roads API (view all of them with descriptions at https://developers.google.com/maps/documentation/api-picker)
    - Note: set pricing quota on your account in case you go over the $200 of free Google Maps Platform credit
-	[Mapbox API](https://docs.mapbox.com/api/)
    - More customizable than Google Maps

**Backend:**
- [Firebase](https://firebase.google.com/)
    - Potential database for storing user information
    - Has been used by many project teams in the past
    - First optional workshop will be about Firebase
- [NHTSA Crash Data API](https://crashviewer.nhtsa.dot.gov/CrashAPI)
    - Allows you to retrieve government car crash data according to different parameters (you will most likely use the "Get Crashes By Location" query)
