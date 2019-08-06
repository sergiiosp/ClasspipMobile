import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ResponseContentType, Http} from '@angular/http';


/**
 * Generated class for the InfoJuegoPuntosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-info-juego-puntos',
  templateUrl: 'info-juego-puntos.html',
})
export class InfoJuegoPuntosPage {

  juegoSeleccionado: any;
  nivelesDelJuego: any[];
  puntosDelJuego: any[];
  Tipo: string;
  imagenNivel: string;
  img: any;
  imagenesNivel: any[] = [];
  private APIRURLJuegoDePuntos = 'http://localhost:3000/api/JuegosDePuntos';

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient, private http2: Http ) {
    this.juegoSeleccionado=navParams.get('juego');
    this.Tipo = "Puntos";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfoJuegoPuntosPage');
    console.log(this.juegoSeleccionado);
    this.RecibirNivelesDelServicio();
    this.RecibirPuntosDelServicio();
    console.log(this.puntosDelJuego);

  }

  RecibirNivelesDelServicio(){
    this.http.get<any[]>(this.APIRURLJuegoDePuntos + '/' + this.juegoSeleccionado.id + '/nivels').subscribe(
      lista => {
        this.nivelesDelJuego = lista;
        console.log ('Ya está la lista');
        console.log(this.nivelesDelJuego)
        this.LogoDeNivel();
        ;})
  }

  RecibirPuntosDelServicio(){
    this.http.get<any[]>(this.APIRURLJuegoDePuntos + '/' + this.juegoSeleccionado.id + '/puntos').subscribe(
      lista => {
        this.puntosDelJuego = lista;
        console.log ('Ya está la lista');
        console.log(this.puntosDelJuego);})
  }

  // Le pasamos el id de la insignia y buscamos el logo que tiene
  LogoDeNivel() {

    for (let i = 0; i < this.nivelesDelJuego.length; i ++) {
    if (this.nivelesDelJuego[i].Imagen!== undefined) {

      // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
      this.http2.get('http://localhost:3000/api/imagenes/imagenNivel/download/' + this.nivelesDelJuego[i].Imagen,
      { responseType: ResponseContentType.Blob })
      .subscribe(response => {
        const blob = new Blob([response.blob()], { type: 'image/jpg'});

        const reader = new FileReader();
        reader.addEventListener('load', () => {
          this.imagenNivel = reader.result.toString();
          this.imagenesNivel[i] = this.imagenNivel;
        }, false);

        if (blob) {
          reader.readAsDataURL(blob);
        }
      });

      // Sino la imagenLogo será undefined para que no nos pinte la foto de otro equipo préviamente seleccionado
    } else {
      this.imagenNivel = undefined;
      this.imagenesNivel[i] = this.imagenNivel;
    }
  }
}
}
