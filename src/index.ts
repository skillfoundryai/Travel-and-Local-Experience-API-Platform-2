import express from "express";

const app = express();
const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const nodeenv =  process.env.NODE_ENV; 

const isPortCorect !isNaN(port) && port> 999 && port <9999
const isCorrectNodeenv =  !!nodeenv && nodeenv.length>2
if(!isPortCorect || !isCorrectNodeenv){
//throw new Error
  console.log("Error with PORT or Node_ENV")
}

app.listen(port, () => {
  //console.log(`Wayfarinook API listening on port ${port}`);
});
