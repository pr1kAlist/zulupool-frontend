import {
    setAssetPath,
    SlButton,
} from "@shoelace-style/shoelace/dist/custom-elements";

console.log(setAssetPath, SlButton);

setAssetPath("/assets/icons-shoelace/");

customElements.define("sl-button", SlButton);
