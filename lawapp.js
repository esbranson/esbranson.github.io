class LawApp extends HTMLElement {
    constructor() {
        super();

        // Create a shadow root
        this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'

        const url = this.hasAttribute("href")
            ? this.getAttribute("href")
            : "https://www.legislation.gov.uk/ukpga/1982/11/data.akn";

        this.doFetch(url).then(data => this.shadowRoot.append(data.children[0]));

        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "akn.css");
        this.shadowRoot.appendChild(linkElem);
    }

    async doFetch(url) {
        try {
            // access-control-allow-origin: *
            const response = await fetch(url);
            if (response.ok) {
                const str = await response.text();
                const data = new window.DOMParser().parseFromString(str, "text/xml");
                console.debug({data})
                return data;
            } else {
                console.error(response);
            }
        } catch (e) {
            console.error(e);
        }
    }
}

customElements.define("law-app", LawApp);
