const profile={
firstName:"Simon",
lastName:"Fischer",
email:"DEINE.PRIVATE.MAIL@BEISPIEL.DE",
studentEmail:"DEINE.STUDENTISCHE.MAIL@BEISPIEL.DE",
phone:"+49 123 4567890",
address:"DEINE STRASSE 1, 00000 ORT"
};

const profileURL=window.location.origin+"/card/";

function createQR(elementId,size){
const element=document.getElementById(elementId);
if(!element)return;
element.innerHTML="";
const img=document.createElement("img");
img.src="https://api.qrserver.com/v1/create-qr-code/?size="+size+"x"+size+"&data="+encodeURIComponent(profileURL);
img.alt="QR-Code";
element.appendChild(img);
}
createQR("qrcode",300);

function openQR(){
document.getElementById("qrModal").classList.add("active");
createQR("qrLarge",600);
}
function closeQR(){
document.getElementById("qrModal").classList.remove("active");
}

function saveContact(){
const vcard=`BEGIN:VCARD
VERSION:3.0
N:${profile.lastName};${profile.firstName}
FN:${profile.firstName} ${profile.lastName}
EMAIL:${profile.email}
EMAIL;TYPE=STUDENT:${profile.studentEmail}
TEL:${profile.phone}
ADR:;;${profile.address}
URL:${profileURL}
END:VCARD`;
const blob=new Blob([vcard],{type:"text/vcard;charset=utf-8"});
const url=URL.createObjectURL(blob);
const link=document.createElement("a");
link.href=url;
link.download=profile.firstName+"_"+profile.lastName+".vcf";
document.body.appendChild(link);
link.click();
link.remove();
URL.revokeObjectURL(url);
}

async function shareProfile(){
const shareData={title:profile.firstName+" "+profile.lastName,text:"Meine digitale Visitenkarte",url:profileURL};
if(navigator.share){
try{await navigator.share(shareData)}catch(error){console.log("Teilen abgebrochen.")}
}else{
try{
await navigator.clipboard.writeText(profileURL);
alert("Link wurde kopiert.");
}catch(e){
prompt("Profil-Link kopieren:",profileURL);
}
}
}

document.getElementById("qrModal").addEventListener("click",function(event){
if(event.target===this)closeQR();
});
