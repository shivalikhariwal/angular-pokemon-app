import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PokeAPI, PokemonDetails, Results } from "../../interfaces";
import { PokemonService } from "../../services/pokemon.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  @Output() exportPokemons = new EventEmitter();
  pokemonsLoaded: boolean;
  pokemons: PokeAPI;
  query: string;
  abilityFilters: Array<string>;
  typeFilters: string;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.pokemonsLoaded = false;
    this.getPokemons();
  }

  /**
   * Loads in all 151 Original pokemon and gets
   * their details and species details
   */
  getPokemons(): void {
    this.pokemonService.getPokemon().subscribe((data: PokeAPI) => {
      this.pokemons = data;

      if (this.pokemons.results && this.pokemons.results.length) {
        // get pokemon details for every pokemon
        this.pokemons.results.forEach((pokemon) => {
          // set pokemon id
          pokemon.id = pokemon.url.split("/")[
            pokemon.url.split("/").length - 2
          ];

          this.getPokemonDetails(pokemon);
          //this.getPokemonSpeciesDetails(pokemon);
        });
      }
    });
  }

  /**
   * Gets and sets a pokemons details
   */
  getPokemonDetails(pokemon: Results): void {
    this.pokemonService
      .getPokemonDetails(pokemon.name)
      .subscribe((details: PokemonDetails) => {
        pokemon.details = details;
        // when last pokemon details have been loaded
        // send pokemons to header component
        if (pokemon.id === "151") {
          this.pokemonsLoaded = true;
          this.exportPokemons.emit(this.pokemons.results);
        }
      });
  }

  // getPokemonSpeciesDetails(pokemon: Results): void {
  //   this.pokemonService
  //     .getPokemonSpecies(pokemon.name)
  //     .subscribe((species: any) => {
  //       const entries = species.flavor_text_entries;
  //       if (entries) {
  //         entries.some((flavor) => {
  //           if (flavor.language.name === "en") {
  //             pokemon.description = flavor.flavor_text;
  //           }
  //         });
  //       }
  //     });
  // }
}
