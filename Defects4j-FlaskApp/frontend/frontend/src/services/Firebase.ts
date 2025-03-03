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

export const addSubmission = async (submission: StudentSubmission) => {
    const code = `/* *  Licensed to the Apache Software Foundation (ASF) under one or more *  contributor license agreements.  See the NOTICE file distributed with *  this work for additional information regarding copyright ownership. *  The ASF licenses this file to You under the Apache License, Version 2.0 *  (the "License"); you may not use this file except in compliance with *  the License.  You may obtain a copy of the License at * *      http://www.apache.org/licenses/LICENSE-2.0 * *  Unless required by applicable law or agreed to in writing, software *  distributed under the License is distributed on an "AS IS" BASIS, *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. *  See the License for the specific language governing permissions and *  limitations under the License. * */package org.apache.commons.compress.utils;import java.io.IOException;import java.io.InputStream;import java.util.zip.Checksum;/** * A stream that calculates the checksum of the data read. * @NotThreadSafe * @since 1.14 */public class ChecksumCalculatingInputStream extends InputStream {    private final InputStream in;    private final Checksum checksum;    public ChecksumCalculatingInputStream(final Checksum checksum, final InputStream in) {        if ( checksum == null ){            throw new NullPointerException("Parameter checksum must not be null");        }        if ( in == null ){            throw new NullPointerException("Parameter in must not be null");        }        this.checksum = checksum;        this.in = in;    }    /**     * Reads a single byte from the stream     * @throws IOException if the underlying stream throws or the     * stream is exhausted and the Checksum doesn't match the expected     * value     */    @Override    public int read() throws IOException {        final int ret = in.read();        if (ret >= 0) {            checksum.update(ret);        }        return ret;    }    /**     * Reads a byte array from the stream     * @throws IOException if the underlying stream throws or the     * stream is exhausted and the Checksum doesn't match the expected     * value     */    @Override    public int read(final byte[] b) throws IOException {        return read(b, 0, b.length);    }    /**     * Reads from the stream into a byte array.     * @throws IOException if the underlying stream throws or the     * stream is exhausted and the Checksum doesn't match the expected     * value     */    @Override    public int read(final byte[] b, final int off, final int len) throws IOException {        final int ret = in.read(b, off, len);        if (ret >= 0) {            checksum.update(b, off, ret);        }        return ret;    }    @Override    public long skip(final long n) throws IOException {        // Can't really skip, we have to hash everything to verify the checksum        if (read() >= 0) {            return 1;        }        return 0;    }    /**     * Returns the calculated checksum.     * @return the calculated checksum.     */    public long getValue() {        return checksum.getValue();    }}`
  try {
    const docRef = await setDoc(
      doc(
        db,
        "classes",
        submission.className,
        "projects",
        submission.projectName,
        "submissions",
        submission.studentNumber,
      ),
      {
        submissionDate: new Date().toISOString(),
        killedMutants: 23,
        code,
      },
    );
    console.log("Document written with ID: ", docRef);
  } catch (e) {
    console.error("Error adding document: ", e);
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
  const projects: string[] = [];
  querySnapshot.forEach((doc) => {
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