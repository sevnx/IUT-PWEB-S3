const electsFromJson = getElects();

window.onload = function () {
    const container = document.getElementById("elects-row");
    populateElectsRow(container);
    // addFilterSearchChoiceButtonListener();
    addResultButtonListener();
};

function addFilterSearchChoiceButtonListener(){
    const filterButton = document.getElementById("button-filter");
    const filterInput = document.getElementById("button-search");
    function showAndHideDiv(divToShow, divToHide){
        divToShow.classList.remove("d-none");
        divToHide.classList.add("d-none");
    }
    filterButton.addEventListener("click", function(){
        let divToShow, divToHide;
        divToShow = document.getElementById("elect-filter");
        divToHide = document.getElementById("elect-search");
        showAndHideDiv(divToShow, divToHide);
    });
    filterInput.addEventListener("click", function() {
        let divToShow, divToHide;
        divToShow = document.getElementById("elect-search");
        divToHide = document.getElementById("elect-filter");
        showAndHideDiv(divToShow, divToHide);
    });
}

function addResultButtonListener(){
    const resultButton = document.getElementById("button-result");
    const resultDiv = document.getElementById("elects-row");
    resultButton.addEventListener("click", function(){
        populateElectsRow(resultDiv, getFilterTag(), getSearchName());
    });
}

function getFilterTag(){
    const filterTag = document.getElementById("choice");
    return filterTag.value;
}

function getSearchName(){
    const searchName = document.getElementById("search");
    return searchName.value;
}

function isChoiceFilter(){
    const filterElement = document.getElementById("elect-filter");
    return !filterElement.classList.contains("d-none");
}

function isChoiceSearch(){
    const searchElement = document.getElementById("elect-search");
    return !searchElement.classList.contains("d-none");
}

///

function electHasTag(elect, tag){
    return elect.tags.includes(tag);
}

function electNameMatchesSearch(elect, name){
    return elect.name.toLowerCase().includes(name.toLowerCase());
}

function canAddElect(elect, tag, name){
    return (tag === null || tag === "" || electHasTag(elect, tag))
        && (name === null || electNameMatchesSearch(elect, name));
}

function populateElectsRow(container_row, tag = null, name = null){
    container_row.innerHTML = "";
    electsFromJson.then(data => {
        data.elects.forEach(elect => {
            if(canAddElect(elect, tag, name)) {
                const personDiv = getElectDiv(elect);
                container_row.appendChild(personDiv);
            }
        });
    });
}

function getElects() {
    return fetch("https://victor.ait37.fr/api.php?getElects=true")
        .then(response => response.json())
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

function getElectDiv(person){
    const personDiv = document.createElement("div");
    personDiv.className = "col-lg-3 col-md-3 d-flex align-items-stretch mt-4";
    personDiv.appendChild(getMemberDiv(person));
    return personDiv;
}

function getMemberDiv(person){
    const member = document.createElement("div");
    member.classList.add("member");
    member.classList.add("elect");
    member.classList.add("w-100");
    member.classList.add("h-100");
    member.appendChild(getMemberImgDiv(person));
    member.appendChild(getMemberInfoDiv(person));
    return member;
}

function getMemberInfoDiv(person){
    const memberInfo = document.createElement("div");
    memberInfo.classList.add("member-info");
    memberInfo.appendChild(getMemberInfoH4(person.name));
    memberInfo.appendChild(getMemberInfoSpan(person.jobs));
    return memberInfo;
}

function getMemberInfoH4(name){
    const memberInfoH4 = document.createElement("h4");
    memberInfoH4.textContent = name;
    return memberInfoH4;
}

function getMemberInfoSpan(jobs){
    const memberInfoSpan = document.createElement("span");
    memberInfoSpan.textContent = jobs.join(", ");
    return memberInfoSpan;
}

function getMemberImgDiv(person){
    const memberImg = document.createElement("div");
    memberImg.classList.add("member-img");
    memberImg.appendChild(getImg(person));
    return memberImg;
}

function getImg(person){
    const image = document.createElement("img");
    image.src = "../../assets/img/institution/elects/"+person.imagePath;
    image.classList.add("img-fluid");
    image.alt = `${person.name}'s Image`;
    return image;
}