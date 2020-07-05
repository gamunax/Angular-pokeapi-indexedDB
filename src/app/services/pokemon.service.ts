import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  readonly API_POKEMONES = 'https://pokeapi.co/api/v2/pokemon?limit=200';

  constructor(
    private http: HttpClient
  ) { }

  getPokemones() {
    console.log('xxx');
    return this.http.get(this.API_POKEMONES);
  }

  getPokemonById(apiId) {
    return this.http.get(apiId);
  }
}
