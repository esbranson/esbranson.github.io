class LawApp extends HTMLElement {
    #href;
    #filter;
    #rootElement; // non-nullable

    constructor() {
        super();

        // Create a shadow root
        this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'

        this.XPathResultPolyfill();

        this.filter = this.hasAttribute("filter")
            ? this.getAttribute("filter")
            : "";

        this.href = this.hasAttribute("href")
            ? this.getAttribute("href")
            : "";

        const linkElemAN = document.createElement("link");
        linkElemAN.setAttribute("rel", "stylesheet");
        linkElemAN.setAttribute("href", "akn.css");
        this.shadowRoot.appendChild(linkElemAN);

        const linkElemUSLM = document.createElement("link");
        linkElemUSLM.setAttribute("rel", "stylesheet");
        linkElemUSLM.setAttribute("href", "uslm.css");
        this.shadowRoot.appendChild(linkElemUSLM);

        const wrapper = document.createElement("span");
        this.#rootElement = wrapper;
        this.shadowRoot.append(wrapper);
    }

    doIt(data, filter) {
        if (data === undefined || data === null) { return; }

        if (filter) { LawApp.doFilter(data, filter); }

        this.#rootElement.textContent = ''; // LOL

        const AkomaNtoso = data.children[0];
        const wrapper = document.createElement("span");
        wrapper.dataset.id = 0;
        // Note: When the attribute is set, its value is always converted to a string. 
        // For example: element.dataset.example = null is converted into data-example="null".
        wrapper.append(AkomaNtoso);

        this.#rootElement.append(wrapper);
    }

    static doFilter(document, filter) {
        const results = Array.from(document.evaluate(filter, document, LawApp.nsResolver, XPathResult.ANY_TYPE, null));
        results.map((result) => result.remove());
    }

    //
    // <https://open-wc.org/guides/knowledge/attributes-and-properties/>
    //
    // «We recommend reflecting from an attribute to a property, but to avoid
    // reflecting from properties to attributes. This is because with custom
    // elements properties can update often and triggering a DOM change for
    // each update can impact performance.»
    //

    set href(value) {
        console.debug('set href', this.filter, { value });
        if (value === this.#href) { return }

        if (value) {
            LawApp.doFetch(value)?.then(data => this.doIt(data, this.filter))?.then(() => {this.#href = value});
        }
    }

    set filter(value) {
        console.debug('set filter', { value }, this.href);
        if (value === this.#filter) { return }

        if (this.href) {
            LawApp.doFetch(this.href)?.then(data => this.doIt(data, value))?.then(() => {this.#filter = value});
        }
    }

    get href() { return this.#href; }
    get filter() { return this.#filter; }

    static get observedAttributes() {
        return ["href", "filter"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.debug('attribute changed', { name }, { newValue });
        if (oldValue == newValue) { return; }

        if (name == "href" && this.href != newValue) {
            this.href = newValue;
        }
        else if (name == "filter" && this.filter != newValue) {
            this.filter = newValue;
        }
    }

    //
    // Utilities
    //

    static async doFetch(url) {
        try {
            // access-control-allow-origin: *
            const response = await fetch(url);
            if (response.ok) {
                const str = await response.text();
                const data = new window.DOMParser().parseFromString(str, "text/xml");
                const an = data.children[0];
                console.debug('doFetch', { an })
                return data;
            } else {
                console.error(response);
            }
        } catch (e) {
            console.error(e);
        }
    }

    static nsResolver(prefix) {
        const ns = {
            'an': 'http://docs.oasis-open.org/legaldocml/ns/akn/3.0',
            'uslm': 'http://schemas.gpo.gov/xml/uslm'
        };
        return ns[prefix] || null;
    }

    // https://stackoverflow.com/questions/47017441/how-to-use-array-from-with-a-xpathresult/72548135#72548135
    XPathResultPolyfill() {
        if (!XPathResult.prototype[Symbol.iterator]) XPathResult.prototype[Symbol.iterator] = function* () {
            switch (this.resultType) {
                case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
                case XPathResult.ORDERED_NODE_ITERATOR_TYPE:
                    let result;
                    while ((result = this.iterateNext()) != null) yield result;
                    break;
                case XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE:
                case XPathResult.ORDERED_NODE_SNAPSHOT_TYPE:
                    for (let i = 0; i < this.snapshotLength; i++) yield this.snapshotItem(i);
                    break;
                default:
                    yield this.singleNodeValue;
                    break;
            }
        };
    }
}

customElements.define("law-app", LawApp);
