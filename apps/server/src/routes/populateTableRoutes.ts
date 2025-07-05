import { Router } from "express";

import { populateTableController } from "../controllers/populateTableController";

const populateTableRoutes = Router();

populateTableRoutes.post(
  "/buildings",
  populateTableController.populateBuildings,
);
populateTableRoutes.post("/floors", populateTableController.populateFloors);
populateTableRoutes.post("/rooms", populateTableController.populateRooms);
populateTableRoutes.post("/alias", populateTableController.populateAlias);
populateTableRoutes.post("/nodes", populateTableController.populateNodes);
populateTableRoutes.post("/edges", populateTableController.populateEdges);

export default populateTableRoutes;
