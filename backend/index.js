import express from 'express';
import cors from 'cors'; // ✅ Import cors
import UserRouter from './features/users/user.routes.js';
import { connectToMongoDB } from './config/mongodb.js';
import propertyRouter from './features/properties/properties.routes.js';
import bookingRouter from './features/bookings/bookings.routes.js';
import historyRouter from './features/rentalHistory/rentalHistory.routes.js';
import router from './features/Admin/admin.routes.js';

const server = express();

server.use(cors({ origin: 'http://localhost:3000' })); // ✅ Allow frontend origin
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const startServer = async () => {
  try {
    await connectToMongoDB();

    server.use("/api/users", UserRouter);
    server.use("/api/properties", propertyRouter);
    server.use("/api/bookings", bookingRouter);
    server.use("/api/rental-history", historyRouter);
    server.use("/api/admin", router);

    server.listen(3200, () => {
      console.log('Server is listening on port 3200');
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

startServer();
