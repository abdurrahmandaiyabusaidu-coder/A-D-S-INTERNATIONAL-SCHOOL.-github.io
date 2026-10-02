document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       STORAGE
    ===================================================== */

    const STORAGE = {
        students: "eduStudents",
        classes: "eduClasses",
        attendance: "eduAttendance",
        results: "eduResults",
        settings: "eduSchoolSettings",
        admin: "eduAdminName",
        theme: "schoolTheme"
    };


    function getData(key, fallback = []) {
        try {
            return JSON.parse(localStorage.getItem(key)) ?? fallback;
        } catch (error) {
            console.error("Storage error:", error);
            return fallback;
        }
    }


    function saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }


    let students = getData(STORAGE.students, []);
    let classes = getData(STORAGE.classes, []);
    let attendance = getData(STORAGE.attendance, []);
    let results = getData(STORAGE.results, []);


    /* =====================================================
       DEFAULT CLASSES
    ===================================================== */

    if (!classes.length) {

        classes = [
            {
                id: "class-1",
                name: "JSS 1",
                teacher: "Not Assigned"
            },
            {
                id: "class-2",
                name: "JSS 2",
                teacher: "Not Assigned"
            },
            {
                id: "class-3",
                name: "JSS 3",
                teacher: "Not Assigned"
            },
            {
                id: "class-4",
                name: "SS 1",
                teacher: "Not Assigned"
            },
            {
                id: "class-5",
                name: "SS 2",
                teacher: "Not Assigned"
            },
            {
                id: "class-6",
                name: "SS 3",
                teacher: "Not Assigned"
            }
        ];

        saveData(STORAGE.classes, classes);
    }


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const pages = {
        dashboard: document.getElementById("dashboardPage"),
        students: document.getElementById("studentsPage"),
        classes: document.getElementById("classesPage"),
        attendance: document.getElementById("attendancePage"),
        results: document.getElementById("resultsPage"),
        settings: document.getElementById("settingsPage")
    };


    const pageTitle = document.getElementById("pageTitle");
    const pageSubtitle = document.getElementById("pageSubtitle");


    const pageInfo = {
        dashboard: [
            "Dashboard",
            "Welcome to your school management system."
        ],

        students: [
            "Students",
            "Manage all student records."
        ],

        classes: [
            "Classes",
            "Manage school classes and teachers."
        ],

        attendance: [
            "Attendance",
            "Record and manage student attendance."
        ],

        results: [
            "Results",
            "Manage student academic results."
        ],

        settings: [
            "Settings",
            "Configure your school management system."
        ]
    };


    /* =====================================================
       NAVIGATION
    ===================================================== */

    const navLinks = document.querySelectorAll(".nav-link");


    function showPage(pageName) {

        Object.values(pages).forEach(page => {
            if (page) {
                page.classList.remove("active-page");
            }
        });


        if (pages[pageName]) {
            pages[pageName].classList.add("active-page");
        }


        navLinks.forEach(link => {
            link.classList.toggle(
                "active",
                link.dataset.page === pageName
            );
        });


        if (pageInfo[pageName]) {

            pageTitle.textContent = pageInfo[pageName][0];

            pageSubtitle.textContent = pageInfo[pageName][1];
        }


        closeSidebar();


        if (pageName === "dashboard") {
            updateDashboard();
        }

        if (pageName === "students") {
            renderStudents();
        }

        if (pageName === "classes") {
            renderClasses();
        }

        if (pageName === "attendance") {
            renderAttendance();
        }

        if (pageName === "results") {
            renderResults();
        }

        if (pageName === "settings") {
            loadSettings();
        }
    }


    navLinks.forEach(link => {

        link.addEventListener("click", () => {
            showPage(link.dataset.page);
        });

    });


    document.querySelectorAll("[data-page-target]").forEach(button => {

        button.addEventListener("click", () => {

            const target = button.dataset.pageTarget;

            showPage(target);

        });

    });


    /* =====================================================
       SIDEBAR MOBILE
    ===================================================== */

    const sidebar = document.getElementById("sidebar");
    const menuBtn = document.getElementById("menuBtn");
    const sidebarOverlay = document.getElementById("sidebarOverlay");


    function openSidebar() {
        sidebar.classList.add("open");
        sidebarOverlay.classList.add("show");
    }


    function closeSidebar() {
        sidebar.classList.remove("open");
        sidebarOverlay.classList.remove("show");
    }


    if (menuBtn) {
        menuBtn.addEventListener("click", openSidebar);
    }


    if (sidebarOverlay) {
        sidebarOverlay.addEventListener("click", closeSidebar);
    }


    /* =====================================================
       THEME
    ===================================================== */

    const themeBtn = document.getElementById("themeBtn");
    const themeToggle = document.getElementById("themeToggle");


    function applyTheme(theme) {

        if (theme === "light") {

            document.body.classList.add("light-theme");

        } else {

            document.body.classList.remove("light-theme");

        }


        if (themeToggle) {
            themeToggle.checked = theme === "light";
        }


        if (themeBtn) {

            const icon = themeBtn.querySelector("i");

            if (icon) {

                icon.className =
                    theme === "light"
                        ? "fa-solid fa-sun"
                        : "fa-solid fa-moon";
            }
        }
    }


    let savedTheme =
        localStorage.getItem(STORAGE.theme) || "dark";


    applyTheme(savedTheme);


    if (themeBtn) {

        themeBtn.addEventListener("click", () => {

            savedTheme =
                document.body.classList.contains("light-theme")
                    ? "dark"
                    : "light";

            localStorage.setItem(
                STORAGE.theme,
                savedTheme
            );

            applyTheme(savedTheme);
        });
    }


    if (themeToggle) {

        themeToggle.addEventListener("change", () => {

            const theme =
                themeToggle.checked
                    ? "light"
                    : "dark";

            localStorage.setItem(
                STORAGE.theme,
                theme
            );

            applyTheme(theme);
        });
    }


    /* =====================================================
       DASHBOARD
    ===================================================== */

    const totalStudents =
        document.getElementById("totalStudents");

    const totalClasses =
        document.getElementById("totalClasses");

    const attendanceRate =
        document.getElementById("attendanceRate");

    const totalResults =
        document.getElementById("totalResults");

    const recentStudents =
        document.getElementById("recentStudents");


    function updateDashboard() {

        totalStudents.textContent = students.length;

        totalClasses.textContent = classes.length;

        totalResults.textContent = results.length;


        if (!attendance.length) {

            attendanceRate.textContent = "0%";

        } else {

            const present =
                attendance.filter(
                    item => item.status === "Present"
                ).length;

            const rate =
                Math.round(
                    (present / attendance.length) * 100
                );

            attendanceRate.textContent = `${rate}%`;
        }


        renderRecentStudents();
    }


    function renderRecentStudents() {

        if (!students.length) {

            recentStudents.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-user-graduate"></i>
                    <p>No students added yet.</p>
                </div>
            `;

            return;
        }


        const recent =
            [...students]
                .sort(
                    (a, b) =>
                        new Date(b.createdAt) -
                        new Date(a.createdAt)
                )
                .slice(0, 5);


        recentStudents.innerHTML =
            recent.map(student => {

                const photo =
                    student.photo ||
                    "";


                return `
                    <div class="recent-item">

                        ${
                            photo
                                ? `
                                    <img
                                        class="recent-photo"
                                        src="${photo}"
                                        alt="${escapeHTML(student.name)}"
                                    >
                                `
                                : `
                                    <div class="recent-photo">
                                        <i class="fa-solid fa-user"></i>
                                    </div>
                                `
                        }

                        <div>
                            <strong>
                                ${escapeHTML(student.name)}
                            </strong>

                            <span>
                                ${escapeHTML(student.studentClass || "No class")}
                            </span>
                        </div>

                    </div>
                `;

            }).join("");
    }


    /* =====================================================
       STUDENT MODAL
    ===================================================== */

    const studentModal =
        document.getElementById("studentModal");

    const studentForm =
        document.getElementById("studentForm");

    const addStudentBtn =
        document.getElementById("addStudentBtn");

    const quickAddStudent =
        document.getElementById("quickAddStudent");

    const closeStudentModal =
        document.getElementById("closeStudentModal");

    const cancelStudentBtn =
        document.getElementById("cancelStudentBtn");

    const studentModalTitle =
        document.getElementById("studentModalTitle");

    const studentSubmitText =
        document.getElementById("studentSubmitText");


    const studentId =
        document.getElementById("studentId");

    const studentName =
        document.getElementById("studentName");

    const studentGender =
        document.getElementById("studentGender");

    const studentDOB =
        document.getElementById("studentDOB");

    const studentClass =
        document.getElementById("studentClass");

    const studentDepartment =
        document.getElementById("studentDepartment");

    const studentPhone =
        document.getElementById("studentPhone");

    const studentAddress =
        document.getElementById("studentAddress");

    const studentPhoto =
        document.getElementById("studentPhoto");

    const photoPreview =
        document.getElementById("photoPreview");


    let editingStudentId = null;

    let selectedPhoto = "";


    function openStudentModal(student = null) {

        studentForm.reset();

        selectedPhoto = "";


        if (student) {

            editingStudentId = student.id;


            studentModalTitle.textContent =
                "Edit Student";

            studentSubmitText.textContent =
                "Update Student";


            studentId.value =
                student.studentId || "";

            studentName.value =
                student.name || "";

            studentGender.value =
                student.gender || "";

            studentDOB.value =
                student.dob || "";

            studentClass.value =
                student.studentClass || "";

            studentDepartment.value =
                student.department || "";

            studentPhone.value =
                student.phone || "";

            studentAddress.value =
                student.address || "";


            selectedPhoto =
                student.photo || "";


            if (selectedPhoto) {

                photoPreview.innerHTML = `
                    <img
                        src="${selectedPhoto}"
                        alt="Student photo"
                    >
                `;

            } else {

                photoPreview.innerHTML =
                    `<i class="fa-solid fa-user"></i>`;
            }

        } else {

            editingStudentId = null;


            studentModalTitle.textContent =
                "Add Student";

            studentSubmitText.textContent =
                "Save Student";


            photoPreview.innerHTML =
                `<i class="fa-solid fa-user"></i>`;
        }


        populateClassSelects();


        if (student) {
            studentClass.value =
                student.studentClass || "";
        }


        studentModal.classList.add("show");
    }


    function closeStudentModalWindow() {

        studentModal.classList.remove("show");

        studentForm.reset();

        editingStudentId = null;

        selectedPhoto = "";

        studentModalTitle.textContent =
            "Add Student";

        studentSubmitText.textContent =
            "Save Student";

        photoPreview.innerHTML =
            `<i class="fa-solid fa-user"></i>`;
    }


    if (addStudentBtn) {

        addStudentBtn.addEventListener(
            "click",
            () => openStudentModal()
        );
    }


    if (quickAddStudent) {

        quickAddStudent.addEventListener(
            "click",
            () => openStudentModal()
        );
    }


    if (closeStudentModal) {

        closeStudentModal.addEventListener(
            "click",
            closeStudentModalWindow
        );
    }


    if (cancelStudentBtn) {

        cancelStudentBtn.addEventListener(
            "click",
            closeStudentModalWindow
        );
    }


    studentModal.addEventListener("click", event => {

        if (event.target === studentModal) {
            closeStudentModalWindow();
        }

    });


    /* =====================================================
       PHOTO PREVIEW
    ===================================================== */

    if (studentPhoto) {

        studentPhoto.addEventListener("change", event => {

            const file =
                event.target.files[0];


            if (!file) return;


            if (!file.type.startsWith("image/")) {

                alert("Please select an image file.");

                studentPhoto.value = "";

                return;
            }


            const reader =
                new FileReader();


            reader.onload = event => {

                selectedPhoto =
                    event.target.result;


                photoPreview.innerHTML = `
                    <img
                        src="${selectedPhoto}"
                        alt="Student photo"
                    >
                `;
            };


            reader.readAsDataURL(file);
        });
    }


    /* =====================================================
       SAVE STUDENT
    ===================================================== */

    studentForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                studentName.value.trim();

            const gender =
                studentGender.value;

            const dob =
                studentDOB.value;

            const studentClassValue =
                studentClass.value;

            const department =
                studentDepartment.value.trim();

            const phone =
                studentPhone.value.trim();

            const address =
                studentAddress.value.trim();

            const idValue =
                studentId.value.trim();


            if (!name) {

                alert("Please enter the student's full name 👨‍🎓.");

                studentName.focus();

                return;
            }


            if (!gender) {

                alert("Please select the student's gender 🧬.");

                studentGender.focus();

                return;
            }


            if (!studentClassValue) {

                alert("Please select the student's class 🏛.");

                studentClass.focus();

                return;
            }


            /* ---------------------------------------------
               CHECK DUPLICATE STUDENT ID
            --------------------------------------------- */

            const duplicate =
                students.find(student =>
                    student.studentId.toLowerCase() ===
                    idValue.toLowerCase() &&
                    student.id !== editingStudentId
                );


            if (idValue && duplicate) {

                alert(
                    "This Student ID already exists. Please use another ID."
                );

                studentId.focus();

                return;
            }


            /* ---------------------------------------------
               EDIT EXISTING STUDENT
            --------------------------------------------- */

            if (editingStudentId) {

                const index =
                    students.findIndex(
                        student =>
                            student.id === editingStudentId
                    );


                if (index !== -1) {

                    students[index] = {
                        ...students[index],

                        studentId:
                            idValue ||
                            students[index].studentId,

                        name,
                        gender,
                        dob,
                        studentClass:
                            studentClassValue,
                        department,
                        phone,
                        address,

                        photo:
                            selectedPhoto ||
                            students[index].photo ||
                            "",

                        updatedAt:
                            new Date().toISOString()
                    };
                }


                saveData(
                    STORAGE.students,
                    students
                );


                alert("Student details updated successfully!");


            } else {

                /* -----------------------------------------
                   ADD NEW STUDENT
                ----------------------------------------- */

                const newStudent = {

                    id:
                        "student-" +
                        Date.now() +
                        "-" +
                        Math.random()
                            .toString(36)
                            .slice(2, 8),

                    studentId:
                        idValue ||
                        generateStudentID(),

                    name,

                    gender,

                    dob,

                    studentClass:
                        studentClassValue,

                    department,

                    phone,

                    address,

                    photo:
                        selectedPhoto || "",

                    createdAt:
                        new Date().toISOString()
                };


                students.push(newStudent);


                saveData(
                    STORAGE.students,
                    students
                );


                alert("Student saved successfully!");
            }


            closeStudentModalWindow();


            renderStudents();

            populateClassSelects();

            updateDashboard();

        }
    );


    /* =====================================================
       GENERATE STUDENT ID
    ===================================================== */

    function generateStudentID() {

        let number =
            students.length + 1;

        let id =
            `ADS-${String(number).padStart(4, "0")}`;


        while (
            students.some(
                student =>
                    student.studentId === id
            )
        ) {

            number++;

            id =
                `ADS-${String(number).padStart(4, "0")}`;
        }


        return id;
    }


    /* =====================================================
       STUDENTS TABLE
    ===================================================== */

    const studentsTableBody =
        document.getElementById("studentsTableBody");

    const studentSearch =
        document.getElementById("studentSearch");

    const studentClassFilter =
        document.getElementById("studentClassFilter");

    const printStudentsBtn =
        document.getElementById("printStudentsBtn");


    function renderStudents() {

        const search =
            studentSearch.value
                .trim()
                .toLowerCase();

        const classFilter =
            studentClassFilter.value;


        const filtered =
            students.filter(student => {

                const matchesSearch =
                    !search ||

                    student.name
                        .toLowerCase()
                        .includes(search) ||

                    student.studentId
                        .toLowerCase()
                        .includes(search) ||

                    (student.phone || "")
                        .toLowerCase()
                        .includes(search) ||

                    (student.department || "")
                        .toLowerCase()
                        .includes(search);


                const matchesClass =
                    classFilter === "all" ||
                    student.studentClass === classFilter;


                return matchesSearch &&
                       matchesClass;
            });


        if (!filtered.length) {

            studentsTableBody.innerHTML = `
                <tr>
                    <td colspan="8">
                        <div class="empty-state">
                            <i class="fa-solid fa-user-graduate"></i>
                            <p>No students found.</p>
                        </div>
                    </td>
                </tr>
            `;

            return;
        }


        studentsTableBody.innerHTML =
            filtered.map(student => {

                const photo =
                    student.photo || "";


                return `
                    <tr>

                        <td>

                            ${
                                photo
                                    ? `
                                        <img
                                            class="student-table-photo"
                                            src="${photo}"
                                            alt="${escapeHTML(student.name)}"
                                        >
                                    `
                                    : `
                                        <div
                                            class="student-table-photo"
                                            style="
                                                display:flex;
                                                align-items:center;
                                                justify-content:center;
                                            "
                                        >
                                            <i class="fa-solid fa-user"></i>
                                        </div>
                                    `
                            }

                        </td>


                        <td>
                            <strong>
                                ${escapeHTML(student.studentId)}
                            </strong>
                        </td>


                        <td>
                            ${escapeHTML(student.name)}
                        </td>


                        <td>
                            ${escapeHTML(student.gender)}
                        </td>


                        <td>
                            ${escapeHTML(student.studentClass)}
                        </td>


                        <td>
                            ${escapeHTML(student.department || "-")}
                        </td>


                        <td>
                            ${escapeHTML(student.phone || "-")}
                        </td>


                        <td>

                            <div class="action-buttons">

                                <button
                                    class="table-action edit"
                                    data-action="edit-student"
                                    data-id="${student.id}"
                                    title="Edit"
                                >
                                    <i class="fa-solid fa-pen"></i>
                                </button>


                                <button
                                    class="table-action delete"
                                    data-action="delete-student"
                                    data-id="${student.id}"
                                    title="Delete"
                                >
                                    <i class="fa-solid fa-trash"></i>
                                </button>

                            </div>

                        </td>

                    </tr>
                `;

            }).join("");
    }


    studentsTableBody.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest("button");


            if (!button) return;


            const id =
                button.dataset.id;

            const action =
                button.dataset.action;


            if (action === "edit-student") {

                const student =
                    students.find(
                        item => item.id === id
                    );


                if (student) {
                    openStudentModal(student);
                }
            }


            if (action === "delete-student") {

                deleteStudent(id);
            }

        }
    );


    function deleteStudent(id) {

        const student =
            students.find(
                item => item.id === id
            );


        if (!student) return;


        const confirmed =
            confirm(
                `Delete ${student.name}?\n\nThis action cannot be undone.`
            );


        if (!confirmed) return;


        students =
            students.filter(
                item => item.id !== id
            );


        saveData(
            STORAGE.students,
            students
        );


        attendance =
            attendance.filter(
                item => item.studentId !== id
            );


        results =
            results.filter(
                item => item.studentId !== id
            );


        saveData(
            STORAGE.attendance,
            attendance
        );

        saveData(
            STORAGE.results,
            results
        );


        renderStudents();

        renderAttendance();

        renderResults();

        updateDashboard();


        alert("Student deleted successfully.");
    }


    if (studentSearch) {

        studentSearch.addEventListener(
            "input",
            renderStudents
        );
    }


    if (studentClassFilter) {

        studentClassFilter.addEventListener(
            "change",
            renderStudents
        );
    }


    if (printStudentsBtn) {

        printStudentsBtn.addEventListener(
            "click",
            () => window.print()
        );
    }


    /* =====================================================
       CLASS MANAGEMENT
    ===================================================== */

    const classesGrid =
        document.getElementById("classesGrid");

    const addClassBtn =
        document.getElementById("addClassBtn");

    const classModal =
        document.getElementById("classModal");

    const classForm =
        document.getElementById("classForm");

    const closeClassModal =
        document.getElementById("closeClassModal");

    const cancelClassBtn =
        document.getElementById("cancelClassBtn");

    const className =
        document.getElementById("className");

    const classTeacher =
        document.getElementById("classTeacher");


    function openClassModal() {

        classForm.reset();

        classModal.classList.add("show");
    }


    function closeClassModalWindow() {

        classModal.classList.remove("show");

        classForm.reset();
    }


    addClassBtn.addEventListener(
        "click",
        openClassModal
    );


    closeClassModal.addEventListener(
        "click",
        closeClassModalWindow
    );


    cancelClassBtn.addEventListener(
        "click",
        closeClassModalWindow
    );


    classModal.addEventListener(
        "click",
        event => {

            if (event.target === classModal) {
                closeClassModalWindow();
            }

        }
    );


    classForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                className.value.trim();

            const teacher =
                classTeacher.value.trim() ||
                "Not Assigned";


            if (!name) return;


            const exists =
                classes.some(
                    item =>
                        item.name.toLowerCase() ===
                        name.toLowerCase()
                );


            if (exists) {

                alert("This class already exists.");

                return;
            }


            classes.push({

                id:
                    "class-" +
                    Date.now(),

                name,

                teacher
            });


            saveData(
                STORAGE.classes,
                classes
            );


            closeClassModalWindow();


            renderClasses();

            populateClassSelects();

            updateDashboard();


            alert("Class saved successfully.");
        }
    );


    function renderClasses() {

        if (!classes.length) {

            classesGrid.innerHTML = `
                <div class="panel">
                    <div class="empty-state">
                        <i class="fa-solid fa-chalkboard"></i>
                        <p>No classes available.</p>
                    </div>
                </div>
            `;

            return;
        }


        classesGrid.innerHTML =
            classes.map(cls => {

                const count =
                    students.filter(
                        student =>
                            student.studentClass ===
                            cls.name
                    ).length;


                return `
                    <div class="class-card">

                        <div class="class-card-top">

                            <div class="class-icon">
                                <i class="fa-solid fa-chalkboard"></i>
                            </div>

                            <button
                                class="table-action delete"
                                data-class-delete="${cls.id}"
                                title="Delete class"
                            >
                                <i class="fa-solid fa-trash"></i>
                            </button>

                        </div>


                        <h3>
                            ${escapeHTML(cls.name)}
                        </h3>


                        <p>
                            Teacher:
                            ${escapeHTML(cls.teacher)}
                        </p>


                        <div class="class-card-actions">

                            <span class="class-count">
                                ${count}
                                student${count === 1 ? "" : "s"}
                            </span>

                        </div>

                    </div>
                `;

            }).join("");
    }


    classesGrid.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-class-delete]"
                );


            if (!button) return;


            const id =
                button.dataset.classDelete;


            const cls =
                classes.find(
                    item => item.id === id
                );


            if (!cls) return;


            const used =
                students.some(
                    student =>
                        student.studentClass ===
                        cls.name
                );


            if (used) {

                alert(
                    "You cannot delete this class because students are assigned to it."
                );

                return;
            }


            if (
                !confirm(
                    `Delete class "${cls.name}"?`
                )
            ) {
                return;
            }


            classes =
                classes.filter(
                    item => item.id !== id
                );


            saveData(
                STORAGE.classes,
                classes
            );


            renderClasses();

            populateClassSelects();

            updateDashboard();
        }
    );


    /* =====================================================
       CLASS SELECTS
    ===================================================== */

    function populateClassSelects() {

        const selects = [
            studentClass,
            studentClassFilter,
            attendanceClassFilter
        ];


        selects.forEach(select => {

            if (!select) return;


            const currentValue =
                select.value;


            if (
                select === studentClass
            ) {

                select.innerHTML = `
                    <option value="">
                        Select class
                    </option>
                `;

            } else {

                select.innerHTML = `
                    <option value="all">
                        All Classes
                    </option>
                `;
            }


            classes.forEach(cls => {

                const option =
                    document.createElement("option");


                option.value =
                    cls.name;

                option.textContent =
                    cls.name;


                select.appendChild(option);
            });


            if (
                [...select.options]
                    .some(
                        option =>
                            option.value ===
                            currentValue
                    )
            ) {

                select.value =
                    currentValue;
            }

        });
    }


    /* =====================================================
       ATTENDANCE
    ===================================================== */

    const attendanceDate =
        document.getElementById("attendanceDate");

    const attendanceSearch =
        document.getElementById("attendanceSearch");

    const attendanceClassFilter =
        document.getElementById(
            "attendanceClassFilter"
        );

    const attendanceTableBody =
        document.getElementById(
            "attendanceTableBody"
        );

    const presentCount =
        document.getElementById("presentCount");

    const absentCount =
        document.getElementById("absentCount");

    const lateCount =
        document.getElementById("lateCount");

    const todayAttendanceRate =
        document.getElementById(
            "todayAttendanceRate"
        );


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    attendanceDate.value = today;


    function getAttendanceStatus(
        studentIdValue,
        date
    ) {

        const record =
            attendance.find(
                item =>
                    item.studentId ===
                    studentIdValue &&
                    item.date === date
            );


        return record
            ? record.status
            : "";
    }


    function setAttendance(
        studentIdValue,
        date,
        status
    ) {

        const index =
            attendance.findIndex(
                item =>
                    item.studentId ===
                    studentIdValue &&
                    item.date === date
            );


        const record = {

            studentId:
                studentIdValue,

            date,

            status
        };


        if (index === -1) {

            attendance.push(record);

        } else {

            attendance[index] = record;
        }


        saveData(
            STORAGE.attendance,
            attendance
        );


        renderAttendance();

        updateDashboard();
    }


    function renderAttendance() {

        const date =
            attendanceDate.value ||
            today;


        const search =
            attendanceSearch.value
                .trim()
                .toLowerCase();


        const classFilter =
            attendanceClassFilter.value;


        const filtered =
            students.filter(student => {

                const matchesSearch =
                    !search ||

                    student.name
                        .toLowerCase()
                        .includes(search) ||

                    student.studentId
                        .toLowerCase()
                        .includes(search);


                const matchesClass =
                    classFilter === "all" ||
                    student.studentClass ===
                        classFilter;


                return matchesSearch &&
                       matchesClass;
            });


        if (!filtered.length) {

            attendanceTableBody.innerHTML = `
                <tr>
                    <td colspan="4">
                        <div class="empty-state">
                            <i class="fa-solid fa-calendar-xmark"></i>
                            <p>No students found.</p>
                        </div>
                    </td>
                </tr>
            `;

        } else {

            attendanceTableBody.innerHTML =
                filtered.map(student => {

                    const status =
                        getAttendanceStatus(
                            student.id,
                            date
                        );


                    return `
                        <tr>

                            <td>
                                <strong>
                                    ${escapeHTML(student.name)}
                                </strong>
                            </td>


                            <td>
                                ${escapeHTML(student.studentId)}
                            </td>


                            <td>
                                ${escapeHTML(student.studentClass)}
                            </td>


                            <td>

                                <div class="attendance-buttons">

                                    <button
                                        class="
                                            attendance-btn
                                            present
                                            ${status === "Present" ? "active" : ""}
                                        "
                                        data-attendance-status="Present"
                                        data-student-id="${student.id}"
                                    >
                                        Present
                                    </button>


                                    <button
                                        class="
                                            attendance-btn
                                            absent
                                            ${status === "Absent" ? "active" : ""}
                                        "
                                        data-attendance-status="Absent"
                                        data-student-id="${student.id}"
                                    >
                                        Absent
                                    </button>


                                    <button
                                        class="
                                            attendance-btn
                                            late
                                            ${status === "Late" ? "active" : ""}
                                        "
                                        data-attendance-status="Late"
                                        data-student-id="${student.id}"
                                    >
                                        Late
                                    </button>

                                </div>

                            </td>

                        </tr>
                    `;

                }).join("");
        }


        updateAttendanceSummary(date);
    }


    function updateAttendanceSummary(date) {

        const records =
            students.map(student =>
                getAttendanceStatus(
                    student.id,
                    date
                )
            );


        const present =
            records.filter(
                status => status === "Present"
            ).length;


        const absent =
            records.filter(
                status => status === "Absent"
            ).length;


        const late =
            records.filter(
                status => status === "Late"
            ).length;


        const recorded =
            present + absent + late;


        const rate =
            recorded
                ? Math.round(
                    (present / recorded) * 100
                )
                : 0;


        presentCount.textContent =
            present;

        absentCount.textContent =
            absent;

        lateCount.textContent =
            late;

        todayAttendanceRate.textContent =
            `${rate}%`;
    }


    attendanceTableBody.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-attendance-status]"
                );


            if (!button) return;


            const studentIdValue =
                button.dataset.studentId;


            const status =
                button.dataset.attendanceStatus;


            setAttendance(
                studentIdValue,
                attendanceDate.value || today,
                status
            );
        }
    );


    attendanceDate.addEventListener(
        "change",
        renderAttendance
    );


    attendanceSearch.addEventListener(
        "input",
        renderAttendance
    );


    attendanceClassFilter.addEventListener(
        "change",
        renderAttendance
    );


    /* =====================================================
       RESULTS
    ===================================================== */

    const resultsTableBody =
        document.getElementById(
            "resultsTableBody"
        );

    const resultSearch =
        document.getElementById(
            "resultSearch"
        );

    const resultTermFilter =
        document.getElementById(
            "resultTermFilter"
        );

    const addResultBtn =
        document.getElementById(
            "addResultBtn"
        );

    const resultModal =
        document.getElementById(
            "resultModal"
        );

    const resultForm =
        document.getElementById(
            "resultForm"
        );

    const closeResultModal =
        document.getElementById(
            "closeResultModal"
        );

    const cancelResultBtn =
        document.getElementById(
            "cancelResultBtn"
        );

    const resultStudent =
        document.getElementById(
            "resultStudent"
        );

    const resultSubject =
        document.getElementById(
            "resultSubject"
        );

    const resultTermInput =
        document.getElementById(
            "resultTermInput"
        );

    const resultScore =
        document.getElementById(
            "resultScore"
        );


    function openResultModal() {

        resultForm.reset();

        populateResultStudents();

        resultModal.classList.add("show");
    }


    function closeResultModalWindow() {

        resultModal.classList.remove("show");

        resultForm.reset();
    }


    addResultBtn.addEventListener(
        "click",
        openResultModal
    );


    closeResultModal.addEventListener(
        "click",
        closeResultModalWindow
    );


    cancelResultBtn.addEventListener(
        "click",
        closeResultModalWindow
    );


    resultModal.addEventListener(
        "click",
        event => {

            if (event.target === resultModal) {
                closeResultModalWindow();
            }

        }
    );


    function populateResultStudents() {

        resultStudent.innerHTML = `
            <option value="">
                Select student
            </option>
        `;


        students.forEach(student => {

            const option =
                document.createElement("option");


            option.value =
                student.id;


            option.textContent =
                `${student.name} (${student.studentId})`;


            resultStudent.appendChild(option);
        });
    }


    resultForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const studentIdValue =
                resultStudent.value;


            const subject =
                resultSubject.value.trim();


            const term =
                resultTermInput.value;


            const score =
                Number(resultScore.value);


            if (
                !studentIdValue ||
                !subject ||
                !term ||
                Number.isNaN(score)
            ) {

                alert(
                    "Please complete all result fields."
                );

                return;
            }


            if (
                score < 0 ||
                score > 100
            ) {

                alert(
                    "Score must be between 0 and 100."
                );

                return;
            }


            results.push({

                id:
                    "result-" +
                    Date.now() +
                    "-" +
                    Math.random()
                        .toString(36)
                        .slice(2, 7),

                studentId:
                    studentIdValue,

                subject,

                term,

                score,

                createdAt:
                    new Date().toISOString()
            });


            saveData(
                STORAGE.results,
                results
            );


            closeResultModalWindow();


            renderResults();

            updateDashboard();


            alert("Result saved successfully.");
        }
    );


    function getGrade(score) {

        if (score >= 70) return "A";

        if (score >= 60) return "B";

        if (score >= 50) return "C";

        if (score >= 45) return "D";

        if (score >= 40) return "E";

        return "F";
    }


    function renderResults() {

        const search =
            resultSearch.value
                .trim()
                .toLowerCase();


        const termFilter =
            resultTermFilter.value;


        const filtered =
            results.filter(result => {

                const student =
                    students.find(
                        item =>
                            item.id ===
                            result.studentId
                    );


                const studentName =
                    student
                        ? student.name
                        : "";


                const matchesSearch =
                    !search ||

                    studentName
                        .toLowerCase()
                        .includes(search) ||

                    result.subject
                        .toLowerCase()
                        .includes(search);


                const matchesTerm =
                    termFilter === "all" ||
                    result.term === termFilter;


                return matchesSearch &&
                       matchesTerm;
            });


        if (!filtered.length) {

            resultsTableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="empty-state">
                            <i class="fa-solid fa-file-circle-xmark"></i>
                            <p>No results found.</p>
                        </div>
                    </td>
                </tr>
            `;

            return;
        }


        resultsTableBody.innerHTML =
            filtered.map(result => {

                const student =
                    students.find(
                        item =>
                            item.id ===
                            result.studentId
                    );


                const name =
                    student
                        ? student.name
                        : "Unknown Student";


                const grade =
                    getGrade(
                        Number(result.score)
                    );


                return `
                    <tr>

                        <td>
                            ${escapeHTML(name)}
                        </td>


                        <td>
                            ${escapeHTML(result.subject)}
                        </td>


                        <td>
                            ${escapeHTML(result.term)}
                        </td>


                        <td>
                            ${result.score}%
                        </td>


                        <td>
                            <span class="badge">
                                ${grade}
                            </span>
                        </td>


                        <td>

                            <button
                                class="table-action delete"
                                data-result-delete="${result.id}"
                                title="Delete result"
                            >
                                <i class="fa-solid fa-trash"></i>
                            </button>

                        </td>

                    </tr>
                `;

            }).join("");
    }


    resultsTableBody.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-result-delete]"
                );


            if (!button) return;


            const id =
                button.dataset.resultDelete;


            if (
                !confirm(
                    "Delete this result?"
                )
            ) {
                return;
            }


            results =
                results.filter(
                    result =>
                        result.id !== id
                );


            saveData(
                STORAGE.results,
                results
            );


            renderResults();

            updateDashboard();
        }
    );


    resultSearch.addEventListener(
        "input",
        renderResults
    );


    resultTermFilter.addEventListener(
        "change",
        renderResults
    );


    /* =====================================================
       SETTINGS
    ===================================================== */

    const schoolSettingsForm =
        document.getElementById(
            "schoolSettingsForm"
        );

    const schoolName =
        document.getElementById(
            "schoolName"
        );

    const adminName =
        document.getElementById(
            "adminName"
        );

    const schoolAddress =
        document.getElementById(
            "schoolAddress"
        );

    const sidebarAdminName =
        document.getElementById(
            "sidebarAdminName"
        );


    function loadSettings() {

        const settings =
            getData(
                STORAGE.settings,
                {}
            );


        schoolName.value =
            settings.schoolName || "";


        adminName.value =
            localStorage.getItem(
                STORAGE.admin
            ) || "";


        schoolAddress.value =
            settings.schoolAddress || "";


        sidebarAdminName.textContent =
            adminName.value ||
            "Administrator";
    }


    schoolSettingsForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const settings = {

                schoolName:
                    schoolName.value.trim(),

                schoolAddress:
                    schoolAddress.value.trim()
            };


            saveData(
                STORAGE.settings,
                settings
            );


            localStorage.setItem(
                STORAGE.admin,
                adminName.value.trim() ||
                "Administrator"
            );


            sidebarAdminName.textContent =
                adminName.value.trim() ||
                "Administrator";


            alert(
                "Settings saved successfully."
            );
        }
    );


    /* =====================================================
       CLEAR ALL DATA
    ===================================================== */

    const clearDataBtn =
        document.getElementById(
            "clearDataBtn"
        );


    clearDataBtn.addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "Are you sure you want to delete all students, attendance records and results?\n\nThis cannot be undone."
                );


            if (!confirmed) return;


            students = [];

            attendance = [];

            results = [];


            saveData(
                STORAGE.students,
                students
            );

            saveData(
                STORAGE.attendance,
                attendance
            );

            saveData(
                STORAGE.results,
                results
            );


            renderStudents();

            renderAttendance();

            renderResults();

            renderClasses();

            updateDashboard();


            alert(
                "Student, attendance and result data cleared."
            );
        }
    );


    /* =====================================================
       ESCAPE MODALS WITH ESC KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }


            if (
                studentModal.classList.contains(
                    "show"
                )
            ) {
                closeStudentModalWindow();
            }


            if (
                classModal.classList.contains(
                    "show"
                )
            ) {
                closeClassModalWindow();
            }


            if (
                resultModal.classList.contains(
                    "show"
                )
            ) {
                closeResultModalWindow();
            }
        }
    );


    /* =====================================================
       HELPER
    ===================================================== */

    function escapeHTML(value) {

        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    populateClassSelects();

    updateDashboard();

    renderStudents();

    renderClasses();

    renderAttendance();

    renderResults();

    loadSettings();


    console.log(
        "✅ EduManage School Management System is working!"
    );

});

/* ==========================================
   1Ø2 THINGS - ADVANCED LOADING SCREEN
========================================== */

window.addEventListener("load", function () {

    const loadingScreen =
        document.getElementById("loading-screen");

    if (!loadingScreen) return;

    setTimeout(function () {

        loadingScreen.classList.add("hide");

    }, 1800);

});