import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _regiones : string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  private baseUrl: string = `https://restcountries.eu/rest/v2`;

  get regiones(): string[]{
    return [...this._regiones];
  }

  constructor(
    private http: HttpClient
  ) { }

  paisesPorRegion( region: string ): Observable<PaisSmall[]>{

    const url : string = `${ this.baseUrl }/region/${ region }?fields=name;alpha2Code`
    return this.http.get<PaisSmall[]>(url);

  }

  getPaisPorCodigo (codigo: string): Observable<Pais | null>{
    if(!codigo){
      return of(null)
    }
    const url = `${ this.baseUrl}/alpha/${ codigo }`
    return this.http.get<Pais>(url);
  }

  getPaisPorCodigoSmall (codigo: string): Observable<PaisSmall>{

    const url = `${ this.baseUrl}/alpha/${ codigo }?fields=name;alpha2Code`
    return this.http.get<PaisSmall>(url);

  }

  getPaisesPorCodigos( borders: string[] ): Observable<PaisSmall[]>{
    if(!borders){
      return of([])
    }

    const peticiones: Observable<PaisSmall>[] = [];
    borders.forEach(codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push( peticion );
    })

    return combineLatest( peticiones );
  }

}
