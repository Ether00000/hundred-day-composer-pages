const phases=[
  {title:"基础与 DAW",range:"Day 01–10",description:"认识声音、拍号、速度、音程与 MIDI，在真实工作流中完成第一个 8 小节声音片段。",outcome:"8 小节声音明信片",days:["声音的四个维度","认识 DAW 工作流","拍、小节与循环","音名与键盘地图","半音、全音与八度","MIDI 位置、时值与力度","速度与拍号","量化与演奏感","搭建第一个 Loop","阶段作品：声音明信片"]},
  {title:"节奏与律动",range:"Day 11–20",description:"从鼓组角色与 Backbeat 出发，掌握细分、重音、切分、Swing、幽灵音和 Fill。",outcome:"会呼吸的完整鼓组",days:["鼓组的四个角色","Backbeat 骨架","八分与十六分细分","用力度设计重音","切分与反拍","Swing 的长短关系","Ghost Note","风格节奏：House","三档密度与 Fill","阶段作品：鼓组叙事"]},
  {title:"旋律写作",range:"Day 21–30",description:"用音阶、动机、问答句、轮廓、留白与和弦音写出可记忆的完整主题。",outcome:"一条完整原创主题",days:["C 大调旋律","A 小调情绪","五声音阶 Hook","四音动机","动机的三个变体","问句与答句","旋律轮廓","让旋律呼吸","强拍和弦音","阶段作品：完整主题"]},
  {title:"和声与进行",range:"Day 31–40",description:"从三和弦与调内和声出发，理解功能、流行进行、转位、七和弦和借用和弦。",outcome:"旋律和声 Demo",days:["根音、三音与五音","大和弦与小和弦","C 大调调内和弦","I–IV–V–I","I–V–vi–IV","转位与平滑连接","七和弦的色彩","借用 iv 和弦","为旋律配和弦","阶段作品：和声 Demo"]},
  {title:"曲式与结构",range:"Day 41–50",description:"用段落职责、能量曲线、重复升级和参考曲分析，把循环扩展成一首歌。",outcome:"完整曲式蓝图",days:["四个段落职责","前奏的线索","两个不同主歌","预副歌蓄力","副歌兑现期待","桥段打开新视角","重复副歌升级","全曲能量线","参考曲结构分析","阶段作品：曲式蓝图"]},
  {title:"音色与设计",range:"Day 51–60",description:"用振荡器、ADSR、滤波、LFO、采样切片和分层建立统一的专属音色板。",outcome:"六类专属音色板",days:["音色的角色","四种基础波形","ADSR：Pluck 与 Pad","滤波扫频","LFO 调制","采样与切片","三层复合音色","小音箱 Bass","空间的前后层次","阶段作品：音色板"]},
  {title:"编曲与配器",range:"Day 61–70",description:"把注意力分配给低、中、高频与主配角，通过声部进行、Fill、自动化和减法完成编曲。",outcome:"全曲编曲 V1",days:["只保留一个主角","Kick 与 Bass 分工","中频声部避让","高频与段落明暗","主角、配角与背景","反向声部进行","空隙中的 Fill","三类自动化","Mute Test 做减法","阶段作品：编曲 V1"]},
  {title:"录音与编辑",range:"Day 71–80",description:"建立安全增益与家庭录音流程，完成多 Take、Comp、自然修正、工程整理与 Stem 导出。",outcome:"可混音的干净素材",days:["安全输入增益","寻找最佳录音位置","人声录音设置","多 Take 与 Comp","噪声、呼吸与淡化","自然节奏编辑","自然音高校正","真实乐器拾音","工程命名与分组","阶段作品：Stem 验证"]},
  {title:"混音与空间",range:"Day 81–90",description:"从音量与声像开始，用 EQ、压缩、瞬态、混响、Delay、总线和参考曲完成可翻译的混音。",outcome:"全曲混音 V1",days:["只用音量平衡","中心与两侧","问题导向 EQ","压缩与冲击力","瞬态塑形","短长混响层次","句尾 Delay Throw","功能总线与路由","参考曲与多设备","阶段作品：混音 V1"]},
  {title:"完成与发布",range:"Day 91–100",description:"建立冻结与反馈机制，完成结构、编曲、混音、母带、导出、包装和发布。",outcome:"第一首完整原创作品",days:["定义完成标准","三层反馈法","冻结结构","冻结编曲","冻结混音","克制的母带链","响度、动态与导出","标题、封面与说明","发布前最终清单","毕业：发布第一首歌"]}
];

