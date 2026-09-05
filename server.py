#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Coğrafya & Tarih Atlası - Yerel SQLite Veritabanı ve API Sunucusu
Python standart kütüphanesiyle SQLite API ve statik arayüz sunucusu.
Port: 5005
Veritabanı: cografya.db
"""

import os
import sys
import json
import sqlite3
import hashlib
import secrets
import mimetypes
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs, unquote
from pathlib import Path
from datetime import datetime, timezone

PORT = int(os.environ.get("PORT", 5005))
HOST = os.environ.get("HOST", "127.0.0.1")
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.environ.get("DB_PATH", os.path.join(BASE_DIR, "cografya.db"))
DIST_DIR = os.path.join(BASE_DIR, "dist")

def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 600_000).hex()
    return f"pbkdf2_sha256$600000${salt}${digest}"

def verify_password(password, stored):
    if stored.startswith("pbkdf2_sha256$"):
        _, rounds, salt, digest = stored.split("$")
        actual = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), int(rounds)).hex()
    else:
        # Existing SQLite accounts are upgraded after a successful login.
        digest = stored
        actual = hashlib.sha256(password.encode()).hexdigest()
    return secrets.compare_digest(actual, digest)

def get_db():
    db_dir = os.path.dirname(os.path.abspath(DB_FILE))
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir, exist_ok=True)
    conn = sqlite3.connect(DB_FILE)
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA busy_timeout = 5000")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()

    # Kullanıcılar tablosu
    c.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            name TEXT DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Oturum tokenleri
    c.execute("""
        CREATE TABLE IF NOT EXISTS user_sessions (
            token TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    """)

    # Atlas ve Harita Verisi (Supabase user_atlas_data karşılığı)
    c.execute("""
        CREATE TABLE IF NOT EXISTS user_atlas_data (
            user_id TEXT PRIMARY KEY,
            data TEXT NOT NULL,
            revision INTEGER DEFAULT 1,
            updated_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    """)

    # Soru Çözüm İlerlemesi (soru havuzu için)
    c.execute("""
        CREATE TABLE IF NOT EXISTS question_progress (
            user_id TEXT NOT NULL,
            question_id TEXT NOT NULL,
            selected_option TEXT,
            is_correct INTEGER DEFAULT 0,
            answered_at TEXT NOT NULL,
            PRIMARY KEY (user_id, question_id)
        )
    """)

    c.execute("""CREATE TABLE IF NOT EXISTS user_atlas_data_versions (
        user_id TEXT NOT NULL, revision INTEGER NOT NULL, data TEXT NOT NULL,
        updated_at TEXT NOT NULL, PRIMARY KEY(user_id, revision),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )""")

    conn.commit()
    conn.close()

class RequestHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def send_json(self, status_code, payload):
        self.send_response(status_code)
        self._send_cors_headers()
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(json.dumps(payload, ensure_ascii=False).encode("utf-8"))

    def read_json_body(self):
        length = int(self.headers.get("Content-Length", 0))
        if length < 0 or length > 20 * 1024 * 1024:
            raise ValueError("İstek boyutu geçersiz (en fazla 20 MB).")
        body = json.loads(self.rfile.read(length).decode("utf-8")) if length else {}
        if not isinstance(body, dict):
            raise ValueError("JSON nesnesi bekleniyor.")
        return body

    def require_owner(self, requested_id):
        user = self.get_user_from_token()
        if not user:
            self.send_json(401, {"error": "Oturum açman gerekiyor."})
            return None
        if requested_id and requested_id != user["id"]:
            self.send_json(403, {"error": "Bu kayda erişim iznin yok."})
            return None
        return user["id"]

    def get_user_from_token(self):
        auth_header = self.headers.get("Authorization", "")
        token = ""
        if auth_header.startswith("Bearer "):
            token = auth_header[7:].strip()
        
        if not token:
            return None
        
        conn = get_db()
        c = conn.cursor()
        c.execute("""
            SELECT u.id, u.email, u.name 
            FROM user_sessions s
            JOIN users u ON s.user_id = u.id
            WHERE s.token = ? AND s.created_at > datetime('now', '-30 days')
        """, (token,))
        row = c.fetchone()
        conn.close()
        if row:
            return dict(row)
        return None

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/")
        query = parse_qs(parsed.query)

        # Sağlık kontrolü
        if path == "/api/health":
            try:
                with get_db() as conn:
                    conn.execute("SELECT 1 FROM users LIMIT 1").fetchone()
                self.send_json(200, {"status": "ok", "database": "sqlite"})
            except sqlite3.Error:
                self.send_json(503, {"error": "Veritabanına erişilemiyor."})
            return

        # Oturum kontrolü
        if path == "/api/auth/session":
            user = self.get_user_from_token()
            if user:
                self.send_json(200, {
                    "session": {
                        "user": {
                            "id": user["id"],
                            "email": user["email"],
                            "user_metadata": {"name": user["name"]}
                        }
                    }
                })
            else:
                self.send_json(200, {"session": None})
            return

        # Atlas verisini getir
        if path == "/api/atlas/data":
            user_id = self.require_owner(query.get("user_id", [None])[0])
            if not user_id:
                return

            conn = get_db()
            c = conn.cursor()
            c.execute("SELECT data, revision, updated_at FROM user_atlas_data WHERE user_id = ?", (user_id,))
            row = c.fetchone()
            conn.close()

            if not row:
                self.send_json(200, {"row": None})
                return

            try:
                data_obj = json.loads(row["data"])
            except Exception:
                data_obj = row["data"]

            self.send_json(200, {
                "row": {
                    "data": data_obj,
                    "revision": row["revision"],
                    "updated_at": row["updated_at"]
                }
            })
            return

        # Soru havuzu çözülen soruları getir
        if path == "/api/questions/progress":
            user_id = self.require_owner(query.get("user_id", [None])[0])
            if not user_id:
                return

            conn = get_db()
            c = conn.cursor()
            c.execute("""
                SELECT question_id, selected_option, is_correct, answered_at 
                FROM question_progress 
                WHERE user_id = ?
            """, (user_id,))
            rows = c.fetchall()
            conn.close()

            result = [
                {
                    "question_id": r["question_id"],
                    "selected_option": r["selected_option"],
                    "is_correct": bool(r["is_correct"]),
                    "answered_at": r["answered_at"]
                }
                for r in rows
            ]
            self.send_json(200, {"progress": result})
            return

        # /api ile başlamayan tüm GET isteklerinde dist/ klasöründeki frontend'i sun
        if not path.startswith("/api"):
            if os.path.isdir(DIST_DIR):
                req_file = parsed.path.lstrip("/")
                target = str((Path(DIST_DIR) / unquote(req_file)).resolve())
                if not Path(target).is_relative_to(Path(DIST_DIR).resolve()):
                    self.send_json(403, {"error": "Geçersiz dosya yolu."})
                    return
                if req_file and os.path.isfile(target):
                    mime, _ = mimetypes.guess_type(target)
                    self.send_response(200)
                    self._send_cors_headers()
                    self.send_header("Content-Type", mime or "application/octet-stream")
                    self.end_headers()
                    with open(target, "rb") as f:
                        self.wfile.write(f.read())
                    return

                # SPA fallback: index.html sun
                index_html = os.path.join(DIST_DIR, "index.html")
                if os.path.isfile(index_html):
                    self.send_response(200)
                    self._send_cors_headers()
                    self.send_header("Content-Type", "text/html; charset=utf-8")
                    self.end_headers()
                    with open(index_html, "rb") as f:
                        self.wfile.write(f.read())
                    return

        self.send_json(404, {"error": "Endpoint bulunamadı"})

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/")
        try:
            body = self.read_json_body()
        except (ValueError, UnicodeError):
            self.send_json(400, {"error": "Geçerli bir JSON nesnesi gönder (en fazla 20 MB)."})
            return
        if path.startswith("/api/auth/"):
            for key in ("email", "password", "name"):
                if key in body and not isinstance(body[key], str):
                    self.send_json(400, {"error": {"message": "Giriş bilgileri metin olmalı."}})
                    return

        # Giriş yap
        if path == "/api/auth/signin":
            email = body.get("email", "").strip().lower()
            password = body.get("password", "")

            conn = get_db()
            c = conn.cursor()
            c.execute("SELECT id, email, password_hash, name FROM users WHERE lower(email) = ?", (email,))
            user = c.fetchone()

            if not user or not verify_password(password, user["password_hash"]):
                conn.close()
                self.send_json(400, {
                    "error": {
                        "code": "invalid_credentials",
                        "message": "E-posta adresi veya şifre hatalı."
                    }
                })
                return

            if not user["password_hash"].startswith("pbkdf2_sha256$"):
                c.execute("UPDATE users SET password_hash = ? WHERE id = ?", (hash_password(password), user["id"]))
            # Yeni token üret ve kaydet
            token = secrets.token_hex(24)
            c.execute("INSERT INTO user_sessions (token, user_id) VALUES (?, ?)", (token, user["id"]))
            conn.commit()
            conn.close()

            self.send_json(200, {
                "user": {
                    "id": user["id"],
                    "email": user["email"],
                    "user_metadata": {"name": user["name"]}
                },
                "session": {
                    "access_token": token,
                    "user": {
                        "id": user["id"],
                        "email": user["email"],
                        "user_metadata": {"name": user["name"]}
                    }
                }
            })
            return

        # Hızlı Giriş (Mehmet Kerem hesabı)
        if path == "/api/auth/quick-login":
            self.send_json(403, {"error": {"message": "Hesabına e-posta ve şifrenle giriş yap."}})
            return

        # Kayıt ol
        if path == "/api/auth/signup":
            email = body.get("email", "").strip().lower()
            password = body.get("password", "")
            name = body.get("name", "").strip() or email.split("@")[0]

            if "@" not in email or len(password) < 8 or len(password) > 1024:
                self.send_json(400, {
                    "error": {
                        "code": "weak_password",
                        "message": "Geçerli bir e-posta ve en az 8 karakterli şifre giriniz."
                    }
                })
                return

            conn = get_db()
            c = conn.cursor()
            c.execute("SELECT id FROM users WHERE lower(email) = ?", (email,))
            if c.fetchone():
                conn.close()
                self.send_json(400, {
                    "error": {
                        "code": "user_already_exists",
                        "message": "Bu e-posta adresiyle zaten bir hesap bulunuyor."
                    }
                })
                return

            new_id = f"user_{secrets.token_hex(8)}"
            c.execute("""
                INSERT INTO users (id, email, password_hash, name)
                VALUES (?, ?, ?, ?)
            """, (new_id, email, hash_password(password), name))

            token = secrets.token_hex(24)
            c.execute("INSERT INTO user_sessions (token, user_id) VALUES (?, ?)", (token, new_id))
            conn.commit()
            conn.close()

            self.send_json(200, {
                "user": {
                    "id": new_id,
                    "email": email,
                    "user_metadata": {"name": name}
                },
                "session": {
                    "access_token": token,
                    "user": {
                        "id": new_id,
                        "email": email,
                        "user_metadata": {"name": name}
                    }
                }
            })
            return

        # Çıkış yap
        if path == "/api/auth/signout":
            auth_header = self.headers.get("Authorization", "")
            token = ""
            if auth_header.startswith("Bearer "):
                token = auth_header[7:].strip()

            if token:
                conn = get_db()
                c = conn.cursor()
                c.execute("DELETE FROM user_sessions WHERE token = ?", (token,))
                conn.commit()
                conn.close()

            self.send_json(200, {"success": True})
            return

        # Atlas Verisini Kaydet / Eşitle
        if path == "/api/atlas/sync":
            user_id = self.require_owner(body.get("user_id"))
            if not user_id:
                return
            data = body.get("data")
            expected_revision = body.get("revision")

            if not isinstance(data, dict) or type(expected_revision) is not int or expected_revision < 0:
                self.send_json(400, {"error": "data nesnesi ve revision zorunludur."})
                return

            now = datetime.now(timezone.utc).isoformat()
            data_str = json.dumps(data, ensure_ascii=False) if isinstance(data, (dict, list)) else str(data)

            conn = get_db()
            c = conn.cursor()
            c.execute("BEGIN IMMEDIATE")
            c.execute("SELECT revision FROM user_atlas_data WHERE user_id = ?", (user_id,))
            row = c.fetchone()

            if not row and expected_revision != 0:
                conn.close()
                self.send_json(409, {"error": "CLOUD_SAVE_CONFLICT", "current_revision": 0})
                return

            if not row:
                # İlk defa oluşturuluyor
                new_rev = 1
                c.execute("""
                    INSERT INTO user_atlas_data (user_id, data, revision, updated_at)
                    VALUES (?, ?, ?, ?)
                """, (user_id, data_str, new_rev, now))
                conn.commit()
                conn.close()
                self.send_json(200, {
                    "revision": new_rev,
                    "updated_at": now
                })
                return

            current_rev = row["revision"]

            # Çakışma kontrolü (Optimistic Concurrency Control)
            if expected_revision != current_rev:
                conn.close()
                self.send_json(409, {
                    "error": "CLOUD_SAVE_CONFLICT",
                    "current_revision": current_rev
                })
                return

            c.execute("""INSERT OR IGNORE INTO user_atlas_data_versions
                (user_id, revision, data, updated_at)
                SELECT user_id, revision, data, updated_at FROM user_atlas_data WHERE user_id = ?""", (user_id,))
            new_rev = current_rev + 1
            c.execute("""
                UPDATE user_atlas_data
                SET data = ?, revision = ?, updated_at = ?
                WHERE user_id = ?
            """, (data_str, new_rev, now, user_id))
            conn.commit()
            conn.close()

            self.send_json(200, {
                "revision": new_rev,
                "updated_at": now
            })
            return

        # Soru İlerlemesi Kaydet (tek veya toplu)
        if path == "/api/questions/progress":
            user_id = self.require_owner(body.get("user_id"))
            if not user_id:
                return
            question_id = body.get("question_id")
            selected_option = body.get("selected_option")
            is_correct = 1 if body.get("is_correct") else 0
            now = datetime.now(timezone.utc).isoformat()

            if not isinstance(question_id, str) or not question_id or selected_option not in ("A", "B", "C", "D", "E") or type(body.get("is_correct")) is not bool:
                self.send_json(400, {"error": "user_id ve question_id zorunludur."})
                return

            conn = get_db()
            c = conn.cursor()
            c.execute("""
                INSERT INTO question_progress (user_id, question_id, selected_option, is_correct, answered_at)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(user_id, question_id) DO UPDATE SET
                    selected_option = excluded.selected_option,
                    is_correct = excluded.is_correct,
                    answered_at = excluded.answered_at
            """, (user_id, question_id, selected_option, is_correct, now))
            conn.commit()
            conn.close()

            self.send_json(200, {"success": True, "saved_at": now})
            return

        self.send_json(404, {"error": "Endpoint bulunamadı"})

def run_server():
    init_db()
    server_address = (HOST, PORT)
    httpd = HTTPServer(server_address, RequestHandler)
    print(f"==================================================")
    print(f"🌍 Coğrafya & Tarih Atlası SQLite API Sunucusu")
    print(f"🚀 Adres: http://127.0.0.1:{PORT}")
    print(f"💾 Veritabanı: {DB_FILE}")
    print(f"==================================================")
    sys.stdout.flush()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nSunucu kapatılıyor...")
        httpd.server_close()

if __name__ == "__main__":
    if len(sys.argv) == 3 and sys.argv[1] == "--set-password":
        import getpass
        email = sys.argv[2].strip().lower()
        password = getpass.getpass("Yeni şifre (en az 8 karakter): ")
        if len(password) < 8 or len(password) > 1024:
            raise SystemExit("Şifre 8–1024 karakter olmalı.")
        if password != getpass.getpass("Yeni şifre tekrar: "):
            raise SystemExit("Şifreler eşleşmiyor.")
        init_db()
        with get_db() as conn:
            user = conn.execute("SELECT id FROM users WHERE lower(email) = ?", (email,)).fetchone()
            if not user:
                raise SystemExit("Hesap bulunamadı.")
            conn.execute("UPDATE users SET password_hash = ? WHERE id = ?", (hash_password(password), user["id"]))
            conn.execute("DELETE FROM user_sessions WHERE user_id = ?", (user["id"],))
        print("Şifre güncellendi; eski oturumlar kapatıldı.")
    else:
        run_server()
