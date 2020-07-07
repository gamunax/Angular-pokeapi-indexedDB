import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import Dexie from 'dexie';
import { OnlineOfflineService } from './online-offline.service';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  readonly API_POKEMONES = 'https://pokeapi.co/api/v2/pokemon?limit=200';
  private db: any;
  private table: Dexie.Table<any> = null;
  private tableListPokemon: Dexie.Table<any> = null;

  constructor(
    private http: HttpClient,
    private onlineOfflineService: OnlineOfflineService
  ) {
    this.initIndexedDB();
  }

  private initIndexedDB() {
    this.db = new Dexie('db-pokemon');
    this.db.version(1).stores({
      pokemon: 'id, name, image',
      pokemonList: 'id, url'
    });

    this.onlineOfflineService.connectionChanged.subscribe(online => {
      if (online) {
        console.log('borra');
        this.clearRows();
        
      }
    });

    this.tableListPokemon = this.db.table('pokemonList');
    this.table = this.db.table('pokemon');
  }

  getPokemones() {
    return this.http.get(this.API_POKEMONES);
  }

  getPokemonById(apiId) {
    return this.http.get(apiId);
  }

  async setPokemonListIndexedDB(url) {
    try {
      console.log(url);
      await this.tableListPokemon.add(url);
    } catch (error) {
      console.log('error');
    }
  }

  async setPokemonIndexedDB(pokemon) {
    try {
      await this.table.add(pokemon);
    } catch (error) {
      console.log('error');
    }
  }

  async sendIndexedPokemon() {
    const pokemones = await this.table.toArray();
    console.log(pokemones);
  }

  clearRows() {
    this.db.pokemon.clear();
    this.db.pokemonList.clear();
  }

  async getPokemonIndexedDB(id) {
    return await this.db.pokemon.get(id);
  }

  async getPokemonList() {
    return await this.tableListPokemon.toArray();
  }

}
