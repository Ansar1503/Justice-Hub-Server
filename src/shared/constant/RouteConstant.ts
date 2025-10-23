export const AuthRoute = {
  signup: "/signup",
  login: "/login",
  refresh: "/refresh",
  verifyMail: "/verify-email",
  verifyOtp: "/verify-otp",
  resendOtp: "/resend-otp",
};

export const AdminRoutes = {
  dashboard: "/dashboard",
  overview: "/overview",
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
  base: "/client",
  dashboard: "/dashboard",
  profile: {
    base: "/profile",
    image: "/image",
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
    walletbook: "/lawyer/slots/book-wallet",
    byId: "/lawyers/:id",
    FetchLawyerCalendarAvailabilty: "/lawyers/:lawyerId/availability/calendar",
    review: "/lawyers/review",
    reviewsByLawyer: "/lawyers/reviews/:id",
    settings: "/lawyers/settings/:id",
    slots: "/lawyers/slots/:id",
  },

  slots: {
    checkout: "/lawyer/slots/checkout-session",
    followup: "/lawyer/slots/checkout-session/follow-up",
    removeFailed: "/lawyer/slots/session/:id",
  },
  notifcation: {
    updateStatus: "/notification/:id/status",
    getAllNotifications: "/notifications",
    markAllAsRead: "/notification/status",
  },
  stripe: {
    session: "/stripe/session/:id",
    webhook: "/stripe/webhooks",
    subscriptionWebhook: "/stripe/subscription/webhooks",
  },

  chat: {
    sendFile: "/chat/sendFile",
  },
};

export const LawyerRoutes = {
  base: "/lawyers",
  verification: "/verification",
  professional: "/professional",
  root: "/",

  schedule: {
    settings: "/schedule/settings",
    availability: "/schedule/availability",
    override: "/schedule/override",
  },

  profile: {
    base: "/profile",
    appointments: {
      base: "/profile/appointments",
      reject: "/profile/appointments/reject",
      approve: "/profile/appointments/approve",
    },
    sessions: {
      base: "/profile/sessions",
      start: "/profile/sessions/startSession",
      join: "/profile/sessions/join",
      end: "/profile/sessions/endSession",
      cancel: "/profile/sessions/cancel",
      callLogs: "/profile/sessions/callLogs/:id",
      document: "/profile/sessions/document/:id",
      reviewsBySession: "/profile/sessions/reviews/:id",
    },
    reviews: "/profile/reviews",
  },

  chat: {
    sendFile: "/chat/sendFile",
  },
  nofication: {
    getAllNotifications: "/notifications",
    updateStatus: "/notification/:id/status",
    markAllAsRead: "/notification/status",
  },
};

export const WalletRoutes = {
  base: "/wallet",
  transactions: "/transactions",
};

export const SpecializationRoute = {
  base: "/specialization",
  params: "/:id",
};
export const PracticeAreaRoutes = {
  base: "/practicearea",
  params: "/:id",
};
export const CasetypeRoutes = {
  base: "/casetypes",
  params: "/:id",
};
export const CommonParamsRoute = {
  params: "/:id",
};

export const CasesRoutes = {
  base: "/cases",
  user: "/user",
  appointments: "/appointments",
  sessions: "/sessions",
  sessionSummary: "/summary",
  documents: "/documents",
  caseTypes: "/caseTypes",
  ids: "/ids",
};

export const CommissionRoutes = {
  base: "/commission",
  settings: "/settings",
  transactions: "/transactions",
};

export const SubscriptionRoute = {
  base: "/subscriptions",
  status: "/status",
  subscribe: "/subscibe",
  user: "/user",
};
