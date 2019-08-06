import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,Loading, LoadingController } from 'ionic-angular';
import { HttpClient} from '@angular/common/http';


import {TablaAlumnoJuegoDePuntos} from '../../clases/TablaAlumnoJuegoDePuntos';
import {TablaEquipoJuegoDePuntos} from '../../clases/TablaEquipoJuegoDePuntos';
import {AlumnoJuegoDePuntos} from '../../clases/AlumnoJuegoDePuntos';
import {HistorialPuntosAlumno} from '../../clases/HistorialPuntosAlumno';
import {EquipoJuegoDePuntos} from '../../clases/EquipoJuegoDePuntos';
import {HistorialPuntosEquipo} from '../../clases/HistorialPuntosEquipo';


@IonicPage()
@Component({
  selector: 'page-asignar-puntos',
  templateUrl: 'asignar-puntos.html',
})
export class AsignarPuntosPage {

  // Juego De Puntos seleccionado
  juegoSeleccionado: any;

  // Recupera la informacion del juego seleccionado además de los alumnos o los equipos, los puntos y los niveles del juego
  alumnosDelJuego: any[];
  equiposDelJuego: any[];
  puntosDelJuego: any[];
  nivelesDelJuego: any[];

  fechaAsignacionPunto: Date;
  fechaString: string;

  alumno : AlumnoJuegoDePuntos;

  listaSeleccionable: any[] = [];

  haySeleccionado : boolean = false;

  // Recoge la inscripción de un alumno en el juego ordenada por puntos
  listaAlumnosOrdenadaPorPuntos: any[];

  studentsSelectedArray: Array<any> = new Array<any>();

  listaEquiposOrdenadaPorPuntos: any[];

   // Muestra la posición del alumno, el nombre y los apellidos del alumno, los puntos y el nivel
   rankingJuegoDePuntos: any[] = [];
   rankingJuegoDePuntosTotal: any[] = [];

   rankingEquiposJuegoDePuntos: any[] = [];

   vectorCorrectos: any[]=[];

   rankingEquiposJuegoDePuntosTotal: any[] = [];

   puntoSeleccionadoId: number;

   displayedColumnsAlumnos: string[] = ['posicion', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'puntos', 'nivel', ' '];
   displayedColumnsEquipos: string[] = ['posicion', 'nombreEquipo', 'miembros', 'puntos', 'nivel', ' '];

   alumnosEquipo: any[];

   tab1: any;
   tab2: any;

   seleccionados: boolean[];
   seleccionadosEquipos: boolean[];
   valorPunto: number = 1;
   public loading: Loading;

  private APIRURLJuegoDePuntos = 'http://localhost:3000/api/JuegosDePuntos';
  private APIURLAlumnoJuegoDePuntos = 'http://localhost:3000/api/AlumnoJuegosDePuntos';
  private APIURLEquiposJuegoDePuntos = 'http://localhost:3000/api/EquiposJuegosDePuntos';
  private APIURLHistorialPuntosAlumno = 'http://localhost:3000/api/HistorialesPuntosAlumno';
  private APIURLHistorialPuntosEquipo = 'http://localhost:3000/api/HistorialesPuntosEquipo';


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private http: HttpClient, public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {
    this.juegoSeleccionado=navParams.get('juego');
  }

