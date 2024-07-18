import { Router } from "express";
import { getLogs, getMapping, scaleAuth } from "../controllers/scale.js";
const router = Router();

// router.use(scaleAuth);

router.get("/", (req, res) => {
  res.send("Authenticated");
});

router.post("/get-mapping", getMapping);
router.get('get-logs', getLogs);
export default router;