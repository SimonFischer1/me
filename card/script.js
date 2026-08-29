/* =========================================================
   SIMON FISCHER · DIGITALE VISITENKARTE
   ========================================================= */


/* ---------------------------------------------------------
   PROFIL
   --------------------------------------------------------- */

const profile = {
    firstName: "Simon",
    lastName: "Fischer",

    email: "DEINE.PRIVATE.MAIL@BEISPIEL.DE",

    studentEmail:
        "DEINE.STUDENTISCHE.MAIL@BEISPIEL.DE",

    phone:
        "+49 123 4567890",

    address:
        "DEINE STRASSE 1, 00000 ORT",

    instagram:
        "https://www.instagram.com/",

    linkedin:
        "https://www.linkedin.com/",

    github:
        "https://github.com/"
};


/* ---------------------------------------------------------
   FESTE URL DER VISITENKARTE
   --------------------------------------------------------- */

const profileURL = "http://card.navtool.de/";


/*
   Diese URL wird vom unteren QR-Code verwendet.

   Beim Aufrufen erkennt script.js:
   ?save=contact

   und startet automatisch den Kontakt-Download.
*/

const contactURL =
    "http://card.navtool.de/?save=contact";


/* ---------------------------------------------------------
   QR-CODE ERSTELLEN
   --------------------------------------------------------- */

function createQR(elementId, data, size) {

    const element =
        document.getElementById(elementId);

    if (!element) return;

    element.innerHTML = "";

    const img =
        document.createElement("img");

    img.src =
        "https://api.qrserver.com/v1/create-qr-code/?" +
        "size=" +
        size +
        "x" +
        size +
        "&margin=10" +
        "&data=" +
        encodeURIComponent(data);

    img.alt =
        "QR-Code";

    img.loading =
        "eager";

    element.appendChild(img);
}


/* ---------------------------------------------------------
   UNTERER QR-CODE
   -> KONTAKT SPEICHERN
   --------------------------------------------------------- */

createQR(
    "qrcode",
    contactURL,
    500
);


/* ---------------------------------------------------------
   QR-CODE OBEN ÖFFNEN
   -> VISITENKARTE
   --------------------------------------------------------- */

function openQR() {

    const modal =
        document.getElementById("qrModal");

    modal.classList.add("active");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    createQR(
        "qrLarge",
        profileURL,
        600
    );
}


/* ---------------------------------------------------------
   QR-MODAL SCHLIESSEN
   --------------------------------------------------------- */

function closeQR() {

    const modal =
        document.getElementById("qrModal");

    modal.classList.remove("active");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );
}


/* ---------------------------------------------------------
   VCARD ERSTELLEN
   --------------------------------------------------------- */

function createVCard() {

    return `BEGIN:VCARD
VERSION:3.0
N:${profile.lastName};${profile.firstName};;;
FN:${profile.firstName} ${profile.lastName}
EMAIL;TYPE=INTERNET:${profile.email}
EMAIL;TYPE=INTERNET,STUDENT:${profile.studentEmail}
TEL;TYPE=CELL:${profile.phone}
ADR;TYPE=HOME:;;${profile.address};;;
URL:${profileURL}
NOTE:Digitale Visitenkarte von ${profile.firstName} ${profile.lastName}
END:VCARD`;
}


/* ---------------------------------------------------------
   KONTAKT SPEICHERN
   --------------------------------------------------------- */

function saveContact() {

    const vcard =
        createVCard();

    const blob =
        new Blob(
            [vcard],
            {
                type:
                    "text/vcard;charset=utf-8"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href =
        url;

    link.download =
        profile.firstName +
        "_" +
        profile.lastName +
        ".vcf";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    setTimeout(
        function () {
            URL.revokeObjectURL(url);
        },
        1000
    );
}


/* ---------------------------------------------------------
   PROFIL TEILEN
   --------------------------------------------------------- */

async function shareProfile() {

    const shareData = {

        title:
            profile.firstName +
            " " +
            profile.lastName,

        text:
            "Meine digitale Visitenkarte",

        url:
            profileURL
    };


    /*
       iPhone / iPad / moderne Browser
    */

    if (
        navigator.share &&
        typeof navigator.share === "function"
    ) {

        try {

            await navigator.share(
                shareData
            );

        } catch (error) {

            /*
               Benutzer hat Teilen abgebrochen.
               Nichts weiter tun.
            */

            console.log(
                "Teilen abgebrochen."
            );
        }

        return;
    }


    /*
       Desktop-Fallback:
       Link kopieren
    */

    try {

        await navigator.clipboard.writeText(
            profileURL
        );

        alert(
            "Der Link zur Visitenkarte wurde kopiert."
        );

    } catch (error) {

        prompt(
            "Profil-Link kopieren:",
            profileURL
        );
    }
}


/* ---------------------------------------------------------
   MODAL DURCH KLICK AUF HINTERGRUND SCHLIESSEN
   --------------------------------------------------------- */

const qrModal =
    document.getElementById("qrModal");

if (qrModal) {

    qrModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === qrModal
            ) {

                closeQR();

            }

        }
    );
}


/* ---------------------------------------------------------
   ESC-TASTE
   --------------------------------------------------------- */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeQR();

        }

    }
);


/* ---------------------------------------------------------
   QR-KONTAKT-LINK ERKENNEN
   --------------------------------------------------------- */

/*
   Wenn jemand den unteren QR-Code scannt,
   landet er auf:

   http://card.navtool.de/?save=contact

   Danach wird automatisch die vCard erzeugt.
*/

function checkContactQR() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    if (
        params.get("save") ===
        "contact"
    ) {

        /*
           Kleine Verzögerung, damit die Seite
           vollständig geladen ist.
        */

        setTimeout(
            function () {

                saveContact();

            },
            700
        );
    }
}


checkContactQR();
