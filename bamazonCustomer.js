var mysql = require('mysql');
var inquirer = require('inquirer');

// connect to the mysql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "bamazon_db"
});

//tests connection
connection.connect(function(err){
  if(err){
    console.log(err);
    return;
  }
  console.log("connected as id " + connection.threadId);
  displayInventory();
});

// inquirer prompts
var productPurchasePrompt = {
  type:'input',
  message:"Type in the ID of the product you would like to purchase:",
  name:'product_purchase'
};
var productQuantityPrompt = {
  type:'input',
  message:"How many units of the product would you like to purchase?",
  name:'product_quantity'
};
var restartPrompt = {
  type: "list",
  message: "Would you like to shop again?",
  choices: ["Yes", "No"],
  name: "restart_prompt"
};

// displays all inventory when first running application
var displayInventory = function(){
  connection.query("SELECT * FROM products", function(err,res){
    console.log("DISPLAYING ALL INVENTORY:" + "\n" + "----------------------------");
    for (var i = 0; i < res.length; i++) {
      console.log("Item ID: " + res[i].item_id + "\n" + "Product Name: " + res[i].product_name + "\n" + "Price: " + res[i].price + "\n" + "Available Quantity: " + res[i].stock_quantity + "\n----------------------------");
    }
    // then prompts users with which products they would like to buy
    promptCustomer(res);
  })
}
