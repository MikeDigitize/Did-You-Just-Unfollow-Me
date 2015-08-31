# Did You Just Unfollow Me?!
A standalone Twitter app that keeps track of which of your (or any other user's) Twitter friends follow you back and which of your followers you aren't friends with, giving you the option to <strong>unfollow</strong> any friends who don't follow you back, and <strong>follow</strong> any followers that you aren't currently following. Clear as mud? Thought so.

## The Problem
I'm quite a friendly, sociable guy on Twitter. If you follow me and are connected in some way to the web or technology chances are I'll follow you back. One day I looked through my list of Twitter friends and was surprised to see how many people had followed me and then after I'd followed them back had later unfollowed me. Since Twitter gives you no means to keep track of this happening I thought I'd build something to do it myself.

## Usage
Enter a Twitter handle e.g. @Your-Twitter-Name and hit search. The tool will search through that user's friends list and look for friends who don't follow that user back, and then search their followers for ones the user doesn't follow in return.

## Setup
This is a standalone application that needs to be ran from your local machine. I've written the setup guide assuming no prior knowledge about JavaScript or web development, so hopefully any Twitter user will find it easy to follow.

### Install Node.js
First thing's first. This is a web page application which needs a web server to run from so it can connect to Twitter and access all that sweet sweet Twitter data. This app uses Node.js as the server so if you don't already have it installed, go do it [now](https://nodejs.org/download/).

### Create a Twitter app
So that's the web server sorted. Now you need to hook this up to your Twitter account so you can unfollow / follow users. To do this you need to create your own Twitter app. Log into Twitter then jump over to [here](https://apps.twitter.com/). Now follow these steps:

1. Click the create new app button.
2. If you haven't got a mobile number linked to your Twitter account you need to do that now [here](https://twitter.com/settings/devices). This is just for security reasons.
3. Back on the create new app page fill in the required fields firstly by giving your app a name e.g. My Twitter app.
4. Give it a description e.g. An app to keep track of my friends / followers.
5. Give it a URL. If you have a website you can enter it here, if not just make something up e.g. http://www.myfakewebsite.com
6. Tick the agree option under the Ts and Cs and hit the create app button.

### Getting the access token
Awesome! You now have an app registered to your account. So there's just a few more steps you need to follow here before you're ready to connect it. After clicking create you'll be taken to the app management page with some tabs across the top of the page. Now follow these steps:

1. Go the permissions tab.
2. In the details check your app has read / write permissions. If it doesn't already then check the read / write permissions option and hit update settings. Without write permissions you can only view followers / friends but you won't be able to follow / unfollow them.
3. Go to the keys and access token tab.
4. Scroll down to the Access Token section.
5. Click create my access token.

Excellent! From Twitter's perspective you are good to go. Keep this page open because you need some of the details listed here, specifically the:

* Consumer Key (API Key)
* Consumer Secret (API Secret)
* Access Token
* Access Token Secret

### Create the config file
So now for the final piece of the puzzle. Download this app from the download zip option on the right of this page and save / unzip it to a suitable location in your hard drive. Open the folder and create a new file. Call it twitter-config.js. Open this file in a text editor or notepad and copy the following into it replacing the quoted text with the relevant text from your Twitter app:

```javascript
module.exports = {
    consumer_key : "your-consumer-key",
    consumer_secret : "your-consumer-secret",
    access_token_key : "your-access-token",
    access_token_secret : "your-access-token-secret"
};
```

Save the file (it should be in the root of the folder, not in any sub folders). 

### Installing the app's dependencies
Almost there now. Open up the command prompt for your PC. Windows users can go the Start menu and type cmd into the search box to launch it. You need to navigate to the app directory so get its full file path e.g. if it's on your desktop it would be something like C:\Users\Your_User_Name\Desktop so type cd and then the file path and hit enter. 

```unix
cd your-directory-file-path
```

Once you're in the directory on the command line you can type

```unix
npm install
```

to install all the dependencies the app uses. 

### Starting the app
On the command line in your app's directory type

```unix
npm start
```

to start the app up. Now open a new tab in your browser and go to 

```unix
http://localhost:1337
```

to see the app. Success!!

## Usage Limit
This app will only analyse the first 5,000 friends and followers a user has, so if you search for anyone who exceeds this number you'll get distorted results. The reason for this is that Twitter only allows you to make a limited amount of requests for data and once you exceed this amount they withhold access for a short period of time, usually 15 mins or so. Since Twitter only allows you to access data 100 users at a time, anything beyond 5,000 is going to exceed the limit.
