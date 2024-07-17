import { Router } from "express";
import { getMapping, scaleAuth } from "../controllers/scale.js";
import { logRequestResponse } from "../lib/middlewares.js";
const router = Router();

// router.use(scaleAuth);

router.get("/", (req, res) => {
  res.send("Authenticated");
});

router.post("/get-mapping", logRequestResponse, getMapping);
export default router;