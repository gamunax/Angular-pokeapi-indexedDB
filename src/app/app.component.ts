import { Component, OnInit } from '@angular/core';
import { PokemonService } from './services/pokemon.service';

import { map, mergeMap, concatMap, exhaustMap } from 'rxjs/operators';
import { from } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  pokemones = [];

  constructor(
    private pokemonService: PokemonService
  ) {
  }

  ngOnInit() {
    this.pokemonService.getPokemones()
      .pipe(
       mergeMap((res: any) => {
         const results = res?.results.map(item => item.url);
         return from(results)
          .pipe(
            mergeMap((detail: any) => {
              return this.pokemonService.getPokemonById(detail)
                .pipe(
                  map((item: any) => {
                    return {
                      id: item?.id,
                      name: item?.name,
                      image: item?.sprites.front_default
                    };
                  })
                );
            }),
          );
       })
      )
      .subscribe(res => {
        this.pokemones = [...this.pokemones, res];
      });
  }

}
