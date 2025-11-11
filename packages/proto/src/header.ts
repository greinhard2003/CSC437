import { define, Auth, Dropdown, Events, Observer } from "@calpoly/mustang";
import { css, html, LitElement } from "lit";
import { state } from "lit/decorators.js";

export class HeaderElement extends LitElement {
  static uses = define({
    "mu-dropdown": Dropdown.Element,
  });

  _authObserver = new Observer<Auth.Model>(this, "festigoer:auth");

  @state()
  loggedIn = false;

  @state()
  userid?: string;

  connectedCallback() {
    super.connectedCallback();

    this._authObserver.observe((auth: Auth.Model) => {
      const { user } = auth;

      if (user && user.authenticated) {
        this.loggedIn = true;
        this.userid = user.username;
      } else {
        this.loggedIn = false;
        this.userid = undefined;
      }
    });
  }

  render() {
    return html`
      <header>
        <h1>Festi-go-ers</h1>
        <mu-dropdown>
          <a slot="actuator"> Hello, ${this.userid || "Guest"} </a>
          <div class="dropdown-background">
            <menu>
              <li>
                <label
                  class="dark-mode-switch"
                  @change=${(event: Event) =>
                    Events.relay(event, "dark-mode", {
                      checked: (event.target as HTMLInputElement)?.checked,
                    })}
                >
                  <input type="checkbox" />
                  Dark Mode
                </label>
              </li>
              <li>
                ${this.loggedIn
                  ? this.renderSignOutButton()
                  : this.renderSignInButton()}
              </li>
            </menu>
          </div>
        </mu-dropdown>
      </header>
    `;
  }

  renderSignOutButton() {
    return html`
      <button
        @click=${(e: UIEvent) => {
          Events.relay(e, "auth:message", ["auth/signout"]);

          window.location.href = "/login.html";
        }}
      >
        Sign Out
      </button>
    `;
  }

  renderSignInButton() {
    return html` <a href="/login.html"> Sign In… </a> `;
  }

  static _initialized = false;
  static initializeOnce() {
    if (HeaderElement._initialized) return;
    HeaderElement._initialized = true;

    function toggleDarkMode(page: HTMLElement | null, checked: boolean) {
      page?.classList.toggle("dark-mode", checked);
    }

    document.body.addEventListener("dark-mode", (event: Event) =>
      toggleDarkMode(
        event.currentTarget as HTMLElement,
        (event as CustomEvent).detail.checked
      )
    );
  }

  static styles = css`
    :host {
      display: block;
      grid-column: start / end;
    }

    header {
      color: var(--color-text-header);
      background-color: var(--color-background-header);
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      text-align: var(--text-align-header);
      font-size: var(--font-size-header);
      font-family: var(--font-family);
      margin: var(--margin-header);
      padding: var(--padding-header);
    }

    a {
      color: var(--color-text-header);
    }

    .dropdown-background {
      background-color: var(--color-background-header);
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
    }
    li {
      list-style: none;
    }
  `;
}
