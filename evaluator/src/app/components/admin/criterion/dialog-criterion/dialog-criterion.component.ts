import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpService } from 'src/app/shared/services/http/http.service';
import { UpdateService } from 'src/app/shared/services/update/update.service';

@Component({
  selector: 'app-dialog-criterion',
  templateUrl: './dialog-criterion.component.html',
  styleUrls: ['./dialog-criterion.component.scss']
})
export class DialogCriterionComponent {
  form!: FormGroup;

  constructor(private _fb: FormBuilder, private _httpService: HttpService, private _updateService: UpdateService, private _dialogRef: MatDialogRef<DialogCriterionComponent>, @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit(): void { this.buildForm(); }

  buildForm(): void {
      this.form = this._fb.group({
        id: 0,
        name: '',
        weight: [],
        description: ''
      });
      if (this.data) this.form.patchValue(this.data);
  }

  clearForm(): void { this.form.reset(); }

  patch(data: any): void { this.form.patchValue(data); }

  onSubmit(data: any) {
    if (this.form.valid) if (data.id) {
      this._updateService.startTimer();
      this._httpService.putById('criterion', data.id, data, { responseType: 'text' })
        .subscribe({
          next: () => {
            this._updateService.notify('Critério atualizado com sucesso.', true);
            this.closeDialog();
          },
          error: (error: any) => {
            this._updateService.notify('Erro ao atualizar critério.');
            console.error(error);
          }
        });
    } else {
      this._httpService.post('criterion', data, { responseType: 'text' })
        .subscribe({
          next: () => {
            this._updateService.notify('Critério adicionado com sucesso.', true);
            this.clearForm();
          },
          error: (error: any) => {
            this._updateService.notify('Erro ao adicionar critério.');
            console.error(error);
          }
        });
    }
  }

  closeDialog(): void { this._dialogRef.close(); }
}
