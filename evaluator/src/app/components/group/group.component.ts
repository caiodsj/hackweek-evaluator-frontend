import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastComponent } from 'src/app/shared/components/toast/toast.component';
import { HttpService } from 'src/app/shared/services/http/http.service';
import { UpdateService } from 'src/app/shared/services/update/update.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
  data: any;
  errorMsg: string = 'Erro ao carregar equipe.';
  form!: FormGroup;

  challengeList: string[] = ['desafio1', 'desafio2', 'desafio3'];
  challenge: string = '';
  type: string = 'Enviar';

  criteria = [
    { name: 'Critério 1', grade: 7.5 },
    { name: 'Critério 2', grade: 9.0 },
    { name: 'Critério 3', grade: 6.8 },
    { name: 'Critério 4', grade: 8.4 },
    { name: 'Critério 5', grade: 9.8 },
  ];

  constructor(private _fb: FormBuilder, private _httpService: HttpService, private _updateService: UpdateService) { }

  @ViewChild(ToastComponent) toast!: ToastComponent;

  ngOnInit(): void {
    this.getGroup(this.data.id);
    this._updateService.update
      .subscribe({
        next: (response: string) => {
          this.toast.elapsedTime = this._updateService.getElapsedTime();
          this.toast.notification = this._updateService.getNotification();
          this.toast.showToast();

          if (response !== this.errorMsg) this.getGroup(this.data.id);
        }
      });
  }

  buildForm(): void {
    this.form = this._fb.group({
      id: [],
      name: '',
      language: '',
      challenge: '',
      title: '',
      description: ''
    });
  }

  getGroup(id: number): void {
    this._httpService.getbyId('group', id)
      .subscribe({
        next: (response: any) => { this.data = response; },
        error: (error: any) => {
          this._updateService.notify('Erro ao carregar equipe.');
          console.error(error);
        }
      });
  }

  edit(data: any) { this.form.patchValue(data); }

  onSubmit(data: any) {
    if (this.form.valid) if (data.id) {
      this._updateService.startTimer();
      this._httpService.putById('group', data.id, data)
        .subscribe({
          next: () => { this._updateService.notify('Equipe atualizada com sucesso.', true); },
          error: (error: any) => {
            this._updateService.notify('Erro ao atualizar equipe.');
            console.error(error);
          }
        });
    } else {
      this._httpService.post('group', data)
        .subscribe({
          next: () => { this._updateService.notify('Equipe cadastrada com sucesso.', true); },
          error: (error: any) => {
            this._updateService.notify('Erro ao cadastrar equipe.');
            console.error(error);
          }
        });
    }
  }
}
