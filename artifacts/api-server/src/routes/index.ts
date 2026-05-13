import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leadsRouter from "./leads";
import portfolioRouter from "./portfolio";
import generateRouter from "./generate";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(leadsRouter);
router.use(portfolioRouter);
router.use(generateRouter);
router.use(uploadRouter);

export default router;
