import express from "express";

import { dropTablesController } from "../controllers/dropTablesController";

const dropTablesRouter = express.Router();

dropTablesRouter.delete("/", dropTablesController.dropTables);

export default dropTablesRouter;
