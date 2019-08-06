//Se define la clase HistorialPuntosEquipo junto a los atributos que le corresponden

export class HistorialPuntosEquipo {

  ValorPunto: number;
  puntoId: number;
  equipoJuegoDePuntosId: number;
  id: number;
  fecha: string;

  constructor(ValorPunto?: number, puntoId?: number, equipoJuegoDePuntosId?: number, fecha?: string) {

    this.ValorPunto = ValorPunto;
    this.puntoId = puntoId;
    this.equipoJuegoDePuntosId = equipoJuegoDePuntosId;
    this.fecha = fecha;
  }
}
