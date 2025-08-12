const express = require("express");
const router = require("./routers/groceryRouter");

const app = express();
const PORT = 5000;

app.use(express.json());
app.get("/", (req, res) => {
    res.status(200).send({message: "Welcome to the my Grocery shop"});
});

//app.use(router);
app.listen(PORT, () => {
    console.log(`Server running in port:${PORT}`);
});