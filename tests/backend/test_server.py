import importlib.util
import json
import tempfile
import threading
import unittest
from pathlib import Path
from http.server import HTTPServer
from urllib.request import Request, urlopen
from urllib.error import HTTPError

spec = importlib.util.spec_from_file_location('atlas_server', Path(__file__).parents[2] / 'server.py')
server = importlib.util.module_from_spec(spec)
spec.loader.exec_module(server)


class ApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory()
        server.DB_FILE = str(Path(cls.temp.name) / 'atlas.db')
        server.DIST_DIR = str(Path(cls.temp.name) / 'dist')
        Path(server.DIST_DIR).mkdir()
        (Path(server.DIST_DIR) / 'index.html').write_text('app')
        (Path(cls.temp.name) / 'secret.txt').write_text('private')
        server.init_db()
        cls.http = HTTPServer(('127.0.0.1', 0), server.RequestHandler)
        cls.thread = threading.Thread(target=cls.http.serve_forever, daemon=True)
        cls.thread.start()
        cls.base = f'http://127.0.0.1:{cls.http.server_port}'

    @classmethod
    def tearDownClass(cls):
        cls.http.shutdown()
        cls.http.server_close()
        cls.thread.join()
        cls.temp.cleanup()

    def api(self, path, body=None, token=None):
        headers = {'Content-Type': 'application/json'}
        if token:
            headers['Authorization'] = f'Bearer {token}'
        req = Request(self.base + path, data=json.dumps(body).encode() if body is not None else None, headers=headers)
        try:
            with urlopen(req, timeout=5) as res:
                return res.status, json.loads(res.read())
        except HTTPError as err:
            with err:
                return err.code, json.loads(err.read())

    def account(self, suffix):
        status, data = self.api('/api/auth/signup', {'email': f'{suffix}@example.com', 'password': 'test-password-123'})
        self.assertEqual(status, 200)
        return data['user']['id'], data['session']['access_token']

    def test_owner_checks_roundtrip_conflict_and_history(self):
        uid, token = self.account('owner')
        other, other_token = self.account('other')
        self.assertEqual(self.api('/api/atlas/data?user_id=' + uid)[0], 401)
        self.assertEqual(self.api('/api/atlas/data?user_id=' + uid, token=other_token)[0], 403)
        payload = {'user_id': uid, 'data': {'maps': ['first']}, 'revision': 0}
        self.assertEqual(self.api('/api/atlas/sync', payload)[0], 401)
        self.assertEqual(self.api('/api/atlas/sync', payload, other_token)[0], 403)
        self.assertEqual(self.api('/api/atlas/sync', payload, token)[1]['revision'], 1)
        payload['force'] = True
        self.assertEqual(self.api('/api/atlas/sync', payload, token)[0], 409)
        payload.update(revision=1, data={'maps': ['second']})
        self.assertEqual(self.api('/api/atlas/sync', payload, token)[1]['revision'], 2)
        row = self.api('/api/atlas/data', token=token)[1]['row']
        self.assertEqual(row['data'], {'maps': ['second']})
        self.assertIn('+00:00', row['updated_at'])
        with server.get_db() as conn:
            saved = conn.execute('SELECT data FROM user_atlas_data_versions WHERE user_id = ?', (uid,)).fetchone()
            self.assertEqual(json.loads(saved['data']), {'maps': ['first']})
            self.assertEqual(conn.execute('PRAGMA foreign_keys').fetchone()[0], 1)

    def test_question_progress_response_and_isolation(self):
        uid, token = self.account('questions')
        other, other_token = self.account('q-other')
        payload = {'user_id': uid, 'question_id': 'test-1', 'selected_option': 'A', 'is_correct': True}
        self.assertEqual(self.api('/api/questions/progress', payload, token)[0], 200)
        result = self.api('/api/questions/progress', token=token)
        self.assertEqual(result[0], 200)
        self.assertEqual(result[1]['progress'][0]['question_id'], 'test-1')
        self.assertEqual(self.api('/api/questions/progress?user_id=' + uid, token=other_token)[0], 403)
        self.assertEqual(self.api('/api/questions/progress', payload, other_token)[0], 403)

    def test_session_revocation_and_no_public_quick_login(self):
        uid, token = self.account('session')
        self.assertEqual(self.api('/api/auth/session', token=token)[1]['session']['user']['id'], uid)
        self.assertEqual(self.api('/api/auth/quick-login', {})[0], 403)
        self.api('/api/auth/signout', {}, token)
        self.assertIsNone(self.api('/api/auth/session', token=token)[1]['session'])
        self.assertEqual(self.api('/api/atlas/data', token=token)[0], 401)

    def test_malformed_input_and_static_traversal(self):
        self.assertEqual(self.api('/api/auth/signup', [1, 2])[0], 400)
        self.assertEqual(self.api('/api/auth/signup', {'email': 4, 'password': []})[0], 400)
        self.assertEqual(self.api('/%2e%2e/secret.txt')[0], 403)
        self.assertEqual(self.api('/api/health')[1], {'status': 'ok', 'database': 'sqlite'})

    def test_legacy_password_upgrades_without_replacing_account(self):
        import hashlib
        with server.get_db() as conn:
            conn.execute('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', ('legacy', 'legacy@example.com', hashlib.sha256(b'old-password').hexdigest()))
        status, data = self.api('/api/auth/signin', {'email': 'legacy@example.com', 'password': 'old-password'})
        self.assertEqual(status, 200)
        self.assertEqual(data['user']['id'], 'legacy')
        with server.get_db() as conn:
            stored = conn.execute("SELECT password_hash FROM users WHERE id = 'legacy'").fetchone()[0]
        self.assertTrue(stored.startswith('pbkdf2_sha256$'))
        self.assertTrue(server.verify_password('old-password', stored))


if __name__ == '__main__':
    unittest.main()
