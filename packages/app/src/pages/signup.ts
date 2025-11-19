// src/auth/signup.ts
import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";

interface SignupFormData {
  firstname?: string;
  lastname?: string;
  username?: string;
  email?: string;
  password?: string;
  favoriteGenre?: string;
}

export class SignupFormElement extends LitElement {
  @state() formData: SignupFormData = {};
  @property() api: string = "/auth/register";
  @property() redirect: string = "/app/home";
  @state() error?: string;

  get canSubmit(): boolean {
    const { firstname, lastname, username, email, password, favoriteGenre } =
      this.formData;
    return Boolean(
      this.api &&
        firstname &&
        lastname &&
        username &&
        email &&
        password &&
        favoriteGenre
    );
  }

  render() {
    return html`
      <img class="image" src="/images/festigoers_signup_img.jpg" />
      <form @input=${this.handleChange} @submit=${this.handleSubmit}>
        <label class="left">
          <span>First Name</span>
          <input name="firstname" autocomplete="off" />
        </label>
        <label class="right">
          <span>Last Name</span>
          <input name="lastname" autocomplete="off" />
        </label>
        <label class="left">
          <span>Username</span>
          <input name="username" autocomplete="off" />
        </label>
        <label class="right">
          <span>Email</span>
          <input name="email" type="email" autocomplete="off" />
        </label>
        <label class="left">
          <span>Favorite Genre</span>
          <input name="favoriteGenre" autocomplete="off" />
        </label>
        <label class="right">
          <span>Password</span>
          <input name="password" type="password" autocomplete="off" />
        </label>

        <button type="submit" ?disabled=${!this.canSubmit}>Sign Up</button>
        <p class="error">${this.error || ""}</p>
      </form>
    `;
  }

  static styles = css`
    :host {
      padding: 2rem;
      display: grid;
      grid-template-columns: subgrid;
      grid-column: start / end;
    }
    span {
      text-align: right;
    }
    form {
      display: grid;
      grid-column: 5 / span 2;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(4, auto);
      gap: 1rem;
    }
    label {
      margin: 0px 10px 0px 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem 2rem;
    }
    .image {
      grid-column: 2 / 4;
      display: block;
      width: 100%;
      max-width: 100%;
      height: auto;
      padding: 0.5rem;
      box-sizing: border-box;
      justify-self: stretch;
      align-self: start;
    }
    .left {
      align-items: flex-end;
    }
    .right {
      align-items: flex-start;
    }
    button {
      grid-column: 1 / -1;
      justify-self: center;
      padding: 0.75rem 2rem;
    }
    .error {
      color: red;
      font-size: 0.9rem;
      min-height: 1.2em;
    }
    .error:empty {
      display: none;
    }
    button[disabled] {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `;

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.formData),
      });

      if (!res.ok) throw new Error("Signup failed");
      const { token, userId } = (await res.json()) as {
        token: string;
        userId: string;
      };

      localStorage.setItem("userId", userId);

      this.dispatchEvent(
        new CustomEvent("auth:message", {
          bubbles: true,
          composed: true,
          detail: ["auth/signin", { token, redirect: this.redirect }],
        })
      );

      this.dispatchEvent(
        new CustomEvent("festigoer:history", {
          bubbles: true,
          composed: true,
          detail: ["history/push", this.redirect],
        })
      );
    } catch (err: any) {
      this.error = err?.message || String(err);
      console.error(err);
    }
  }
}
