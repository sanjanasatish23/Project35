
var dog, happyDog
var database
var foodS, foodStock

var feed, addFood

var fedTime, lastFed

var foodObj

function preload()
{
  dog1IMG=loadImage("images/dogImg.png")
  dog2IMG=loadImage("images/dogImg1.png")
}

function setup() {
  database = firebase.database();
  createCanvas(1200, 400);
  foodObj = new Food();
  
  dog = createSprite(250,250,20,20);
  dog.addImage(dog1IMG);
  dog.scale = 0.15
  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);  

}

function draw() {  
  background(46,139,87);

  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed=data.val();
  });
  fill(255,255,255);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed"+lastFed%12+"PM",350,30);
  }
  else if(lastFed===0){
    text("Last Feed:12AM",350,30);
  }
  else{
    text("Last Feed:"+lastFed+"AM",350,30);
  }

  drawSprites();

}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  }
  database.ref('/').update({
    Food:x
  })
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
      Food:foodObj.getFoodStock(),
      FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
      Food:foodS
  })
}