import { HttpService } from '../../../shared/services/http/http.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogTeamComponent } from './dialog-team/dialog-team.component';
import { UpdateService } from '../../../shared/services/update/update.service';
import { ToastComponent } from 'src/app/shared/components/toast/toast.component';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  data: any = [];
  notifications: string[] = ['Erro ao carregar equipes.', 'Erro ao gerar senha.', 'Senha copiada para a área de transferência.'];
  newPassword: string = '';
  filter = '';
  filterCols = ['id', 'name', 'username'];

  constructor(private _httpService: HttpService, private _updateService: UpdateService, private _dialog: MatDialog) { }

  @ViewChild(ToastComponent) toast!: ToastComponent;

  ngOnInit(): void {
    this.getAll();
    this._updateService.update
      .subscribe({
        next: (response: any) => {
          this.toast.elapsedTime = this._updateService.getElapsedTime();
          this.toast.notification = this._updateService.getNotification();
          this.toast.showToast();

          if (this.notifications.every(notification => notification !== response)) this.getAll();
        }
      });
  }

  getAll(): void {
    this._httpService.getAll('user/role/group')
      .subscribe({
        next: (response: any) => { this.data = response; },
        error: (error: any) => {
          this._updateService.notify(this.notifications[0]);
          console.error(error);
        }
      });
  }

  edit(data: any): void { this.openDialog(data); }

  remove(data: any): void {
    this._updateService.startTimer();
    this._httpService.deleteById('user', data.id, { responseType: 'text' })
      .subscribe({
        next: () => { this._updateService.notify('Equipe excluída com sucesso.', true); },
        error: (error: any) => {
          this._updateService.notify('Erro ao excluir equipe.', true);
          console.error(error);
        }
      });
  }

  generatePassword(data: any) {
    this.newPassword = 'Gerando nova senha...';
    this._httpService.getAll(`user/${data.id}/redefine`, { responseType: 'text' })
      .subscribe({
        next: (response) => { this.newPassword = response; },
        error: (error: any) => {
          this._updateService.notify(this.notifications[1]);
          console.error(error);
        }
      });
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
    this._updateService.notify(this.notifications[2]);
  }

  openDialog(data: any = null): void { this._dialog.open(DialogTeamComponent, { data: data }); }
}
