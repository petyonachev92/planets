import EventEmitter from "eventemitter3";
import image from "../images/planet.svg";

const URL = 'https://swapi.boom.dev/api/planets/';
let planets = [];

export default class Application extends EventEmitter {
  static get events() {
    return {
      READY: "ready",
    };
  }

  constructor() {
    super();
    this._loading = document.getElementsByTagName('progress')[0];

    

    

    this.emit(Application.events.READY);
    this.addListener('Data loaded', this._stopLoading);
    this._startLoading();

    setTimeout(5000);

    
    console.log(planets);
    
  }

  _render({ name, terrain, population }) {
    return `
<article class="media">
  <div class="media-left">
    <figure class="image is-64x64">
      <img src="${image}" alt="planet">
    </figure>
  </div>
  <div class="media-content">
    <div class="content">
    <h4>${name}</h4>
      <p>
        <span class="tag">${terrain}</span> <span class="tag">${population}</span>
        <br>
      </p>
    </div>
  </div>
</article>
    `;
  }

  async _load(url) {
    try {

      let data = await getData(url);

      let next = data.next;
      let planetsArr = data.results;

      planetsArr.forEach(planet => {
        planets.push(planet);
        this._create(planet);
        
      });
      if (next != null) {
        await this._load(next);
      }

      this._stopLoading();
      
    }
    catch (err) {
      console.error(err);
    }
  }

  _create(planet){
    const box = document.createElement("div");
    box.classList.add("box");
    box.innerHTML = this._render({
      name: planet.name,
      terrain: planet.terrain,
      population: planet.population
    });
    
    document.body.getElementsByClassName('main')[0].appendChild(box);
  }

  _startLoading() {
    /* this._loading.hidden = false;document.body.getElementsByClassName('main')[0].appendChild(box); */
    console.log('Start loading');
    this._load(URL);
  }

  _stopLoading() {
    this._loading.style.display = 'none';
  }



}

//get each planet data and return it
async function getData(url) {
  try {
  
    const response = await fetch(url);
    const data = await response.json();

    return data;      
  }
  catch (err) {
    console.error(err);
  }
}