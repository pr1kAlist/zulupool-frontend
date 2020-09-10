import {
    setAssetPath,
    SlButton,
} from "@shoelace-style/shoelace/dist/custom-elements";

setAssetPath("/assets/icons-shoelace/");

customElements.define("sl-button", SlButton);
