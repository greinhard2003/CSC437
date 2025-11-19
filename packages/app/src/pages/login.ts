import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";

// Bring in the Mustang provider + your existing login form element
import { define } from "@calpoly/mustang";
import { LoginFormElement } from "../components/login-form";

// Ensure the dependent custom elements are defined once per app
define({
  "login-form": LoginFormElement,
});

export class LoginPage extends LitElement {
  @property({ type: String }) api: string = "/auth/login";

  static styles = css`
    :host {
      padding: 2rem;
      display: grid;
      grid-template-columns: subgrid;
      grid-column: start / end;
    }
    section {
      display: flex;
      flex-direction: column;
      grid-column: 4 / span 1;
    }
    label {
      display: flex;
      flex-direction: column;
      margin-bottom: 1rem;
    }
  `;

  render() {
    return html`
      <section class="page">
        <mu-auth>
          <h2>User Login</h2>

          <main class="card">
            <login-form .api=${this.api}>
              <label>
                <span>Username:</span>
                <input name="username" autocomplete="off" />
              </label>
              <label>
                <span>Password:</span>
                <input type="password" name="password" />
              </label>
            </login-form>
          </main>

          <p>
            Or did you want to
            <a href="/app/signup">Sign up as a new user</a>?
          </p>
        </mu-auth>
      </section>
    `;
  }
}
