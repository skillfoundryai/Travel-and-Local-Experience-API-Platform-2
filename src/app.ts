import express from "express";
import { discoveryRouter } from "./discovery/router";

export const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));
app.use(discoveryRouter);
