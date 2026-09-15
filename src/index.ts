import express from "express";

const app = express();
const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const nodeenv =  process.env.NODE_ENV; 

app.listen(port, () => {
  //console.log(`Wayfarinook API listening on port ${port}`);
});
