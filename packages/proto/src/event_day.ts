import { html, css, LitElement } from "lit";
import { property } from "lit/decorators.js";

export class EventDayElement extends LitElement {
  @property({ type: String, attribute: "img-src" })
  imgSrc = "";

  override render() {
    return html`
      <h1>Event Schedule</h1>
      <div class="images">
        <img src="${this.imgSrc}" />
      </div>
      <section class="main-acts">
        <h2>Main Acts</h2>
        <table>
          <thead>
            <tr>
              <th>Artist</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Richie Havens</td>
              <td>05:00 pm - 05:30 pm</td>
            </tr>
            <tr>
              <td>Ravi Shankar</td>
              <td>12:00 am - 12:45 am</td>
            </tr>
            <tr>
              <td>Arlo Guthrie</td>
              <td>01:45 am - 12:15 am</td>
            </tr>
            <tr>
              <td>Joan Baez</td>
              <td>03:00 am - 03:45 am</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section class="side-acts">
        <h2>Side Acts</h2>
        <table>
          <thead>
            <tr>
              <th>Artist</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sweetwater</td>
              <td>06:15 pm - 07:00 pm</td>
            </tr>
            <tr>
              <td>Bert Sommer</td>
              <td>07:15 pm - 07:45 pm</td>
            </tr>
            <tr>
              <td>Tim Hardin</td>
              <td>08:30 pm - 09:15 pm</td>
            </tr>
            <tr>
              <td>Melanie</td>
              <td>01:00 am - 01:30 am</td>
            </tr>
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
            <tr>
              <td>05:00 pm - 05:30 pm</td>
              <td>Richie Havens</td>
            </tr>
            <tr>
              <td>05:30 pm - 06:15 pm</td>
              <td>Break / Food</td>
            </tr>
            <tr>
              <td>06:15 pm - 07:00 pm</td>
              <td>Sweetwater</td>
            </tr>
            <tr>
              <td>07:00 pm - 08:20 pm</td>
              <td>Power Nap</td>
            </tr>
            <tr>
              <td>08:20 pm - 09:15 pm</td>
              <td>Tim Hardin</td>
            </tr>
            <tr>
              <td>09:15 pm - 10:30 pm</td>
              <td>MORE OATS</td>
            </tr>
            <tr>
              <td>10:30 pm - 09:00 am</td>
              <td>Sleep</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section class="food">
        <h2>Food</h2>
        <p>Hope you like oats!</p>
      </section>
      <a class="breadcrumb" href="woodstock.html">Back to Festival</a>
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
      margin-top: 0;
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
