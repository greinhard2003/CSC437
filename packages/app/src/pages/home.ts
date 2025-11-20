// src/auth/signup.ts
import { Observer, Auth } from "@calpoly/mustang";
import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";

export interface Event {
  _id: string;
  userid: string;
  eventname: string;
  startdate: string;
  enddate: string;
  location: string;
}

export class HomePage extends LitElement {
  @state()
  userid?: string;
  @state()
  events: Event[] = [];
  @state()
  error?: string;
  @property({ type: String })
  api: string = "/api/events";

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

  connectedCallback() {
    super.connectedCallback();

    const lsUserId = localStorage.getItem("userId") || undefined;

    this._authObserver.observe((auth: Auth.Model) => {
      this._user = auth.user;
      this.userid = this._user?.username;
      if (this._user?.authenticated) this.hydrate(lsUserId ?? "");
    });
  }

  async hydrate(userid: string) {
    try {
      const res = await fetch(`/api/events/${userid}`, {
        headers: this.authorization,
      });

      if (!res.ok) throw new Error(`Failed to load events (${res.status})`);

      this.events = await res.json();
      this.error = undefined;
    } catch (err: any) {
      this.error = err?.message || String(err);
      this.events = [];
      console.error("Error loading events:", err);
    }
  }

  populateEvents(events: Event[]) {
    return html`
      ${events.map(
        (event) => html`
          <div class="event">
            <a href="/home/events/${event._id}"><h2>${event.eventname}</h2></a>
            <div>
              <dt>
                <strong>Location</strong>
              </dt>
              <dd>${event.location}</dd>
            </div>
            <div>
              <dt>
                <strong>Start Date</strong>
              </dt>
              <dd>${event.startdate}</dd>
            </div>
            <div>
              <dt>
                <strong>End Date</strong>
              </dt>
              <dd>${event.enddate}</dd>
            </div>
            <a href="home/event/edit/${event._id}">Edit Festival</a>
          </div>
        `
      )}
    `;
  }

  render() {
    return html`
      <h1>Events Planned</h1>
      <div class="events">
        ${this.populateEvents(this.events)}
        <a class="addnew" href="home/planevent">Schedule New Festival</a>
      </div>
      <img class="image" src="/images/Sonic-Temple-Art-Music-Festival.jpg" />
    `;
  }

  static styles = css`
    :host {
      padding: 2rem;
      display: grid;
      grid-template-columns: subgrid;
      grid-column: 1 / -1;
    }
    h1 {
      display: block;
      justify-self: center;
      grid-column: 1 / span 5;
    }
    h2 {
      margin: 0;
    }
    .events {
      grid-auto-rows: min-content;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-column: 1 / span 4;
      gap: 2em;
    }
    .event {
      align-items: center;
      display: grid;
      grid-template-columns: subgrid;
      grid-column: 1 / -1;
    }
    dd {
      margin: 0;
      justify-self: start;
      text-align: left;
    }
    .addnew {
      display: block;
      grid-column: 1 / span 5;
      justify-self: center;
    }
    .image {
      grid-column: 5 / span 2;
      width: 100%;
    }
    a {
      color: var(--color-link);
      &:visited {
        color: var(--color-link-visited);
      }
    }
  `;
}
