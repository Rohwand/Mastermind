(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))l(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&l(n)}).observe(document,{childList:!0,subtree:!0});function c(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function l(e){if(e.ep)return;e.ep=!0;const o=c(e);fetch(e.href,o)}})();const f=["red","blue","green","yellow","purple","orange"],s=4,y=20,p=20;let g=[],a=[],v=[],i=0,d=p,h=!1,m;try{m=new Audio("/background-music.mp3"),m.loop=!0,m.volume=.3,document.addEventListener("click",()=>{m.play().catch(()=>{console.log("Failed to play background music")})},{once:!0})}catch{console.log("Background music not supported")}function C(){const r=[];for(let t=0;t<s;t++)r.push(f[Math.floor(Math.random()*f.length)]);return r}function L(){const r=document.getElementById("game-board");r.innerHTML="";for(let t=0;t<y;t++){const c=document.createElement("div");c.className="row";for(let e=0;e<s;e++){const o=document.createElement("div");o.className="hole",o.dataset.row=t,o.dataset.position=e,o.addEventListener("click",()=>{if(t===i&&!h){const n=document.querySelector(".color.selected");n&&(o.style.backgroundColor=n.dataset.color,a[e]=n.dataset.color)}}),c.appendChild(o)}const l=document.createElement("div");l.className="feedback";for(let e=0;e<s;e++){const o=document.createElement("div");o.className="feedback-peg",l.appendChild(o)}c.appendChild(l),r.appendChild(c)}}function I(){const r=document.getElementById("colors-picker");f.forEach(t=>{const c=r.querySelector(`[data-color="${t}"]`);c.style.backgroundColor=t,c.addEventListener("click",()=>{document.querySelectorAll(".color").forEach(l=>l.classList.remove("selected")),c.classList.add("selected")})})}function S(){if(a.length!==s||a.includes(void 0)){alert("Veuillez remplir toutes les positions!");return}const r=B(a,g);O(r,i),v.push([...a]),a=[],i++,r.exact===s?E():(d=Math.max(0,d-1),document.getElementById("current-score").textContent=d,i>=y&&E()),k()}function B(r,t){let c=0,l=0;const e=new Array(s).fill(!1),o=new Array(s).fill(!1);for(let n=0;n<s;n++)r[n]===t[n]&&(c++,e[n]=!0,o[n]=!0);for(let n=0;n<s;n++)if(!e[n]){for(let u=0;u<s;u++)if(!o[u]&&r[n]===t[u]){l++,o[u]=!0;break}}return{exact:c,partial:l}}function O(r,t){const c=document.querySelectorAll(`.row:nth-child(${t+1}) .feedback-peg`);let l=0;for(let e=0;e<r.exact;e++)c[l].style.backgroundColor="#2ecc71",l++;for(let e=0;e<r.partial;e++)c[l].style.backgroundColor="#e67e22",l++}function k(){document.getElementById("attempts-left").textContent=y-i}function E(r){h=!0;const t=document.getElementById("game-over"),c=document.getElementById("final-score");c.textContent=d,t.classList.remove("hidden")}function w(){const r=document.getElementById("player-name").value.trim();if(!r){alert("Veuillez entrer un pseudo!");return}const t=JSON.parse(localStorage.getItem("mastermind-scores")||"{}");!t[r]||t[r]<d?(t[r]=d,localStorage.setItem("mastermind-scores",JSON.stringify(t)),alert("Score sauvegardé !")):alert("Ce score n'est pas votre meilleur score."),window.location.href="scores.html"}function b(){g=C(),a=[],v=[],i=0,d=p,h=!1,L(),I(),k(),document.getElementById("current-score").textContent=p,document.getElementById("game-over").classList.add("hidden"),console.log("Secret code:",g)}document.getElementById("check-button").addEventListener("click",S);document.getElementById("save-score").addEventListener("click",w);document.getElementById("play-again").addEventListener("click",b);b();
