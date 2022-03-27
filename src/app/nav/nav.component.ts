import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../servicies/auth.service';
import { ModalService } from '../servicies/modal.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  constructor(
    public modalService: ModalService,
    public auth: AuthService,
    public fireAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {}
  openModal($event: Event) {
    $event.preventDefault();

    this.modalService.toggleModal('auth');
  }
  async logout($event: Event) {
    $event.preventDefault();
    await this.fireAuth.signOut();
  }
}
