const express = require("express");
const {createGrocery, getAllGroceries, getOneGrocery, getGroceryByName, resetDB, updateGrocery, deleteGrocery} = require("../controller/groceryController");
const router = express.Router();


router.post('/groceries', createGrocery);
router.get('/groceries', getAllGroceries);
router.get('/groceries/:id', getOneGrocery);
router.get('/groceries-name', getGroceryByName);
router.patch('/groceries/:id', updateGrocery);
router.delete('/reset', resetDB);
router.delete('/groceries/:id', deleteGrocery);

module.exports = router;