  async showLoading(message: string) {

    this.loading = await this.loadingCtrl.create({
      content: message,
    });
    await this.loading.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AsignarPuntosPage');

    this.PuntosDelJuego();

    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.AlumnosDelJuego();
    } else {
      this.EquiposDelJuego();
    }
  }

  validar(){

    this.haySeleccionado = false;

    if (this.studentsSelectedArray.length >= 1) {
      for (let i = 0; i < this.studentsSelectedArray.length; i++) {
        if (this.studentsSelectedArray[i].selected) {
            this.haySeleccionado = true;
            this.vectorCorrectos[i]=this.studentsSelectedArray[i];
        }
      }
    }

    console.log('estos son' + this.vectorCorrectos);
      if (this.haySeleccionado!==true)
      {
        this.showLoading('Espere mientras se asignan los puntos.');
        setTimeout(() => {
          this.loading.dismiss();
          this.showAlert1();
        },1500);

      }
      else{
        this.showLoading('Espere mientras se asignan los puntos.');
        this.AsignarPuntos();
      }
  }

  AsignarPuntos() {

    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log('el juego es individual');

      this.AsignarPuntosAlumnos();
      console.log("Revisa los puntos para verificar");

    } else {
      console.log('El juego es en equipo');
      this.AsignarPuntosEquipos();
    }

    this.vectorCorrectos = [];

  }

  AsignarPuntosAlumnos() {

    for (let i = 0; i < this.vectorCorrectos.length; i++) {

      // Buscamos los alumnos que hemos seleccionado
      if (this.vectorCorrectos [i]) {

        let alumno: TablaAlumnoJuegoDePuntos;
        alumno = this.rankingJuegoDePuntos[i];
        console.log(alumno.nombre + ' seleccionado');

        let nuevosPuntos: number;
        nuevosPuntos = this.listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno + this.valorPunto;
        this.alumno = new AlumnoJuegoDePuntos (this.listaAlumnosOrdenadaPorPuntos[i].alumnoId,
        this.listaAlumnosOrdenadaPorPuntos[i].juegoDePuntosId, nuevosPuntos);

        this.http.put<AlumnoJuegoDePuntos>(this.APIURLAlumnoJuegoDePuntos + '/' + this.listaAlumnosOrdenadaPorPuntos[i].id, this.alumno)
        .subscribe( res => {
          if (res !== undefined) {
            setTimeout(() => {
              this.loading.dismiss();
              console.log(res);
              this.listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno = nuevosPuntos;
              // this.listaAlumnosOrdenadaPorPuntos[i].nivelId = nivel.id;

              this.rankingJuegoDePuntos[i].puntos = nuevosPuntos;
              this.fechaAsignacionPunto = new Date();
              this.fechaString = this.fechaAsignacionPunto.toLocaleDateString() + '  ' + this.fechaAsignacionPunto.toLocaleTimeString();

              // tslint:disable-next-line:max-line-length
              this.POST_HistorialAlumno(this.valorPunto, this.puntoSeleccionadoId, this.listaAlumnosOrdenadaPorPuntos[i].id, this.fechaString);
              this.OrdenarListaPorPuntos();
              this.OrdenarRankingPorPuntos();
              this.showAlert();
            },1500);

          }
          else{
            setTimeout(() => {
              this.loading.dismiss();
              this.showAlert1();
            },1500);

          }});

      }
    }

  }

  AsignarPuntosEquipos() {

    for (let i = 0; i < this.vectorCorrectos.length; i++) {

      // Buscamos los alumnos que hemos seleccionado
      if (this.vectorCorrectos[i]) {

        let equipo: TablaEquipoJuegoDePuntos;
        equipo = this.rankingEquiposJuegoDePuntos[i];
        console.log(equipo.nombre + ' seleccionado');


        let nuevosPuntos: number;
        nuevosPuntos = this.listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo + this.valorPunto;

        let valor : any;
        valor = new EquipoJuegoDePuntos(this.listaEquiposOrdenadaPorPuntos[i].equipoId,
        this.listaEquiposOrdenadaPorPuntos[i].juegoDePuntosId, nuevosPuntos);

        console.log(this.listaEquiposOrdenadaPorPuntos);
        console.log(valor);

        this.http.put<EquipoJuegoDePuntos>(this.APIURLEquiposJuegoDePuntos + '/' + this.listaEquiposOrdenadaPorPuntos[i].id, new EquipoJuegoDePuntos(this.listaEquiposOrdenadaPorPuntos[i].equipoId,
        this.listaEquiposOrdenadaPorPuntos[i].juegoDePuntosId, nuevosPuntos))
        .subscribe( res => {
          if (res !== undefined) {
            setTimeout(() => {
                this.loading.dismiss();
                console.log(res);
                this.listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo = nuevosPuntos;

                this.rankingEquiposJuegoDePuntos[i].puntos = nuevosPuntos;

                this.fechaAsignacionPunto = new Date();
                this.fechaString = this.fechaAsignacionPunto.toLocaleDateString() + '  ' + this.fechaAsignacionPunto.toLocaleTimeString();

                // tslint:disable-next-line:max-line-length
                this.POST_HistorialEquipo(this.valorPunto, this.puntoSeleccionadoId, this.listaEquiposOrdenadaPorPuntos[i].id, this.fechaString);
                this.OrdenarListaEquiposPorPuntos();
                this.OrdenarRankingEquiposPorPuntos();
                this.showAlert();
              },1500);
            }
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

  MostrarRankingSeleccionado() {

    // Si es indefinido muestro la tabla del total de puntos
    if (this.puntosDelJuego.filter(res => res.id === Number(this.puntoSeleccionadoId))[0] === undefined) {

      console.log('Tabla del principio');
      this.TablaClasificacionTotal();

    } else {
      console.log('Voy a por la clasficiacion del punto');
      this.ClasificacionPorTipoDePunto();

    }
  }

  ClasificacionPorTipoDePunto() {
    if (this.juegoSeleccionado.Modo === 'Individual') {

      for (let i = 0; i < this.listaAlumnosOrdenadaPorPuntos.length; i ++) {

        let alumno: any;
        let nivel: any;

        alumno = this.BuscarAlumno(this.listaAlumnosOrdenadaPorPuntos[i].alumnoId);

        if (this.listaAlumnosOrdenadaPorPuntos[i].nivelId !== undefined) {
          console.log(this.listaAlumnosOrdenadaPorPuntos[i].alumnoId);
        }

        this.http.get<any[]>(this.APIURLHistorialPuntosAlumno + '?filter[where][alumnoJuegoDePuntosId]='
        + this.listaAlumnosOrdenadaPorPuntos[i].id + '&filter[where][puntoId]=' + this.puntoSeleccionadoId)
        .subscribe(historial => {
          let puntos = 0;
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < historial.length; j ++) {
            puntos = puntos + historial[j].ValorPunto;
          }

          if (nivel !== undefined) {
            // tslint:disable-next-line:max-line-length
            this.rankingJuegoDePuntos[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
              puntos, nivel.Nombre);
          } else {
            // tslint:disable-next-line:max-line-length
            this.rankingJuegoDePuntos[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
              puntos);
          }

          if (i === this.listaAlumnosOrdenadaPorPuntos.length - 1 ) {
            this.OrdenarTablaPorPuntos();
          }
        });
      }
    } else {

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.listaEquiposOrdenadaPorPuntos.length; i ++) {

        let equipo: any;
        let nivel: any;

        equipo = this.BuscarEquipo(this.listaEquiposOrdenadaPorPuntos[i].equipoId);

        this.http.get<any[]>(this.APIURLHistorialPuntosEquipo + '?filter[where][equipoJuegoDePuntosId]='
        + this.listaEquiposOrdenadaPorPuntos[i].id + '&filter[where][puntoId]=' + this.puntoSeleccionadoId)
        .subscribe(historial => {

          let puntos = 0;
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < historial.length; j ++) {
            puntos = puntos + historial[j].ValorPunto;
          }


          if (nivel !== undefined) {
            this.rankingEquiposJuegoDePuntos[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
              puntos, nivel.Nombre);
          } else {
            this.rankingEquiposJuegoDePuntos[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
              puntos);
          }

          if (i === this.listaEquiposOrdenadaPorPuntos.length - 1 ) {
            this.OrdenarTablaPorPuntos();
          }
        });
      }
    }


  }

  OrdenarTablaPorPuntos() {
    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log('Voy a orddenar la tabla');
      // tslint:disable-next-line:only-arrow-functions
      this.rankingJuegoDePuntos = this.rankingJuegoDePuntos.sort(function(obj1, obj2) {
        return obj2.puntos - obj1.puntos;
      });
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.rankingJuegoDePuntos.length; i++) {
        this.rankingJuegoDePuntos[i].posicion = i + 1;
      }
    } else {

      console.log('Voy a ordenar la tabla de equipos');

      this.rankingEquiposJuegoDePuntos = this.rankingEquiposJuegoDePuntos.sort(function(obj1, obj2) {
        return obj2.puntos - obj1.puntos;
      });
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.rankingEquiposJuegoDePuntos.length; i++) {
        this.rankingEquiposJuegoDePuntos[i].posicion = i + 1;
      }
    }

  }


  // Recoge la lista y la ordena por puntos de mayor a menor
  OrdenarListaPorPuntos() {
    console.log('entro a ordenar lista');

    // tslint:disable-next-line:only-arrow-functions
    this.listaAlumnosOrdenadaPorPuntos = this.listaAlumnosOrdenadaPorPuntos.sort(function(obj1, obj2) {
      return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;
    });
    return this.listaAlumnosOrdenadaPorPuntos;
  }

  OrdenarListaEquiposPorPuntos() {
    console.log('entro a ordenar lista');

    // tslint:disable-next-line:only-arrow-functions
    this.listaEquiposOrdenadaPorPuntos = this.listaEquiposOrdenadaPorPuntos.sort(function(obj1, obj2) {
      return obj2.PuntosTotalesEquipo - obj1.PuntosTotalesEquipo;
    });
    return this.listaEquiposOrdenadaPorPuntos;
  }

