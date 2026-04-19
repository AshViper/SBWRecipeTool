let selectedItem = null;
let gridData = Array(9).fill(null);
let sbwItems = [];
let lastJSON = null;
let currentLang = "ja";

// 静的データ（items.jsonの中身）
const items = [
  "minecraft:tnt",
  "minecraft:glass",
  "minecraft:iron_ingot",
  "minecraft:iron_block",
  "minecraft:comparator",
  "superbwarfare:steel_ingot",
  "superbwarfare:seeker",
  "superbwarfare:missile_engine",
  "superbwarfare:grain",
  "superbwarfare:fusee",
  "superbwarfare:track",
  "superbwarfare:wheel",
  "superbwarfare:propeller",
  "superbwarfare:large_propeller",
  "superbwarfare:motor",
  "superbwarfare:large_motor",
  "superbwarfare:ap_head",
  "superbwarfare:medium_battery_pack",
  "superbwarfare:light_armament_module",
  "superbwarfare:medium_armament_module",
  "superbwarfare:cemented_carbide_block",
  "superbwarfare:steel_block",
  "ashvehicle:enginefanitem"
];

// 既存処理をそのまま流用
items.forEach(item=>{
  const div=document.createElement("div");
  div.className="item";

  div.innerHTML=`<img src="${getItemImage(item)}"><span>${item}</span>`;

  div.onclick=()=>{
    if(recipeType.value==="sbw"){ addSBWFromItem(item); return; }

    selectedItem=item;
    document.querySelectorAll(".item").forEach(el=>el.classList.remove("selected"));
    div.classList.add("selected");
  };

  itemList.appendChild(div);
});

// ===== 多言語 =====
const i18n = {
  ja: {
    recipeType:"レシピタイプ", shaped:"通常クラフト", sbw:"SBWクラフト",
    grid:"クラフトグリッド", result:"結果アイテム", count:"個数",
    category:"カテゴリ", entity:"エンティティ", materials:"材料",
    generate:"生成", clear:"クリア", save:"保存",
    hintShaped:"クリックで選択 → グリッド配置",
    hintSBW:"クリックで材料追加", itemList:"アイテム一覧"
  },
  en: {
    recipeType:"Recipe Type", shaped:"Crafting", sbw:"SBW Craft",
    grid:"Craft Grid", result:"Result", count:"Count",
    category:"Category", entity:"Entity", materials:"Materials",
    generate:"Generate", clear:"Clear", save:"Save",
    hintShaped:"Click → place on grid",
    hintSBW:"Click to add", itemList:"Items"
  },
  ru: {
    recipeType:"Тип рецепта", shaped:"Крафт", sbw:"SBW крафт",
    grid:"Сетка", result:"Результат", count:"Количество",
    category:"Категория", entity:"Сущность", materials:"Материалы",
    generate:"Создать", clear:"Очистить", save:"Скачать",
    hintShaped:"Клик → разместить",
    hintSBW:"Клик для добавления", itemList:"Предметы"
  }
};

function applyLanguage() {
  const t = i18n[currentLang];

  labelRecipeType.textContent = t.recipeType;
  optionShaped.textContent = t.shaped;
  optionSBW.textContent = t.sbw;
  labelGrid.textContent = t.grid;
  labelResult.textContent = t.result;
  labelCount.textContent = t.count;
  labelCategory.textContent = t.category;
  labelEntity.textContent = t.entity;
  labelMaterials.textContent = t.materials;
  btnGenerate.textContent = t.generate;
  btnClear.textContent = t.clear;
  btnSave.textContent = t.save;
  itemListTitle.textContent = t.itemList;

  updateHint();
}

function changeLang(lang) {
  currentLang = lang;
  applyLanguage();
}

// ===== モード =====
const recipeType = document.getElementById("recipeType");

recipeType.addEventListener("change", () => {
  const type = recipeType.value;

  grid.style.display = type === "shaped" ? "grid" : "none";
  normalUI.style.display = type === "shaped" ? "block" : "none";
  sbwUI.style.display = type === "sbw" ? "block" : "none";

  updateHint();
});

function updateHint() {
  const t = i18n[currentLang];
  modeHint.textContent =
    recipeType.value === "sbw" ? t.hintSBW : t.hintShaped;
}

