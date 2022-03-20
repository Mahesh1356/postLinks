
# Simple Blog(Links)
 A simple blog app, to experiment ```linked list```.
 ## Step 1
 - Open a terminal and run command ```cd ~/Documents ```
 - Clone this repo by running command ```git clone git@github.com:Mahesh1356/postLinks.git```
 - Run command ```cd postLinks/```.
 - Run command ```npm install```. Check whether the node has installed in your PC.
 - Run command ``` npm start ``` to start run this app.

## Step 2
 - Open a new terminal and run command ```json-server --watch db.json```
 - If previous command throws an error, please do install <b>json server</b> globally using the command ``` npm i -g json-server```

## Step 3
 Use this url ```http://localhost:3001/posts/``` to do following operations.
 - ```get```  http://localhost:3001/posts/ - to get list of posts.
 - ```get```  http://localhost:3001/posts/:id - to get the particular post.
 - ```post```  http://localhost:3001/posts/ - to create a new post, post content will be created automatically.
 - ```delete```  http://localhost:3001/posts/:id - to add delete the post.

