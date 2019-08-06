import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Loading, LoadingController } from 'ionic-angular';
import { HttpClient} from '@angular/common/http';
import { Http, ResponseContentType} from '@angular/http';

import {Juego} from '../../clases/Juego';
import {Alumno} from '../../clases/Alumno';
import {Equipo} from '../../clases/Equipo';
import {Coleccion} from '../../clases/Coleccion';
import {Cromo} from '../../clases/Cromo';
import {AlumnoJuegoDeColeccion} from '../../clases/AlumnoJuegoDeColeccion';
import {EquipoJuegoDeColeccion} from '../../clases/EquipoJuegoDeColeccion';
import {Album} from '../../clases/Album';
import {AlbumEquipo} from '../../clases/AlbumEquipo';


/**
 * Generated class for the AsignarCromosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-asignar-cromos',
  templateUrl: 'asignar-cromos.html',
})
export class AsignarCromosPage {

  private APIUrl = 'http://localhost:3000/api/Colecciones';
  private APIUrlCromos = 'http://localhost:3000/api/cromos';
  private APIRURLJuegoDeColeccion = 'http://localhost:3000/api/JuegosDeColeccion';
  private APIRURLAlbum = 'http://localhost:3000/api/Albumes';
  private APIURLAlumnoJuegoDeColeccion = 'http://localhost:3000/api/AlumnosJuegoDeColeccion';
  private APIURLEquipoJuegoDeColeccion = 'http://localhost:3000/api/EquiposJuegoDeColeccion';
  private APIRURLAlbumEquipo = 'http://localhost:3000/api/albumsEquipo';



  fechaAsignacionCromo: Date;
  fechaString: string;

  juegoSeleccionado: Juego;

  alumnosDelJuego: Alumno[];
  equiposDelJuego: Equipo[];

  imagenCromo: string;

  public cromo:any;

  coleccion: Coleccion;
  cromosColeccion: Cromo[];

  displayedColumnsAlumno: string[] = ['select', 'nombreAlumno', 'primerApellido', 'segundoApellido'];

  displayedColumnsEquipos: string[] = ['select', 'nombreEquipo', 'miembros'];

  seleccionados: boolean[];
  seleccionadosEquipos: boolean[];

  cromoSeleccionado: any;
  cromoSeleccionadoId: number;

  alumnosEquipo: Alumno[];

  inscripcionesAlumnos: AlumnoJuegoDeColeccion[];
  inscripcionesEquipos: EquipoJuegoDeColeccion[];

  studentsSelectedArray: Array<any> = new Array<any>();

  items: any[];
  items1: any[];
  itemsAPI: any[];

  haySeleccionado : boolean = false;


  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres asignar este cromo';

  // tslint:disable-next-line:no-inferrable-types
  mensajeAleatorio: string = 'Estás seguro/a de que quieres asignar este número de cromos aleatoriamente';

  // tslint:disable-next-line:ban-types
  isDisabled: Boolean = true;
  vectorCorrectos: any[]=[];


  // Para asignar cromos random
  probabilidadCromos: number[] = [];
  indexCromo: number;
  // tslint:disable-next-line:no-inferrable-types
  numeroCromosRandom: number = 1;
  Tipo: string;
  public loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private http: HttpClient, private https: Http,
              public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.juegoSeleccionado=navParams.get('juego');
    this.Tipo = "Manual";
  }

  async showLoading(message: string) {

    this.loading = await this.loadingCtrl.create({
      content: message,
    });
    await this.loading.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AsignarCromosPage');
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.RecuperarInscripcionesAlumnoJuego();
      this.Get_AlumnosColeccion();
    } else {
      this.RecuperarInscripcionesEquiposJuego();
      this.Get_EquiposColeccion();
    }

    this.CromosColeccion();

  }

  ionChange(){
    console.log(this.cromoSeleccionado);
    this.GET_ImagenCromo();
  }

  validar(tipo:any){

    this.haySeleccionado = false;
    if (this.studentsSelectedArray.length >= 1) {
      for (let i = 0; i < this.studentsSelectedArray.length; i++) {
        if (this.studentsSelectedArray[i].selected) {
            this.haySeleccionado = true;
            this.vectorCorrectos[i]=this.studentsSelectedArray[i];
        }
      }
    }

    console.log(this.vectorCorrectos)
      if (tipo === 1)
      {
        if (this.haySeleccionado!==true)
        {
          this.showLoading('Espere mientras se asignan los cromos.');
          setTimeout(() => {
            this.loading.dismiss();
            this.showAlert1();
          },1500);

        }
        else{
          this.showLoading('Espere mientras se asignan los cromos.');
          this.AsignarCromos();
        }

      }
      else{
        if (this.haySeleccionado!==true)
        {
          this.showLoading('Espere mientras se asignan los cromos.');
          setTimeout(() => {
            this.loading.dismiss();
            this.showAlert1();
          },1500);

        }
        else{
          this.showLoading('Espere mientras se asignan los cromos.');
          this.AsignarCromosAleatorios();
        }

      }
  }

  AsignarCromos() {

    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log('el juego es individual');
      this.AsignarCromoAlumnos(this.cromo[0].id);
      console.log("Revisa los cromos para verificar");

    } else {
      console.log('El juego es en equipo');
      this.AsignarCromoEquipos(this.cromo[0].id);
    }

    this.vectorCorrectos = [];

  }

  AsignarCromosAleatorios() {

    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log('el juego es individual');
      this.AsignarCromosAleatoriosAlumno();

    } else {
      console.log('El juego es en equipo');
      this.AsignarCromosAleatoriosEquipo();
    }
  }

  randomIndex(
    probabilities: number[],
    randomGenerator: () => number = Math.random): number {

      // get the cumulative distribution function
      let acc = 0;
      const cdf = probabilities
          .map(v => acc += v) // running total [4,7,9,10]
          .map(v => v / acc); // normalize to max 1 [0.4,0.7,0.9,1]

      // pick a random number between 0 and 1
      const randomNumber = randomGenerator();

      // find the first index of cdf where it exceeds randomNumber
      // (findIndex() is in ES2015+)
      return cdf.findIndex(p => randomNumber < p);
  }

  AsignarCromosAleatoriosAlumno() {

    for (let i = 0; i < this.vectorCorrectos.length; i++) {

      // Buscamos los alumnos que hemos seleccionado
      if (this.vectorCorrectos [i]) {

        let alumno: Alumno;
        alumno = this.items[i];
        console.log(alumno.Nombre + ' seleccionado');

        let alumnoJuegoDeColeccion: AlumnoJuegoDeColeccion;
        alumnoJuegoDeColeccion = this.inscripcionesAlumnos.filter(res => res.alumnoId === alumno.id)[0];
        console.log(alumnoJuegoDeColeccion);

        // tslint:disable-next-line:prefer-const
        let hits = this.probabilidadCromos.map(x => 0);


        for (let k = 0; k < this.numeroCromosRandom; k++) {

          console.log('Voy a hacer el post del cromo ' + k);

          this.indexCromo = this.randomIndex(this.probabilidadCromos);
          hits[this.indexCromo]++;

          console.log(this.cromosColeccion[this.indexCromo].Nombre);

          this.http.post<Album>(this.APIRURLAlbum, new Album (alumnoJuegoDeColeccion.id,
          this.cromosColeccion[this.indexCromo].id)).subscribe(res => {

            if (res !== undefined) {
              setTimeout(() => {
                this.loading.dismiss();
                console.log(res);
                this.showAlert();
              },1500);}

            else{
            setTimeout(() => {
              this.loading.dismiss();
              this.showAlert1();
            },1500);

            }

          });

        }
        console.log(hits);
      }
    }
  }

  AsignarCromosAleatoriosEquipo() {

    for (let i = 0; i < this.vectorCorrectos.length; i++) {

      // Buscamos los alumnos que hemos seleccionado
      if (this.vectorCorrectos [i]) {

        let equipo: Equipo;
        equipo = this.items[i];
        console.log(equipo.Nombre + ' seleccionado');

        let equipoJuegoDeColeccion: EquipoJuegoDeColeccion;
        equipoJuegoDeColeccion = this.inscripcionesEquipos.filter(res => res.equipoId === equipo.id)[0];
        console.log(equipoJuegoDeColeccion);

        // tslint:disable-next-line:prefer-const
        let hits = this.probabilidadCromos.map(x => 0);


        for (let k = 0; k < this.numeroCromosRandom; k++) {

          console.log('Voy a hacer el post del cromo ' + k);

          this.indexCromo = this.randomIndex(this.probabilidadCromos);
          hits[this.indexCromo]++;

          console.log(this.cromosColeccion[this.indexCromo].Nombre);

          this.http.post<AlbumEquipo>(this.APIRURLAlbumEquipo, new AlbumEquipo (equipoJuegoDeColeccion.id,
          this.cromosColeccion[this.indexCromo].id)).subscribe(res => {

            if (res !== undefined) {
              setTimeout(() => {
                this.loading.dismiss();
                console.log(res);
                this.showAlert();
              },1500);}

            else{
            setTimeout(() => {
              this.loading.dismiss();
              this.showAlert1();
            },1500);

            }

          });
        }
        console.log(hits);
      }
    }
  }

  AsignarCromoAlumnos(cromoSeleccionado) {

    console.log(cromoSeleccionado);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.vectorCorrectos.length; i++) {

       // Buscamos los alumnos que hemos seleccionado
       if (this.vectorCorrectos [i]) {

        let alumno: Alumno;
        alumno = this.items[i];
        console.log(alumno.Nombre + ' seleccionado');

        let alumnoJuegoDeColeccion: AlumnoJuegoDeColeccion;
        alumnoJuegoDeColeccion = this.inscripcionesAlumnos.filter(res => res.alumnoId === alumno.id)[0];
        console.log(alumnoJuegoDeColeccion);

        this.http.post<Album>(this.APIRURLAlbum, new Album (alumnoJuegoDeColeccion.id, cromoSeleccionado))
        .subscribe(res => {
          if (res !== undefined) {
            setTimeout(() => {
              this.loading.dismiss();
              console.log(res);
              this.showAlert();
            },1500);}

          else{
          setTimeout(() => {
            this.loading.dismiss();
            this.showAlert1();
          },1500);

          }});

       }
    }
  }

  AsignarCromoEquipos(cromoSeleccionado) {

    console.log(cromoSeleccionado);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.vectorCorrectos.length; i++) {

       // Buscamos los alumnos que hemos seleccionado
       if (this.vectorCorrectos [i]) {

        let equipo: Equipo;
        equipo = this.items[i];
        console.log(equipo.Nombre + ' seleccionado');

        let equipoJuegoDeColeccion: EquipoJuegoDeColeccion;
        equipoJuegoDeColeccion = this.inscripcionesEquipos.filter(res => res.equipoId === equipo.id)[0];
        console.log(equipoJuegoDeColeccion);

        this.http.post<Album>(this.APIRURLAlbumEquipo, new AlbumEquipo (equipoJuegoDeColeccion.id, cromoSeleccionado))
        .subscribe(res => {

          if (res !== undefined) {
            setTimeout(() => {
              this.loading.dismiss();
              console.log(res);
              this.showAlert();
            },1500);}

          else{
          setTimeout(() => {
            this.loading.dismiss();
            this.showAlert1();
          },1500);

          }

        });

       }
    }
  }

   // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen y los ordena de mayor a menor valor
   RecuperarInscripcionesAlumnoJuego() {
    this.http.get<AlumnoJuegoDeColeccion[]>(this.APIURLAlumnoJuegoDeColeccion + '?filter[where][juegoDeColeccionId]='
    + this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.inscripcionesAlumnos = inscripciones;
      console.log(this.inscripcionesAlumnos);
    });
  }

     // Recupera las inscripciones de los equipos en el juego y los puntos que tienen y los ordena de mayor a menor valor
    RecuperarInscripcionesEquiposJuego() {

      this.http.get<EquipoJuegoDeColeccion[]>(this.APIURLEquipoJuegoDeColeccion + '?filter[where][juegoDeColeccionId]='
    + this.juegoSeleccionado.id)
      .subscribe(inscripciones => {
        this.inscripcionesEquipos = inscripciones;
        console.log(this.inscripcionesEquipos);
      });
    }



  getSelectedStudents(stuArray: Array<any>){
    this.studentsSelectedArray = stuArray;
  }

  CromosColeccion() {
    // Busca los cromos dela coleccion en la base de datos
    this.http.get<Cromo[]>(this.APIUrl + '/' + this.juegoSeleccionado.coleccionId + '/cromos')
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.cromosColeccion = res;
        this.cromoSeleccionadoId=this.cromosColeccion[0].id;
        this.cromoSeleccionado=this.cromosColeccion[0].Nombre;
        this.GET_ImagenCromo();

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.cromosColeccion.length; i ++) {
          if (this.cromosColeccion[i].Probabilidad === 'Muy Baja') {
            this.probabilidadCromos[i] = 3;

          } else if (this.cromosColeccion[i].Probabilidad === 'Baja') {

            this.probabilidadCromos[i] = 7;

          } else if (this.cromosColeccion[i].Probabilidad === 'Media') {

            this.probabilidadCromos[i] = 20;

          } else if (this.cromosColeccion[i].Probabilidad === 'Alta') {

            this.probabilidadCromos[i] = 30;

          } else {

            this.probabilidadCromos[i] = 40;

          }

        }

        console.log(res);
      } else {
        console.log('No hay cromos en esta coleccion');
        this.cromosColeccion = undefined;
      }
    });
  }

   // Busca la imagen que tiene el nombre del cromo.Imagen y lo carga en imagenCromo
  GET_ImagenCromo() {

    this.http.get<any>(this.APIUrlCromos + '?filter[where][Nombre]=' + this.cromoSeleccionado)
    .subscribe(res => {
      this.cromo=res;
      console.log(this.cromo);
      console.log(this.cromo[0].Imagen);

      if (this.cromo[0].Imagen !== undefined ) {
        // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
        this.https.get('http://localhost:3000/api/imagenes/ImagenCromo/download/' + this.cromo[0].Imagen,
        { responseType: ResponseContentType.Blob })
        .subscribe(response => {
          const blob = new Blob([response.blob()], { type: 'image/jpg'});

          const reader = new FileReader();
          reader.addEventListener('load', () => {
            this.imagenCromo= reader.result.toString();
          }, false);

          if (blob) {
            reader.readAsDataURL(blob);
          }
      });
    }})
  }

  Get_AlumnosColeccion(){
    this.http.get<any[]>(this.APIRURLJuegoDeColeccion + '/' + this.juegoSeleccionado.id + '/alumnos')
    .subscribe(alumnosJuego => {
      console.log(alumnosJuego);
      this.itemsAPI = alumnosJuego;
      this.items = alumnosJuego;
    });
  }

  Get_EquiposColeccion(){
    this.http.get<any[]>(this.APIRURLJuegoDeColeccion + '/' + this.juegoSeleccionado.id + '/equipos')
    .subscribe(equiposJuego => {
      this.itemsAPI = equiposJuego;
      this.items= equiposJuego;
    });
  }


  //Nos permitirá fijar la lista de alumnos (filtrados)
  fijarItems(items :any[]){
  this.items = items;
  }

 //Función correspondiente al ion-searchbar que nos permitirá visualizar los alumnos que
  //tengas las caracteristicas definidas en el filtro
  getItems(ev: any) {
    // Reset items back to all of the items
    this.fijarItems(this.itemsAPI);
    // set val to the value of the searchbar
    let val = ev.target.value;

        if (val && val.trim() !== '') {
        this.items = this.items.filter(function(item) {
          return (item.Nombre.toLowerCase().includes(val.toLowerCase())||
          item.PrimerApellido.toLowerCase().includes(val.toLowerCase())||
          item.SegundoApellido.toLowerCase().includes(val.toLowerCase()));
        });
      }
    }

      //Función correspondiente al ion-searchbar que nos permitirá visualizar los alumnos que
  //tengas las caracteristicas definidas en el filtro
  getItems1(ev: any) {
    // Reset items back to all of the items
    this.fijarItems(this.itemsAPI);
    // set val to the value of the searchbar
    let val = ev.target.value;

        if (val && val.trim() !== '') {
        this.items = this.items.filter(function(item) {
          return (item.Nombre.toLowerCase().includes(val.toLowerCase()));
        });
      }
    }

    showConfirm() {
      const confirm = this.alertCtrl.create({
        title: 'Asignación Manual',
        message: '¿Ha asignado correctamente ? En caso afirmativo, haga click en ACEPTAR de lo contrario, haga click en CANCELAR ',
        buttons: [
          {
            text: 'Cancelar',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Aceptar',
            handler: () => {
              console.log('Agree clicked');
              this.validar(1);
            }
          }
        ]
      });
      confirm.present();
    }

    showConfirm1() {
      const confirm = this.alertCtrl.create({
        title: 'Asignación Aleatoria',
        message: '¿Ha asignado correctamente ? En caso afirmativo, haga click en ACEPTAR de lo contrario, haga click en CANCELAR ',
        buttons: [
          {
            text: 'Cancelar',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Aceptar',
            handler: () => {
              console.log('Agree clicked');
              this.validar(2);
            }
          }
        ]
      });
      confirm.present();
    }

    showAlert() {
      const alert = this.alertCtrl.create({
        title: 'Asignación efectuada',
        subTitle: 'Para comprobar la asignación, retroceda al álbum del grupo/alumno deseado.',
        buttons: ['Cerrar']
      });
      alert.present();
    }

    showAlert1() {
      const alert = this.alertCtrl.create({
        title: 'Asignación Abortada',
        subTitle: 'Compruebe que ha seleccionado el alumno/equipo deseado.',
        buttons: ['Cerrar']
      });
      alert.present();
    }

}
