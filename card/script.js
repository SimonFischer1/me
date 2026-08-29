/*
  =========================================
  DEINE DATEN – HIER EINMAL EINTRAGEN
  =========================================
*/
const PROFILE = {
  firstName: "Simon",
  lastName: "Fischer",
  role: "Student · Digital Projects · Web",

  privateEmail: "DEINE.PRIVATE.MAIL@BEISPIEL.DE",
  studentEmail: "DEINE.STUDENTISCHE.MAIL@BEISPIEL.DE",
  phone: "+49 123 4567890",
  address: "DEINE STRASSE 1, 00000 ORT",

  qualifications: [
    "DEINE QUALIFIKATION",
    "DEIN STUDIUM / ABSCHLUSS",
    "WEITERE QUALIFIKATION"
  ],

  socials: [
    {name:"Instagram", url:"https://www.instagram.com/thesimonfischer"},
    {name:"LinkedIn", url:"https://www.linkedin.com/"},
    // Weitere Beispiele:
    // {name:"GitHub", url:"https://github.com/DEINUSERNAME"},
    // {name:"Website", url:"https://deine-website.de"}
  ]
};

const fullName = `${PROFILE.firstName} ${PROFILE.lastName}`;
const profileUrl = new URL("./", window.location.href).href;

document.title = `${fullName} · Digitale Visitenkarte`;

const setText = (id, text) => document.getElementById(id).textContent = text;

setText("privateMail", PROFILE.privateEmail);
document.getElementById("privateMail").href = `mailto:${PROFILE.privateEmail}`;
setText("studentMail", PROFILE.studentEmail);
document.getElementById("studentMail").href = `mailto:${PROFILE.studentEmail}`;
setText("phone", PROFILE.phone);
document.getElementById("phone").href = `tel:${PROFILE.phone.replace(/\s/g,"")}`;
setText("address", PROFILE.address);

document.querySelector("h1").textContent = fullName;
document.querySelector(".role").textContent = PROFILE.role;

const q = document.getElementById("qualifications");
PROFILE.qualifications.filter(Boolean).forEach(item => {
  const el = document.createElement("div");
  el.textContent = item;
  q.appendChild(el);
});

const socials = document.getElementById("socials");
PROFILE.socials.filter(s => s.name && s.url).forEach(s => {
  const a = document.createElement("a");
  a.href = s.url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.textContent = `${s.name} ↗`;
  socials.appendChild(a);
});

/* QR-Code */
function makeQR(elementId, size) {
  const el = document.getElementById(elementId);
  el.innerHTML = "";
  new QRCode(el, {
    text: profileUrl,
    width: size,
    height: size,
    colorDark: "#071012",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
}

function refreshQR() {
  makeQR("qrPreview", 112);
}

refreshQR();

const modal = document.getElementById("qrModal");
function openQR(){
  modal.classList.add("show");
  modal.setAttribute("aria-hidden","false");
  makeQR("qrLarge", 240);
}
function closeQR(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden","true");
}

document.getElementById("openQr").addEventListener("click", openQR);
document.getElementById("openQr2").addEventListener("click", openQR);
document.getElementById("closeQr").addEventListener("click", closeQR);
modal.addEventListener("click", e => { if(e.target === modal) closeQR(); });
document.addEventListener("keydown", e => { if(e.key === "Escape") closeQR(); });

/* vCard: funktioniert auf iPhone, iPad, Mac, Android und Desktop-Browsern */
function downloadVCard(){
  const socialLines = PROFILE.socials
    .filter(s => s.name && s.url)
    .map(s => `X-SOCIALPROFILE;TYPE=${s.name}:${s.url}`)
    .join("\r\n");

  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${PROFILE.lastName};${PROFILE.firstName};;;`,
    `FN:${fullName}`,
    `EMAIL;TYPE=INTERNET:${PROFILE.privateEmail}`,
    `EMAIL;TYPE=INTERNET:${PROFILE.studentEmail}`,
    `TEL;TYPE=CELL:${PROFILE.phone}`,
    `ADR;TYPE=HOME:;;${PROFILE.address};;;;`,
    `URL:${profileUrl}`,
    socialLines,
    "END:VCARD"
  ].filter(Boolean).join("\r\n");

  const blob = new Blob([vcard], {type:"text/vcard;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${PROFILE.firstName}${PROFILE.lastName}.vcf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

document.getElementById("saveContact").addEventListener("click", downloadVCard);

/* Native Teilen, wenn das Gerät es unterstützt */
document.getElementById("shareProfile").addEventListener("click", async () => {
  try {
    if (navigator.share) {
      await navigator.share({title: fullName, text: "Meine digitale Visitenkarte", url: profileUrl});
    } else {
      await navigator.clipboard.writeText(profileUrl);
      alert("Profil-Link wurde kopiert.");
    }
  } catch(e) {}
});
