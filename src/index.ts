import express from "express";
import { app } from "./app";
import { discoveryRouter } from "./discovery/router";

export const myapp = express();

myapp.disable("x-powered-by");
myapp.use(express.json({ limit: "100kb" }));
myapp.use(discoveryRouter);
