import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PainelSenhaComponent } from '../../components/painel-senha/painel-senha.component';
import { interval, Subscription } from 'rxjs';
import { SenhaService } from '../../services/senha.service';
import { Senha } from '../../models/senha.model';

@Component({
  selector: 'app-painel',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, PainelSenhaComponent],
  templateUrl: './painel.page.html',
  styleUrls: ['./painel.page.scss'],
})
export class PainelPage implements OnInit, OnDestroy {
  ultimasSenhas: Senha[] = [];
  private subscription?: Subscription;

  constructor(private senhaService: SenhaService) {}

  ngOnInit(): void {
    this.subscription = interval(2000).subscribe(() => {
      this.atualizarSenhas();
    });
    this.atualizarSenhas();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private atualizarSenhas(): void {
    this.ultimasSenhas = this.senhaService.obterUltimasChamadas(5);
  }
}
