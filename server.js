const express = require('express');
const app = express();
const port = 3000;

app.get("/", (req, res) => {
    const htmlResponse = "<h1><i>Expense Manager</i></h1>";
    res.send(htmlResponse);
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running`);
    });
}

module.exports = app;