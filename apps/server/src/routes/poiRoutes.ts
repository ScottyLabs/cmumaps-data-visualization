import express from "express";

import { poiController } from "../controllers/poiController";

const poiRouter = express.Router();

poiRouter.post("/:id", poiController.createPoi);
poiRouter.put("/:id/type", poiController.updatePoiType);
poiRouter.delete("/:id", poiController.deletePoi);

export default poiRouter;
