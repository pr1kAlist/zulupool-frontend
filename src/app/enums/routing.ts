export enum EAppRoutes {
    Home = "",
    Auth = "auth",
    UserResendEmail = "resend-email",
    Actions = "actions",
    Monitoring = "monitoring",
    History = "history",
    Help = "help",
}

export enum EActionsRoutes {
    UserActivate = "useracivate",
}

export const userRootRoute = EAppRoutes.Monitoring;
