import { FormGroup } from "@angular/forms";

export const isRequired = (field: 'title', form: FormGroup) => {
    const control = form.get(field);

    return control && control.touched && control.hasError('required');
};
