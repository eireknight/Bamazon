var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon_db"
});

connection.connect(function(err){
  if (err) throw err;
  console.log("Connected: ID " + connection.threadId);
  displayInventory();
});

var Purchase = {
  type:'input',
  message:"What would you like to purchase?  Enter the ID",
  name:'Purchase'
};
var Quantity = {
  type:'input',
  message:"How many would you like to purchase?",
  name:'Quantity'
};
var Restart = {
  type: "list",
  message: "Would you like to continue shopping?",
  choices: ["Yes", "No"],
  name: "Restart"
};

var displayInventory = function(){
  connection.query("SELECT * FROM inventory", function(err,res){
    console.log("Displaying Inventory:" + "\n" + "----------------------------");
    for (var i = 0; i < res.length; i++) {
      console.log("Item ID: " + res[i].item_id + "\n" + "Product Name: " + res[i].product_name + "\n" + "Price: " + res[i].price + "\n" + "Available Quantity: " + res[i].stock_quantity + "\n----------------------------");
    }
    promptCustomer(res);
  })
}

var promptCustomer = function(res){
  inquirer.prompt([Purchase]).then(function(inquirerResponse){
    var chosenProductID = parseInt(inquirerResponse.Purchase);
    for (var i=0;i<res.length;i++){
      if(res[i].item_id === chosenProductID){
        var id = i;
        inquirer.prompt([Quantity]).then(function(inquirerResponse){
          var chosenQuantity = parseInt(inquirerResponse.Quantity);

          if ((res[id].stock_quantity - chosenQuantity) >= 0) {
            var newQuantity = res[id].stock_quantity - chosenQuantity;
            var totalCost = res[id].price * chosenQuantity;
            var sql = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
            var values = ['inventory', 'stock_quantity', newQuantity, 'item_id', chosenProductID];
            connection.query(sql, values, function(err, res){
              if(err) {
                console.log(err),
                connection.end();
              }
              console.log("Product(s) bought!" + "\n" + "Total Cost of Transaction: $" + totalCost);
              inquirer.prompt([Restart]).then(function(inquirerResponse){
                if (inquirerResponse.Restart === "Yes") {
                  displayInventory();
                } else {
                  console.log("Thank You!");
                  connection.end();
                }
              })
            })
          }

          else {
            console.log("Insufficient Quantity! We only carry in stock the quantity shown.");
            promptCustomer(res);
          }
        })
      }
    }
  })
}
