var scriptTag=document.getElementById("identify-poker"),gameType=scriptTag.getAttribute("data-game-type");if(null==gameType)throw Error("data-game-type attribute must be set");function createConfetti(){confetti({particleCount:100,spread:70,origin:{y:.6}})}
function createPerformanceChart(a){const b=document.getElementById("performanceChart").getContext("2d"),d=Object.keys(a),g=d.map(f=>a[f].correct),c=d.map(f=>a[f].incorrect);return new Chart(b,{type:"bar",data:{labels:d,datasets:[{label:"Correct",data:g,backgroundColor:"rgba(75, 192, 192, 0.5)",borderColor:"rgba(75, 192, 192, 1)",borderWidth:1},{label:"Incorrect",data:c,backgroundColor:"rgba(255, 99, 132, 0.5)",borderColor:"rgba(255, 99, 132, 1)",borderWidth:1}]},options:{scales:{y:{beginAtZero:!0}},
plugins:{legend:{position:"top"}}}})}
let Board,Hole,BestHand,handCategoryTable={"high card":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},pair:{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},"two pair":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},"three of a kind":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},straight:{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},flush:{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},"full house":{correct:0,incorrect:0,secondsCorrect:0,
secondsIncorrect:0},"four of a kind":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},"straight flush":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0}},performanceChart;
function updateTable(a,b,d){b=scoreHand(b);b=categories[b.category];localStorage.getItem("holdem_handCategoryTable")&&(localStorage.setItem("texas_handCategoryTable",localStorage.getItem("holdem_handCategoryTable")),localStorage.removeItem("holdem_handCategoryTable"));if("texas"==gameType)var g=localStorage.getItem("texas_handCategoryTable");else if("omaha"==gameType)g=localStorage.getItem("omaha_handCategoryTable");else throw Error("data-game-type attribute must be set to 'texas' or 'omaha'");g&&
(handCategoryTable=JSON.parse(g));a?(handCategoryTable[b].correct++,handCategoryTable[b].secondsCorrect+=d):(handCategoryTable[b].incorrect++,handCategoryTable[b].secondsIncorrect+=d);"texas"==gameType?localStorage.setItem("texas_handCategoryTable",JSON.stringify(handCategoryTable)):"omaha"==gameType&&localStorage.setItem("omaha_handCategoryTable",JSON.stringify(handCategoryTable));updateGraphAndTable(handCategoryTable)}
function updateGraphAndTable(a){var b=Object.keys(a).reduce((e,k)=>e+a[k].correct,0),d=Object.keys(a).reduce((e,k)=>e+a[k].incorrect,0),g=0<b||0<d?b/(b+d)*100:0,c=Object.keys(a).reduce((e,k)=>e+a[k].secondsCorrect,0),f=Object.keys(a).reduce((e,k)=>e+a[k].secondsIncorrect,0);b=0<b?c/b:0;d=0<d?f/d:0;document.getElementById("hand_category_table").innerHTML=`
<tr>
<th>Hand Category</th>
<th>Correct</th>
<th>Incorrect</th>
<th>Percent Correct</th>
<th>Total Time Correct</th>
<th>Average Time Correct (s)</th>
<th>Total Time Incorrect</th>
<th>Average Time Incorrect (s)</th>
</tr>
${Object.keys(a).map(e=>{const k=a[e].correct,m=a[e].incorrect;var h=k+m;h=0<h?(k/h*100).toFixed(0):"-";const l=a[e].secondsCorrect%60,n=Math.floor(a[e].secondsIncorrect/60),q=a[e].secondsIncorrect%60,p=a[e].secondsCorrect/k,r=a[e].secondsIncorrect/m;return`
<tr>
  <td>${e}</td>
  <td>${k}</td>
  <td>${m}</td>
  <td>${h}%</td>
    <td>${Math.floor(a[e].secondsCorrect/60)}:${10>l?"0":""}${l}</td>
    <td>${isNaN(p)?"-":p.toFixed(1)}</td>
    <td>${n}:${10>q?"0":""}${q}</td>
    <td>${isNaN(r)?"-":r.toFixed(1)}</td>

</tr>
`}).join("")}
<tr>
<td>Total</td>
<td>${Object.keys(a).reduce((e,k)=>e+a[k].correct,0)}</td>
<td>${Object.keys(a).reduce((e,k)=>e+a[k].incorrect,0)}</td>
    <td>${g.toFixed(0)}%</td>
    <td>${Math.floor(c/60)}m:${10>c%60?"0":""}${c%60}s</td>
    <td>${b.toFixed(1)}</td>
    <td>${Math.floor(f/60)}m:${10>f%60?"0":""}${f%60}s</td>
    <td>${d.toFixed(1)}</td>
</tr>
`;performanceChart?(g=Object.keys(a),performanceChart.data.labels=g,performanceChart.data.datasets[0].data=g.map(e=>a[e].correct),performanceChart.data.datasets[1].data=g.map(e=>a[e].incorrect),performanceChart.update()):performanceChart=createPerformanceChart(a)}function renderCards(a,b){const d=document.getElementById(b);d.innerHTML="";a.forEach(g=>{const c=document.createElement("div");c.classList.add("card");c.dataset.rank=g.rank;c.dataset.suit=g.suit;c.innerHTML=`
            <div class="card-rank">${g.rank}</div>
            <div class="card-suit">${getSuitCharColor(g.suit)}</div>
        `;d.appendChild(c)})}function renderHandScore(a,b,d){d=document.getElementById(d);a=getHandDescription(a);d.innerHTML=`
        <div>${b} ${a}</div>
    `}function drawHand(){const a=shuffleDeck(createDeck());Board=a.slice(0,5);if("texas"==gameType)Hole=a.slice(5,7);else if("omaha"==gameType)Hole=a.slice(5,9);else throw Error("data-game-type attribute must be set to 'texas' or 'omaha'");renderCards(Board,"board");renderCards(Hole,"hole");document.getElementById("score_true").innerHTML="2. Click Confirm";document.getElementById("score_user").innerHTML="1. Pick your cards"}
