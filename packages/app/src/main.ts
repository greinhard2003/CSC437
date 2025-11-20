import { Auth, define, History, Switch } from "@calpoly/mustang";
import { html } from "lit";
import { HeaderElement } from "./components/header";
import { SignupFormElement } from "./pages/signup";
import { LoginPage } from "./pages/login";
import { HomePage } from "./pages/home";
import { PlanEventPage } from "./pages/plan_event";

const routes = [
  {
    path: "/app/tour/:id",
    view: (params: Switch.Params) => html`
      <tour-view tour-id=${params.id}></tour-view>
    `,
  },
  {
    path: "/app/signup",
    view: () => html` <signup-form></signup-form> `,
  },
  {
    path: "/app",
    view: () => html` <login-page></login-page> `,
  },
  {
    path: "/app/home",
    view: () => html` <home-page></home-page> `,
  },
  {
    path: "/app/home/planevent",
    view: () => html`<planevent-page></planevent-page>`,
  },
  {
    path: "/",
    redirect: "/app",
  },
];

HeaderElement.initializeOnce();

define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "festigoer-header": HeaderElement,
  "signup-form": SignupFormElement,
  "login-page": LoginPage,
  "home-page": HomePage,
  "planevent-page": PlanEventPage,
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "festigoer:history", "festigoer:auth");
    }
  },
});
