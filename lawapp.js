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

        const style = document.createElement("style");
        style.textContent = `

        @charset "UTF-8";
        @namespace an "http://docs.oasis-open.org/legaldocml/ns/akn/3.0";
        @namespace uslm "http://schemas.gpo.gov/xml/uslm";
        @namespace xml "http://www.w3.org/XML/1998/namespace";
        @namespace dc "http://purl.org/dc/elements/1.1/";
        @namespace dcterms "http://purl.org/dc/terms/";
        @namespace xhtml "http://www.w3.org/1999/xhtml";
        
        /* Version 2.17 2021-09-09 */
        
        /* USLM root elements*/
        act, bill, resolution, pLaw,
        statutesAtLarge, statuteCompilation,
        cfrDoc, frDoc, uscDoc {
            font-family: "Century Schoolbook", "NewCenturySchlbk", "Times New Roman", serif;
        }
        
        /* Set margin to be 1em, to push the text away from the frame/print border */
        /* Set the font-size to be 10pts, and make all other measurements in em's */
        /* Not using rem units because the USLM sometimes lives within a 'div' of a surrounding application */
        /* Use serifed font to match printed bills and U.S. Code */
        
        act, bill, resolution, pLaw,
        statutesAtLarge, statuteCompilation  {
            display:            block;
            margin:             1em;
            font-size:          10pt;
        }
        
        /* For U.S. Code, set rendering compatibility with OLRC web version */
        uscDoc  {
            max-width:          426pt;  /* Printed column width is ~206 pt. Both columns plus gutter is ~426pt*/
            margin-left:        24pt;
            margin-right:       24pt;
            font-size:          11pt;  /* Web font size is 11pt. Printed font size is 8pt */
        }
        
        cfrDoc,
        part[identifier*="/us/cfr"],
        chapter[identifier*="/us/cfr"]  {
            display:            block;
            margin:             1em;
            max-width:          35em;  /* 350 points */
            font-size:          10pt;
            font-family: 		"Century Schoolbook", "NewCenturySchlbk", "Times New Roman", serif;
        }
        
        frDoc {
            display:            block;
            margin:             1em;
            max-width:          58em;  /* 522 points */
            font-size:          9pt;
            font-family: 		"Century Schoolbook", "NewCenturySchlbk", "Times New Roman", serif;
        }
        
        uscDoc>meta, frDoc>meta  {
            display:            none;
            border-style:       solid;
            border-width:       1pt;
            border-color:       gray;
            margin-left:	    3pt;
            margin-top:         3pt;
            margin-bottom:	    3pt;
            text-align:         left;
            text-indent:        1em;
        }
        
        uscDoc>meta:before, frDoc>meta:before  {
            display:            none;
            color:              gray;
            font-size:          1.2em;
            font-weight:        bold;
            content:            "[Metadata]";
        }
        
        /* USLM First-level elements */
        meta, preface, main, signatures, appendix {
            display:            block;
        }
        
        /* Suppress display of the Meta block */
        meta {
            display:            none;
        }
        
        /* To render similar to GPO-printed bills and resolutions, set the max-width to match prints */
        /* Use max-width to allow the width to be narrower than print display to support narrower viewing windows */
        /* An override stylesheet may be used to set fixed width without scaling narrower when the window is not wide enough */
        bill[class~="mimicGPOPrint"],
        resolution[class~="mimicGPOPrint"],
        pLaw[class~="mimicGPOPrint"],
        statutesAtLarge[class~="mimicGPOPrint"] pLaw,
        statutesAtLarge[class~="mimicGPOPrint"] resolution {
            max-width:          46.8em;  /* 468 points including side note space */
        }
        
        /* Set margin space on the right for sidenotes on Public Laws and Statutes at Large */
        pLaw>main,
        pLaw>preface,
        pLaw>signatures,
        pLaw>appendix,
        statutesAtLarge resolution>main,
        statutesAtLarge resolution>preface,
        statutesAtLarge resolution>signatures,
        statutesAtLarge resolution>appendix,
        statutesAtLarge pLaw>main,
        statutesAtLarge pLaw>preface,
        statutesAtLarge pLaw>signatures,
        statutesAtLarge pLaw>appendix  {
            margin-left:        0em; /*  None, since side notes are put on the right */
            margin-right:       9em;
        }
        
        /* The print that OLRC delivers to GPO is approx. 25% smaller and has wider margins */
        bill[class~="OLRCPrint"] {
            width:              450pt;
            max-width:          450pt;
            margin-left:        72pt;
            margin-right:       72pt;
            font-size:          8pt;
        }
        
        bill[class~="OLRCPrint"]>meta,
        bill[class~="OLRCPrint"]>preface,
        bill[class~="OLRCPrint"]>main,
        bill[class~="OLRCPrint"]>appendix {
            margin-left:        108pt;
            margin-right:       108pt;
        }
        
        resolution>signatures>signature>notation[type="attestation"]  {
            display:            block;
            text-align:         left;
            font-style:         normal;
            margin-left:        -8em;
        }
        
        resolution resolvingClause  {
            display:            inline;
        }
        
        /* Preface Elements */
        /* Bill and Resolution Preface */
        bill>preface>dc|type,
        resolution>preface>dc|type  {
            display:            inline-block;
            margin-top:         1em;
            margin-left:        0em;  /* this is printed in the left margin */
            text-align:         left;
            font-size:          1.3em;
        }
        
        bill>preface>docNumber,
        resolution>preface>docNumber  {
            display:            inline-block;
            margin-left:        0em;  /* this shows on the same line as the dc|type */
            font-size:          1.3em;
        }
        
        bill>preface>action,
        resolution>preface>action  {
            display:            inline-block;
            float:              right;
            margin-top:         1em;
            margin-right:       0em;  /* this is printed in the right margin */
            font-size:          1.3em;
        }
        
        bill>preface>congress,
        resolution>preface>congress  {
            display:            block;
            margin-top:         1em;
            margin-bottom:      .5em;
            margin-left:        1em;
            margin-right:       1em;
            text-align:         center;
            font-size:          2em;
            font-family:        "Old English Text MT", serif;
        }
        
        bill>preface>session,
        resolution>preface>session  {
            display:            block;
            margin-top:         1em;
            margin-bottom:      1em;
            text-align:         center;
            font-weight:        bold;
        }
        
        enrolledDateline   {
            display:            block;
            margin-top:         1em;
            margin-left:        3em;
            margin-right:       3em;
            text-align:         center;
            font-size:          1em;
            font-weight:        bold;
            font-style:         italic;
            font-family:        "Bodoni MT", serif;
        }
        
        /* Public & Private Law Preface */
        pLaw preface>coverTitle  {
            display:            block;
            margin-top:         1em;
            margin-bottom:      1em;
            text-align:         center;
            font-size:          1.4em;  /* 14 point font in the PDF */
        }
        
        pLaw>preface>dc|type,
        pLaw>preface>docNumber,
        pLaw>preface>congress  {
            display:            inline-block;
            margin-top:         1em;
            text-align:         left;
            font-size:          1.2em;
        }
        
        pLaw>preface>docNumber  {
            margin-left:        0.25em;
        }
        
        pLaw>preface>congress  {
            display:            block;
            margin-top:          0em;
        }
        
        /* StatutesAtLarge Preface */
        statutesAtLarge>preface,  /* In case there is only one part and no collection and component elements*/
        statutesAtLarge>preface>note,
        statutesAtLarge component>preface,  /* For the repeated preface at the start of each part of the volume */
        statutesAtLarge component>preface>note  {
            display:            block;
            margin-top:         1em;
            margin-bottom:      1em;
            margin-left:        0em;
            margin-right:       0em;
            text-align:         center;
            text-indent:        0em;
        }
        
        statutesAtLarge preface>coverTitle  {
            font-size:          2.3em;  /* 23 point font in the PDF */
        }
        
        statutesAtLarge preface>note
        {
            text-indent:        0em;
            font-size:          1.2em;  /* mostly 12 point font in the PDF */
        }
        
        statutesAtLarge preface p   {
            text-indent:        0em;
        }
        statutesAtLarge preface>organizationNote  {
            font-size:          0.8em;  /* 8 point font in the PDF */
        }
        
        statutesAtLarge preface>authority  {
            display:            block;
            margin-top:         3em;
            margin-bottom:      3em;
            margin-left:        18em;
            margin-right:       18em;
            text-align:         justify;
            text-indent:        0em;
            font-size:          0.8em;  /* 8 point font in the PDF */
        }
        
        statutesAtLarge preface>explanationNote  {
            display:            block;
            margin-right:       20em;
            margin-left:        20em;
            padding-top:        1.5em;
            padding-bottom:     1.5em;
            padding-left:       1.5em;
            padding-right :     1.5em;
            border-style:       solid;
            border-color:       black;
            border-width:       1pt;
            text-align:         justify;
            font-size:          0.8em;  /* 8 point font in the PDF */
        }
        
        /*  Suppress property note */
        statutesAtLarge component>preface>note[role="propertyStatement"]  {
           display:none;
        }
        
        statutesAtLarge preface>toc  {
            display:            table;
            margin-top:         4em;
            margin-bottom:      4em;
            margin-left:        14em;
            text-align:         center;
            max-width:          32em;
        }
        
        statutesAtLarge preface>toc>heading  {
            display:            block;
            padding-bottom:     1em;
            font-size:          1.2em;
            text-align:         center;
        }
        
        statutesAtLarge preface>toc headingItem  {
            font-style:         italic;
            font-size:          0.8em;
            text-align:         right;
        }
        
        statutesAtLarge preface>toc>groupItem>label  {
            display:            table-row;
            text-align:         center;
        }
        
        statutesAtLarge preface>toc>groupItem>referenceItem>designator  {
            width:              40em;
            font-variant:       small-caps;
        }
        
        /*  put space between lists tables and set font size */
        statutesAtLarge preface>listOfBillsEnacted  {
            margin-top:         6em;
            margin-bottom:      4em;
            margin-left:        12em;
            width:              40em;
            font-size:          .9em;  /* 9 point font in the PDF */
        }
        
        statutesAtLarge preface>listOfPublicLaws,
        statutesAtLarge preface>listOfPrivateLaws,
        statutesAtLarge preface>listOfConcurrentResolutions,
        statutesAtLarge preface>listOfProclamations  {
            margin-top:         6em;
            margin-bottom:      6em;
            font-size:          .8em;  /* 8 point font in the PDF */
        }
        
        /* Force some vertical space before these lists */
        /* Setting these to block or table and using margin-top creates other problems */
        statutesAtLarge preface>listOfBillsEnacted:before,
        statutesAtLarge preface>listOfPublicLaws:before,
        statutesAtLarge preface>listOfPrivateLaws:before,
        statutesAtLarge preface>listOfConcurrentResolutions:before,
        statutesAtLarge preface>listOfProclamations:before  {
          content:              "\A\A\A\A";
          white-space:          pre;
        }
        
        statutesAtLarge preface>listOfBillsEnacted>groupItem  {
            display:            table-row-group;
        }
        
        /* Override default properties designator*/
        statutesAtLarge preface>listOfBillsEnacted designator,
        statutesAtLarge preface>listOfPublicLaws designator,
        statutesAtLarge preface>listOfPrivateLaws designator  {
            width:              8em;
        }
        
        /* Override default properties for label */
        statutesAtLarge preface>listOfPrivateLaws>headingItem>label  {
            text-align:         right;
            width:              30em;
            font-style:         italic;
        }
        
        /* Override default properties for label */
        statutesAtLarge preface>listOfPrivateLaws>headingItem>target  {
            width:              12em;
            font-style:         italic;
        }
        
        /* Override default properties for target */
        statutesAtLarge preface>listOfBillsEnacted>referenceItem>target,
        statutesAtLarge preface>listOfPrivateLaws designator  {
            text-align:         left;
            width:              6em;
        }
        /* Override default properties for target */
        statutesAtLarge preface>listOfPrivateLaws  target  {
            width:              6em;
        }
        
        statutesAtLarge preface>listOfBillsEnacted>heading,
        statutesAtLarge preface>listOfPublicLaws>heading,
        statutesAtLarge preface>listOfConcurrentResolutions>heading,
        statutesAtLarge preface>listOfProclamations>heading,
        statutesAtLarge preface>listOfPrivateLaws>heading  {
            display:            block;
            font-size:          1.6em
        }
        
        statutesAtLarge preface>listOfBillsEnacted>heading:nth-of-type(3)  {
            display:            none;  /* suppress the third heading, which is a page heading */
        }
        
        /* Add rule below last subheading */
        statutesAtLarge preface>listOfBillsEnacted>subheading:last-of-type:after,
        statutesAtLarge preface>listOfPublicLaws>subheading:last-of-type:after,
        statutesAtLarge preface>listOfConcurrentResolutions>subheading:last-of-type:after,
        statutesAtLarge preface>listOfProclamations>subheading:last-of-type:after,
        statutesAtLarge preface>listOfPrivateLaws>subheading:last-of-type:after  {
          content:              "\A\___________";
          text-align:           center;
          white-space:          pre;
        }
        
        /* Override default properties for headingItem>label */
        statutesAtLarge preface>listOfPublicLaws>headingItem>label {
             margin-right:       1em;
             text-align:         right;
             width:              24em;
        }
        
        /* Override default properties for referenceItem>label */
        statutesAtLarge preface>listOfPublicLaws label  {
             padding-left:       .5em;
             width:              10em;
        }
        
        /* Override default properties for target */
        statutesAtLarge preface>listOfPublicLaws target  {
             width:              4em;
        }
        
        statutesAtLarge preface>listOfBillsEnacted>subheading,
        statutesAtLarge preface>listOfPublicLaws>subheading,
        statutesAtLarge preface>listOfConcurrentResolutions>subheading,
        statutesAtLarge preface>listOfProclamations>subheading  {
            display:            block;
            margin-top:         1em;
            margin-bottom:      1em;
            text-align:         center;
            font-size:          0.9em;
        }
        
        statutesAtLarge preface>listOfBillsEnacted>headingItem,
        statutesAtLarge preface>listOfPublicLaws>headingItem,
        statutesAtLarge preface>listOfConcurrentResolutions>headingItem,
        statutesAtLarge preface>listOfProclamations>headingItem,
        statutesAtLarge preface>listOfPrivateLaws>headingItem  {
            font-style:         italic;
            font-size:          0.8em;
        }
        
        statutesAtLarge preface>listOfPublicLaws>referenceItem>label:nth-of-type(1)  {
            width:              25em;
            text-indent:        -1em;
        }
        
        statutesAtLarge preface>listOfPublicLaws>referenceItem>label:nth-of-type(2),
        statutesAtLarge preface>listOfConcurrentResolutions>referenceItem>label:nth-of-type(2),
        statutesAtLarge preface>listOfProclamations>referenceItem>label:nth-of-type(2)  {
            width:              8em;
        }
        
        statutesAtLarge preface>listOfConcurrentResolutions>referenceItem>designator,
        statutesAtLarge preface>listOfProclamations>referenceItem>designator  {
            width:              10em;
        }
        
        statutesAtLarge preface>listOfConcurrentResolutions>referenceItem>label:nth-of-type(1),
        statutesAtLarge preface>listOfProclamations>referenceItem>label:nth-of-type(1)  {
            width:              28em;
            padding-right:      .5em;
            padding-left:       .5em;
        
        }
        
        /* Override default settings for this list  */
        statutesAtLarge preface>listOfConcurrentResolutions>headingItem>target,
        statutesAtLarge preface>listOfConcurrentResolutions>referenceItem>target  {
            width:              3em;
            padding-right:      .5em;
            padding-left:       .5em;
        }
        
        statutesAtLarge publicLaws>preface>coverText,
        statutesAtLarge concurrentResolutions>preface>coverText  {
            display:            block;
            margin-top:         2em;
            margin-bottom:      1em;
            text-align:         center;
            font-size:          1.5em;
        }
        
        statutesAtLarge publicLaws enrolledDateline   {
            display:            block;
            margin-top:         1em;
            margin-left:        10em;
            margin-right:       10em;
            text-align:         center;
            font-size:          1em;
            font-weight:        normal;
            font-style:         italic;
            font-family:        "Century Schoolbook", "NewCenturySchlbk", "Times New Roman", serif;
        }
        
        statutesAtLarge presidentialDoc {
           font-size:           0.9em;
        }
        
        statutesAtLarge presidentialDoc>preface>docNumber {
           font-weight:         bold;
        }
        
        statutesAtLarge presidentialDoc>preface>dc|title  {
            display:            block;
            margin-bottom:      0.7em;
            font-size:          1.2em;
            font-weight:        bold;
        }
        
        statutesAtLarge presidentialDoc>preface>dc|creator,
        statutesAtLarge presidentialDoc>preface>dc|type  {
            display:            block;
            font-style:         italic;
        }
        
        statutesAtLarge presidentialDoc p  {
            display:            block;
            margin-bottom:      0.5em;
            text-align:         justify;
        }
        
        /* Federal Register Preface */
        frDoc preface  {
            display:            block;
            border-bottom-style:   solid;
            border-width:       1pt;
            margin-top:         4em;
            text-align:         left;
        }
        
        frDoc preface>startingPage  {
            display:            block;
            margin-top:         1em;
            text-align:         right;
            font-size:          1.2em;
            font-weight:        bold;
        }
        
        frDoc preface>docPublicationName[role="unitName"]  {
            display:            block;
            border-top-style:   double;
            border-width:       3pt;
            text-align:         left;
            font-size:          2em;
            font-weight:        bold;
            font-family:        sans-serif;
        }
        
        frDoc preface>docPublicationName[role="documentName"]  {
            display:            block;
            margin-top:         .7em;
            margin-left:        0em;
            text-align:         left;
            font-size:          0.9em;
            font-weight:        bold;
        }
        
        frDoc preface>volume  {
            display:            inline-block;
            margin-top:         .7em;
            margin-left:        0em;
            text-align:         left;
            font-size:          .9em;
            font-family: 		"Century Schoolbook", "NewCenturySchlbk", "Times New Roman", serif;
        }
        
        
        frDoc preface>issue  {
            display:            inline-block;
            margin-left:        .2em;
            text-align:         left;
            font-size:          .9em;
        }
        
        frDoc preface>date  {
            display:            block;
            margin-top:         .7em;
            margin-bottom:      1.2em;
            margin-left:        0em;
            text-align:         left;
            font-size:          .9em;
        }
        
        presidentialDocs p[class~="titleGroupNum"]
        {
            margin-top:         .7em;
            text-indent:        0em;
            font-size:          1em;
            font-weight:        bold;
        }
        
        presidentialDocs p[class~="titleGroupSubject"]
        {
            margin-top:         .7em;
            text-indent:        0em;
            font-size:          1.2em;
            font-weight:        bold;
        }
        
        presidentialDoc>preface>dc|title  {
            display:            block;
            margin-top:         .7em;
            margin-left:        0em;
            text-align:         left;
            font-size:          1em;
            font-weight:        bold;
        }
        
        presidentialDoc>preface>dc|subject  {
            display:            block;
            margin-top:         .7em;
            margin-left:        0em;
            text-align:         left;
            font-size:          1.2em;
            font-weight:        bold;
            font-family: 		"Century Schoolbook", "NewCenturySchlbk", "Times New Roman", serif;
        }
        
        /* Federal Register Main elements */
        frDoc part  {
            display:            block;
            margin-left:        0em;
            text-align:         justify; /*left align in print due to narrow column */
        }
        
        frDoc level,
        frDoc section,
        frDoc paragraph,
        frDoc subparagraph,
        frDoc level>heading  {
            display:            block;
            margin-left:        0em;
            text-indent:        0em;
            margin-bottom:      0.25em;
            text-align:         justify; /*left align in print due to narrow column */
        }
        
        frDoc level>num,
        frDoc level>heading,
        frDoc part>num,
        frDoc part>heading,
        frDoc section>heading,
        frDoc section>num  {
            text-indent:        0em;
            font-weight:        bold;
            font-size:          1em;
            font-weight:        bold;
            font-family:        sans-serif;
        }
        
        /* Override the normal inline style.  Not sure if this is the best way. */
        frDoc content>p:first-of-type  {
            display:            block;
        }
        
        frDoc section>content  {
            display:            inline;
        }
        
        frDoc signature, frDoc signature *  {
            display:            block;
            margin-top:         0.5em;
            text-align:         left;
            font-style:         normal;
            margin-left:        0em;
        }
        
        frDoc signature>signatureDate  {
            text-indent:        1em;
        }
        
        frDoc signature>signatureDate>date  {
            display:            inline;
        }
        
        frDoc signature>name  {
            font-weight:         bold;
        }
        
        frDoc signature>role  {
            font-style:         italic;
        }
        
        frDocId  {
            display:            block;
            font-size:          0.8em;
            margin-top:         1em;
        }
        
        billingCode  {
            display:            block;
            margin-top:         0.5em;
            margin-bottom:      2em;
            font-size:          0.7em;
            font-family:        sans-serif;
            font-weight:        bold;
        }
        
        frDoc findingAidsNote > heading  {
            font-family:        sans-serif;
            font-weight:        bold;
            margin-bottom:      2em;
        }
        
        /* Collections */
        frDoc rules, frDoc proposedRules, frDoc notices, frDoc presidentialDocs  {
            display:            block;
            width:              100%;  /* 522 points */
            margin-top:         1.2em;
            text-align:         justify; /*left align in print due to narrow column */
            font-family:        sans-serif;
        }
        
        rules>p, proposedRules>p, notices>p  {
            display:            block;
            margin-bottom:	    0.7em;
            text-indent:        0em;
        }
        
        agencyGroup  {
            display:            block;
            border-top-style:   solid;
            border-width:       2pt;
        }
        
        /*  Suppress display of metadata in components */
        component>*>meta,
        component>*>meta *,
        component>pLaw>meta:before,
        component>resolution>meta:before  {
            display:none;
        }
        
        /* rule, notice, and presidentialDoc elements */
        rule, presidentialDoc, notice  {
            display:            block;
            font-size:          1em;
            font-family: 		"Century Schoolbook", "NewCenturySchlbk", "Times New Roman", serif;
        }
        
        /* Presidential Documents */
        presidentialDoc  {
           margin-left:         2em;
        }
        
        presidentialDoc section {
           margin-top:          0.3em;
           text-indent:         1em;
        }
        
        presidentialDoc statement  {
            display:            block;
            margin-top:         1.5em;
        }
        
        presidentialDoc section>num {
            font-family: 		"Century Schoolbook", "NewCenturySchlbk", "Times New Roman", serif;
        }
        
        presidentialDoc section>heading {
            font-family: 		"Century Schoolbook", "NewCenturySchlbk", "Times New Roman", serif;
           font-style:          italic;
           font-weight:         normal;
        }
        
        presidentialDoc signature>date {
           text-indent:         0em;
           font-style:          italic;
        }
        
        notice>preface>startingPage  {
           display:             none;
        }
        
        /* Rule Documents, including proposed rules */
        rule>preface, notice>preface  {
            display:            block;
            margin-top:         2pt;
            border-top-style:   solid;
            border-top-width:   1pt;
        }
        
        rule>main>rulePreamble>statement>content>heading  {
            display:            inline;
            font-family:        sans-serif;
            font-weight:        bold;
        }
        
        rule level>heading, notice level>heading {
            font-family: 		"Century Schoolbook", "NewCenturySchlbk", "Times New Roman", serif;
        }
        
        rule statement,
        notice statement  {
            display:            block;
            margin-top:         0.3em;
        }
        
        rule statement>p:first-of-type,
        notice statement>p:first-of-type {
            display:            inline;
        }
        
        rule p>heading {
           font-style:          italic;
        }
        
        rule *[class~="T02"]  {
            font-weight:        bold;
            font-family:        sans-serif;
            font-size:          0.8em;
        }
        
        frDoc preface>organization,
        frDoc preface>property,
        rule>preface>affected,
        frDoc preface>dc|subject,
        frDoc preface>subject,
        notice>preface>dc|identifier  {
            display:            block;
            margin-top:         0.7em;
            font-family:        sans-serif;
            font-weight:        bold;
        }
        
        frDoc appendix  {
            text-align:         left;
        }
        
        frDoc preface>organization[role="agency"]  {
            display:            block;
            margin-top:         0.3em;
            font-family: 		"Century Schoolbook", "NewCenturySchlbk", "Times New Roman", serif;
            font-weight:        normal;
        }
        
        /* remove -uslm style attribute, replace with role attribute */
        frDoc preface docNumber[style="-uslm-sgm-DEPDOC"]  {
            display:            block;
            margin-top:         1em;
            font-size:          0.8em;
            font-weight:        bold;
            font-family:        sans-serif;
        }
        
        frDoc preface>subject  {
            margin-bottom:      0.7em;
        }
        
        notice subject,
        notice organization  {
            display:            block;
            margin-top:         0.7em;
            font-family:        sans-serif;
            font-weight:        bold;
        }
        
        notice>main>date  {
            display:            block;
            margin-top:         1em;
            margin-bottom:      1em;
        }
        
        frDoc preface>action  {
            display:            block;
            margin-top:         0.1em;
            margin-bottom:      0.5em;
            padding-bottom:     0.5em;
            font-family: 		"Century Schoolbook", "NewCenturySchlbk", "Times New Roman", serif;
        }
        
        frDoc preface>action>actionDescription>headingText  {
            font-weight:        bold;
            font-family:        sans-serif;
        }
        
        frDoc preface inline[role="heading"],
        frDoc statement>heading  {
            display:            inline;
            font-size:          0.8em;
            font-weight:        bold;
            font-family:        sans-serif;
        }
        
        frDoc *[class~="hd1"]  {
            display:            block;
            font-family: 		"Century Schoolbook", "NewCenturySchlbk", "Times New Roman", serif;
            font-weight:        bold;
            font-size:          1em;
            margin-top:         0.3em;
            margin-bottom:      0.3em;
            text-indent:        0em;
        }
        
        frDoc *[class~="hd2"]  {
            display:            block;
            font-family: 		"Century Schoolbook", "NewCenturySchlbk", "Times New Roman", serif;
            font-weight:        normal;
            font-style:         italic;
            font-size:          1em;
            margin-top:         0.3em;
            margin-bottom:      0.3em;
            text-indent:        0em;
        }
        
        wordsOfIssuance  {
            display:            block;
            margin-top:         0.3em;
            text-indent:        1em;
        }
        
        wordsOfIssuance>heading  {
            display:            block;
            text-indent:        0em;
            font-weight:        bold;
        }
        
        /* cfrDoc preface */
        cfrDoc>preface  {
            display:            block;
            margin-left:        4em;
            font-size:          1em;
            font-weight:        normal;
        }
        
        cfrDoc>preface>dcterms|title  {
            display:            block;
            margin-left:        1.8em;
            font-size:          1.6em;
            font-family:        sans-serif;
            font-weight:        normal;
            text-align:         left;
        }
        
        cfrDoc>preface>docNumber  {
            display:            block;
            margin-left:        1em;
            margin-top:         1em;
            font-size:          3em;
            font-family:        sans-serif;
            font-weight:        bold;
        }
        
        cfrDoc>preface>subject  {
            display:            block;
            margin-left:        1.8em;
            width:              16em;
            font-size:          1.6em;
            font-family:        sans-serif;
            font-weight:        normal;
            border-bottom:      solid;
            border-width:       1pt;
        }
        
        cfrDoc>preface>provisionRange  {
            display:            block;
            margin-top:         1em;
            margin-left:        2.1em;
            font-size:          1.4em;
            font-family:        sans-serif;
            font-weight:        normal;
        }
        
        cfrDoc>preface>created  {
            display:            block;
            margin-top:         2em;
            margin-left:        2.5em;
            font-size:          1.2em;
            font-family:        sans-serif;
            font-weight:        normal;
        }
        
        cfrDoc>preface>note[topic="contains"],
        cfrDoc>preface>dc|date,
        cfrDoc>preface>dc|publisher  {
            display:            block;
            margin-top:         2em;
            margin-left:        3em;
            width:              21em;
            text-indent:        0em;
            font-size:          1em;
            font-family:        sans-serif;
            font-weight:        normal;
        }
        
        cfrDoc>preface>content,
        cfrDoc>preface editionNote,
        cfrDoc>preface citationNote,
        cfrDoc>preface explanationNote  {
            display:            block;
            margin-top:         5em;
        }
        
        cfrDoc>preface heading  {
            display:            block;
            margin-top:         1em;
            font-size:          1em;
            font-family:        sans-serif;
            font-weight:        bold;
        }
        
        cfrDoc>preface citationNote  {
            margin-left:        3em;
            width:              15em;
            border-top:         solid;
            border-bottom:      solid;
            border-width:       1pt;
            font-style:         italic;
        }
        
        cfrDoc>preface citationNote > p  {
            margin-top:         0.5em;
            margin-bottom:         0.5em;
            margin-left:        1em;
            text-indent:        -1em;
            font-style:         italic;
        }
        
        cfrDoc>preface>explanationNote  {
            font-size:          0.8em;
            text-align:         justify;
        }
        
        cfrDoc>preface>explanationNote heading  {
            display:            block;
            margin-top:         1em;
            margin-bottom:      1em;
            font-size:          1em;
            font-family: 		"Century Schoolbook", "NewCenturySchlbk", "Times New Roman", serif;
            font-weight:        normal;
        }
        
        cfrDoc>preface>explanationNote>heading:first-of-type {
            display:            block;
            margin-bottom:      1em;
            font-size:          1.2em;
            font-family:        sans-serif;
            text-align:         center;
            font-weight:        normal;
        }
        
        /* cfrDoc main */
        cfrDoc>main  {
            margin-top:         5em;
        }
        
        cfrDoc title>num, cfrDoc title>heading  {
            font-size:          3em;
            font-family:        sans-serif;
            font-weight:        normal;
        }
        
        cfrDoc title>note[topic="volumeNote"]  {
            text-align:         center;
            margin-top:         1em;
            padding-bottom:     3em;
            margin-bottom:      0.5em;
            border-bottom:      solid;
            border-width:       1pt;
        }
        
        cfrDoc chapter,
        cfrDoc subchapter  {
            margin-top:         6em;
        }
        
        cfrDoc chapter>num,
        cfrDoc chapter>heading  {
            font-family:        sans-serif;
            font-size:          1.6em;
            font-weight:        normal;
        }
        
        cfrDoc chapter>heading+*  {
            border-top:        solid;
            border-width:      1pt;
            margin-top:        2em;
            padding-top:       1em;
        }
        
        cfrDoc subchapter>num,
        cfrDoc subchapter>heading  {
            font-family:        sans-serif;
            font-size:          1.2em;
            font-weight:        bold;
        }
        
        cfrDoc part  {
            margin-bottom:      1.5em;
        }
        
        cfrDoc part>num,
        cfrDoc part>heading,
        cfrDoc subpart>num,
        cfrDoc subpart>heading  {
            font-family:        sans-serif;
            font-size:          1.1em;
            font-weight:        bold;
        }
        
        cfrDoc section>chapeau,
        cfrDoc paragraph  {
            text-indent:        1em;
            margin-left:        0em;
        }
        
        cfrDoc section  {
            text-indent:        -2em;
            margin-left:        2em;
        }
        
        cfrDoc section>:not(heading):not(num)  {
            margin-left:        -2em; /* sets margin back to normal */
        }
        
        cfrDoc section heading::before  {
            content:            " ";
        }
        
        cfrDoc paragraph>heading  {
            font-variant:       none;
            font-style:         italic;
        }
        
        cfrDoc level  {
            margin-left:        0em;
            text-indent:        0em;
        }
        
        cfrDoc level>heading  {
            display:            block;
            text-align:         center;
            margin-top:         1em;
            font-variant:       small-caps;
        }
        
        cfrDoc level>section  {
            margin-top:         0.3em;
        }
        
        cfrDoc heading+notes  {
            margin-top:         1.5em;
            /* add space above when notes comes directly after heading */
        }
        
        cfrDoc note, cfrDoc editorialNote  {
            display:            block;
            font-size:          0.9em;
            text-indent:        1em;
            text-align:         left;
        }
        
        cfrDoc note[topic="citation"]  {
            margin-top:         1em;
            text-indent:        0em;
        }
        
        cfrDoc authority, cfrDoc source,
        frDoc section authority  {
            display:            block;
            text-indent:        1em;
            text-align:         left;
            font-size:          0.85em;
            margin-top:         0.3em;
        }
        
        cfrDoc section>source  {
            margin-top:         0.7em;
            border-width:       1pt;
            text-indent:        0em;
        }
        
        cfrDoc appendix>num, cfrDoc appendix>heading  {
            display:            inline;
            font-variant:       small-caps;
            font-size:          1.1em;
        }
        
        cfrDoc appendix>p  {
            text-align:         left;
        }
        
        cfrDoc appendix>heading+p  {
            /* Adds space above a paragraph right after a heading */
            margin-top:         1em;
        }
        
        /* Statute Compilations */
        statuteCompilation  {
            display:            block;
            margin-left:        24pt;
            margin-right:       24pt;
            font-size:          10pt;
            font-family: 		"Century Schoolbook", "NewCenturySchlbk", "Times New Roman", serif;
        }
        
        
        statuteCompilation>preface>dc|title,
        property[role='compShortTitle'],
        statuteCompilation>preface>citationNote,
        statuteCompilation>preface>editionNote  {
            display:            block;
            margin-top:         .7em;
            margin-left:        0em;
            text-align:         center;
            font-size:          1em;
        }
        
        statuteCompilation>preface>dc|title,
        property[role='compShortTitle']  {
            font-weight:        bold;
        }
        
        
        
        statuteCompilation>preface>explanationNote  {
            display:            block;
            margin-top:         .7em;
            margin-left:        1em;
            text-align:         justify;
            text-indent:        -1em;
            font-size:          0.8em;  /*  8 point in the PDF */
        }
        
        statuteCompilation editorialNote  {
            display:            inline;
            font-weight:        normal;
            font-style:         normal
        }
        
        /* section-level USC reference notes are on a separate line */
        statuteCompilation section > editorialNote[role="uscRef"]  {
            display:            block;
        }
        
        statuteCompilation elided  {
            display:            block;
            margin-top:         1em;
            margin-bottom:      0em;
            text-align:         center;
            text-indent:        0em;
            font-weight:        normal;
        }
        
        statuteCompilation toc > heading,
        statuteCompilation toc > headingItem > designator,
        statuteCompilation toc > headingItem > label  {
            display:            block;
            text-align:         center;
        }
        
        section[styleType='traditional'] > heading  {
            display:            block;
            margin-top:         0.5em;
            margin-bottom:      0.5em;
            text-align:         center;
            font-size:          1em;
            font-weight:        normal;
            font-variant:       small-caps;
        }
        
        section[styleType='traditional'] > num,
        section[styleType='traditional-inline'] > num  {
            font-size:          1em;
            font-weight:        normal;
            font-variant:       small-caps;
        }
        
        section[styleType='traditional'] > content,
        section[styleType='traditional'] > chapeau,
        section[styleType='traditional-inline'] > content,
        section[styleType='traditional-inline'] > chapeau {
            display:            inline;
        }
        statuteCompilation section > content  {
            text-indent:        2em;  /*  override the 1em setting above */
        }
        
        statuteCompilation section>num,
        statuteCompilation section>heading  {
            font-size:          0.8em;  /*  8 point in the PDF */
            font-weight:        bold;
        }
        
        
        statuteCompilation section>editorialNote  {
            font-size:          1em;
            font-weight:        normal;
        }
        
        statuteCompilation section>editorialNote[role="uscRef"]  {
            font-size:          0.8em;  /*  8 point in the PDF */
        }
        
        statuteCompilation section > num + editorialNote[role="uscRef"]  {
            display:            inline;
            font-size:          0.8em;
            font-weight:        bold;
        }
        
        statuteCompilation title>num,
        statuteCompilation title>heading  {
            font-size:          1.4em;  /*  14 point in the PDF */
        }
        
        statuteCompilation longTitle  {
            display:            block;
            margin-top:         1em;
            margin-bottom:      1em;
            margin-left:        1em;
            text-indent:        -1em;
            text-align:         justify;
        }
        statuteCompilation longTitle>docTitle,
        statuteCompilation longTitle>officialTitle  {
            display:            inline;
            font-size:          1em;
            font-family:       "Century Schoolbook", "NewCenturySchlbk", "Times New Roman", serif;
        }
        
        statuteCompilation longTitle>officialTitle:before  {
            content:            " ";
        }
        
        /* Main elements */
        
        /* Bills and Resolutions */
        longTitle  {
            display:            block;
            text-align:         center;
        }
        
        longTitle>docTitle  {
            display:            block;
            margin-top:         1.5em;
            margin-bottom:      0.5em;
            font-size:          1.6em;
            font-weight:        normal;
            font-family:        "Old English Text MT", serif;
        }
        
        pLaw>main>longTitle>docTitle  {
            font-size:          1.2em;  /* 12 point font in the pdf */
            font-family: 		"Century Schoolbook", "NewCenturySchlbk", "Times New Roman", serif;
        }
        
        /* In print, the official title is centered if 2 lines or less
         * and is justified with 1em hanging indent of 3 or more lines.
         * Here, we go with the 2 or less line style. */
        longTitle>officialTitle  {
            display:            block;
            margin-bottom:      0.8em;
            font-size:          0.8em;  /* 8 point font in the pdf */
        }
        
        recital {
            display:            block;
            margin-bottom:         0.5em;
            margin-left:        1em;
            text-indent:        -1em;
            font-size:          1em;
            text-align:         justify;
        }
        
        enactingFormula, resolvingClause  {
            display:            block;
            text-indent:        2em;
            font-size:          1em;
            font-style:         italic;
            text-align:         justify;
        }
        
        bill>main>section  {
            margin-top:         1em;
            margin-bottom:      1em;
        }
        
        bill>main title>num, bill>main title>a>num, bill>main title>heading,
        pLaw>main title>num, pLaw>main title>a>num, pLaw>main title>heading
        {
            display:            block;
            margin-top:         1em;
            margin-bottom:      1em;
            text-align:         center;
            font-size:          1em;
            font-weight:        bold;
        }
        
        resolution subsection  {
            text-indent:        1em;
        }
        
        resolution>main>section,
        bill>main>title>section {
            text-align:         justify;
            text-indent:        1em;
        }
        
        /*  resolution>main>section *,
        bill>main>title>section *:not(table*)  {
            display:            inline;
        }
        */
        
        resolution>main>section>num,
        bill>main>title>section>num {
            font-weight:        normal;
            font-variant:       small-caps;
        }
        
        /* Section is displayed differently if it has a heading */
        resolution>main>section>heading ~ content:first-of-type  {
            display:            block;
        }
        
        resolution main level,
        bill main level  {
            margin-left:        0em;
        }
        
        /* Section nums and headings are bold in both bills and the USC. */
        section>num, section>a>num, section>heading,
        courtRule>num, courtRule>heading  {
            font-size:          1em;
            font-weight:        bold;
        }
        
        /* USC Section nums and headings are larger than body text */
        section[identifier*="/us/usc"]>num,
        section[identifier*="/us/usc"]>a>num,
        section[identifier*="/us/usc"]>heading  {
            font-size:          1.15em;
        }
        
        /* Bill Section nums and headings are all caps and smaller font size*/
        bill section>num, bill section>a>num, bill section>heading,
        resolution section>num, resolution section>a>num, resolution section>heading,
        pLaw section>num, pLaw section>a>num, pLaw section>heading  {
            font-size:          0.8em;
        }
        
        /* Bill Sections with a heading that preceeds the num have the heading centered on a separate line */
        bill>main section > heading:first-child,
        resolution>main section > heading:first-child,
        pLaw>main section > heading:first-child  {
            display:            block;
            text-align:         center;
            margin-bottom:      0.5em;
        }
        
        /* Bill Section with a num and no heading have the content on the same line as the num  */
        bill>main section > num + content,
        bill>main section > num + chapeau,
        resolution>main section > num + content,
        resolution>main section > num + chapeau,
        pLaw>main section > num + content,
        pLaw>main section > num + chapeau  {
            display:            inline;
        }
        
        /* Bill Section with heading that preceed the num have the the num indented */
        bill>main section > heading + num,
        bill>main section > num:first-child,
        bill>main section > content:first-child,
        bill>main section > chapeau:first-child,
        resolution>main section > heading + num,
        resolution>main section > num:first-child,
        resolution>main section > content:first-child,
        resolution>main section > chapeau:first-child,
        pLaw>main section > heading + num,
        pLaw>main section > num:first-child,
        pLaw>main section > content:first-child,
        pLaw>main section > chapeau:first-child  {
            text-indent:        2em;
        }
        
        subsection>heading,
        paragraph>heading,
        subparagraph>heading,
        clause>heading,
        subclause>heading,
        item>heading,
        subitem>heading,
        subsubitem>heading {
            font-variant:       small-caps;
        }
        
        rule subsection>heading  {
            font-variant:       normal;
            font-style:         italic;
        }
        
        subheading  {
            display:            block;
        }
        
        content>p:first-of-type,
        paragraph>p:first-of-type  {
            display:            inline;
        }
        
        pLaw > main > action  {
            display:            block;
            margin-top:         1em;
            margin-left:        1em;
        }
        
        /* Signatures */
        signatures  {
            margin-right:       2em;
        }
        
        rulePreamble>signatures>signature  {
            margin-top:         0.4em;
        }
        
        signature  {
             display:           block;
             margin-top:        2em;
             margin-left:       10em;
             text-align:        right;
             font-style:        italic;
        }
        
        uscDoc signature  {
             display:           block;
             margin-top:        0.5em;
             margin-bottom:     0.5em;
             margin-right:      1em;
             text-align:        right;
             font-style:        normal;
             font-variant:      small-caps;
        }
        
        /* Statutes At Large */
        statutesAtLarge resolution officialTitle  {
            display:            block;
            margin-top:         1em;
            margin-bottom:      1em;
            text-align:         center;
            font-weight:        bold;
        }
        
        /* U.S. Code */
        /* Big-levels */
        title,
        subtitle,
        chapter,
        subchapter,
        part,
        subpart,
        division,
        subdivision,
        article,
        subArticle,
        level,
        appendix,
        compiledAct,
        courtRules,
        reorganizationPlan {
            display:            block;
            margin-top:         1em;
            margin-bottom:      0.3em;
            text-align:         center;
        }
        
        title>num, title>a>num, title>heading  {
            font-size:          2em;
            font-weight:        bold;
        }
        
        subtitle>num, subtitle>heading  {
            font-size:          1.5em;
            font-weight:        bold;
        }
        
        chapter>num, chapter>heading  {
            font-size:          1.2em;
            font-weight:        bold;
        }
        
        division>num, division>a>num, division>heading  {
            font-weight:        bold;
        }
        
        part>num, part>heading,
        subpart>num, subpart>heading  {
            font-size:          1.2em;
        }
        
        courtRules title>num, courtRules title>heading  {
            font-size:          1em;
        }
        
        compiledAct title>num, compiledAct title>heading  {
            font-size:          1.2em;
            font-weight:        bold;
        }
        
        heading {
            font-weight:        normal;
            display:            inline;
        }
        
        
        /* USLM 1.0 ToC rules (deprecated)*/
        toc {
         /*   display:            table; */
            display : block;
            background-color:   inherit;
            width:              100%;
            margin-top:         1em;
            margin-bottom:      1em;
            text-align:         left;
            text-indent:        0em;
            font-weight:        normal;
        }
        
        uscDoc toc {
            border-style:       none;
            border-color:       gray;
            border-width:       1pt;
            margin-left:        0pt;
            margin-top:         24pt;
            margin-bottom:      3pt;
            margin-right:       0pt;
            text-align:         left;
            display:            table;
            font-size:          1em;  /* For web, set TOC font the same size as body text. In print, the TOC uses a smaller font */
        }
        
        toc > layout header {
            display:            block;
            background-color:   inherit;
        }
        
        toc > layout header[role="tocColumnHeader"] {
            display:            table-row;
            font-size:          0.9em;
            font-weight:        normal;
        }
        
        toc > layout header[role="tocSubtitleHeader"] > column  {
            display:            block;
            background-color:   inherit;
            margin-top:         0.5em;
            margin-bottom:      0.5em;
            text-align:         center;
            font-weight:        bold;
        }
        
        title toc > layout header[role="tocSubtitleHeader"] > column  {
            display:            block;
            background-color:   inherit;
            margin-top:         0.5em;
            margin-bottom:      0.5em;
            text-align:         center;
            font-size:          1.5em;
            font-weight:        bold;
        }
        
        toc > layout header[role="tocTitleHeader"] > column,
        toc > layout header[role="tocDivisionHeader"] > column,
        toc > layout header[role="tocSubdivisionHeader"] > column,
        toc > layout header[role="tocChapterHeader"] > column,
        toc > layout header[role="tocSubchapterHeader"] > column,
        toc > layout header[role="tocPartHeader"] > column,
        toc > layout header[role="tocSubpartHeader"] > column {
            display:            block;
            background-color:   inherit;
            margin-top:         0.5em;
            margin-bottom:      0.5em;
            text-align:         center;
            font-weight:        bold;
        }
        
        toc > layout header[role="tocSubpartHeader"] {
            display:            block;
            background-color:   inherit;
        }
        
        tocItem {
            display:            block;
            background-color:   inherit;
        }
        
        column {
            display:            table-cell;
        }
        
        column[class~="threeColumnLeft"] {
            width:              10%;
        }
        
        column[class~="threeColumnMiddle"] {
            width:              100%;
            margin-left:        1em;
            text-indent:        -1em;
        }
        
        column[class~="threeColumnRight"] {
            width:              15%;
            text-align:         right;
        }
        
        column[class~="tocHeaderLeft"] {
            width:              5em;
            text-align:         left;
        }
        
        header[role="tocColumnHeader"] column:not([class]) {
            width:              76.7%;
        }
        
        column[class~="tocHeaderRight"] {
            width:              15%;
            text-align:         right;
        }
        
        column[class~="twoColumnLeft"] {
            width:              5em;
        }
        
        column[class~="twoColumnRight"] {
            width:              50em;
            margin-left:        1em;
            text-indent:        -1em;
        }
        
        toc[role="twoColumnPageWidthTOC"] {
            width:             426pt;
        }
        
        toc[role="twoColumnPageWidthTOC"] column[class~="twoColumnLeft"] {
            width:             380pt;
            margin-right:      10pt;
            font-weight:       bold;
        }
        
        toc[role="twoColumnPageWidthTOC"] column[class~="twoColumnRight"],
        toc[role="twoColumnPageWidthTOC"] column[class~="headerRight"] {
            width:             40pt;
            text-align:        right;
        }
        
        toc[role="twoColumnPageWidthTOC"] column[class~="twoColumnRight"] {
            font-weight:       bold;
        }
        
        *[class~="indentTo65ptsHang"] {
           text-indent:        -24pt;
           padding-left:       36pt;
        }
        
        /* USLM 2.0 ToC rules */
        /* ToC's are blocks */
        bill toc, resolution toc, pLaw toc  {
            display:            block;
            background-color:   inherit;
            font-size:          0.8em;
        }
        
        referenceItem, headingItem  {
            display:            block;
            width:              100%;
        }
        
        /*
        Old user agents don't support @supports() so will ignore the use of table-row
        but (recent) browsers will load it and override the properties set above.
        */
        @supports (display: table-row) {
            referenceItem, headingItem  {
                display:            table-row;
                width:              100%;
            }
        }
        
        /* By default, designators, labels and targets are flex block */
        designator, label, target  {
            display:            table-cell;
            text-align:         left;
            vertical-align:     top;
        }
        
        /* targets are right aligned */
        target  {
            text-align:         right;
        }
        
        /* Some Big level ToC entries are centered, with designator and label inline */
        bill toc referenceItem[role="division"],
        bill toc > referenceItem[role="title"],
        bill toc > referenceItem[role="subtitle"],
        resolution toc referenceItem[role="division"],
        resolution toc > referenceItem[role="title"],
        resolution toc > referenceItem[role="subtitle"],
        pLaw toc referenceItem[role="division"],
        pLaw toc > referenceItem[role="title"],
        pLaw toc > referenceItem[role="subtitle"]  {
            display:            block;
            background-color:   inherit;
            margin-top:         0.5em;
            margin-bottom:      0.5em;
            text-align:         center;
        }
        
        bill toc referenceItem[role="division"] > designator,
        bill toc referenceItem[role="division"] > label,
        bill toc referenceItem[role="title"] > designator,
        bill toc referenceItem[role="title"] > label,
        bill toc referenceItem[role="subtitle"] > designator,
        bill toc referenceItem[role="subtitle"] > label,
        resolution toc referenceItem[role="division"] > designator,
        resolution toc referenceItem[role="division"] > label,
        resolution toc referenceItem[role="title"] > designator,
        resolution toc referenceItem[role="title"] > label,
        resolution toc referenceItem[role="subtitle"] > designator,
        resolution toc referenceItem[role="subtitle"] > label,
        plaw toc referenceItem[role="division"] > designator,
        plaw toc referenceItem[role="division"] > label,
        plaw toc referenceItem[role="title"] > designator,
        plaw toc referenceItem[role="title"] > label,
        plaw toc referenceItem[role="subtitle"] > designator,
        plaw toc referenceItem[role="subtitle"] > label  {
            display:            inline;
        }
        
        /* Nested entries are set back to left align */
        bill toc referenceItem[role="division"] referenceItem,
        resolution toc referenceItem[role="division"] referenceItem,
        pLaw toc referenceItem[role="division"] referenceItem  {
            text-align:         left;
        }
        
        resolution toc referenceItem[role="section"]:first-of-type *,
        bill toc referenceItem[role="section"]:first-of-type *,
        pLaw toc referenceItem[role="section"]:first-of-type *  {
            padding-top:         1em;
        }
        
        bill toc referenceItem[role="section"]>designator,
        resolution toc referenceItem[role="section"]>designator,
        pLaw toc referenceItem[role="section"]>designator  {
            width:              6em;
        }
        
        bill toc referenceItem[role="section"]>label,
        resolution toc referenceItem[role="section"]>label,
        pLaw toc referenceItem[role="section"]>label  {
            text-indent:        -1em;
            padding-left:        1em;
        }
        
        cfrDoc toc, frDoc toc  {
            display:            block;
        }
        
        cfrDoc toc > heading, fr toc > heading  {
            display:            block;
            text-align:         center;
            font-size:          2em;
        }
        
        cfrDoc toc referenceItem  {
            display:            flex;
            width:              100%;
            flex-direction:     row;
            justify-content:    space-between;
        }
        
        cfrDoc toc groupItem > designator, cfrDoc toc groupItem > label {
            display:            inline;
            text-align:         center;
        }
        
        cfrDoc toc groupItem, cfrDoc toc headingItem  {
            display:            block;
            width:              100%;
            text-align:         center;
        }
        
        cfrDoc toc designator  {
            display:            block;
        }
        
        cfrDoc toc label  {
            display:            block;
        }
        
        cfrDoc toc target  {
            display:            block;
            margin-right:       0em;
        }
        
        cfrDoc > preface toc  {
            font-size:         0.8em;
        }
        
        cfrDoc > preface toc > headingItem > designator {
            font-style:         italic;
        }
        
        cfrDoc > preface toc > groupItem > headingItem {
            display:            block;
            margin-top:         1em;
            margin-bottom:      1em;
            text-align:         left;
        }
        
        cfrDoc > preface toc > groupItem > referenceItem {
            text-indent:        2em;
        }
        
        cfrDoc toc[class~="cfrTitleTOC"] headingItem,
        cfrDoc > preface toc > headingItem  {
            display:            flex;
            width:              100%;
            flex-direction:     row;
            justify-content:    flex-end;
            font-style:         italic;
        }
        
        cfrDoc toc headingItem[class~="columnHeader"]  {
            display:            flex;
            width:              100%;
            flex-direction:     row;
            justify-content:    space-between;
            font-style:         italic;
        }
        
        cfrDoc toc headingItem > designator,
        cfrDoc toc headingItem > label {
            display:            inline;
            font-variant:       small-caps;
        }
        
        cfrDoc toc[class~="cfrChapterTOC"] referenceItem > designator  {
            width:              6em;
        }
        
        cfrDoc part > toc headingItem  {
            display:            block;
            margin-top:         0.5em;
            margin-bottom:      0.5em;
            text-align:         center;
            width:              100%;
        }
        
        /* the first level group heading is bold */
        cfrDoc part > toc > groupItem > headingItem  {
            font-family:        sans-serif;
            font-weight:        bold;
            font-variant:       normal;
        }
        
        cfrDoc part > toc referenceItem  {
            display:            block;
            text-align:         left;
            margin-left:        2em;
            text-indent:        -2em;
            width:              100%;
        }
        
        cfrDoc part > toc referenceItem > designator,
        cfrDoc part > toc referenceItem > label  {
            display:            inline;
        }
        
        frDoc toc[role="fr-contents"],
        frDoc toc[role="fr-contents"] groupItem,
        frDoc toc[role="fr-contents"] referenceItem,
        frDoc toc[role="fr-issue-parts"],
        frDoc toc[role="fr-issue-parts"] groupItem,
        frDoc toc[role="fr-issue-parts"] referenceItem  {
            display:            block;
        }
        
        frDoc toc[role="fr-contents"] referenceItem,
        frDoc toc[role="fr-issue-parts"] referenceItem  {
            margin-left:        2em;
            text-indent:        -2em;
        }
        
        frDoc toc[role="fr-contents"] groupItem[role="agency"] > label,
        frDoc toc[role="fr-issue-parts"] groupItem > label  {
            display:            block;
            margin-top:         1em;
            font-weight:        bold;
            font-family:        sans-serif;
        }
        
        frDoc toc[role="fr-contents"] groupItem[role="agency"] groupItem[role="category"]>label {
            display:            block;
            font-size:          0.8em;
            font-weight:        bold;
            font-family:        sans-serif;
        }
        
        frDoc toc[role="fr-contents"] groupItem[role="category"]>groupItem>referenceItem {
            display:            block;
            margin-left:        3em;
            font-weight:        normal;
        }
        
        frDoc toc[role="fr-contents"] referenceItem[role="xref"]>label {
            font-style:         italic;
        }
        
        frDoc toc[role="fr-contents"] referenceItem>label,
        frDoc toc[role="fr-contents"] referenceItem>target,
        frDoc toc[role="fr-issue-parts"] referenceItem>label,
        frDoc toc[role="fr-issue-parts"] referenceItem>target  {
            display:            inline;
        }
        
        frDoc toc[role="fr-contents"] referenceItem>target[role="fr-doc-id"] {
            display:            none;
        }
        
        frDoc toc[role="fr-issue-parts"]  {
            display:            block;
        
            border-top-style:   solid;
            border-bottom-style:   solid;
            border-width:       1pt;
        }
        
        statuteCompilation toc referenceItem[role="section"]>designator  {
            width:              20em;
        }
        
        statuteCompilation toc referenceItem[role="section"]>label  {
            width:              50em;
        }
        
        statuteCompilation toc referenceItem[role="title"],
        statuteCompilation toc referenceItem[role="subtitle"]  {
            display:            block;
            margin-top:         0.5em;
            margin-bottom:      0.5em;
            text-align:         center;
        }
        
        statuteCompilation toc referenceItem[role="title"]>designator,
        statuteCompilation toc referenceItem[role="title"]>label,
        statuteCompilation toc referenceItem[role="subtitle"]>designator,
        statuteCompilation toc referenceItem[role="subtitle"]>label  {
            display:            inline;
        }
        
        /* Rules for Indexes */
        statutesAtLarge popularNameIndex,
        statutesAtLarge subjectIndex  {
            display:            block;
            font-size:          0.9em;
        }
        
        statutesAtLarge popularNameIndex>heading,
        statutesAtLarge subjectIndex>heading  {
            display:            block;
            margin-top:         1em;
            margin-bottom:      1em;
            font-size:          1.2em;
            text-align:         center;
        }
        
        statutesAtLarge popularNameIndex groupItem,
        statutesAtLarge subjectIndex groupItem  {
            display:            block;
            margin-top:         1em;
            margin-bottom:      1em;
            font-size:          1.2em;
        }
        
        statutesAtLarge popularNameIndex groupItem>label,
        statutesAtLarge subjectIndex groupItem>label  {
            display:            block;
            width:              26em;
            font-weight:        bold;
            text-align:         center;
        }
        
        statutesAtLarge subjectIndex groupItem>groupItem>label  {
            width:              26em;
            text-align:         left;
            font-size:          0.8em;
        }
        
        statutesAtLarge subjectIndex referenceItem  {
            display:            block;
            margin-left:        1em;
        }
        
        statutesAtLarge popularNameIndex referenceItem>designator  {
            display:            table-cell;
            padding-left:       2em;
            text-indent:        -2em;
            width:              20em;
            text-align:         left;
            font-weight:        bold;
        }
        
        statutesAtLarge popularNameIndex referenceItem>target  {
            width:              6em;
            text-align:         right;
            vertical-align:     bottom;
        }
        
        statutesAtLarge subjectIndex referenceItem>designator  {
            display:            table-cell;
            padding-left:       2em;
            text-indent:        -2em;
            width:              20em;
            font-size:          0.8em;
            text-align:         left;
        }
        
        statutesAtLarge subjectIndex referenceItem>target  {
            width:              6em;
            text-align:         right;
            vertical-align:     bottom;
            font-size:          0.8em;
        }
        
        /* Section element rules */
        section, courtRule {
            display:            block;
            margin-top:         1em;
            margin-bottom:      0.3em;
            text-align:         justify;
            font-size:          1em;
            font-weight:        normal;
        }
        
        section > content, section > amendingFormula,
        courtRule > content, courtRule > chapeau  {
            display:            block;
            margin-top:         0em;
            margin-bottom:      0em;
            text-indent:        1em;
        }
        
        
        /* Below section element rules */
        
        content {
            display:            inline;
        }
        
        /* For most docs, levels below subsection are indented 2em from their parent,
         * with a first-line indent of an additional 2em. */
        paragraph,
        subparagraph,
        clause,
        subclause,
        item,
        subitem,
        subsubitem,
        section level {
            display:            block;
            margin-top:         0.3em;
            margin-left:        2em;
            margin-bottom:      0.3em;
            text-align:         justify;
            text-indent:        2em;
            background-color: inherit;
        }
        
        /* USC levels below subsection are indented 1em from their parent by default,
         * with a first-line indent of an additional 1em. */
         paragraph[identifier*="/us/usc"]:not([class~="indent0"]),
         subparagraph[identifier*="/us/usc"]:not([class~="indent0"]),
         clause[identifier*="/us/usc"]:not([class~="indent0"]),
         subclause[identifier*="/us/usc"]:not([class~="indent0"]),
         item[identifier*="/us/usc"]:not([class~="indent0"]),
         subitem[identifier*="/us/usc"]:not([class~="indent0"]),
         level[identifier*="/us/usc"]:not([class~="indent0"]),
         section[identifier*="/us/usc"] paragraph:not([class~="indent0"]),
         section[identifier*="/us/usc"] subparagraph:not([class~="indent0"]),
         section[identifier*="/us/usc"] clause:not([class~="indent0"]),
         section[identifier*="/us/usc"] subclause:not([class~="indent0"]),
         section[identifier*="/us/usc"] item:not([class~="indent0"]),
         section[identifier*="/us/usc"] subitem:not([class~="indent0"]),
         section[identifier*="/us/usc"] level:not([class~="indent0"]),
         uscDoc paragraph:not([class~="indent0"]),
         uscDoc subparagraph:not([class~="indent0"]),
         uscDoc clause:not([class~="indent0"]),
         uscDoc subclause:not([class~="indent0"]),
         uscDoc item:not([class~="indent0"]),
         uscDoc subitem:not([class~="indent0"])  {
             margin-left:        1em !important;
             text-indent:        1em !important;
         }
        
        
        /* Subsections are flush with sections */
        subsection  {
            display:            block;
            margin-top:         0.3em;
            margin-left:        0em;
            margin-bottom:      0.3em;
            text-align:         justify;
            text-indent:        2em;
        }
        
        /* USC subsections have a 1em first-line indent */
        subsection[identifier*="/us/usc"],
        section[identifier*="/us/usc"] subsection  {
            text-indent:        1em;
        }
        
        /* CFR paragraphs are not indented and have a 1em first-line indent */
        paragraph[identifier*="/us/cfr"],
        section[identifier*="/us/cfr"] paragraph  {
            display:            block;
            margin-left:        0em;
            text-indent:        1em;
        }
        
        /* As a workaround, !important is set for USC small levels to override the indent and first-indent styles */
        /* Current USC USLM data has indents that are absolute from the left margin, not relative to their container. */
        /* But, this CSS works on relative margins. */
        
        /* In USC, subsection headings are not small-caps
         * This was incorrectly set because it followed the html printing the printed pdf does have small caps for subsections.
        subsection[identifier*="/us/usc"] heading,
        section[identifier*="/us/usc"] subsection heading {
            font-variant:       normal;
        }
        */
        
        /* In USC non-positive law titles, small levels that have headings put a new line after the heading */
        /* Temporarily this difference is recogized by a p element in content or an indent class on a chapeau */
        /* In the longer-term, USC title documents will have class indicating positive versus non-positive */
        [identifier*="/us/usc"] heading+content>p,
        [identifier*="/us/usc"] heading+chapeau[class*="indent"]  {
            display:            block;
            margin-left:        0em !important;
            text-indent:        1em !important;
            background-color: inherit;
        }
        
        paragraph[class~="indent-up1"] {
            margin-left:        0em;
            background-color: inherit;
        }
        
        chapeau {
            display:            inline;
        }
        
        section>chapeau {
            display:            block;
            text-indent:        2em;
            background-color: inherit;
        }
        
        chapeau[class~="blockIndent0"] {
            display:            block;
            margin-left:        0em;
            text-indent:        1em;
            background-color: inherit;
        }
        
        chapeau[class~="blockIndent1"] {
            display:            block;
            margin-left:        1em;
            text-indent:        1em;
            background-color: inherit;
        }
        
        chapeau[class~="blockIndent2"] {
            display:            block;
            margin-left:        2em;
            text-indent:        1em;
            background-color: inherit;
        }
        
        continuation {
            display:            block;
            background-color: inherit;
        }
        
        /* Appropriations */
        title[role~="appropriations"]>num,
        title[role~="appropriations"]>heading,
        title[class~="bill-dtd-appropriations"]>num,
        title[class~="bill-dtd-appropriations"]>heading  {
            text-align:         center;
            font-size:       1em;
            font-weight:        normal;
        }
        
        appropriations,
        level[role~="appropriations"]  {
            display:            block;
            margin-top:         1em;
            margin-left:        0em;
            text-align:         justify;
        }
        
        title[role~="appropriations"] > heading,
        level[role~="appropriations"] > heading,
        appropriations-intermediate > heading,
        title[role~="appropriations"] > subheading,
        level[role~="appropriations"] > subheading,
        appropriations-intermediate > subheading,
        appropriations > heading,
        appropriations > subheading {
            display:            block;
            margin-bottom:      0.5em;
            text-align:         center;
            font-variant:       small-caps;
        }
        
        appropriations > content  {
            display:            block;
            margin-left:        0em;
            text-align:         justify;
            text-indent:        2em;
        }
        
        appropriations > section > num,
        *[role=appropriations] > section > num  {
            margin-left:        2em;
            font-weight:        normal;
            font-variant:       small-caps;
        }
        
        appropriations > section > content,
        appropriations > section > chapeau,
        *[role=appropriations] > section > content,
        *[role=appropriations] > section > chapeau  {
            display:            inline;
        }
        
        /* Appendix Content */
        reorganizationPlan > content {
            display:            block;
            margin-top:         0.3em;
            margin-bottom:      0.3em;
            margin-right:       1em;
            text-align:         left;
            text-indent:        1em;
            font-weight:        normal;
        }
        
        
        /* Notes and References */
        notes {
            display:            block;
            background-color:   inherit;
            margin-top:         0.3em;
            margin-bottom:      0.3em;
            margin-left:        0em;
            font-size:          0.9em;
            font-weight:        normal;
        }
        
        sourceCredit {
            display:            block;
            background-color:   inherit;
            margin-left:        0em;
            margin-top:         0.3em;
            margin-bottom:      0.3em;
            text-align:         left;
            text-indent:        0em;
            font-size:          1em;
            font-weight:        normal;
        }
        
        sourceCredit > p {
            text-indent:        0em;
        }
        
        note {
            display:            block;
            background-color:   inherit;
            margin-bottom:      0.3em;
            text-align:         left;
            text-indent:        0em;
            font-weight:        normal;
        }
        
        notes[type="uscNote"] > note > heading {
            margin-top:         2em;
            font-size:          0.9em;
            text-align:         center;
            display:            block;
            font-weight:        bold;
        }
        
        note[type="footnote"],
        footnote  {
            display:            block;
            background-color:   inherit;
            margin-top:         0.5em;
            margin-bottom:      0em;
            text-align:         left;
            text-indent:        0em;
            font-size:          1em;
            font-weight:        normal;
        }
        
        /* Footnote rendering for statute compilations*/
        statuteCompilation footnote  {
            display:            block;
            background-color:   inherit;
            margin-top:         1em;
            margin-bottom:      1em;
            padding-top:        0.2em;
            padding-bottom:     0.2em;
            text-align:         left;
            text-indent:        0em;
            font-size:          0.8em;
            font-weight:        normal;
            border-top:         1pt solid;
            border-bottom:      1pt solid;
        }
        
        note[type="footnote"] > num,
        footnote > num,
        ref[class~="footnoteRef"] {
            font-weight:        bold;
            vertical-align:     super;
            font-size:          0.8em;
        }
        
        note[type="footnote"] > p:first-of-type,
        footnote > p:first-of-type {
            display:            inline;
        }
        
        note[type="footnote"] > p:first-of-type:before,
        footnote > p:first-of-type:before {
            content:            ' ';
        }
        
        /* Footnote superscript number */
        /* These selectors should be replaced with non-SGML specific selectors */
        note[style="-uslm-sgm-FTNT/P/SU"],
        footnote[style="-uslm-sgm-FTNT/P/SU"],
        ref[style="-uslm-sgm-p/su"],
        ref[style="-uslm-dtd:footnote-ref"],
        ref[style="-uslm-dtd:dangling-footnote-ref"] {
            display:            inline;
            font-size:          0.8em;
            vertical-align:     top;
        }
        
        /* Sidenotes */
        sidenote  {
          display:              block;
          background-color:   inherit;
          float:                right;  /* Default to right side */
          margin-right:         -12em;
          width:                11em;
          text-align:           left;
          margin-top:           0.3em;
          margin-bottom:        -1.2em;
          text-indent:          0em;
          font-size:            0.8em;
          font-weight:          normal;
          font-variant:         normal;
        }
        
        sidenote[renderingPosition="leftMargin"]  {
          float:                left;
          margin-left:         -12em;
          width:                10em;
        }
        
        /* Push the a second sidenote below the first one.  There should be a better way to do this. */
        sidenote:not(:first-of-type) {
          margin-top:         3em;
        }
        
        /* Enactment Date sidenote */
        sidenote[topic~="enactment"],
        pLaw longTitle > sidenote,
        resolution sidenote:first-of-type  {
          margin-top:           -3em;
          text-align:           center;
        }
        
        /* To simulate the line between date and the bill number */
        sidenote[topic~="enactment"] date,
        pLaw longTitle > sidenote > p:first-of-type,
        resolution sidenote:first-of-type > p:first-of-type  {
          text-decoration:      underline;
        }
        
        sidenote[topic~="shortTitle"],
        sidenote[topic~="classification"],
        sidenote[topic~="pLawNote"]  {
          font-size:            0.8em;
        }
        
        /* Special case for sidenote after enacting formula or resolving clause */
        pLaw enactingFormula + sidenote,
        pLaw resolvingClause + sidenote  {
          margin-top:           -2em;  /* move it up by two lines */
        }
        
        sidenote > p {
          text-indent:          0em;
        }
        
        span[role="classifiedText"]:before,
        ref[role="classifiedText"]:before  {
            font-weight: bold;
            font-size: 1.2em;
            color: red;
            content: "["
        }
        
        span[role="classifiedText"]:after,
        ref[role="classifiedText"]:after  {
            font-weight: bold;
            font-size: 1.2em;
            color: red;
            content: "]"
        }
        
        endMarker  {
            display:            block;
            text-align:         center;
            font-size:          1.6em;
        }
        
        /* In-flow Notes */
        legislativeHistory  {
            display:            block;
            max-width:          32.4em;
            margin-left:        0em;
            margin-right:       0em;
            margin-top:         4em;
            border-top:         1px solid;
            font-size:          0.8em;
        }
        
        legislativeHistory p {
            margin-left:        5em;
        }
        
        note[topic="enacting"] > p {
            display:            block;
            background-color:   inherit;
            margin-left:        2em;
            margin-right:       2em;
            margin-top:         0em;
            margin-bottom:      0em;
            text-align:         center;
            font-style:         italic;
        }
        
        note[topic="explanation"]::before {
            font-style:         normal;
        }
        
        note[topic="explanation"] {
            font-style:         italic;
        }
        
        /* For U.S. Code note at the top */
        title>note[topic="miscellaneous"], appendix>note[topic="miscellaneous"] {
            display:            block;
            background-color:   inherit;
            text-align:         center;
            font-style:         normal;
        }
        
        title>note[topic="miscellaneous"]>p:before, appendix>note[topic="miscellaneous"]>p:before {
            display:            inline;
            content:            "[";
        }
        
        title>note[topic="miscellaneous"]>p:after, appendix>note[topic="miscellaneous"]>p:after {
            display:            inline;
            content:            "]";
        }
        
        /* Elided */
        elided[role="fiveStar"] {
            display:            block;
            margin-bottom:      0em;
            text-align:         left;
            text-indent:        0em;
            font-weight:        normal;
        }
        
        elided[role="threeStar"] {
            display:            inline;
            font-weight:        normal;
        }
        
        /* Provisions not in effect within statute compilations are rendered in italic */
        *[inEffect="false"]  {
            font-style:         italic;
        }
        
        /* General Content Item Rules */
        *[class~="normal"]  {
            font-weight:        normal;
            font-style:         normal;
            font-variant:       normal;
        }
        
        *[class~="centered"] {
            display:            block;
            background-color:   inherit;
            margin-left:        0em;
            margin-right:       0em;
            text-indent:        0em;
            text-align:         center;
        }
        
        *[class~="bold"] {
            font-weight:        bold !important;
        }
        
        *[class~="italic"] {
            font-style:         italic !important;
        }
        
        *[class~="smallCaps"] {
            font-variant:       small-caps !important;
        }
        
        *[class~="noSmallCaps"]  {
            font-variant:       normal !important;
        }
        
        *[class~="noTextTransform"]  {
            text-transform:       none !important;
        }
        
        *[class~="block"] {
           display:             block;
        }
        
        *[class~="inline"] {
           display:             inline !important;
           margin-left:         0em;
        }
        
        /* Set the first line indentation. Each logical indent level is 2em */
        *[class~="firstIndent-4"] {
            text-indent:        -8em !important;
        }
        
        *[class~="firstIndent-3"] {
            text-indent:        -6em !important;
        }
        
        *[class~="firstIndent-2"] {
            text-indent:        -4em !important;
        }
        
        *[class~="firstIndent-1"] {
            text-indent:        -2em !important;
        }
        
        *[class~="firstIndent0"] {
            text-indent:        0em !important;
        }
        
        *[class~="firstIndent1"] {
            text-indent:        2em !important;
        }
        
        *[class~="firstIndent2"] {
            text-indent:        4em !important;
        }
        
        /* These are a workarounds to handle hanging indents in USC titles that are converted from locators */
        /* These occur for subsection headings and paragraph headings in non-positive titles */
        *[class~="indent2"][class~="firstIndent-2"] {
            text-indent:        0em !important;
        }
        
        *[class~="indent3"][class~="firstIndent-2"] {
            text-indent:        0em !important;
        }
        
        *[class~="indent4"][class~="firstIndent-2"] {
            text-indent:        0em !important;
        }
        
        *[class~="indent5"][class~="firstIndent-2"] {
            text-indent:        0em !important;
        }
        
        *[class~="indent6"][class~="firstIndent-2"] {
            text-indent:        0em !important;
        }
        
        /* Set right margin indentation. Each logical indent level is 2em */
        *[class~="rightIndent1"] {
            display:            block;
            margin-right:       2em;
            text-align:         right;
        }
        
        *[class~="rightIndent2"] {
            display:            block;
            margin-right:       4em;
            text-align:         right;
        }
        
        *[class~="rightIndent3"] {
            display:            block;
            margin-right:       6em;
            text-align:         right;
        }
        
        /*  Left indents, relative to the parent container. Each logical indent level is 2em */
        *[class~="indentDown7"] {
            margin-left:        -14em;
        }
        
        *[class~="indentDown6"] {
            margin-left:        -12em;
        }
        
        *[class~="indentDown5"] {
            margin-left:        -10em;
        }
        
        *[class~="indentDown4"] {
            margin-left:        -8em;
        }
        
        *[class~="indentDown3"] {
            margin-left:        -6em;
        }
        
        *[class~="indentDown2"] {
            margin-left:        -4em;
        }
        
        *[class~="indentDown1"] {
            margin-left:        -2em;
        }
        *[class~="indent0"]    {
            margin-left:        0em;
        }
        
        /* For bills, the normal indent for descendent levels is 2em. */
        /* 2em default is set elsewhere, without this "indentUp1" class. */
        *[class~="indentUp1"] {
            margin-left:        2em;
        }
        
        *[class~="indentUp2"] {
            margin-left:        4em;
        }
        
        *[class~="indentUp3"] {
            margin-left:        6em;
        }
        
        *[class~="indentUp4"] {
            margin-left:        8em;
        }
        
        *[class~="indentUp5"] {
            margin-left:        10em;
        }
        
        *[class~="indentUp6"] {
            margin-left:        12em;
        }
        
        *[class~="indentUp7"] {
            margin-left:        14em;
        }
        
        /* Comment this out becuase the converter sets these as absolute indents,
         * not relative to the hierarchical container.
        
        *[class~="indent-6"] {
            margin-left:        -12em;
        }
        
        *[class~="indent-5"] {
            margin-left:        -10em;
        }
        
        *[class~="indent-4"] {
            margin-left:        -8em;
        }
        
        *[class~="indent-3"] {
            margin-left:        -6em;
        }
        
        *[class~="indent-2"] {
            margin-left:        -4em;
        }
        
        *[class~="indent0"], *[class~="indent-1"] {
            margin-left:        0em;
        }
        
        *[class~="indent1"] {
            margin-left:        2em;
        }
        
        *[class~="indent2"] {
            margin-left:        4em;
        }
        
        *[class~="indent3"] {
            margin-left:        6em;
        }
        
        *[class~="indent4"] {
            margin-left:        8em;
        }
        
        *[class~="indent5"] {
            margin-left:        10em;
        }
        
        *[class~="indent6"] {
            margin-left:        12em;
        }
        
        *[class~="indent7"] {
            margin-left:        14em;
        }
        */
        
        *[class~="fontsize6"] {
            font-size:          0.6em;
        }
        
        *[class~="fontsize7"] {
            font-size:          0.7em;
        }
        
        *[class~="fontsize8"] {
            font-size:          0.8em;
        }
        
        /* cfr classes */
        *[class~="heading2"]  {
            text-align:         center;
            font-style:         italic;
            margin-top:         1em;
        }
        
        *[class~="heading1"]  {
            text-align:         center;
            font-variant:       small-caps;
            margin-top:         1em;
        }
        
        *[class~="heading1"]+p:not([class]),
        *[class~="heading2"]+p:not([class])  {
            /* Add space above regular paragraphs after headings */
            margin-top:         1em;
        }
        
        xhtml|p, p {
            display:            block;
            background-color:   inherit;
            margin-left:        0em;
            text-indent:        1em;
        }
        
        text {
            display:            block;
            text-indent:        1em;
        }
        
        continuation {
            display:            block;
            text-indent:        0em;
        }
        
        content > heading  {
            display:            block;
            margin-top:         0.5em;
        }
        
        quotedContent {
            display:            inline;
        /*  text-indent:        0em; */
        }
        
        quotedText {
            display:            inline;
        }
        
        quotedContent > section {
            display:            block;
            margin-top:         0.3em;
        }
        
        xhtml|ul {
            display:            block;
            margin-top:         0em;
            margin-bottom:      0em;
            list-style-position: inside;
            text-indent:        1em;
            margin-left:        -3em;
        }
        
        xhtml|li  {
            display:            list-item;
            text-align:         left;
            list-style-type:    disc;
        }
        
        xhtml|ul[class~="outsideBullet"]  {
           list-style-position: outside;
           text-indent:         0em;
           margin-left:         -2em;
        }
        
        sup {
            vertical-align:     super;
            font-size:          0.6em;
        }
        
        sub {
            vertical-align:     sub;
            font-size:          0.6em;
        }
        
        xhtml|italic,
        xhtml|i,
        i {
            font-style:         italic;
        }
        
        xhtml|bold,
        xhtml|b,
        b {
            font-weight:        bold;
        }
        
        inline {
            display:            inline;
        }
        
        *[class~="small-caps"] {
            font-variant:       small-caps;
        }
        
        *[class~="underline"] {
            text-decoration:       underline;
        }
        
        def {
            display:            inline;
        }
        
        term {
            display: inline;
        }
        
        cfrDoc term {
            display: inline;
            font-style:         italic;
            font-variant:       normal;
        }
        
        xhtml|br,
        br {
            display:            block;
        }
        
        figure {
            display: block;
            margin-top: 1em;
            margin-bottom: 1em;
            margin-left: 40px;
            margin-right: 40px;
        }
        
        figCaption {
            display: block;
        }
        
        /*  Lists */
        listHeading  {
            display:            block;
            margin-top:         0.5em;
            margin-bottom:      0.5em;
            text-align:         center;
        }
        
        listItem  {
            display:            block;
            margin-left:        2em;
            text-indent:        0em;
        }
        
        listContent  {
            display:            inline;
        }
        
        /* ------------------------------------------------------------------------- */
        /* HTML                                                                      */
        /* ------------------------------------------------------------------------- */
        
        /* Tables */
        xhtml|table {
            display:            table;
            border-style:       none;
            margin-top:         1em;
            margin-bottom:      1em;
            border-collapse:    collapse;
        }
        
        xhtml|colgroup, colgroup {
            display:            table-column-group
        }
        
        xhtml|col, col {
            display:            table-column
        }
        
        xhtml|thead, thead {
           display:             table-header-group;
           text-align:          center;
           margin:              0.3em;
        }
        
        
        xhtml|tfoot, tfoot {
           display:             table-footer-group;
           text-align:          center;
           margin:              0.3em;
        }
        
        xhtml|tbody, tbody {
           display:             table-row-group;
           font-size:           0.7em;
           text-align:          justify;
        }
        
        xhtml|tr, tr {
           display:             table-row;
        }
        
        xhtml|td, td,
        xhtml|th, th {
           display:             table-cell;
           font-weight :        normal;
           padding-left:        .2em;
        }
        
        /* End table CSS */
        
        *[class~="thinsp"] {
           width:               0.16em;
           display:             inline-block;
        }
        
        *[class~="sectionNumber"] {
           font-weight:         bold;
        }
        
        *[class~="title"] {
           font-size:           1em;
           font-weight:         bold;
           margin-bottom:       0.6em;
           text-align:          center;
        }
        
        xhtml|tr[class~="headers"] {
           vertical-align:      middle;
           text-align:          center;
        }
        
        xhtml|td > xhtml|p {
           margin:              .3em;
           padding-left:        .2em;
        }
        
        xhtml|th > xhtml|p {
           margin:              0em;
           margin-left:         0.4em;
           margin-right:        0.4em;
        }
        
        xhtml|p[class~="leaders"] {
            max-width:          40em;
            padding:            0em;
            baseline-shift:     0;
            overflow-x:         hidden;
            list-style:         none;
        }
        
        xhtml|p[class~="leaders"] xhtml|span:after {
            display:            inline-flex;
            float:              left;
            width:              0em;
            baseline-shift:     0;
            white-space:        nowrap;
        }
        
        xhtml|p[class~="leaders"] xhtml|span:first-child {
            padding-right:      0.33em;
            background:         white;
        }
        
        
        /* ------------------------------------------------------------------------- */
        /* Schedule of Laws Repealed */
        *[class~="SOLR"] {
            width: 100%;
            margin: 1em 0 1em 0;
            text-indent: 0;
            border-bottom: 1px solid black;
        }
        *[class~="SOLR"] colgroup > col:nth-child(1) { width: 39%; }
        *[class~="SOLR"] colgroup > col:nth-child(2) { width: 31%; }
        *[class~="SOLR"] colgroup > col:nth-child(3) { width: 30%; }
        *[class~="SOLR"] caption { padding-bottom: 0.8em; }
        *[class~="SOLR"] th:not(:last-of-type), *[class~="SOLR"] td:not(:last-of-type) {
            border-right: 1px solid black;
        }
        *[class~="SOLR"] thead th {
            font-size: 0.7em;
            text-align: center;
            padding: 0.5em 0 0.5em 0;
            vertical-align: middle;
            border-top: 1px solid black;
            border-bottom: 1px solid black;
        }
        *[class~="SOLR"] tbody {
            font-size: 1em;
            vertical-align: top;
        }
        *[class~="SOLR"] td  {
            padding-right: 0.2em;
        }
        *[class~="SOLR"] tr.firstOfAct > td  {
            padding-top: 1em;
        }
        *[class~="SOLR"] td:nth-of-type(2), *[class~="SOLR"] td:nth-of-type(3) {
            text-align: left;
        }
        *[class~="SOLR"] td p {
            padding-left: 1em;
            text-indent: -0.8em;
        }
        
        
        /* Metadata block */
        uscDoc>meta, bill>meta, resolution>meta, pLaw>meta, statutesAtLarge>meta,
        frDoc>meta, cfrDoc>meta, statutesAtLarge component>meta  {
            display:            none;
            border-style:       solid;
            border-width:       1pt;
            border-color:       gray;
            margin-left:	    3pt;
            margin-top:         3pt;
            margin-bottom:	    3pt;
            text-align:         left;
            text-indent:        0em;
            padding-left:       1em;
            color:              gray;
        }
        
        uscDoc>meta:before, bill>meta:before, resolution>meta:before, pLaw>meta:before, statutesAtLarge>meta:before,
        frDoc>meta:before, cfrDoc>meta:before, statutesAtLarge component>meta:before  {
            display:            inline;
            color:              gray;
            font-size:          1.2em;
            font-weight:        bold;
            content:            "[Metadata]";
        }
        
        /* By default, all metadata items are block */
        meta>* {
            display:            block;
            margin-left:        2em;
            text-indent:        -2em;
        }
        
        frDoc component>meta>* {
            display:            none;
        }
        
        /* Metadata display */
        /* Dublin Core elements */
        meta>dc|creator:before {
            display:            inline;
            color:              gray;
            content:            "Created By: ";
        }
        
        meta>dc|format:before {
            display:            inline;
            color:              gray;
            content:            "Format: ";
        }
        
        meta>dc|identifier:before {
            display:            inline;
            color:              gray;
            content:            "Identifier: ";
        }
        
        meta>dc|language:before {
            display:            inline;
            color:              gray;
            content:            "Language: ";
        }
        
        meta>dc|publisher:before  {
            display:            inline;
            color:              gray;
            content:            "Publisher: ";
        }
        
        meta>dc|rights:before {
            display:            inline;
            color:              gray;
            content:            "Rights: ";
        }
        
        meta>dc|title:before  {
            display:            inline;
            color:              gray;
            content:            "Title: ";
        }
        
        meta>dc|type:before  {
            display:            inline;
            color:              gray;
            content:            "Type: ";
        }
        
        meta>dcterms|created:before {
            display:            inline;
            color:              gray;
            content:            "Created On: ";
        }
        
        /* USLM-defined metadata elements */
        meta>congress:before  {
            display:            inline;
            color:              gray;
            content:            "Congress: ";
        }
        
        meta>docNumber:before {
            display:            inline;
            color:              gray;
            content:            "Doc Number: ";
        }
        
        meta>docPublicationName:before {
            display:            inline;
            color:              gray;
            content:            "Publication Name: ";
        }
        
        meta>citableAs:before {
            display:            inline;
            color:              gray;
            content:            "Citable As: ";
        }
        
        meta>docReleasePoint:before {
            display:            inline;
            color:              gray;
            content:            "Doc Release Point: ";
        }
        
        meta>docStage:before  {
            display:            inline;
            color:              gray;
            content:            "Doc Stage: ";
        }
        
        meta>session:before  {
            display:            inline;
            color:              gray;
            content:            "Session: ";
        }
        
        meta>startingPage:before {
            display:            inline;
            color:              gray;
            content:            "Starting Page: ";
        }
        
        meta>dc|title:before {
            display:            inline;
            color:              gray;
            content:            "Title: ";
        }
        
        meta>docPublicationName:before {
            display:            inline;
            color:              gray;
            content:            "Publication Name: ";
        }
        
        meta>volume:before {
            display:            inline;
            color:              gray;
            content:            "Volume: ";
        }
        
        meta>issue:before {
            display:            inline;
            color:              gray;
            content:            "Issue: ";
        }
        
        meta>date:before {
            display:            inline;
            color:              gray;
            content:            "Date: ";
        }
        
        meta>processedBy:before {
            display:            inline;
            color:              gray;
            content:            "Processed By: ";
        }
        
        meta>processedDate:before {
            display:            inline;
            color:              gray;
            content:            "Processed Date: ";
        }
        
        meta>publicPrivate:before {
            display:            inline;
            color:              gray;
            content:            "Public/Private: ";
        }
        
        
        meta>docPart:before {
            display:            inline;
            color:              gray;
            content:            "Document Part: ";
        }
        
        /* Page Formatting */
        /* Page Break Markers */
        page, preface>startingPage  {
            display: block;
            margin-top: 24pt;
            margin-bottom: 12pt;
            text-align: center;
            text-indent: 0pt;
            font-weight: normal;
            font-style: normal;
            font-family: "Century Schoolbook", "NewCenturySchlbk", "Times New Roman", serif;
            font-size: 11pt;  /* fixed size, independent of context. 11pt in the pdf */
        }
        
        /* Suppress page numbers in Statutes At Large cover pages */
        statutesAtLarge > preface page,
        statutesAtLarge component > preface page,
        publicLaws > preface page,
        privateLaws > preface page,
        resolutions > preface page,
        presidentialDocs > preface page  {
            display:            none;
        }
        
        /*
        page:before, preface>startingPage:before {
            content: "--- PAGE ";
        }
        
        page[class="raw"]:before, preface>startingPage[class="raw"]:before {
            content: "--- ";
        }
        
        page:after, preface>startingPage:after {
            content: " ---";
        }
          */
        
        frDoc preface>startingPage  {
            display:none;
        }
        
        cfrDoc leftRunningHead,
        cfrDoc rightRunningHead,
        cfrDoc ear  {
            font-family:        sans-serif;
            font-weight:        bold;
            font-size:          1.2em;
        }
        
        cfrDoc leftRunningHead  {
            display:            inline-block;
            width:              50%;
            text-align:         left;
        }
        
        cfrDoc rightRunningHead  {
            display:            inline-block;
            width:              49%;
            text-align:         right;
        }
        
        cfrDoc ear  {
            display:            block;
            text-align:         left;
        }
        
        frDoc ear  {
            display:            none;
        }
        
        /* Special Items */
        /* Override dc:title at the end of the CSS so that dc:title does not get rendered like a USLM:title element */
        dc|title {
            display:            block;
            margin-top:         0em;
            margin-bottom:      0em;
            text-align:         left;
            font-size:          1em;
        }
        
        /* Placeholder Hack, xmleditor stylesheets do not seem to work */
        /* see https://github.com/Xcential-Corporation/XmlEditor/issues/264 */
        xhtml|placeholder {
          display: inline-block;
          background-color: grey !important;
          color: white !important;
          text-indent: 0;
          /* font-weight: normal !important;
             font-style: normal !important;
             text-decoration: none !important; */
          cursor: pointer;
          border-radius: 5px;
          padding-left: 2px;
          padding-right: 2px;
        }
        
        
        /* P in notes are not nested, so the absolute indents (rather than relative indents) may be respected */
        
        note > p[class~="firstIndent-1"] {
            text-indent:        -1em!important;
        }
        
        note > p[class~="firstIndent-2"] {
            text-indent:        -2em!important;
        }
        
        note > p[class~="firstIndent-3"] {
            text-indent:        -3em!important;
        }
        
        note > p[class~="firstIndent-4"] {
            text-indent:        -4em!important;
        }
        
        note > p[class~="firstIndent-5"] {
            text-indent:        -5em!important;
        }
        
        note > p[class~="firstIndent-6"] {
            text-indent:        -6em!important;
        }
        
        note > p[class~="indent1"] {
            margin-left:        1em;
        }
        
        note > p[class~="indent2"] {
            margin-left:        2em;
        }
        
        note > p[class~="indent3"] {
            margin-left:        3em;
        }
        
        note > p[class~="indent4"] {
            margin-left:        4em;
        }
        
        note > p[class~="indent5"] {
            margin-left:        5em;
        }
        
        note > p[class~="indent6"] {
            margin-left:        6em;
        }

            `;
        this.shadowRoot.append(style);
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
