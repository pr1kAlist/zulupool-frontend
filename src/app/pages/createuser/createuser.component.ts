import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { UserApiService, IAdminUserCreateParams } from "api/user.api";


@Component({
    selector: "app-createuser",
    templateUrl: "./createuser.component.html",
    styleUrls: ["./createuser.component.less"],
})
export class CreateUserComponent implements OnInit {
    settingsItems: IAdminUserCreateParams[];
    selectedIndex: number;

    form = this.formBuilder.group({
        login: [],
        password: [],
        email: [],
        name: [],
        isActive: [],
        isReadOnly: [],
    } as Record<keyof IAdminUserCreateParams, any>);
    isSubmitting = false;

    constructor(
        private formBuilder: FormBuilder,
        private userApiService: UserApiService,
    ) { }

    ngOnInit(): void {
    }

    addUser(): void {
        this.isSubmitting = true;
        if (this.form.value.email === null) delete this.form.value.email;
        if (this.form.value.isActive === null) delete this.form.value.isActive;
        if (this.form.value.isReadOnly === null) delete this.form.value.isReadOnly;
        if (this.form.value.name === null) delete this.form.value.name;
        const data = {
            ...this.form.value,
        };

        this.userApiService.createUser(data).subscribe(
            () => {
                this.isSubmitting = false;
            },
            () => {
                this.isSubmitting = false;
            },
        );
    }
}
