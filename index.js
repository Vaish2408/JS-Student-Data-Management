let studentList;

// Get data from LocalStrorage
// studentList = [
//   { rollno: "10", name: "Satish", marks: 83.3 },
//   { rollno: "11", name: "Nutan", marks: 55.0 },
//   { rollno: "12", name: "Roopal", marks: 38.2 },
//   { rollno: "18", name: "Sahil", marks: 75.8 },
//   { rollno: "19", name: "Anish", marks: 69.6 },
//   { rollno: "20", name: "Jeevan", marks: 33.1 },
//   { rollno: "21", name: "Saurav", marks: 56.4 },
//   { rollno: "22", name: "Leena", marks: 87.5 },
//   { rollno: "23", name: "Neelam", marks: 19.2 },
//   { rollno: "25", name: "Ganesh", marks: 69.9 },
//   { rollno: "27", name: "Sarika", marks: 64.2 },
//   { rollno: "29", name: "Rohan", marks: 45.5 },
// ];

studentList = JSON.parse(window.localStorage.getItem("studentList"));
if (studentList == null) {
  // first time, it is not there in localstorage
  studentList = [];
  studentList = JSON.stringify(studentList);
  window.localStorage.setItem("studentList", studentList);
}
// call this function during add (push), edit (splice) and delete (splice)
function updateLocalStorage() {
  window.localStorage.setItem("studentList", JSON.stringify(studentList));
}
let filteredStudentList = studentList;
let eleBtnAction = document.querySelector(".btn-action");
let eleBtnAddModify = document.querySelector(".btn-add-modify");
let eleRadioBtns = document.querySelectorAll("input[type='radio']");
let eleHeading = document.getElementById("heading");
let eleInputSearch = document.getElementById("ip-txt");
let eleSearchOptions = document.querySelector(".search-options");
let eleListContainer = document.querySelector(".container-list");
let eleRow = document.querySelector(".row");
let eleFormContainer = document.querySelector(".container-form-student");
let eleFormHeading = document.querySelector(".form-heading");
let eleFormInputs = document.querySelectorAll(
  ".container-form-student  input[type=text]"
);
let eleMessage = document.querySelector(".message");
let columnNames = ["rollno", "name", "marks"];
mode = "list";
displayList();
setMode();
eleInputSearch.addEventListener("keyup", function () {
  let target = eleInputSearch.value;
  filteredStudentList = studentList.filter((e) =>
    e.name.trim().toLowerCase().startsWith(target.toLowerCase())
  );
  displayList();
});
eleInputSearch.addEventListener("focus", function () {
  if (!eleRadioBtns[0].checked) {
    eleRadioBtns[0].checked = true;
    filteredStudentList = studentList;
    displayList();
  }
});
let student;
eleRadioBtns.forEach(function (e, index) {
  // if already searching is going on:
  e.addEventListener("change", function () {
    if (index == 0) {
      //all
      filteredStudentList = studentList;
    } else if (index == 1) {
      // marks>=50
      filteredStudentList = studentList.filter((e) => e.marks >= 50);
    } else if (index == 2) {
      // marks<50
      filteredStudentList = studentList.filter((e) => e.marks < 50);
    }
    displayList();
  });
});
function displayList() {
  let list;
  list = filteredStudentList;
  let html = "";
  for (let i = 0; i < list.length; i++) {
    html += `<div class='col-1 bg-primary text-white m1-2 p-2'> ${
      i + 1
    }. </div>`;
    for (let j = 0; j < columnNames.length; j++) {
      html += `<div class='col-3 bg-primary text-white my-1 p-2'> ${
        list[i][columnNames[j]]
      } </div>`;
    } //inner for
    html += `<div class=col-1> <button type='button' class='btn  btn-danger btn-delete'/><i class="bi bi-trash"></i></button>
      </div>`;

    html += `<div class=col-1> <button type='button' class='btn  btn-danger btn-edit' />    <i class="bi bi-pencil-square"></i></button>
      </div>`;

    html += "</div>";
  } //outer for
  eleRow.innerHTML = html;
  updateStudentCount();
  addEventListenersToButtons();
}
function updateStudentCount() {
  eleHeading.innerHTML =
    "Student Data Management (" + filteredStudentList.length + ")";
}
function addEventListenersToButtons() {
  eleBtnsDelete = document.querySelectorAll(".btn-delete");
  eleBtnsEdit = document.querySelectorAll(".btn-edit");
  eleBtnsDelete.forEach((e, index) => {
    e.addEventListener("click", () => {
      // delete operation for element at pos=recordNo
      recordNo = index;
      action = "delete";
      performAction();
    });
  });
  eleBtnsEdit.forEach((e, index) => {
    e.addEventListener("click", () => {
      // edit  operation for element at pos=recordNo
      recordNo = index;
      mode = "editing";
      setMode();
    });
  });
}

