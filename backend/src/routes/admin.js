import { auth, adminAuth } from "../services/auth.js";
import { Router } from "express";
import {
  getDashboardStatsController,
  getAllUsersController,
  createUserController,
    updateUserController,
    deleteUserController,
    getCourseEnrollmentsController,
    getEnrollmentStatsController,
    getUserEnrollmentsWithPaymentsController,
    getUserEnrollmentsController
} from "../controllers/admin.controllers.js";
    
const router = Router();
router.get('/dashboard/stats',adminAuth, getDashboardStatsController);
router.get('/user-enrollments', auth, getUserEnrollmentsWithPaymentsController);
// Gestión de usuarios
router.get('/users', adminAuth, getAllUsersController);
router.post('/users', adminAuth, createUserController);
router.put('/users/:userId', adminAuth, updateUserController);
router.delete('/users/:userId', adminAuth, deleteUserController);

// Inscripciones
router.get('/courses/:courseId/enrollments', adminAuth, getCourseEnrollmentsController);
// Reportes
router.get('/stats/enrollments', adminAuth, getEnrollmentStatsController);
router.get('/stats/enrollments', adminAuth, getUserEnrollmentsController);

export default router;