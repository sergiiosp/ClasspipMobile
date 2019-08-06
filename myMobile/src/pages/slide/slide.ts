import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

/**
 * Generated class for the SlidePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-slide',
  templateUrl: 'slide.html',
})
export class SlidePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SlidePage');
  }

  slides = [
    {
      title: "Descubre Classpip Mobile!",
      description: "Consigue con la gamificación un entorno educativo interactivo e integrador.",
      image: "assets/imgs/Imagen2.png"
    },
    {
      title: "¿Hasta donde podemos llegar?",
      description: "Mediante <b>Classpip</b> conseguiremos motivar a nuestro alumnado y incrementaremos el rendimiento académico.",
      image: "assets/imgs/Imagen1.png"
    },
    {
      title: "¿Cómo lo haremos?",
      description: "Haciendo uso de dinámicas de juegos como las competiciones, los niveles o los cromos.",
      image: "assets/imgs/Imagen3.png"
    }
  ];

  irRegistro() {
    console.log ('Accediendo a pagina Registro');
    this.navCtrl.setRoot (HomePage);
}

}
