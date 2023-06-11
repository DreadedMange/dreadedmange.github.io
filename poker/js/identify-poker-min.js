var scriptTag=document.getElementById("identify-poker"),gameType=scriptTag.getAttribute("data-game-type");if(null==gameType)throw Error("data-game-type attribute must be set");function createConfetti(){confetti({particleCount:100,spread:70,origin:{y:.6}})}
function createPerformanceChart(a){const b=document.getElementById("performanceChart").getContext("2d"),d=Object.keys(a),g=d.map(f=>a[f].correct),c=d.map(f=>a[f].incorrect);return new Chart(b,{type:"bar",data:{labels:d,datasets:[{label:"Correct",data:g,backgroundColor:"rgba(75, 192, 192, 0.5)",borderColor:"rgba(75, 192, 192, 1)",borderWidth:1},{label:"Incorrect",data:c,backgroundColor:"rgba(255, 99, 132, 0.5)",borderColor:"rgba(255, 99, 132, 1)",borderWidth:1}]},options:{scales:{y:{beginAtZero:!0}},
plugins:{legend:{position:"top"}}}})}
let Board,Hole,BestHand,handCategoryTable={"high card":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},pair:{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},"two pair":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},"three of a kind":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},straight:{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},flush:{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},"full house":{correct:0,incorrect:0,secondsCorrect:0,
secondsIncorrect:0},"four of a kind":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},"straight flush":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0}},performanceChart;
function updateTable(a,b,d){b=scoreHand(b);b=categories[b.category];localStorage.getItem("holdem_handCategoryTable")&&(localStorage.setItem("texas_handCategoryTable",localStorage.getItem("holdem_handCategoryTable")),localStorage.removeItem("holdem_handCategoryTable"));if("texas"==gameType)var g=localStorage.getItem("texas_handCategoryTable");else if("omaha"==gameType)g=localStorage.getItem("omaha_handCategoryTable");else throw Error("data-game-type attribute must be set to 'texas' or 'omaha'");g&&
(handCategoryTable=JSON.parse(g));a?(handCategoryTable[b].correct++,handCategoryTable[b].secondsCorrect+=d):(handCategoryTable[b].incorrect++,handCategoryTable[b].secondsIncorrect+=d);"texas"==gameType?localStorage.setItem("texas_handCategoryTable",JSON.stringify(handCategoryTable)):"omaha"==gameType&&localStorage.setItem("omaha_handCategoryTable",JSON.stringify(handCategoryTable));updateGraphAndTable(handCategoryTable)}
function updateGraphAndTable(a){var b=Object.keys(a).reduce((e,h)=>e+a[h].correct,0),d=Object.keys(a).reduce((e,h)=>e+a[h].incorrect,0),g=0<b||0<d?b/(b+d)*100:0,c=Object.keys(a).reduce((e,h)=>e+a[h].secondsCorrect,0),f=Object.keys(a).reduce((e,h)=>e+a[h].secondsIncorrect,0);b=0<b?c/b:0;d=0<d?f/d:0;document.getElementById("hand_category_table").innerHTML=`
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
${Object.keys(a).map(e=>{const h=a[e].correct,n=a[e].incorrect;var k=h+n;k=0<k?(h/k*100).toFixed(0):"-";const l=a[e].secondsCorrect%60,q=Math.floor(a[e].secondsIncorrect/60),p=a[e].secondsIncorrect%60,m=a[e].secondsCorrect/h,r=a[e].secondsIncorrect/n;return`
<tr>
  <td>${e}</td>
  <td>${h}</td>
  <td>${n}</td>
  <td>${k}%</td>
    <td>${Math.floor(a[e].secondsCorrect/60)}:${10>l?"0":""}${l}</td>
    <td>${isNaN(m)?"-":m.toFixed(1)}</td>
    <td>${q}:${10>p?"0":""}${p}</td>
    <td>${isNaN(r)?"-":r.toFixed(1)}</td>

</tr>
`}).join("")}
<tr>
<td>Total</td>
<td>${Object.keys(a).reduce((e,h)=>e+a[h].correct,0)}</td>
<td>${Object.keys(a).reduce((e,h)=>e+a[h].incorrect,0)}</td>
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
document.addEventListener("DOMContentLoaded",()=>{const a=document.getElementById("hole"),b=document.getElementById("board"),d=document.getElementById("ConfirmBtn"),g=document.getElementById("DrawBtn");var c=document.getElementById("ResetStats");let f=!0;totalSeconds=0;const e=()=>{const k=a.getElementsByClassName("selected").length,l=b.getElementsByClassName("selected").length;d.disabled=5!==k+l};c.addEventListener("click",()=>{"texas"==gameType?localStorage.removeItem("texas_handCategoryTable"):
"omaha"==gameType&&localStorage.removeItem("omaha_handCategoryTable");handCategoryTable={"high card":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},pair:{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},"two pair":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},"three of a kind":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},straight:{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},flush:{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},
"full house":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},"four of a kind":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},"straight flush":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0}};updateGraphAndTable(handCategoryTable)});c=k=>{if(f&&k.target.classList.contains("card")){var l="omaha"==gameType?"hole"==k.target.parentElement.id?2==a.getElementsByClassName("selected").length?!0:!1:3==b.getElementsByClassName("selected").length?!0:!1:5==document.getElementsByClassName("selected").length?
!0:!1;(k.target.classList.contains("selected")||0==l)&&k.target.classList.toggle("selected");e()}};a.addEventListener("click",c);b.addEventListener("click",c);d.addEventListener("click",()=>{f=!1;d.disabled=!0;g.disabled=!1;clearInterval(timerVar);const k=totalSeconds;var l=a.getElementsByClassName("selected"),q=b.getElementsByClassName("selected");if("texas"==gameType)var p=bestHoldemHand(Board,Hole);else if("omaha"==gameType)p=bestOmahaHand(Board,Hole);else throw Error("data-game-type attribute must be set to 'texas' or 'omaha'");
l=[...l,...q].map(t=>({rank:t.dataset.rank,suit:t.dataset.suit}));var m=scoreHand(l);q=scoreHand(p);let r;m.score===q.score?(createConfetti(),m=!0,p=l,r="Correct!:"):(m=!1,r="Wrong!:");updateTable(m,p,k);renderAlternateCards(p);renderHandScore(l,r,"score_user");m?document.getElementById("score_true").innerHTML="":renderHandScore(p,"Best Hand:","score_true");handCategory=categories[q.category];"texas"==gameType?(handCategory="holdem_"+handCategory+"_"+(m?"correct":"incorrect"),eventCategory="texas_hand"):
"omaha"==gameType&&(handCategory="omaha_"+handCategory+"_"+(m?"correct":"incorrect"),eventCategory="omaha_hand");gtag("event","identify_hand",{event_category:eventCategory,event_label:handCategory,value:k})});g.addEventListener("click",()=>{f=!0;g.disabled=!0;drawHand();e();clearInterval(timerVar);totalSeconds=0;document.getElementById("timer").innerHTML="00:00";timerVar=setInterval(countTimer,1E3)});c=Array.prototype.filter.call(document.getElementsByClassName("collapsible"),function(k){return"A"!==
k.tagName});var h=document.getElementsByClassName("content"),n;for(n=0;n<c.length;n++)c[n].addEventListener("click",function(k){return function(){this.classList.toggle("active");h[k].style.maxHeight?(h[k].style.maxHeight=null,h[k].style.overflow="hidden"):(h[k].style.maxHeight=h[k].scrollHeight+"px",h[k].style.overflow="auto")}}(n));document.getElementById("setting_use_timer").addEventListener("change",function(){localStorage.setItem("setting_use_timer",this.checked)});document.getElementById("setting_more_straights").addEventListener("change",
function(){localStorage.setItem("setting_more_straights",this.checked)});document.getElementById("setting_use_timer").checked="true"==localStorage.getItem("setting_use_timer");document.getElementById("setting_more_straights").checked="true"==localStorage.getItem("setting_more_straights");document.addEventListener("visibilitychange",function(){"hidden"===document.visibilityState?clearInterval(timerVar):timerVar=setInterval(countTimer,1E3)});drawHand();e();g.disabled=!0;if("texas"==gameType)c=localStorage.getItem("texas_handCategoryTable");
else if("omaha"==gameType){if(c=localStorage.getItem("omaha_handCategoryTable"),old_table=localStorage.getItem("handCategoryTable"))c?localStorage.removeItem("handCategoryTable"):(localStorage.setItem("omaha_handCategoryTable",c),localStorage.removeItem("handCategoryTable"),c=localStorage.getItem("omaha_handCategoryTable"))}else throw Error("data-game-type attribute must be set to 'texas' or 'omaha'");c&&(handCategoryTable=JSON.parse(c));updateGraphAndTable(handCategoryTable)});
