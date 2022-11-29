class LawApp extends HTMLElement {
    constructor() {
        super();

        // Create a shadow root
        this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'

        let url = this.hasAttribute("href")
            ? this.getAttribute("href")
            : "https://www.legislation.gov.uk/ukpga/1982/11/data.akn";

        url = "https://www.legislation.gov.uk/ukpga/1982/11/data.akn";
        fetch(url)
            .then(response => response.text())
            .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
            .then(data => { console.log(data.children[0]); this.shadowRoot.append(data.children[0]); });

        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "akn.css");
        this.shadowRoot.appendChild(linkElem);
    }

    async doFetch(qid) {
        try {
            const uri = 'https://www.wikidata.org/wiki/Special:EntityData/' + qid;
            // access-control-allow-origin: *
            let response = await fetch(uri, { headers: { 'accept': 'application/ld+json' } });
            if (response.ok) {
                const json = await response.json();
                console.log('[index]', qid, json['@graph'][1]['@id']);
            } else {
                console.debug(response);
            }
        } catch (e) {
            console.debug(e);
        }
    }
}

customElements.define("law-app", LawApp);
