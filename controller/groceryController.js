const groceryDB = require("../database/groceryDB.json");
const fs = require("fs");
const {v4: uuid} = require("uuid");

const calculatePrice = (price, quantity) => {
    price = parseInt(quantity.split(" ")[0]) * price;
    return price.toFixed(2);
};

const createGrocery = (req, res) => {
    const {storeName, goods, unitPrice, quantity} = req.body;
    /*   "storeName": "nameOfStore",
             "goods": "nameOfGoods"
             "unitPrice": "1000.00",
             "quantity": "5 packs"
 */
    const totalPrice = calculatePrice(unitPrice, quantity);
    const grocery = {
        id: uuid(),
        storeName, goods, unitPrice, quantity, totalPrice, isAvailable: totalPrice > 0
    };

    groceryDB.push(grocery);
    updateDB(groceryDB);
    /*
            "storeName": "nameOfStore",
             "goods": "nameOfGoods"
             "unitPrice": "1000.00",
             "quantity": "5 packs",
             "totalPrice": "5000.00",
             "isAvailable": true
            }
 */
    res.status(201).json({message: "Grocery created succesfully", data: grocery});
};

const updateDB = (data) => {
    fs.writeFile("./database/groceryDB.json", JSON.stringify(data, null, 2), "utf8", (err, data) => {
        if(err) {
            console.log("Error writing to file", err);
        } else {
            console.log("File sucessfully written");
            return data;
        }
    });
};

const getAllGroceries = (req, res) => {
    if(groceryDB.length > 0) {
        res.status(200).json({message: "All grocerys found", total: groceryDB.length, data: groceryDB});
    } else {
        res.status(200).json({message: "Grocery satabase is empty"});
    }
};

const getOneGrocery = (req, res) => {
    const {id} = req.params;
    const grocery = groceryDB.find((grocery) => grocery.id === id);
    if(grocery) {
        res.status(200).json({message: "Grocery found", data: grocery});
    } else {
        res.status(404).json({message: `Grocery with ID :${id} not found`});
    }
};

const getGroceryByName = (req, res) => {
    const {storeName} = req.body;
    const grocery = groceryDB.find((grocery) => grocery.storeName === storeName);
    if(grocery) {
        res.status(200).json({message: "Grocery found", data: grocery});
    } else {
        res.status(404).json({message: `Grocery wiht the storeName: ${storeName} not found`});
    }
};

const resetDB = (req, res) => {
    if(groceryDB.length > 0) {
        updateDB([]);
        res.status(200).json({message: "Database reset successfull"});
    } else {
        res.status(200).json({mesage: "Dadatbase already epmty"});
    }


};

const updateGrocery = (req, res) => {
    const {id} = req.params;
    const {storeName, goods, unitPrice, quantity} = req.body;
    let updatedGrocery = null;
    const newGroceryDB = groceryDB.map((grocery) => {
        if(grocery.id === id) {
            updatedGrocery = {
                storeName: storeName || grocery.storeName,
                goods: goods || grocery.goods,
                unitPrice: unitPrice || grocery.unitPrice,
                quantity: quantity || grocery.quantity,
                id
            };
            return updatedGrocery;
        } else {
            return grocery;
        }
    });
    if(updatedGrocery) {
        updateDB(newGroceryDB);
        res.status(200).json({message: "Grocery updated successfully", data: updatedGrocery});
    } else {
        res.status(404).json({message: "Studen not found"});
    }
};

const deleteGrocery = (req, res) => {
    const {id} = req.params;
    let groceryToDelete = null;
    const newGroceryDB = groceryDB.filter((grocery) => {
        if(grocery.id === id) {
            groceryToDelete = grocery;
            return false;
        } else {
            return true;
        }
    });

    if(groceryToDelete) {
        updateDB(newGroceryDB);
        res.status(200).json({message: "Grocery deleted successfully", data: groceryToDelete});
    } else {
        res.status(404).json({message: `Grocery with ID: ${id} not found`});
    }
};

module.exports = {
    createGrocery, 
    getAllGroceries, 
    getOneGrocery, 
    getGroceryByName, 
    resetDB, 
    updateGrocery, 
    deleteGrocery
};