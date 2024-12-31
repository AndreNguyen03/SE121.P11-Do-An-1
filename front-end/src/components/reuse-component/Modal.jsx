import React from "react";

const Modal = ({ isOpen, onClose, title, time, fault, status, onMint,onLose }) => {
  
  if (!isOpen) return null; // Không hiển thị modal nếu isOpen là false.

  const handleClose = () => {
    if (status !== "Bạn đã thắng!" && onLose) {
      onLose(); // Gọi callback khi người chơi thua
    }
    onClose(); // Đóng modal
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.content}>
        <button
          style={styles.closeButton}
          onClick={handleClose}
          onMouseOver={(e) => (e.target.style.color = "red")}
          onMouseOut={(e) => (e.target.style.color = "black")}
        >
          &times;
        </button>
        {title && <h2 style={styles.title}>{title}</h2>}
        <div style={styles.body}>
          <p>{status}</p> {/* Hiển thị trạng thái */}
        </div>
        <div style={styles.body}>Thời gian đã chơi: {time}s</div>
        <div style={styles.body}>Số lỗi: {fault}</div>

        {/* Nút Mint chỉ hiển thị nếu trạng thái là "Bạn đã thắng" */}
        {status === "Bạn đã thắng!" && (
          <button
            onClick={onMint}
            style={styles.mintButton}
          >
            Mint
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  content: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "500px",
    width: "100%",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    border: "none",
    background: "none",
    fontSize: "20px",
    cursor: "pointer",
  },
  title: {
    marginTop: 0,
    marginBottom: "20px",
    fontSize: "24px",
    textAlign: "center",
  },
  body: {
    fontSize: "16px",
  },
  mintButton: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Modal;
