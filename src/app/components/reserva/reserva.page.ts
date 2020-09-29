import { Component, OnInit } from '@angular/core';
import { ReservasService } from '../../servicios/reservas.service';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Reserva } from '../../models/reserva-interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.page.html',
  styleUrls: ['./reserva.page.scss'],
})
export class ReservaPage implements OnInit {

  public reservas: any =[];
  public usuarioLog:string;
  public currentUser = this.AFauth.auth.currentUser;

  public contador: number

  public reservas$: Observable<Reserva[]>;

  constructor(public reservasService: ReservasService, private authservice: AuthService,
    public actionSheetController: ActionSheetController, private router:Router, private AFauth : AngularFireAuth,
    ) {

      
     }

  ngOnInit() {
    

    try {
      if(this.currentUser != null){
        this.usuarioLog = this.currentUser.uid;
      }else{
        console.log("No hay un usuariio logueado");
        this.router.navigate(['/home']);

      }
      
    } catch (error) {
      console.log(error)
      this.router.navigate(['/home']);
    }

    

    this.reservas$ = this.reservasService.recuperarDatos()


    //this.reservasService.getReservas().subscribe( data =>{
    //  this.reservas = data;
    //})
    // this.numeroReserva();
  }

  // numeroReserva(){
  //   this.contador = 0;
  //   this.reservasService.listar().subscribe(data =>{
  //     data.forEach(x => {
  //       if(this.usuarioLog === x.uidResta && x.estado === 'En Revision'){
  //         console.log("s", x);
  //         this.contador ++;
  //       }

  //     });
  //     console.log("cuandtos", this.contador);
      
  //   })
  // }

  aceptarReserva(id : string){
    this.reservasService.getReserva(id).subscribe(data =>{
      let reserva : Reserva = {
        nombre : data.nombre,
        numero : data.numero,
        mesas : data.mesas,
        tiempo :data.tiempo,
        uid : data.uid,
        uidResta : data.uidResta,
        uidUsu : data.uidUsu,
        estado : "Aprobado"
      }
      this.reservasService.updateReserva(id , reserva);
    })
  }

  rechazarReserva(id : string){
    this.reservasService.getReserva(id).subscribe(data =>{
      let reserva : Reserva = {
        nombre : data.nombre,
        numero : data.numero,
        mesas : data.mesas,
        tiempo :data.tiempo,
        uid : data.uid,
        uidResta : data.uidResta,
        uidUsu : data.uidUsu,
        estado : "Rechazado"
      }
      this.reservasService.updateReserva(id , reserva);
    })
  }

  goRegreso(){
    this.router.navigate(['/perfil'])
  }

  onLogout(){
    this.authservice.logout();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Menu',
      buttons: [{
        text: 'Peticiones Aceptadas',
        icon: 'checkmark-circle-outline',
        handler: () => {
          this.router.navigate(['/reserva-aceptada']);
        }
      },{
        text: 'Cerrar Sesion',
        icon: 'log-out',
        handler: () => {
         this.onLogout();
        }
      }]
    });
    await actionSheet.present();
    let result = await actionSheet.onDidDismiss();
  }

}