function setMode() {
  if (mode == "editing" || mode == "adding") {
    eleSearchOptions.style.display = "none";
    eleListContainer.style.display = "none";
    eleBtnAction.innerHTML = "Show List";
    eleFormContainer.style.display = "block";
    if (mode == "editing") {
      eleBtnAddModify.innerHTML = "Modify";
      eleFormHeading.innerHTML = "Modify the Student";
      fillForm();
    } else if (mode == "adding") {
      eleBtnAddModify.innerHTML = "Add";
      eleFormHeading.innerHTML = "Add a Student";
      clearForm();
    }
  } else if (mode == "list") {
    eleSearchOptions.style.display = "block";
    eleListContainer.style.display = "block";
    eleFormContainer.style.display = "none";
    eleBtnAction.innerHTML = "Add";
    eleBtnAction.disabled = false;
  }
}
eleBtnAction.addEventListener("click", () => {
  // add operation
  if (mode == "list") {
    mode = "adding";
    setMode();
  } else if (mode == "adding" || mode == "editing") {
    // modify operation
    mode = "list";
    displayList();
    setMode();
  }
});
function collectFormData() {
  event.preventDefault();
  getRecord();
  if (mode == "adding") {
    studentList.push(student);
    updateLocalStorage();
    updateStudentCount();
    clearForm();
    showMessage("Record added successfully...");
    //keep same mode
  } else if (mode == "editing") {
    // modify operation
    studentList.splice(recordNo, 1, student);
    updateLocalStorage();
    filteredStudentList = studentList;
    showMessage("Record updated successfully...");
    //change mode
    mode = "list";
    setMode();
    displayList();
  }
}
function showMessage(message) {
  eleMessage.innerHTML = message;
  window.setTimeout(() => (eleMessage.innerHTML = ""), 3000);
}
function fillForm() {
  student = studentList[recordNo];
  eleFormInputs[0].value = student.rollno;
  eleFormInputs[1].value = student.name;
  eleFormInputs[2].value = student.marks;
}
function clearForm() {
  for (let i = 0; i < eleFormInputs.length; i++) {
    eleFormInputs[i].value = "";
  }
}
function getRecord() {
  student = {};
  student.rollno = eleFormInputs[0].value;
  student.name = eleFormInputs[1].value;
  student.marks = eleFormInputs[2].value;
}
function performAction() {
  // perform add/modify/delete operations
  if (action == "add") {
    // perform add operation
    //     is length of to-record is <4
    if (checkform()) {
      showMessage("Enter data correctly");
    } else {
      // add this record to toDoList
      toDoList.push(eleInputToDo.value);
      displayList();
      eleInputToDo.value = "";
      showMessage("Add operation successful...");
    }
  } else if (action == "delete") {
    // perform delete operation - record number recordNo
    let ans = window.confirm(
      "Do you really want to delete record no. " + (recordNo + 1)
    );
    if (ans == false) {
      showMessage("Delete operation is cancelled");
    } else {
      studentList.splice(recordNo, 1);
      updateLocalStorage();
      filteredStudentList = studentList;
      showMessage("Delete operation is successful...");
      displayList();
    }
  } else if (action == "modify") {
    // perform modify operation
    let newValue = eleInputToDo.value;
    toDoList.splice(recordNo, 1, newValue);
    showMessage("Edit operation is successful...");
    mode = "adding";
    displayList();
    setMode();
  }
}
