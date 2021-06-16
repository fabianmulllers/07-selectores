import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interface';
import { delay, switchMap, tap } from "rxjs/operators";

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styles: [
  ]
})
export class SelectorComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', [Validators.required]],
    pais: ['', [Validators.required]],
    frontera: ['', [Validators.required]],


  })

  // llenar selectores
  regiones : string[] = [];
  paises: PaisSmall[] = [];
  // fronteras: string[] = [];
  fronteras: PaisSmall[] = [];

  cargando: boolean = false;


  constructor(
    private fb: FormBuilder,
    private paisesService: PaisesService
  ) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;

    // cuando cambie el primer selector
    // this.miFormulario.get('region')?.valueChanges
    // .subscribe(
    //   region => {
    //     console.log(region);
    //     this.paisesService.paisesPorRegion(region)
    //     .subscribe(
    //       paises => {
    //         console.log(paises);
    //         this.paises = paises
    //       }
    //     );
    //   }
    // )

    this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap( ( _ ) => { 
        this.miFormulario.get('pais')?.reset('');
        this.cargando = true;
      } ),
      switchMap( region => this.paisesService.paisesPorRegion(region)),
      delay(2000)
    )
    .subscribe(
      paises => {
        this.cargando = false;
        this.paises = paises
      }
    )

    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap(( _ ) => { 
        this.miFormulario.get('frontera')?.reset('') 
        this.cargando = true;
      }),
      switchMap( codigo => this.paisesService.getPaisPorCodigo( codigo )),
      switchMap( pais => this.paisesService.getPaisesPorCodigos(pais?.borders! ))
    )
    .subscribe(
      paises => {
        this.fronteras = paises;
        this.cargando = false;
      }
    )
  }

  guardar(){
    console.log(this.miFormulario.value)
  }
}
