/**
 * Shared helpers  struktur data sudah disesuaikan dengan response asli API
 * Key penting:
 *   animeId    slug untuk navigasi
 *   episodeId  slug untuk episode
 *   title, poster, type, score, status, episodes, releasedOn
 */

const API = '';

/*  Navigasi  */
function goAnime(animeId)   { window.location.href = `/anime?slug=${animeId}`; }
function goEpisode(epId)    { window.location.href = `/episode?slug=${epId}`; }
function goBatch(animeId)   { window.location.href = `/batch-detail?slug=${animeId}`; }
function goGenre(genreId)   { window.location.href = `/genres/${genreId}`; }

/*  Navbar search  */
function initNavSearch() {
  const inp = document.getElementById('navSearch');
  if (!inp) return;
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') doNavSearch(); });
}
function doNavSearch() {
  const q = (document.getElementById('navSearch')?.value || '').trim();
  if (!q) return;
  const btn = document.querySelector('.navbar-search button');
  if (btn) {
    btn.innerHTML = `<div class="spinner" style="width:14px;height:14px;border-width:2px;margin:0 auto"></div>`;
    btn.disabled = true;
    btn.style.minWidth = '52px';
  }
  window.location.href = `/search?q=${encodeURIComponent(q)}`;
}

/*  Card templates  */
function animeCard(a) {
  const id    = a.animeId || a.slug || '';
  const score = a.score && a.score !== '0' && a.score !== '' ? a.score : null;
  return `
    <div class="anime-card" onclick="goAnime('${id}')">
      <div class="anime-card-thumb">
        <img src="${a.poster || '/img/placeholder.svg'}" alt="${a.title}" loading="lazy"
             onerror="this.src='/img/placeholder.svg'"/>
        <span class="anime-card-badge">${a.type || 'TV'}</span>
        ${score ? `<span class="anime-card-badge" style="background:rgba(0,0,0,.65);left:auto;right:6px;color:#f4a261">&#11088; ${score}</span>` : ''}
        <div class="anime-card-info">
          <div class="anime-card-title">${a.title}</div>
          <div class="anime-card-meta">${a.status || ''}</div>
        </div>
      </div>
    </div>`;
}

function recentCard(e) {
  const id = e.animeId || e.slug || '';
  const iconPlay    = `<svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor"><polygon points="2,1 11,6 2,11"/></svg>`;
  const iconClock   = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
  return `
    <div class="episode-card" onclick="goAnime('${id}')">
      <div class="episode-card-thumb">
        <img src="${e.poster || '/img/placeholder.svg'}" alt="${e.title}" loading="lazy"
             onerror="this.src='/img/placeholder.svg'"/>
      </div>
      <div class="episode-card-body">
        <div class="episode-card-title">${e.title}</div>
        <div class="episode-card-ep">${iconPlay} Episode ${e.episodes || '?'}</div>
        <div class="episode-card-meta">${iconClock} ${e.releasedOn || e.releaseDate || '-'}</div>
      </div>
    </div>`;
}

function episodeCard(e) {
  const id = e.episodeId || e.slug || '';
  return `
    <div class="episode-card" onclick="goEpisode('${id}')">
      <div class="episode-card-thumb">
        <img src="${e.poster || '/img/placeholder.svg'}" alt="${e.title}" loading="lazy"
             onerror="this.src='/img/placeholder.svg'"/>
      </div>
      <div class="episode-card-body">
        <div class="episode-card-title">${e.title}</div>
        <div class="episode-card-ep">Episode ${e.episodes || e.episode || '?'}</div>
        <div class="episode-card-meta">${e.releasedOn || e.releaseDate || ''}</div>
      </div>
    </div>`;
}

/*  Pagination  */
function renderPagination(containerId, page, hasNext, onPageChange) {
  document.getElementById(containerId).innerHTML = `
    <button class="page-btn" onclick="${onPageChange}(${page - 1})" ${page <= 1 ? 'disabled' : ''}> Prev</button>
    <span class="page-btn active">${page}</span>
    <button class="page-btn" onclick="${onPageChange}(${page + 1})" ${!hasNext ? 'disabled' : ''}>Next </button>`;

  // Update URL tanpa reload
  const url = new URL(window.location.href);
  if (page > 1) {
    url.searchParams.set('page', page);
  } else {
    url.searchParams.delete('page');
  }
  window.history.replaceState(null, '', url.toString());
}

/*  State boxes  */
function loadingHTML() {
  return '<div class="loading-overlay"><div class="spinner"></div><span>Memuat...</span></div>';
}
function emptyHTML(icon = '', msg = 'Tidak ada data') {
  return `<div class="state-box"><div class="icon">${icon}</div><h3>${msg}</h3></div>`;
}
function errorHTML(msg) {
  return `<div class="state-box"><div class="icon"></div><h3>Gagal memuat</h3><p>${msg}</p></div>`;
}








