export enum EAppRoutes {
    Home = "",
    Auth = "auth",
    UserResendEmail = "resend-email",
    Actions = "actions",
    Monitoring = "monitoring",
    Payments = "payments",
}

export enum EActionsRoutes {
    UserActivate = "useracivate",
}

export const userRootRoute = EAppRoutes.Monitoring;
