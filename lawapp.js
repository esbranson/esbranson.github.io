class LawApp extends HTMLElement {
    #_href;
    #_filter;

    constructor() {
        super();

        this.XPathResultPolyfill();

        // Create a shadow root
        this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'

        this.href = this.hasAttribute("href")
            ? this.getAttribute("href")
            : "https://www.legislation.gov.uk/ukpga/1982/11/data.akn";

        this.filter = this.hasAttribute("filter")
            ? this.getFilter(this.getAttribute("filter"))
            : "";
    }

    doIt(data, filter) {
        this.doFilter(data, filter);

        this.shadowRoot.textContent = '';

        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "akn.css");
        this.shadowRoot.appendChild(linkElem);

        this.shadowRoot.append(data.children[0]);
    }

    doFilter(document, filter) {
        const results = Array.from(document.evaluate(filter, document, () => "http://docs.oasis-open.org/legaldocml/ns/akn/3.0", XPathResult.ANY_TYPE, null));
        results.map((result) => result.remove());
    }

    set href(value) {
        console.debug('set href', { value });
        console.debug('set href', this.filter, value);

        this._href = value;
        if (this.filter) {
            this.doFetch(value).then(data => this.doIt(data, this.filter));
        }
    }

    set filter(value) {
        console.debug('set filter', { value });
        console.debug('set filter', value, this.href);

        this._filter = value;
        if (this.href) {
            this.doFetch(this.href).then(data => this.doIt(data, value));
        }
    }

    get href() { return this._href; }
    get filter() { return this._filter; }

    static get observedAttributes() {
        return ['href', 'filter'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.debug('attribute changed', { name }, { newValue });
        if (oldValue == newValue) { return; }

        if (name == "href" && this.href != newValue) {
            this.href = newValue;
        }
        else if (name == "filter" && this.filter != this.getFilter(newValue)) {
            this.filter = this.getFilter(newValue);
        }
    }

    getFilter(filter_list_str) {
        const list = filter_list_str?.split(/[\s]+/);
        const xpath = list?.map(str => ('//an:' + str)).join('|');
        console.debug('xpath', { xpath });
        return xpath;
    }

    async doFetch(url) {
        try {
            // access-control-allow-origin: *
            const response = await fetch(url);
            if (response.ok) {
                const str = await response.text();
                const data = new window.DOMParser().parseFromString(str, "text/xml");
                console.debug('doFetch', { data })
                return data;
            } else {
                console.error(response);
            }
        } catch (e) {
            console.error(e);
        }
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
