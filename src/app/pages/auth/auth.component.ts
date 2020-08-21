import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

import { AuthApiService, IAuthSignInParams } from "api/auth.api";
import { UserApiService, IUserCreateParams } from "api/user.api";
import { EAppRoutes } from "enums/app-routes";
import { ErrorService } from "services/error.service";
import { routeToUrl } from "tools/route-to-url";

@Component({
    selector: "app-auth",
    templateUrl: "./auth.component.html",
    styleUrls: ["./auth.component.less"],
})
export class AuthComponent {
    readonly EAppRoutes = EAppRoutes;
    readonly routeToUrl = routeToUrl;

    readonly signInForm = this.formBuilder.group({
        login: ["", [Validators.required, Validators.maxLength(64)]],
        password: [
            "",
            [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(64),
            ],
        ],
    } as Record<keyof IAuthSignInParams, any>);

    readonly signIn = this.errorService.createFormErrorsHandler<
        IAuthSignInParams
    >(this.signInForm, {
        password: ["invalid_password", "user_not_active"],
    });

    readonly signUpForm = this.formBuilder.group({
        login: ["", [Validators.required, Validators.maxLength(64)]],
        password: [
            "",
            [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(64),
            ],
        ],
        email: ["", [Validators.required]],
    } as Record<keyof IUserCreateParams, any>);

    readonly signUp = this.errorService.createFormErrorsHandler<
        IUserCreateParams
    >(this.signUpForm, {
        login: ["login_format_invalid", "duplicate_login"],
        password: ["password_format_invalid"],
        email: [
            "email_format_invalid",
            "duplicate_email",
            "smtp_client_create_error",
            "email_send_error",
        ],
    });

    submitting = false;

    constructor(
        private formBuilder: FormBuilder,
        private authApiService: AuthApiService,
        private userApiService: UserApiService,
        private errorService: ErrorService,
    ) {}

    onSignIn(): void {
        this.signIn.validationTrigger.emit();

        if (this.signInForm.invalid) return;

        this.submitting = true;

        const params = this.signInForm.value as IAuthSignInParams;

        this.authApiService.sigIn(params).subscribe(
            () => {
                console.log("AUTH COMPLETE");
            },
            error => {
                this.signIn.serverErrorsTrigger.emit(error?.message || "");

                this.submitting = false;
            },
        );
    }

    onSignUp(): void {}
}
