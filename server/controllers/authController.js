const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY  // service role key — bypass RLS
);

const JWT_SECRET  = process.env.JWT_SECRET || 'miruapp1';
const JWT_EXPIRES = '30d';

function makeToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

// POST /api/auth/register
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ success: false, message: 'Semua field wajib diisi' });

  if (!/^[a-zA-Z0-9_]+$/.test(username))
    return res.status(400).json({ success: false, message: 'Username hanya huruf, angka, dan underscore' });

  if (password.length < 6)
    return res.status(400).json({ success: false, message: 'Password minimal 6 karakter' });

  try {
    // Cek username/email sudah ada
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .or(`username.eq.${username},email.eq.${email}`)
      .maybeSingle();

    if (existing)
      return res.status(409).json({ success: false, message: 'Username atau email sudah digunakan' });

    const password_hash = await bcrypt.hash(password, 12);

    const { data: user, error } = await supabase
      .from('users')
      .insert({ username, email, password_hash })
      .select('id, username, email, role, created_at')
      .single();

    if (error) throw error;

    const token = makeToken(user);
    return res.status(201).json({ success: true, token, user });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email dan password wajib diisi' });

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, email, password_hash, role, is_active')
      .eq('email', email)
      .maybeSingle();

    if (error || !user)
      return res.status(401).json({ success: false, message: 'Email atau password salah' });

    // Hanya blokir jika is_active secara eksplisit false (bukan null/undefined)
    if (user.is_active === false)
      return res.status(403).json({ success: false, message: 'Akun tidak aktif' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(401).json({ success: false, message: 'Email atau password salah' });

    const { password_hash, ...safeUser } = user;
    const token = makeToken(safeUser);
    return res.json({ success: true, token, user: safeUser });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};

// POST /api/auth/logout
exports.logout = async (req, res) => {
  // Stateless JWT — client hapus token sendiri
  return res.json({ success: true, message: 'Logout berhasil' });
};

// GET /api/auth/me  (optional — verify token)
exports.me = async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer '))
    return res.status(401).json({ success: false, message: 'Unauthorized' });

  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET);
    const { data: user } = await supabase
      .from('users')
      .select('id, username, email, role')
      .eq('id', payload.id)
      .single();

    return res.json({ success: true, user });
  } catch {
    return res.status(401).json({ success: false, message: 'Token tidak valid' });
  }
};
