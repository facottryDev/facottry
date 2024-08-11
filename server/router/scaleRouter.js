import { Router } from "express";
import { getLogData, getMapping, scaleAuth } from "../controllers/scale.js";
const router = Router();

router.use(scaleAuth);

router.get("/", (req, res) => {
  res.send("Authenticated");
});

router.post("/get-mapping", getMapping);
router.get("/get-log-by-id", getLogData);
export default router;