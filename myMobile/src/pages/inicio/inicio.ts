import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { AlumnosGrupoPage } from '../alumnos-grupo/alumnos-grupo';
import { EquiposGrupoPage } from '../equipos-grupo/equipos-grupo';
import { JuegoPuntosPage } from '../juego-puntos/juego-puntos';


/**
 * Generated class for the InicioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inicio',
  templateUrl: 'inicio.html',
})
export class InicioPage {


private APIUrlProfesor = 'http://localhost:3000/api/Profesores';

lista : any[];
id:number;
information : any[];
data: any;
nombre: string;
idProfesor:number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient) {
  this.id=navParams.get('id');

  }

  ionViewDidLoad() {
    console.log('El id es ' + this.id);
    console.log('ionViewDidLoad InicioPage');
    this.http.get<any[]>(this.APIUrlProfesor + '/' + this.id + '/grupos').subscribe(
      lista => {
        this.lista = lista;
        console.log ('Ya está la lista');
        console.log(this.lista);
      }
    )
  }


  irAlumnos(i) {
      console.log ('El id del grupo es ' + i);
      console.log ('Accediendo a pagina Alumnos');
      this.navCtrl.push (AlumnosGrupoPage,{id:i});
  }

  irEquipos(i,j) {
      console.log ('El id del grupo es ' + i);
      console.log ('El nombre del grupo es ' + j);
      console.log ('Accediendo a pagina Equipos');
      this.navCtrl.push (EquiposGrupoPage,{id:i,nombre:j});
    }

  irJuego(i) {
      console.log ('Accediendo a pagina Juegos');
      this.navCtrl.push (JuegoPuntosPage,{id:i});
  }

  toggleDetails(data) {
    if (data.showDetails) {
      data.showDetails = false;
      data.icon = 'ios-add-circle-outline';
    } else {
      data.showDetails = true;
      data.icon = 'ios-remove-circle-outline';
    }}



}
