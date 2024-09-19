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
            'x-app-id': "dedf6377",
            'x-app-key': "51a722122b583a5da8ff881242c254ec"
        }
    }

    try {
        const response = await axios.get("https://trackapi.nutritionix.com/v2/search/instant/?query=" + req.body.food, config);
        console.log(response.data.common[0]);
        console.log(req.body.food);
        res.render("result.ejs", { data: response.data.common[0] });
    } catch (error) {
        res.status(404).send(error.response.data);
    }
});

app.listen(port, () => {
    console.log("Listening on port " + port);
});