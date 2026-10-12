import { Route, Switch } from "wouter";
import AdminPromo from "./pages/admin-promo";
import Promo from "./pages/promo";
import Index from "./pages/index";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import Privacy from "./pages/privacy";
import ResetPassword from "./pages/reset-password";
import DeleteAccount from "./pages/delete-account";
import PetProfile from "./pages/pet-profile";
import Call from "./pages/call";
import Dashboard from "./pages/app/dashboard";
import AddPet from "./pages/app/add-pet";
import PetDetail from "./pages/app/pet-detail";
import HealthHub from "./pages/app/health-hub";
import Album from "./pages/app/album";
import Community from "./pages/app/community";
import Marketplace from "./pages/app/marketplace";
import Businesses from "./pages/app/businesses";
import Profile from "./pages/app/profile";
import Subscription from "./pages/app/subscription";
import FirstAid from "./pages/app/first-aid";
import Pharmacy from "./pages/app/pharmacy";
import BreedGuide from "./pages/app/breed-guide";
import Consult from "./pages/app/consult";
import { Provider } from "./components/provider";
import { AgentFeedback, RunableBadge } from "@runablehq/website-runtime";

function App() {
  return (
    <Provider>
      <Switch>
        <Route path="/" component={Index} />
        <Route path="/sign-in" component={SignIn} />
        <Route path="/sign-up" component={SignUp} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/delete-account" component={DeleteAccount} />
        <Route path="/pet/:code" component={PetProfile} />
        <Route path="/call/:roomId" component={Call} />
        <Route path="/admin/promo" component={AdminPromo} />
        <Route path="/promo/:code" component={Promo} />

        {/* App (browser) — mesma conta usada na app Android/iOS */}
        <Route path="/app" component={Dashboard} />
        <Route path="/app/pets/novo" component={AddPet} />
        <Route path="/app/pet/:id" component={PetDetail} />
        <Route path="/app/saude" component={HealthHub} />
        <Route path="/app/album" component={Album} />
        <Route path="/app/comunidade" component={Community} />
        <Route path="/app/loja" component={Marketplace} />
        <Route path="/app/negocios" component={Businesses} />
        <Route path="/app/perfil" component={Profile} />
        <Route path="/app/subscricao" component={Subscription} />
        <Route path="/app/primeiros-socorros" component={FirstAid} />
        <Route path="/app/farmacia" component={Pharmacy} />
        <Route path="/app/guia-racas" component={BreedGuide} />
        <Route path="/app/consulta" component={Consult} />
      </Switch>
      {import.meta.env.DEV && <AgentFeedback />}
      {<RunableBadge />}
    </Provider>
  );
}

export default App;
