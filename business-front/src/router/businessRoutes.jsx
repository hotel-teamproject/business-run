import { Navigate } from "react-router-dom";
import BusinessLayout from "../components/layout/BusinessLayout";
import BusinessLoginPage from "../pages/auth/BusinessLoginPage";
import BusinessDashboardPage from "../pages/business/BusinessDashboardPage";
import BusinessHotelListPage from "../pages/business/BusinessHotelListPage";
import BusinessHotelCreatePage from "../pages/business/BusinessHotelCreatePage";
import BusinessHotelEditPage from "../pages/business/BusinessHotelEditPage";
import BusinessRoomManagePage from "../pages/business/BusinessRoomManagePage";
import BusinessRoomCreatePage from "../pages/business/BusinessRoomCreatePage";
import BusinessRoomEditPage from "../pages/business/BusinessRoomEditPage";
import BusinessPricingPage from "../pages/business/BusinessPricingPage";
import BusinessInventoryPage from "../pages/business/BusinessInventoryPage";
import BusinessReservationListPage from "../pages/business/BusinessReservationListPage";
import BusinessReservationDetailPage from "../pages/business/BusinessReservationDetailPage";
import BusinessReviewListPage from "../pages/business/BusinessReviewListPage";
import BusinessReviewDetailPage from "../pages/business/BusinessReviewDetailPage";
import BusinessStatisticsPage from "../pages/business/BusinessStatisticsPage";
import BusinessSettlementPage from "../pages/business/BusinessSettlementPage";
import BusinessProfilePage from "../pages/business/BusinessProfilePage";

const businessRoutes = [
  {
    path: "/business/login",
    element: <BusinessLoginPage />,
  },
  {
    path: "/business",
    element: <BusinessLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/business/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <BusinessDashboardPage />,
      },
      {
        path: "hotels",
        element: <BusinessHotelListPage />,
      },
      {
        path: "hotels/new",
        element: <BusinessHotelCreatePage />,
      },
      {
        path: "hotels/:hotelId/edit",
        element: <BusinessHotelEditPage />,
      },
      {
        path: "hotels/:hotelId/rooms",
        element: <BusinessRoomManagePage />,
      },
      {
        path: "hotels/:hotelId/rooms/new",
        element: <BusinessRoomCreatePage />,
      },
      {
        path: "hotels/:hotelId/rooms/:roomId/edit",
        element: <BusinessRoomEditPage />,
      },
      {
        path: "hotels/:hotelId/rooms/:roomId/pricing",
        element: <BusinessPricingPage />,
      },
      {
        path: "hotels/:hotelId/rooms/:roomId/inventory",
        element: <BusinessInventoryPage />,
      },
      {
        path: "reservations",
        element: <BusinessReservationListPage />,
      },
      {
        path: "reservations/:reservationId",
        element: <BusinessReservationDetailPage />,
      },
      {
        path: "reviews",
        element: <BusinessReviewListPage />,
      },
      {
        path: "reviews/:reviewId",
        element: <BusinessReviewDetailPage />,
      },
      {
        path: "statistics",
        element: <BusinessStatisticsPage />,
      },
      {
        path: "settlements",
        element: <BusinessSettlementPage />,
      },
      {
        path: "profile",
        element: <BusinessProfilePage />,
      },
    ],
  },
];

export default businessRoutes;

