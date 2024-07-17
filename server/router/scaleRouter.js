import { Router } from "express";
import { getLogs, getMapping, logRequestResponse, scaleAuth } from "../controllers/scale.js";
const router = Router();

// router.use(scaleAuth);

router.get("/", (req, res) => {
  res.send("Authenticated");
});

router.post("/get-mapping", logRequestResponse, getMapping);
router.get('get-logs', getLogs);
export default router;