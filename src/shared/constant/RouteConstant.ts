export const AuthRoute = {
  signup: "/signup",
  login: "/login",
  refresh: "/refresh",
  verifyMail: "/verify-email",
  verifyOtp: "/verify-otp",
  resendOtp: "/resend-otp",
};

export const AdminRoutes = {
  users: "/users",
  lawyers: "/lawyers",
  blockUser: "/user",
  changeLawyerVerification: "/lawyer",
  profileAppointments: "/profile/appointments",
  profileSessions: "/profile/sessions",
  reviewDisputes: "/disputes/reviews",
  chatDisputes: "/disputes/chat",
  updateDisputeStatus: "/disputes/status/:id",
};