const lessons=lessonActivities.map((activity,index)=>({
  ...activity,
  phaseIndex:Math.floor(index/10),
  title:phases[Math.floor(index/10)].days[index%10],
  duration:25+(index%3)*5
}));

let stored={};
try{stored=JSON.parse(localStorage.getItem("composer-learning-state")||"{}")}catch(_){stored={}}
let completedDays=Math.min(100,Math.max(0,Number(stored.completedDays)||0));
let streak=Math.max(0,Number(stored.streak)||0);
let lastCheckin=stored.lastCheckin||"";
let selectedPhase=Math.min(9,Math.floor(Math.min(completedDays,99)/10));
let selectedDay=null;
let validated=false;
let homeObjectUrl=null;
let savedRecords=[];

const $=id=>document.getElementById(id);
const currentDay=()=>Math.min(100,completedDays+1);
const dateKey=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`};
const saveProgress=()=>localStorage.setItem("composer-learning-state",JSON.stringify({...stored,completedDays,streak,lastCheckin}));
const toolName={tour:"DAW 导览",synth:"合成器",drums:"鼓机",piano:"钢琴卷帘",chords:"和弦轨",arrange:"编曲时间线",record:"录音台",mix:"混音台",finish:"发布控制台"};

function renderDashboard(){
  const day=currentDay(),lesson=lessons[day-1],percent=completedDays;
  $("header-day").textContent=`DAY ${String(day).padStart(2,"0")} / 100`;
  $("header-percent").textContent=`${percent}%`;
  $("header-bar").style.width=`${percent}%`;
  $("stat-day").textContent=`${completedDays} / 100 DAYS`;
  $("stat-percent").textContent=percent;
  $("streak-count").textContent=streak;
  $("start-today").innerHTML=`进入 Day ${String(day).padStart(2,"0")} 工作室 <span>→</span>`;
  $("today-index").textContent=`DAY ${String(day).padStart(2,"0")} · ${phases[lesson.phaseIndex].title}`;
  $("today-tool").textContent=toolName[lesson.tool];
  $("today-title").textContent=lesson.mission;
  $("today-principle").textContent=lesson.principle;
  $("today-steps").innerHTML=lesson.steps.map(step=>`<li>${step}</li>`).join("");
  $("segments").innerHTML=Array.from({length:25},(_,index)=>`<i class="${index<Math.ceil(completedDays/4)?"done":""}"></i>`).join("");
  $("week-row").innerHTML=["一","二","三","四","五","六","日"].map((label,index)=>`<span><i class="${index<Math.min(streak,7)?"checked":""}">${index<Math.min(streak,7)?"✓":"·"}</i><small>${label}</small></span>`).join("");
}

function renderRoadmap(){
  $("phase-tabs").innerHTML=phases.map((phase,index)=>`<button role="tab" aria-selected="${selectedPhase===index}" class="${selectedPhase===index?"active":""}" data-phase="${index}"><small>${String(index+1).padStart(2,"0")} · ${phase.range}</small><span>${phase.title}</span></button>`).join("");
  const phase=phases[selectedPhase];
  $("phase-summary").innerHTML=`<div><span>${phase.range} · PHASE ${String(selectedPhase+1).padStart(2,"0")}</span><h3>${phase.title}</h3><p>${phase.description}</p></div><div class="phase-outcome"><small>阶段作品</small><strong>${phase.outcome}</strong></div>`;
  $("lesson-grid").innerHTML=lessons.filter(lesson=>lesson.phaseIndex===selectedPhase).map(lesson=>{
    const status=lesson.day<=completedDays?"done":lesson.day===currentDay()?"current":"upcoming";
    return `<button class="lesson-card ${status}" data-day="${lesson.day}"><span class="day">DAY ${String(lesson.day).padStart(2,"0")}</span><strong>${lesson.title}</strong><span class="tool">${toolName[lesson.tool]}</span><i>${status==="done"?"✓ 已通过":status==="current"?"● 今日任务":"○ 可预览"}</i></button>`;
  }).join("");
  document.querySelectorAll("[data-phase]").forEach(button=>button.addEventListener("click",()=>{selectedPhase=Number(button.dataset.phase);renderRoadmap()}));
  document.querySelectorAll("[data-day]").forEach(button=>button.addEventListener("click",()=>openLesson(Number(button.dataset.day))));
}

async function openLesson(day){
  selectedDay=Math.max(1,Math.min(100,day));
  const requestedDay=selectedDay;
  validated=false;
  const lesson=lessons[selectedDay-1],phase=phases[lesson.phaseIndex];
  $("modal-kicker").textContent=`DAY ${String(selectedDay).padStart(2,"0")} · ${toolName[lesson.tool].toUpperCase()}`;
  $("modal-title").textContent=lesson.title;
  $("mission-text").textContent=lesson.mission;
  $("mission-principle").textContent=lesson.principle;
  $("mission-steps").innerHTML=lesson.steps.map(step=>`<li>${step}</li>`).join("");
  $("previous-day").disabled=selectedDay===1;
  $("next-day").disabled=selectedDay===100;
  $("save-and-checkin").disabled=true;
  $("save-and-checkin").textContent=selectedDay===currentDay()&&selectedDay>completedDays?"保存 WAV 并打卡":selectedDay<=completedDays?"保存新的作品版本":"保存练习（不计进度）";
  setCheckState("neutral","尚未检测",`这是 Day ${selectedDay} 专属的${toolName[lesson.tool]}任务。完成右侧三步后再检查。`);
  $("studio-root").innerHTML='<div class="studio-loading">正在载入工程与音频引擎…</div>';
  let draft=ProjectStore.loadDraft(selectedDay),inherited=false;
  if(!draft&&selectedDay>1){
    const records=savedRecords.length?savedRecords:await ProjectStore.list();
    const previous=records.find(record=>record.day<selectedDay&&record.project);
    if(previous){draft={...previous.project,day:selectedDay};inherited=true}
  }
  if(selectedDay!==requestedDay)return;
  ComposerStudio.mount("studio-root",lesson,draft,()=>{
    if(validated){validated=false;$("save-and-checkin").disabled=true;setCheckState("neutral","作品已改变","很好，继续用耳朵调整。完成后请重新检测。")}
  });
  if(inherited)setCheckState("neutral","已继承上一版工程","今天会在你之前的音乐上继续创作。右侧工具和达标规则已经切换为本课内容。")
  $("lesson-modal").hidden=false;
  document.body.classList.add("modal-open");
  $("modal-close").focus();
}

function setCheckState(type,title,message){
  const box=$("studio-check-result");
  box.className=`check-result ${type==='neutral'?"":type}`;
  box.innerHTML=`<strong>${title}</strong><span>${message}</span>`;
}

function checkWork(){
  const lesson=lessons[selectedDay-1];
  const result=ComposerStudio.validate(lesson.target);
  validated=result.ok;
  $("save-and-checkin").disabled=!result.ok;
  if(result.ok){
    setCheckState("pass",`通过 · ${result.score} 分`,`${lesson.principle} 现在保存后，你的真实 WAV 会出现在主页作品区。`);
  }else{
    const detail=result.errors.slice(0,4).map((error,index)=>`${index+1}. ${error}`).join("<br>");
    setCheckState("fail",`还差 ${result.errors.length} 项`,detail);
  }
}

async function saveAndCheckin(){
  const lesson=lessons[selectedDay-1],result=ComposerStudio.validate(lesson.target);
  if(!validated||!result.ok){validated=false;$("save-and-checkin").disabled=true;checkWork();return}
  const button=$("save-and-checkin");
  button.disabled=true;button.textContent="正在渲染 WAV…";
  try{
    const project=ComposerStudio.getState();
    const wav=ComposerStudio.renderWav();
    const now=Date.now();
    const record={id:`day-${selectedDay}-${now}`,day:selectedDay,title:`Day ${String(selectedDay).padStart(2,"0")} · ${lesson.title}`,createdAt:now,wav,project};
    await ProjectStore.save(record);
    let checkedIn=false;
    if(selectedDay===currentDay()&&selectedDay>completedDays){
      const today=dateKey();
      const previous=lastCheckin?new Date(`${lastCheckin}T00:00:00`):null;
      const gap=previous?Math.round((new Date(`${today}T00:00:00`)-previous)/86400000):1;
      streak=lastCheckin===today?streak:gap===1?streak+1:1;
      lastCheckin=today;
      completedDays=Math.min(100,completedDays+1);
      selectedPhase=Math.floor(Math.min(completedDays,99)/10);
      saveProgress();
      checkedIn=true;
    }
    await loadSavedWorks(record.id);
    renderDashboard();renderRoadmap();
    setCheckState("pass",checkedIn?`Day ${selectedDay} 打卡成功 ✓`:"新版本已保存 ✓",`WAV 和工程已经写入主页“我的作品”。${checkedIn&&completedDays<100?`下一课是 Day ${completedDays+1}。`:"可以刷新页面验证播放。"}`);
    button.textContent="已保存到主页 ✓";
  }catch(error){
    button.disabled=false;button.textContent="重试保存 WAV";
    setCheckState("fail","保存失败",`浏览器没有写入作品：${error.message||"未知错误"}。请确认不是无痕模式并重试。`);
  }
}

function useHomeRecord(record){
  if(!record)return;
  const blob=record.wav instanceof Blob?record.wav:StudioAudio.render(record.project);
  if(homeObjectUrl)URL.revokeObjectURL(homeObjectUrl);
  homeObjectUrl=URL.createObjectURL(blob);
  const audio=$("home-audio");
  audio.src=homeObjectUrl;audio.load();
  $("current-work").innerHTML=`<strong>${record.title}</strong><a href="${homeObjectUrl}" download="${record.title.replace(/[\\/:*?\"<>|]/g,"-")}.wav">下载 WAV</a>`;
  document.querySelectorAll("[data-work-id]").forEach(button=>button.classList.toggle("active",button.dataset.workId===record.id));
}

async function loadSavedWorks(preferredId){
  savedRecords=(await ProjectStore.list()).filter(record=>record&&(record.wav instanceof Blob||record.project));
  $("audio-status").textContent=savedRecords.length?`已保存 ${savedRecords.length} 个版本`:"还没有保存作品";
  $("saved-works").innerHTML=savedRecords.slice(0,12).map(record=>`<button data-work-id="${record.id}" title="${record.title}">${record.title}</button>`).join("");
  document.querySelectorAll("[data-work-id]").forEach(button=>button.addEventListener("click",()=>useHomeRecord(savedRecords.find(record=>record.id===button.dataset.workId))));
  if(savedRecords.length)useHomeRecord(savedRecords.find(record=>record.id===preferredId)||savedRecords[0]);
}

function closeModal(){ComposerStudio.stop();$("lesson-modal").hidden=true;document.body.classList.remove("modal-open")}

$("start-today").addEventListener("click",()=>openLesson(currentDay()));
$("console-enter").addEventListener("click",()=>openLesson(currentDay()));
$("modal-close").addEventListener("click",closeModal);
$("lesson-modal").addEventListener("click",event=>{if(event.target===$("lesson-modal"))closeModal()});
$("previous-day").addEventListener("click",()=>{if(selectedDay>1)openLesson(selectedDay-1)});
$("next-day").addEventListener("click",()=>{if(selectedDay<100)openLesson(selectedDay+1)});
$("check-work").addEventListener("click",checkWork);
$("save-and-checkin").addEventListener("click",saveAndCheckin);
document.addEventListener("keydown",event=>{if(event.key==="Escape"&&!$("lesson-modal").hidden)closeModal()});

renderDashboard();
renderRoadmap();
loadSavedWorks().catch(()=>{$("audio-status").textContent="作品存储暂不可用"});
