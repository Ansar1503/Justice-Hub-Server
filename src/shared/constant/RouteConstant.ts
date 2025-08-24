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

export const ClientRoutes = {
  profile: {
    base: "/profile",
    basic: "/profile/basic",
    personal: "/profile/personal",
    verifyMail: "/profile/verifyMail",
    updatePassword: "/profile/updatePassword",
    address: "/profile/address",

    appointments: "/profile/appointments",
    cancelAppointment: "/profile/appointments",

    sessions: "/profile/sessions",
    sessionDocs: {
      base: "/profile/sessions/document",
      byId: "/profile/sessions/document/:id",
    },
    cancelSession: "/profile/sessions/cancel",
    endSession: "/profile/sessions/endSession",
    join: "/profile/sessions/join",
    callLogs: "/profile/sessions/callLogs/:id",
    reviewsBySession: "/profile/sessions/reviews/:id",

    chats: "/profile/chats",
    chatMessages: "/profile/chats/messages",

    reviews: "/profile/reviews",
    reviewById: "/profile/reviews/:id",
    reportReview: "/profile/reviews/report/:id",
  },

  lawyers: {
    base: "/lawyers",
    byId: "/lawyers/:id",
    review: "/lawyers/review",
    reviewsByLawyer: "/lawyers/reviews/:id",
    settings: "/lawyers/settings/:id",
    slots: "/lawyers/slots/:id",
  },

  slots: {
    checkout: "/lawyer/slots/checkout-session",
    removeFailed: "/lawyer/slots/session/:id",
  },

  stripe: {
    session: "/stripe/session/:id",
    webhook: "/stripe/webhooks",
  },

  chat: {
    sendFile: "/chat/sendFile",
  },
};
