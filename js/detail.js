import { supabase, escapeHTML, won } from './common.js';

const message = document.querySelector('#detail-message');
const detail = document.querySelector('#artwork-detail');
const imageContainer = document.querySelector('#detail-image');
const params = new URLSearchParams(location.search);
const id = params.get('id');

function showError(text) {
    message.textContent = text;
}

async function loadArtwork() {
    if (!id || !/^[1-9]\d*$/.test(id)) {
        showError('올바르지 않은 작품 주소입니다.');
        return;
    }

    const { data: artwork, error } = await supabase
        .from('artworks')
        .select('id, title, artist, description, price, rental_price, image_url, category')
        .eq('id', id)
        .maybeSingle();

    if (error) {
        console.error('작품 상세 조회 오류:', error);
        showError('작품을 불러오지 못했습니다: ' + error.message);
        return;
    }

    if (!artwork) {
        showError('해당 작품을 찾을 수 없습니다.');
        return;
    }

    if (artwork.image_url) {
        imageContainer.innerHTML = `
            <img class="detail-image" src="${escapeHTML(artwork.image_url)}"
                alt="${escapeHTML(artwork.title)}">
        `;
    } else {
        imageContainer.innerHTML = '<div class="no-image detail-image">ART WORKS</div>';
    }

    document.querySelector('#detail-category').textContent = artwork.category || '';
    document.querySelector('#detail-title').textContent = artwork.title || '';
    document.querySelector('#detail-artist').textContent = artwork.artist || '';
    document.querySelector('#detail-description').textContent = artwork.description || '';
    document.querySelector('#detail-price').textContent = won(artwork.price);
    document.querySelector('#detail-rental-price').textContent = won(artwork.rental_price);

    message.hidden = true;
    detail.hidden = false;
}

loadArtwork();