function renderAlternateCards(a){var b=document.getElementById("hole"),d=document.getElementById("board");b=b.getElementsByClassName("card");const g=d.getElementsByClassName("card");d=f=>a.some(e=>e.rank===f.rank&&e.suit===f.suit);for(var c of b)b={rank:c.dataset.rank,suit:c.dataset.suit},c.classList.contains("selected")?(c.classList.remove("selected"),d(b)?c.classList.add("selected-right"):c.classList.add("selected-wrong")):d(b)?c.classList.add("should-have-selected"):c.classList.add("unselected-right");
for(const f of g)c={rank:f.dataset.rank,suit:f.dataset.suit},f.classList.contains("selected")?(f.classList.remove("selected"),d(c)?f.classList.add("selected-right"):f.classList.add("selected-wrong")):d(c)?f.classList.add("should-have-selected"):f.classList.add("unselected-right")}
function allSelectedCardsAreCorrect(a){var b=document.getElementById("hole"),d=document.getElementById("board");b=b.getElementsByClassName("card selected");d=d.getElementsByClassName("card selected");return 2!==b.length||3!==d.length?!1:[...b,...d].every(g=>{var c=g.dataset.rank,f=g.dataset.suit;return a.some(e=>e.rank===c&&e.suit===f)})}
document.addEventListener("DOMContentLoaded",()=>{const a=document.getElementById("hole"),b=document.getElementById("board"),d=document.getElementById("ConfirmBtn"),g=document.getElementById("DrawBtn");var c=document.getElementById("ResetStats");let f=!0;totalSeconds=0;const e=()=>{const h=a.getElementsByClassName("selected").length,l=b.getElementsByClassName("selected").length;d.disabled=5!==h+l};c.addEventListener("click",()=>{"texas"==gameType?localStorage.removeItem("texas_handCategoryTable"):
"omaha"==gameType&&localStorage.removeItem("omaha_handCategoryTable");handCategoryTable={"high card":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},pair:{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},"two pair":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},"three of a kind":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},straight:{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},flush:{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},
"full house":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},"four of a kind":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},"straight flush":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0}};updateGraphAndTable(handCategoryTable)});c=h=>{if(f&&h.target.classList.contains("card")){const l=document.getElementsByClassName("selected").length;(h.target.classList.contains("selected")||5>l)&&h.target.classList.toggle("selected");e()}};a.addEventListener("click",c);b.addEventListener("click",
c);d.addEventListener("click",()=>{f=!1;d.disabled=!0;g.disabled=!1;clearInterval(timerVar);const h=totalSeconds;var l=a.getElementsByClassName("selected"),n=b.getElementsByClassName("selected");if("texas"==gameType)var q=bestHoldemHand(Board,Hole);else if("omaha"==gameType)q=bestOmahaHand(Board,Hole);else throw Error("data-game-type attribute must be set to 'texas' or 'omaha'");l=[...l,...n].map(t=>({rank:t.dataset.rank,suit:t.dataset.suit}));var p=scoreHand(l);n=scoreHand(q);let r;p.score===n.score?
(createConfetti(),p=!0,q=l,r="Correct!:"):(p=!1,r="Wrong!:");updateTable(p,q,h);renderAlternateCards(q);renderHandScore(l,r,"score_user");p?document.getElementById("score_true").innerHTML="":renderHandScore(q,"Best Hand:","score_true");handCategory=categories[n.category];"texas"==gameType?(handCategory="holdem_"+handCategory+"_"+(p?"correct":"incorrect"),eventCategory="texas_hand"):"omaha"==gameType&&(handCategory="omaha_"+handCategory+"_"+(p?"correct":"incorrect"),eventCategory="omaha_hand");gtag("event",
"identify_hand",{event_category:eventCategory,event_label:handCategory,value:h})});g.addEventListener("click",()=>{f=!0;g.disabled=!0;drawHand();e();clearInterval(timerVar);totalSeconds=0;document.getElementById("timer").innerHTML="00:00";timerVar=setInterval(countTimer,1E3)});c=document.getElementsByClassName("collapsible");var k=document.getElementsByClassName("content"),m;for(m=0;m<c.length;m++)c[m].addEventListener("click",function(h){return function(){this.classList.toggle("active");k[h].style.maxHeight=
k[h].style.maxHeight?null:k[h].scrollHeight+"px"}}(m));document.addEventListener("visibilitychange",function(){"hidden"===document.visibilityState?clearInterval(timerVar):timerVar=setInterval(countTimer,1E3)});drawHand();e();g.disabled=!0;if("texas"==gameType)c=localStorage.getItem("texas_handCategoryTable");else if("omaha"==gameType)c=localStorage.getItem("omaha_handCategoryTable");else throw Error("data-game-type attribute must be set to 'texas' or 'omaha'");if(c){const h=JSON.parse(c);m=Object.keys(h).some(n=>
0<h[n].secondsCorrect);const l=Object.keys(h).some(n=>0<h[n].secondsIncorrect);m||l?(handCategoryTable=JSON.parse(c),updateGraphAndTable(handCategoryTable)):localStorage.removeItem("holdem_handCategoryTable")}});
