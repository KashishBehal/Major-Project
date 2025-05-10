import React, { useState, useEffect } from "react";

const AssignmentUpload = () => {
  const [file, setFile] = useState(null);
  const [assignments, setAssignments] = useState([]);

  // Load previous assignments from localStorage when the component mounts
  useEffect(() => {
    const savedAssignments = JSON.parse(localStorage.getItem("assignments")) || [];
    setAssignments(savedAssignments);
  }, []);

  // Handle file change
  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  // Handle file upload
  const handleUpload = () => {
    if (file) {
      const newAssignment = {
        name: file.name,
        type: file.type,
        size: file.size,
        date: new Date().toLocaleString(),
        fileURL: URL.createObjectURL(file),
      };

      // Save to localStorage
      const updatedAssignments = [...assignments, newAssignment];
      localStorage.setItem("assignments", JSON.stringify(updatedAssignments));

      // Update state
      setAssignments(updatedAssignments);
      setFile(null);
    } else {
      alert("Please select a file to upload.");
    }
  };

  // Handle file download
  const handleDownload = (fileURL, fileName) => {
    const link = document.createElement("a");
    link.href = fileURL;
    link.download = fileName;
    link.click();
  };

  // Handle file sharing (copy to clipboard)
  const handleShare = (fileURL) => {
    navigator.clipboard.writeText(fileURL).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.header}>Student Assignment Portal</h1>

        <h2 style={styles.subHeader}>Upload Assignment</h2>
        <input type="file" onChange={handleFileChange} style={styles.fileInput} />
        <button onClick={handleUpload} style={styles.uploadButton}>Upload Assignment</button>

        <div>
          <h2 style={styles.subHeader}>Uploaded Assignments History</h2>
          <ul style={styles.assignmentList}>
            {assignments.length > 0 ? (
              assignments.map((assignment, index) => (
                <li key={index} style={styles.assignmentItem}>
                  <div style={styles.assignmentDetails}>
                    <strong>{assignment.name}</strong> (Uploaded on: {assignment.date}) - Size:{" "}
                    {Math.round(assignment.size / 1024)} KB - Type: {assignment.type}
                  </div>
                  <div style={styles.actions}>
                    {/* View Button */}
                    {assignment.type.startsWith("image") && (
                      <a href={assignment.fileURL} target="_blank" rel="noopener noreferrer" style={styles.viewButton}>
                        View Image
                      </a>
                    )}
                    {assignment.type === "application/pdf" && (
                      <a href={assignment.fileURL} target="_blank" rel="noopener noreferrer" style={styles.viewButton}>
                        View PDF
                      </a>
                    )}
                    {/* Download Button */}
                    <button style={styles.downloadButton} onClick={() => handleDownload(assignment.fileURL, assignment.name)}>
                      Download
                    </button>
                    {/* Share Button */}
                    <button style={styles.shareButton} onClick={() => handleShare(assignment.fileURL)}>
                      Share
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li>No assignments uploaded yet.</li>
            )}
          </ul>
        </div>

        <footer style={styles.footer}>
          <p>
            Powered by <a href="https://www.yourcompany.com" target="_blank" rel="noopener noreferrer" style={styles.footerLink}>Your Company</a>
          </p>
        </footer>
      </div>
    </div>
  );
};

// Inline styling (for simplicity)
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh", // Ensures the content covers the entire viewport height
    background: "#f7f7f7",
    padding: "20px",
    boxSizing: "border-box",
    backgroundColor: "rgb(216, 216, 200)",
  },
  content: {
    width: "100%",
    maxWidth: "900px", // Keeps the content within a max width for better readability
    backgroundColor: "rgb(216, 216, 210)",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    backdropFilter: "blur(10px)", // Add blur effect to background
    textAlign: "center",
    fontFamily: "'Arial', sans-serif",
  },
  header: {
    fontSize: "2.5rem",
    color: "#333",
    marginBottom: "20px",
  },
  subHeader: {
    fontSize: "1.8rem",
    marginBottom: "20px",
    color: "#333",
  },
  fileInput: {
    padding: "15px",
    fontSize: "16px",
    border: "2px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#fff",
    cursor: "pointer",
    width: "100%",
    maxWidth: "350px",
    display: "block",
    margin: "0 auto 20px auto",
  },
  uploadButton: {
    padding: "12px 24px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "1.2rem",
    cursor: "pointer",
    marginTop: "20px",
    transition: "background-color 0.3s ease",
  },
  uploadButtonHover: {
    backgroundColor: "#45a049",
  },
  assignmentList: {
    listStyleType: "none",
    padding: "0",
    marginTop: "30px",
  },
  assignmentItem: {
    backgroundColor: "#fff",
    padding: "15px",
    margin: "10px 0",
    borderRadius: "8px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "1.1rem",
  },
  assignmentDetails: {
    maxWidth: "60%",
    textAlign: "left",
  },
  actions: {
    display: "flex",
    gap: "10px",
  },
  viewButton: {
    color: "#4CAF50",
    textDecoration: "none",
    fontWeight: "bold",
    marginRight: "15px",
  },
  downloadButton: {
    padding: "8px 16px",
    fontSize: "1rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  shareButton: {
    padding: "8px 16px",
    fontSize: "1rem",
    backgroundColor: "#ff9900",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  footer: {
    marginTop: "20px",
    fontSize: "1rem",
    color: "#aaa",
  },
  footerLink: {
    color: "#fff",
    textDecoration: "none",
  },
};

export default AssignmentUpload;