// ===== 画像 =====
function getItemImage(item) {
  const [ns, name] = item.split(":");
  return `./assets/${ns}/${name}.png`;
}

// ===== グリッド =====
for (let i = 0; i < 9; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";

  cell.onclick = () => {
    if (selectedItem) {
      gridData[i] = selectedItem;
      renderGrid();
    }
  };

  cell.oncontextmenu = e => {
    e.preventDefault();
    gridData[i] = null;
    renderGrid();
  };

  grid.appendChild(cell);
}

function renderGrid() {
  document.querySelectorAll(".cell").forEach((cell, i) => {
    cell.innerHTML = "";
    if (gridData[i]) {
      const img = document.createElement("img");
      img.src = getItemImage(gridData[i]);
      cell.appendChild(img);
    }
  });
}

// ===== SBW =====
function addSBWFromItem(item) {
  const f = sbwItems.find(i => i.name === item);
  f ? f.count++ : sbwItems.push({ name:item, count:1 });
  renderSBWList();
}

function renderSBWList() {
  const list = document.getElementById("sbwList");
  list.innerHTML = "";

  sbwItems.forEach((item, i) => {
    const row = document.createElement("div");

    const img = document.createElement("img");
    img.src = getItemImage(item.name);
    img.className = "item-icon";

    const name = document.createElement("span");
    name.textContent = item.name;

    const controls = document.createElement("div");
    controls.className = "sbw-controls";

    const count = document.createElement("input");
    count.type = "number";
    count.value = item.count;

    const del = document.createElement("button");
    del.textContent = "×";
    del.onclick = () => {
      sbwItems.splice(i, 1);
      renderSBWList();
    };

    controls.append(count, del);

    row.append(img, name, controls);
    list.appendChild(row);
  });
}

// ===== アイテム =====
fetch("items.json").then(r=>r.json()).then(items=>{
  items.forEach(item=>{
    const div=document.createElement("div");
    div.className="item";

    div.innerHTML=`<img src="${getItemImage(item)}"><span>${item}</span>`;

    div.onclick=()=>{
      if(recipeType.value==="sbw"){ addSBWFromItem(item); return; }

      selectedItem=item;
      document.querySelectorAll(".item").forEach(el=>el.classList.remove("selected"));
      div.classList.add("selected");
    };

    itemList.appendChild(div);
  });
});

// ===== 生成 =====
function generate() {
  if (recipeType.value === "sbw") {
    lastJSON = {
      type:"superbwarfare:vehicle_assembling",
      category: sbwCategory.value,
      inputs: sbwItems.map(i=>`${i.count} ${i.name}`),
      result:{ entity: `${sbwResultNamespace.value}:${sbwResultId.value}` }
    };
  } else {
    const {pattern,key}=buildPattern();
    lastJSON = {
      type:"minecraft:crafting_shaped",
      pattern,key,
      result:{
        item:`${resultNamespace.value}:${resultId.value}`,
        count:parseInt(count.value)||1
      }
    };
  }

  output.textContent = JSON.stringify(lastJSON,null,2);
}

// ===== pattern =====
function buildPattern(){
  const p=[],k={},m={}; let c=65;
  for(let r=0;r<3;r++){
    let row="";
    for(let col=0;col<3;col++){
      const item=gridData[r*3+col];
      if(!item){row+=" ";continue;}
      if(!m[item]){ const ch=String.fromCharCode(c++); m[item]=ch;k[ch]={item}; }
      row+=m[item];
    }
    p.push(row);
  }
  return {pattern:p,key:k};
}

// ===== 保存 =====
function downloadCurrent(){
  if(!lastJSON)return alert("generate first");

  let id="recipe";
  if(lastJSON.result?.item) id=lastJSON.result.item.split(":")[1];
  if(lastJSON.result?.entity) id=lastJSON.result.entity.split(":")[1];

  const blob=new Blob([JSON.stringify(lastJSON,null,2)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=id+".json";
  a.click();
}

// ===== クリア =====
function clearAll(){
  gridData.fill(null);
  sbwItems=[];
  selectedItem=null;
  lastJSON=null;
  renderGrid();
  renderSBWList();
  output.textContent="";
}

// ===== 初期化 =====
applyLanguage();