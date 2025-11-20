import { Observer, History, Auth } from "@calpoly/mustang";
import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";

interface CreateEventFormData {
  eventname?: string;
  location?: string;
  startdate?: string;
  enddate?: string;
}

export class PlanEventPage extends LitElement {
  @state()
  userid?: string;
  @state()
  userId?: string;
  @state()
  formData: CreateEventFormData = {};
  @property({ type: String })
  api: string = "/api/events";
  @state() dateError = "";

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
    this.userId = lsUserId;
    this._authObserver.observe((auth: Auth.Model) => {
      this._user = auth.user;
      this.userid = this._user?.username;
      if (!this._user?.authenticated)
        History.dispatch(this, "history/redirect", { href: "/app" });
    });
  }

  get datesValid(): boolean {
    const { startdate, enddate } = this.formData;
    if (!startdate || !enddate) return true;
    const ok = new Date(enddate).getTime() >= new Date(startdate).getTime();
    this.dateError = ok
      ? ""
      : "End date must be the same as or after the start date.";
    return ok;
  }

  get canSubmit(): boolean {
    const { eventname, location, startdate, enddate } = this.formData;
    const hasAll = this.api && eventname && location && startdate && enddate;
    return Boolean(hasAll && this.datesValid);
  }

  private handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (!target?.name) return;
    this.formData = { ...this.formData, [target.name]: target.value };
  };

  private async handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!this.canSubmit) return;

    try {
      const res = await fetch(this.api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.authorization ?? {}),
        },
        body: JSON.stringify({
          ...this.formData,
          userid: this.userId,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Server error ${res.status}: ${text}`);
      }

      History.dispatch(this, "history/navigate", { href: `/app/home` });
    } catch (err: any) {
      console.error(err);
    }
  }

  render() {
    return html`
      <h2>Get Your Boogie On!</h2>
      <form @input=${this.handleChange} @submit=${this.handleSubmit}>
        <label>
          <span>Event Name:</span>
          <input name="eventname" autocomplete="off" />
        </label>
        <label>
          <span>Event Location:</span>
          <input name="location" autocomplete="off" />
        </label>
        <label>
          <span>Start Date:</span>
          <input type="date" name="startdate" autocomplete="off" />
        </label>
        <label>
          <span>End Date:</span>
          <input type="date" name="enddate" autocomplete="off" />
        </label>
        <button type="submit" ?disabled=${!this.canSubmit}>
          Plan Festival
        </button>
        ${this.dateError
          ? html`<p
              id="enddate-error"
              class="error"
              role="alert"
              aria-live="polite"
            >
              ${this.dateError}
            </p>`
          : ""}
      </form>
    `;
  }

  static styles = css`
    :host {
      padding: 2rem;
      display: grid;
      grid-template-columns: subgrid;
      grid-column: start / end;
      gap: 0.5rem;
    }
    h2 {
      grid-column: 2 / end;
    }
    form {
      display: flex;
      flex-direction: column;
      grid-column: 2 / span 1;
      gap: 1rem;
    }
    button {
      align-self: center;
      width: fit-content;
    }
    .error {
      color: red;
    }
    label {
      margin: 0px 10px 0px 10px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  `;
}
