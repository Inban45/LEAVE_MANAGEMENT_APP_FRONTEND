// src/components/common/NotificationBell.js
import React, { useState } from "react";
import { useNotifications } from "../../context/NotificationContext";

const NotificationBell = () => {
  const { notifications, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div style={{ position: "relative", cursor: "pointer" }}>
      <span onClick={() => setOpen(!open)}>
        🔔 {unreadCount > 0 && <span>({unreadCount})</span>}
      </span>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "25px",
            right: 0,
            width: "250px",
            maxHeight: "300px",
            overflowY: "auto",
            background: "white",
            border: "1px solid #ccc",
            padding: "10px",
            zIndex: 100,
          }}
        >
          {notifications.length === 0 && <p>No notifications</p>}
          {notifications.map((n) => (
            <div
              key={n.id}
              style={{
                marginBottom: "10px",
                padding: "5px",
                background: n.read ? "#f1f1f1" : "#e1f5fe",
                cursor: "pointer",
              }}
              onClick={() => markAsRead(n.id)}
            >
              <strong>{n.type}</strong>: {n.message}
              <br />
              <small>{new Date(n.createdAt).toLocaleString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