// Ordena el ranking por puntos
  OrdenarRankingPorPuntos() {
  console.log('entro a ordenar ranking');
  // tslint:disable-next-line:only-arrow-functions
  this.rankingJuegoDePuntos = this.rankingJuegoDePuntos.sort(function(obj1, obj2) {
    return obj2.puntos - obj1.puntos;
  });

  for (let i = 0; i < this.rankingJuegoDePuntos.length; i ++) {
    this.rankingJuegoDePuntos[i].posicion = i + 1;
  }
  this.rankingJuegoDePuntos = this.rankingJuegoDePuntos.filter(res => res.nombre !== '');
  return this.rankingJuegoDePuntos;
  }

  OrdenarRankingEquiposPorPuntos() {
    console.log('entro a ordenar ranking');
    // tslint:disable-next-line:only-arrow-functions
    this.rankingEquiposJuegoDePuntos = this.rankingEquiposJuegoDePuntos.sort(function(obj1, obj2) {
      return obj2.puntos - obj1.puntos;
    });

    for (let i = 0; i < this.rankingEquiposJuegoDePuntos.length; i ++) {
      this.rankingEquiposJuegoDePuntos[i].posicion = i + 1;
    }
    this.rankingEquiposJuegoDePuntos = this.rankingEquiposJuegoDePuntos.filter(res => res.nombre !== '');
    return this.rankingEquiposJuegoDePuntos;
  }

  POST_HistorialAlumno(valorPunto: number, puntoId: number, alumnoJuegoDePuntos: number, fechaAsignacionPunto: string ) {

    console.log(fechaAsignacionPunto);
    // tslint:disable-next-line:max-line-length
    this.http.post<HistorialPuntosAlumno>(this. APIURLHistorialPuntosAlumno, new HistorialPuntosAlumno (valorPunto, puntoId, alumnoJuegoDePuntos, fechaAsignacionPunto))
    .subscribe(res => console.log(res));
  }

  POST_HistorialEquipo(valorPunto: number, puntoId: number, equipoJuegoDePuntos: number, fechaAsignacionPunto: string) {
    this.http.post<HistorialPuntosEquipo>(this. APIURLHistorialPuntosEquipo, new HistorialPuntosEquipo (valorPunto, puntoId, equipoJuegoDePuntos, fechaAsignacionPunto))
    .subscribe(res => console.log(res));
  }



  getSelectedStudents(stuArray: Array<any>){
    this.studentsSelectedArray = stuArray;
  }

  // Recupera los puntos que se pueden asignar en el juego
  PuntosDelJuego() {
    this.http.get<any[]>(this.APIRURLJuegoDePuntos + '/' + this.juegoSeleccionado.id + '/puntos')
    .subscribe(puntos => {
      this.puntosDelJuego = puntos;

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.puntosDelJuego.length; i ++) {
        this.listaSeleccionable.push(this.puntosDelJuego[i]);
      }
    });
  }

  // Recupera los alumnos que pertenecen al juego
  AlumnosDelJuego() {
    this.http.get<any[]>(this.APIRURLJuegoDePuntos + '/' + this.juegoSeleccionado.id + '/alumnos')
    .subscribe(alumnosJuego => {
      console.log(alumnosJuego);
      this.alumnosDelJuego = alumnosJuego;
      this.RecuperarInscripcionesAlumnoJuego();
    });
  }

    // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen y los ordena de mayor a menor valor
  RecuperarInscripcionesAlumnoJuego() {
      this.http.get<any[]>(this.APIURLAlumnoJuegoDePuntos + '?filter[where][juegoDePuntosId]=' + this.juegoSeleccionado.id)
      .subscribe(inscripciones => {
        this.listaAlumnosOrdenadaPorPuntos = inscripciones;
        this.OrdenarPorPuntos();
        this.TablaClasificacionTotal();
      });
  }

      // Recoge la lista y la ordena por puntos de mayor a menor
  OrdenarPorPuntos() {

    // tslint:disable-next-line:only-arrow-functions
    this.listaAlumnosOrdenadaPorPuntos = this.listaAlumnosOrdenadaPorPuntos.sort(function(obj1, obj2) {
      return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;
    });
    return this.listaAlumnosOrdenadaPorPuntos;
  }

  // En función del modo, recorremos la lisa de Alumnos o de Equipos y vamos rellenando el rankingJuegoDePuntos
  TablaClasificacionTotal() {

    if (this.juegoSeleccionado.Modo === 'Individual') {

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.listaAlumnosOrdenadaPorPuntos.length; i++) {
        let alumno: any;
        let nivel: any;

        alumno = this.BuscarAlumno(this.listaAlumnosOrdenadaPorPuntos[i].alumnoId);

        if (this.listaAlumnosOrdenadaPorPuntos[i].nivelId !== undefined) {
          console.log(this.listaAlumnosOrdenadaPorPuntos[i].alumnoId);
        }

        if (nivel !== undefined) {
          this.rankingJuegoDePuntos[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
            this.listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno, nivel.Nombre);

          this.rankingJuegoDePuntosTotal[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido,
            alumno.SegundoApellido, this.listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno, nivel.Nombre);
        } else {
          this.rankingJuegoDePuntos[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
            this.listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno);

          this.rankingJuegoDePuntosTotal[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido,
            alumno.SegundoApellido, this.listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno);
        }
      }


    } else {
      for (let i = 0; i < this.listaEquiposOrdenadaPorPuntos.length; i++) {
        let equipo: any;
        let nivel: any;

        equipo = this.BuscarEquipo(this.listaEquiposOrdenadaPorPuntos[i].equipoId);

        if (this.listaEquiposOrdenadaPorPuntos[i].nivelId !== undefined) {
          console.log(this.listaEquiposOrdenadaPorPuntos[i].equipoId);
        }

        if (nivel !== undefined) {
          this.rankingEquiposJuegoDePuntos[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
            this.listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo, nivel.Nombre);

          this.rankingEquiposJuegoDePuntosTotal[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
            this.listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo, nivel.Nombre);
        } else {
          this.rankingEquiposJuegoDePuntos[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
            this.listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo);

          this.rankingEquiposJuegoDePuntosTotal[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
            this.listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo);
        }
      }

    }
  }

  BuscarAlumno(alumnoId: number): any {

    let alumno: any;
    // tslint:disable-next-line:no-unused-expression
    alumno = this.alumnosDelJuego.filter(res => res.id === alumnoId)[0];
    return alumno;
  }

  BuscarEquipo(equipoId: number): any {

    let equipo: any;
    // tslint:disable-next-line:no-unused-expression
    equipo = this.equiposDelJuego.filter(res => res.id === equipoId)[0];
    return equipo;
  }

  // Recupera los equipos que pertenecen al juego
  EquiposDelJuego() {
    this.http.get<any[]>(this.APIRURLJuegoDePuntos + '/' + this.juegoSeleccionado.id + '/equipos')
    .subscribe(equiposJuego => {
      this.equiposDelJuego = equiposJuego;
      this.RecuperarInscripcionesEquiposJuego();
    });
  }

   // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen y los ordena de mayor a menor valor
   RecuperarInscripcionesEquiposJuego() {

    this.http.get<any[]>(this.APIURLEquiposJuegoDePuntos + '?filter[where][juegoDePuntosId]=' + this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaEquiposOrdenadaPorPuntos = inscripciones;
      console.log(this.listaEquiposOrdenadaPorPuntos);
      this.OrdenarPorPuntosEquipos();
      this.TablaClasificacionTotal();
    });
  }

  OrdenarPorPuntosEquipos() {

    // tslint:disable-next-line:only-arrow-functions
    this.listaEquiposOrdenadaPorPuntos = this.listaEquiposOrdenadaPorPuntos.sort(function(obj1, obj2) {
      return obj2.PuntosTotalesEquipo - obj1.PuntosTotalesEquipo;
    });
    return this.listaEquiposOrdenadaPorPuntos;
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
            this.validar();
          }
        }
      ]
    });
    confirm.present();
  }


  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Asignación efectuada',
      subTitle: 'Para comprobar la asignación, retroceda a la página anterior.',
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
