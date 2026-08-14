import { Route, Switch } from "wouter";
import AdminPromo from "./pages/admin-promo";
import Index from "./pages/index";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import Privacy from "./pages/privacy";
import DeleteAccount from "./pages/delete-account";
import PetProfile from "./pages/pet-profile";
import Call from "./pages/call";
import { Provider } from "./components/provider";
import { AgentFeedback, RunableBadge } from "@runablehq/website-runtime";

function App() {
  return (
    <Provider>
      <Switch>
        <Route path="/" component={Index} />
        <Route path="/sign-in" component={SignIn} />
        <Route path="/sign-up" component={SignUp} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/delete-account" component={DeleteAccount} />
        <Route path="/pet/:code" component={PetProfile} />
        <Route path="/call/:roomId" component={Call} />
        <Route path="/admin/promo" component={AdminPromo} />
      </Switch>
      {import.meta.env.DEV && <AgentFeedback />}
      {<RunableBadge />}
    </Provider>
  );
}

export default App;
