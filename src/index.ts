import express from "express";

const app = express();
const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const nodeenv =  process.env.NODE_ENV; 

const isPortCorect = !isNaN(port) && port> 999 && port <9999
const isCorrectNodeenv =  ["development", "test", "staging", "production"].indexOf(nodeenv)>-1
if(!isPortCorect){
throw new Error(`PORT must be a number between 1000 and 9999`);
 
}

if( !isCorrectNodeenv){
throw new Error(`NODE_ENV is required (e.g. development|test|production)`);
 
}
app.listen(port, () => {
  console.log(`Wayfarinook API listening on port ${port}`);
});
