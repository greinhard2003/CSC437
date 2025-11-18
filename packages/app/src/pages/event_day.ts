import { Auth, Observer } from "@calpoly/mustang";
import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";

export interface EventActivity {
  activity: string;
  time: string;
}

export interface Food {
  item: string;
}

export interface EventData {
  main_acts: EventActivity[];
  sideActs: EventActivity[];
  listeningPlan: EventActivity[];
  imageSrc: string;
  foods: Food[];
  breadcrumbHref: string;
}

function buildTableRows(acts: Array<EventActivity>) {
  return html`
    ${acts.map(
      (act) => html`
        <tr>
          <td>${act.time}</td>
          <td>${act.activity}</td>
        </tr>
      `
    )}
  `;
}

function buildFoodRows(foodItems: Array<Food>) {
  return html` ${foodItems.map((food) => html` <p>${food.item}</p> `)} `;
}

export class EventDayElement extends LitElement {
  @property()
  src?: string;
  @state()
  mainEvents: Array<EventActivity> = [];
  @state()
  sideEvents: Array<EventActivity> = [];
  @state()
  listeningPlan: Array<EventActivity> = [];
  @state()
  imageSrc: string = "";
  @state()
  food: Array<Food> = [];
  @state()
  breadcrumbHref: string = "";

  _authObserver = new Observer<Auth.Model>(this, "festigoer:auth");
  _user?: Auth.User;

  get authorization() {
    if (this._user?.authenticated) {
      return {
        Authorization: `Bearer ${(this._user as Auth.AuthenticatedUser).token}`,
      };
    }
    return undefined;
  }

  hydrate(src: string) {
    fetch(src, {
      headers: this.authorization,
    })
      .then((response) => response.json())
      .then((json: EventData) => {
        this.mainEvents = json.main_acts;
        this.sideEvents = json.sideActs;
        this.listeningPlan = json.listeningPlan;
        this.imageSrc = json.imageSrc;
        this.food = json.foods;
        this.breadcrumbHref = json.breadcrumbHref;
      });
  }

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe((auth: Auth.Model) => {
      this._user = auth.user;
      if (this._user?.authenticated && this.src) this.hydrate(this.src);
    });
  }

  override render() {
    return html`
      <h1>Event Schedule</h1>
      <div class="images">
        <img src="${this.imageSrc}" />
      </div>
      <section class="main-acts">
        <h2>Main Acts</h2>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Artist</th>
            </tr>
          </thead>
          <tbody>
            ${buildTableRows(this.mainEvents)}
          </tbody>
        </table>
      </section>
      <section class="side-acts">
        <h2>Side Acts</h2>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Artist</th>
            </tr>
          </thead>
          <tbody>
            ${buildTableRows(this.sideEvents)}
          </tbody>
        </table>
      </section>
      <section class="listening-plan">
        <h2>Listening Plan</h2>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Activity</th>
            </tr>
          </thead>
          <tbody>
            ${buildTableRows(this.listeningPlan)}
          </tbody>
        </table>
      </section>
      <section class="food">
        <h2>Food</h2>
        ${buildFoodRows(this.food)}
      </section>
      <a class="breadcrumb" href="${this.breadcrumbHref}">Back to Festival</a>
    `;
  }

  static styles = css`
    :host {
      display: grid;
      grid-column: start / span 7;
      grid-template-columns: subgrid;
    }

    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0 0.75rem;
    }

    p {
      text-align: center;
    }

    th,
    td {
      padding-bottom: 0.5rem;
      text-align: center;
    }

    h1 {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: start / end;
      padding: 1rem;
    }

    .images {
      flex-direction: column;
      display: flex;
      grid-column: 2 / 7;
      padding: 1rem;
    }

    .main-acts {
      display: flex;
      flex-direction: column;
      grid-column: 2 / span 1;
    }

    .side-acts {
      display: flex;
      flex-direction: column;
      grid-column: 3 / span 1;
    }

    .listening-plan {
      display: flex;
      flex-direction: column;
      grid-column: 5 / span 1;
    }

    .food {
      display: flex;
      flex-direction: column;
      grid-column: 6 / span 1;
    }

    .breadcrumb {
      display: flex;
      flex-direction: column;
      align-items: center;
      grid-column: 3 / 6;
    }
  `;
}
