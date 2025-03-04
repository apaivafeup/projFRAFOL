import { doc, setDoc, query, collection, getDocs, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";

export interface StudentSubmission {
  className: string;
  projectName: string;
  studentNumber: string;
  submissionDate: string;
  killedMutants: string[];
  code: string;
}

const classProjectAlreadyExists = async (className: string, projectName: string) => {
  try {
    const docRef = await getDoc(
      doc(db, "classes", className, "projects", projectName),
    );
    return docRef.exists();
  }
  catch {
    return false;
  }
}

const createClassProject = async (className: string, projectName: string) => {
  try {
    const docRef = await setDoc(
      doc(db, "classes", className, "projects", projectName),
      {},
    );
    console.log("Document written with ID: ", docRef);
  } catch (e) {
    throw new Error("Error" + e);
  }
}

export const addSubmission = async (submission: StudentSubmission) => {
  try {
    if (!await classProjectAlreadyExists(submission.className, submission.projectName)) {
      await createClassProject(submission.className, submission.projectName);
    }
    const docRef = await setDoc(
      doc(
        db,
        "classes",
        `${submission.className}`,
        "projects",
        submission.projectName,
        "submissions",
        submission.studentNumber,
      ),
      {
        submissionDate: new Date().toISOString(),
        killedMutants: submission.killedMutants,
        code: submission.code,
      },
    );
    console.log("Document written with ID: ", docRef);
  } catch (e) {
    throw new Error("Error" + e);
  }
};

export const addClass = async (className: string) => {
  try {
    const docRef = await setDoc(doc(db, "classes", className), {});
    console.log("Document written with ID: ", docRef);
  } catch (e) {
    throw new Error("Error adding document: " + e);
  }
};

export const getAllClasses = async () => {
  const q = query(collection(db, "classes"));
  const querySnapshot = await getDocs(q);
  const classes: string[] = [];
  querySnapshot.forEach((doc) => {
    classes.push(doc.id);
  });
  return classes;
};

export const getClassProjects = async (className: string) => {
  const q = query(collection(db, "classes", className, "projects"));
  const querySnapshot = await getDocs(q);
  console.log(querySnapshot);
  const projects: string[] = [];
  querySnapshot.forEach((doc) => {
    console.log(doc);
    projects.push(doc.id);
  });
  return projects;
};

export const getClassSubmissions = async (
  className: string,
  projectName: string,
) => {
  const q = query(
    collection(db, "classes", className, "projects", projectName, "submissions"),
  );
  const querySnapshot = await getDocs(q);
  const submissions: StudentSubmission[] = [];
  querySnapshot.forEach((doc) => {
    submissions.push({...doc.data() as StudentSubmission, studentNumber: doc.id});
  });
  return submissions;
};

export const getClassAdmissions = async (className: string) => {
  const q = query(collection(db, "classes", className, "admissions"));
  const querySnapshot = await getDocs(q);
  const admissions: string[] = [];
  querySnapshot.forEach((doc) => {
    admissions.push(doc.id);
  });
  return admissions;
};

export const getClassStudents = async (className: string) => {
  const q = query(collection(db, "classes", className, "admitted"));
  const querySnapshot = await getDocs(q);
  const students: string[] = [];
  querySnapshot.forEach((doc) => {
    students.push(doc.id);
  });
  return students;
}

export const createStudent = async (studentNumber: string, className: string) => {

        if(await getExistingStudent(studentNumber, className)){
            throw new Error("Student already exists");
        }
        try {
        const docRef = await setDoc(
        doc(db, "classes", className, "admissions", studentNumber),
        {        },
        );
        console.log("Document written with ID: ", docRef);
    } catch {
        throw new Error("Error creating your account");
    }
};


export const getExistingStudent = async (studentNumber: string, className: string) => {
    try {
        const docRef = await getDoc(
        doc(db, "classes", className, "admissions", studentNumber),
        );
        return docRef.exists();
    } catch {
        return false;
    }
}

export const admitStudent = async (studentNumber: string, className: string) => {
    try {
        await setDoc(
        doc(db, "classes", className, "admitted", studentNumber),
        {},
        );
    } catch {
        throw new Error("Error admitting student");
    }
}

export const isAdmittedStudent = async (studentNumber: string, className: string) => {
    try {
        console.log('fds', studentNumber, className);
        const docRef = await getDoc(
        doc(db, "classes", className, "admitted", studentNumber),
        );
        return docRef.exists();
    } catch {
        return false;
    }
}

export const deleteStudentAdmission = async (studentNumber: string, className: string) => {
    try {
        await deleteDoc(
        doc(db, "classes", className, "admissions", studentNumber),
        );
    } catch {
        throw new Error("Error deleting your account");
    }
}

export const deleteAdmittedStudent = async (studentNumber: string, className: string) => {
    try {
        await deleteDoc(
        doc(db, "classes", className, "admitted", studentNumber),
        );
    } catch {
        throw new Error("Error deleting your account");
    }
}