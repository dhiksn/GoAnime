const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ─── WATCH HISTORY ────────────────────────────────────────────────────────────

// GET /api/user/history
exports.getHistory = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_watch_history')
      .select('*')
      .eq('user_id', req.user.id)
      .order('last_watched', { ascending: false });

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (err) {
    console.error('getHistory error:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil riwayat' });
  }
};

// GET /api/user/history/:slug  — ambil satu item (untuk resume)
exports.getHistoryBySlug = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_watch_history')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('video_slug', req.params.slug)
      .maybeSingle();

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (err) {
    console.error('getHistoryBySlug error:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil riwayat' });
  }
};

// POST /api/user/history  — upsert satu item
exports.upsertHistory = async (req, res) => {
  const { video_slug, video_title, video_cover_url, watch_progress, last_position, last_server_id } = req.body;

  if (!video_slug)
    return res.status(400).json({ success: false, message: 'video_slug wajib diisi' });

  try {
    // Ambil data lama agar tidak overwrite field yang tidak dikirim
    const { data: existing } = await supabase
      .from('user_watch_history')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('video_slug', video_slug)
      .maybeSingle();

    const payload = {
      user_id:        req.user.id,
      video_slug,
      video_title:     video_title     || existing?.video_title     || null,
      video_cover_url: video_cover_url || existing?.video_cover_url || null,
      watch_progress:  watch_progress  ?? existing?.watch_progress  ?? 0,
      last_position:   last_position   ?? existing?.last_position   ?? 0,
      last_server_id:  last_server_id  || existing?.last_server_id  || null,
      last_watched:    new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('user_watch_history')
      .upsert(payload, { onConflict: 'user_id,video_slug' })
      .select()
      .single();

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (err) {
    console.error('upsertHistory error:', err);
    return res.status(500).json({ success: false, message: 'Gagal menyimpan riwayat' });
  }
};

// DELETE /api/user/history/:slug
exports.deleteHistory = async (req, res) => {
  try {
    const { error } = await supabase
      .from('user_watch_history')
      .delete()
      .eq('user_id', req.user.id)
      .eq('video_slug', req.params.slug);

    if (error) throw error;
    return res.json({ success: true });
  } catch (err) {
    console.error('deleteHistory error:', err);
    return res.status(500).json({ success: false, message: 'Gagal menghapus riwayat' });
  }
};

// DELETE /api/user/history  — hapus semua
exports.clearHistory = async (req, res) => {
  try {
    const { error } = await supabase
      .from('user_watch_history')
      .delete()
      .eq('user_id', req.user.id);

    if (error) throw error;
    return res.json({ success: true });
  } catch (err) {
    console.error('clearHistory error:', err);
    return res.status(500).json({ success: false, message: 'Gagal menghapus riwayat' });
  }
};

// ─── FAVORITES ────────────────────────────────────────────────────────────────

// GET /api/user/favorites
exports.getFavorites = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (err) {
    console.error('getFavorites error:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil favorit' });
  }
};

// POST /api/user/favorites  — tambah favorit
exports.addFavorite = async (req, res) => {
  const { video_slug, video_title, video_cover_url } = req.body;

  if (!video_slug)
    return res.status(400).json({ success: false, message: 'video_slug wajib diisi' });

  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .upsert(
        {
          user_id: req.user.id,
          video_slug,
          video_title:     video_title     || null,
          video_cover_url: video_cover_url || null,
        },
        { onConflict: 'user_id,video_slug' }
      )
      .select()
      .single();

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (err) {
    console.error('addFavorite error:', err);
    return res.status(500).json({ success: false, message: 'Gagal menambah favorit' });
  }
};

// DELETE /api/user/favorites/:slug
exports.deleteFavorite = async (req, res) => {
  try {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', req.user.id)
      .eq('video_slug', req.params.slug);

    if (error) throw error;
    return res.json({ success: true });
  } catch (err) {
    console.error('deleteFavorite error:', err);
    return res.status(500).json({ success: false, message: 'Gagal menghapus favorit' });
  }
};

// DELETE /api/user/favorites  — hapus semua
exports.clearFavorites = async (req, res) => {
  try {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', req.user.id);

    if (error) throw error;
    return res.json({ success: true });
  } catch (err) {
    console.error('clearFavorites error:', err);
    return res.status(500).json({ success: false, message: 'Gagal menghapus favorit' });
  }
};

// GET /api/user/favorites/check/:slug  — cek apakah sudah difavoritkan
exports.checkFavorite = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('video_slug', req.params.slug)
      .maybeSingle();

    if (error) throw error;
    return res.json({ success: true, isFavorite: !!data });
  } catch (err) {
    console.error('checkFavorite error:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengecek favorit' });
  }
};
