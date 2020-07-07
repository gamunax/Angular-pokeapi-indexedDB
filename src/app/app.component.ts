import { Component, OnInit } from '@angular/core';
import { PokemonService } from './services/pokemon.service';

import { map, mergeMap, concatMap, exhaustMap } from 'rxjs/operators';
import { from, fromEvent, Observable } from 'rxjs';
import { OnlineOfflineService } from './services/online-offline.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  pokemon: any;
  pokemones = [];

  constructor(
    private pokemonService: PokemonService,
    private onlineOfflineService: OnlineOfflineService
  ) {
  }

  ngOnInit() {

    this.onlineOfflineService.connectionChanged.subscribe(async online => {
      console.log(online);
      if (online) {
        this.getPokemones();
      } else {
        const pokemonList = await this.pokemonService.getPokemonList();
        console.log(pokemonList);
      }
    });
  }

  setPokemonIndexedDB(pokemon) {
    return this.pokemonService.setPokemonIndexedDB(pokemon);
  }

  sendData() {
    this.pokemonService.sendIndexedPokemon();
  }

  getPokemones() {
    this.pokemonService.getPokemones()
      .pipe(
       mergeMap((res: any) => {
         const results = res?.results.map((item: any, index) => {
          this.pokemonService.setPokemonListIndexedDB({id: index, url: item.url});
          return item.url;
         });
         return from(results)
          .pipe(
            mergeMap((detail: any) => {
              return this.pokemonService.getPokemonById(detail)
                .pipe(
                  map((item: any) => {
                    const pokemon = {
                      id: item?.id,
                      name: item?.name,
                      image: item?.sprites.front_default
                    };
                    this.setPokemonIndexedDB(pokemon);
                    return pokemon;
                  })
                );
            }),
          );
       })
      )
      .subscribe( async res => {
        const pokemones = await this.pokemonService.getPokemonIndexedDB(res.id);
        this.pokemones = [...this.pokemones, pokemones];
      });
  }


}
