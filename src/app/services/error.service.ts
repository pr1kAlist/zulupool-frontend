import { Injectable, EventEmitter } from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";
// import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";

import { Observable, merge } from "rxjs";
import { map } from "rxjs/operators";
import not from "logical-not";

enum EControlEvent {
    HideValidationMessage = 1,
    ShowValidationMessage,
}

export interface IFormErrorsHandler<T> {
    errors: Record<keyof T, IFormErrors>;
    validationTrigger: EventEmitter<void>;
    serverErrorsTrigger: EventEmitter<string>;
}

export interface IFormErrorsAPI {
    setForm(form: AbstractControl): void;
    setValidationTrigger(validationTrigger: EventEmitter<void>): void;
}

export interface IFormErrors {
    status: Observable<string>;
    error: Observable<string>;
}

@Injectable({ providedIn: "root" })
export class ErrorService {
    constructor(private translateService: TranslateService) {}

    createFormErrorsHandler<T>(
        form: AbstractControl,
        errorsByControlName: { [controlName: string]: string[] },
    ): IFormErrorsHandler<T> {
        const validationTrigger = new EventEmitter<void>();
        const serverErrorsTrigger = new EventEmitter<string>();

        const controlNamesByError: { [error: string]: string[] } = {};

        Object.entries(errorsByControlName).forEach(([controlName, errors]) => {
            errors.forEach(error => {
                if (not(error in controlNamesByError)) {
                    controlNamesByError[error] = [];
                }

                if (not(controlNamesByError[error].includes(controlName))) {
                    controlNamesByError[error].push(controlName);
                }
            });
        });

        const errors = {} as Record<keyof T, IFormErrors>;

        if (form instanceof FormGroup) {
            Object.entries(form.controls).forEach(([name, control]) => {
                errors[name] = {
                    status: merge(
                        control.valueChanges.pipe(
                            map(() => EControlEvent.HideValidationMessage),
                        ),
                        validationTrigger.pipe(
                            map(() =>
                                control.invalid
                                    ? EControlEvent.ShowValidationMessage
                                    : EControlEvent.HideValidationMessage,
                            ),
                        ),
                        serverErrorsTrigger.pipe(
                            map(error =>
                                controlNamesByError[error].includes(name)
                                    ? EControlEvent.ShowValidationMessage
                                    : EControlEvent.HideValidationMessage,
                            ),
                        ),
                    ).pipe(
                        map(event => {
                            switch (event) {
                                case EControlEvent.HideValidationMessage:
                                    return "success";
                                case EControlEvent.ShowValidationMessage:
                                    return "error";
                            }
                        }),
                    ),
                    error: merge(
                        validationTrigger.pipe(
                            map(() => this.getErrorMessage(control)),
                        ),
                        serverErrorsTrigger.pipe(
                            map(error =>
                                controlNamesByError[error].includes(name)
                                    ? this.createErrorMessage(
                                          "serverError",
                                          error,
                                      )
                                    : "",
                            ),
                        ),
                    ),
                } as IFormErrors;
            });
        }

        return { errors, validationTrigger, serverErrorsTrigger };
    }

    private getErrorMessage(control: AbstractControl): string {
        if (control.valid) return "";

        for (let error in control.errors) {
            const payload = control.errors[error];

            return this.createErrorMessage("clientError", error, payload);
        }

        return this.translateService.instant("validation.unknownError");
    }

    private createErrorMessage(
        source: string,
        type: string,
        params?: any,
    ): string {
        const key = `validation.${source}.${type}`;

        const message = this.translateService.instant(key, params);

        return message !== key
            ? message
            : this.translateService.instant("validation.unknownError");
    }
}
