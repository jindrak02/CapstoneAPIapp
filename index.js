import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import 'dotenv/config';

const app = express();
const port = 3000;

// Pro volání nutritionix api
const appId = process.env.appId;
const appKey= process.env.appKey;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/get-macros", async (req, res) => {

    const config = {
        'method': 'GET',
        'headers': {
            //'Content-Type': 'application/json',
            'x-app-id': appId,
            'x-app-key': appKey
        }
    }

    const body = {
        'query': req.body.food
    }

    try {
        const response = await axios.get("https://trackapi.nutritionix.com/v2/search/instant/?query=" + req.body.food, config);
        const macros = await axios.post("https://trackapi.nutritionix.com/v2/natural/nutrients", body, config);
        res.render("result.ejs", { data: response.data.common[0], macros: macros.data.foods[0] });
    } catch (error) {
        console.log(error.response.data.message);
        res.render("result.ejs", { error: error.response.data.message });
    }
});

app.listen(port, () => {
    console.log("Listening on port " + port);
});