import {
  interactor,
  isPresent,
  fillable,
  clickable,
  value
} from '@bigtest/interactor';

@interactor class StaffSlipForm {
  isLoaded = isPresent('#template-editor');
  whenLoaded() {
    return this.when(() => this.isLoaded);
  }

  hasDescription = isPresent('#input-staff-slip-description');
  descValue = value('#input-staff-slip-description');

  hasSaveButton = isPresent('#clickable-save-staff-slip');

  fillDescription = fillable('#input-staff-slip-description');
  fillEditor = fillable('#template-editor');

  save = clickable('#clickable-save-staff-slip');
}

export default new StaffSlipForm('#form-staff-slip');
