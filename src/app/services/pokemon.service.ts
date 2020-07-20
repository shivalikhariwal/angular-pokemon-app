import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { PokeAPI, PokemonDetails } from "../interfaces";

@Injectable({
  providedIn: "root",
})
export class PokemonService {
  pokeAPI: any;

  constructor(private http: HttpClient) {
    this.pokeAPI = environment.pokemonURL;
  }

  /**
   * Returns original 151 pokemon
   */
  getPokemon(): Observable<PokeAPI> {
    return this.http
      .get<PokeAPI>(`${this.pokeAPI}?limit=151`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Uses pokemon name to retrieve individual pokemon details
   */
  getPokemonDetails(name): Observable<PokemonDetails> {
    return this.http
      .get<PokemonDetails>(`${this.pokeAPI}/${name}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Handles any request error
   */
  private handleError(error: HttpErrorResponse) {
    // return an observable with a user-facing error message
    return throwError("Something bad happened; please try again later.");
  }
}
