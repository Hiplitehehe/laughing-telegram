export default {
  async fetch(request) {
    return new Response(
      `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cloudflare Worker Auth</title>
</head>
<body>
    <h1>Cloudflare Worker Authentication</h1>

    <div id="auth-section">
        <h2>Login / Register</h2>
        <input type="text" id="username" placeholder="Enter username">
        <input type="password" id="password" placeholder="Enter password">
        <button onclick="register()">Register</button>
        <button onclick="login()">Login</button>
    </div>

    <div id="note-section" style="display:none;">
        <h2>Create a Note</h2>
        <input type="text" id="note-title" placeholder="Note Title">
        <textarea id="note-content" placeholder="Write your note here..."></textarea>
        <button onclick="makeNote()">Submit Note</button>

        <h2>Approved Notes</h2>
        <div id="notes-list"></div>
    </div>

    <script>
        const API_BASE = "https://autumn-sky-4229.hiplitehehe.workers.dev";

        async function register() {
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            if (!username || !password) return alert("Please enter username and password.");

            const response = await fetch(\`\${API_BASE}/register\`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
                credentials: "include"
            });

            const result = await response.json();
            alert(result.message || "Registered!");
        }

        async function login() {
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            if (!username || !password) return alert("Please enter username and password.");

            const response = await fetch(\`\${API_BASE}/login\`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
                credentials: "include"
            });

            const result = await response.json();
            if (result.message === "Login successful") {
                localStorage.setItem("username", username);
                document.getElementById("auth-section").style.display = "none";
                document.getElementById("note-section").style.display = "block";
                loadNotes();
            } else {
                alert(result.message || "Login failed!");
            }
        }

        async function makeNote() {
            const title = document.getElementById("note-title").value;
            const content = document.getElementById("note-content").value;
            const username = localStorage.getItem("username");
            if (!title || !content) return alert("Please enter title and content.");

            const response = await fetch(\`\${API_BASE}/make-note\`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, title, content }),
                credentials: "include"
            });

            const result = await response.json();
            alert(result.message || "Note submitted!");
            loadNotes();
        }

        async function loadNotes() {
            const response = await fetch(\`\${API_BASE}/notes\`, {
                credentials: "include"
            });
            const notes = await response.json();
            const notesList = document.getElementById("notes-list");
            notesList.innerHTML = notes.map(note => \`<div><h3>\${note.title}</h3><p>\${note.content}</p></div>\`).join("");
        }

        if (localStorage.getItem("username")) {
            document.getElementById("auth-section").style.display = "none";
            document.getElementById("note-section").style.display = "block";
            loadNotes();
        }
    </script>
</body>
</html>`,
      {
        headers: { "Content-Type": "text/html" }
      }
    );
  }
};
