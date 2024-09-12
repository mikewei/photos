document.addEventListener('DOMContentLoaded', function() {
    fetch('/assets/data/album.json')
        .then(response => response.json())
        .then(data => {
            console.log('Album data loaded:', data); // 添加这行
            displayTopics(data);
            displayAllPhotos(data);
        })
        .catch(error => {
            console.error('Error loading album data:', error);
        });
});

function displayTopics(data) {
    const topicsContainer = document.getElementById('topics');
    // 添加"全部"选项
    const allTopic = document.createElement('a');
    allTopic.className = 'topic active';
    allTopic.textContent = '全部';
    allTopic.href = '#';
    allTopic.addEventListener('click', (e) => {
        e.preventDefault();
        displayAllPhotos(data);
        setActiveTopicLink(allTopic);
    });
    topicsContainer.appendChild(allTopic);

    data.forEach(album => {
        const topicLink = document.createElement('a');
        topicLink.className = 'topic';
        topicLink.textContent = album.topicMetadata.topicName;
        topicLink.href = '#';
        topicLink.addEventListener('click', (e) => {
            e.preventDefault();
            displayPhotos(album.photoMetadata);
            setActiveTopicLink(topicLink);
        });
        topicsContainer.appendChild(topicLink);
    });
}

function displayAllPhotos(data) {
    const photosContainer = document.getElementById('photos');
    photosContainer.innerHTML = '';

    const allPhotos = data.flatMap(album => album.photoMetadata);
    allPhotos.forEach(photo => {
        const photoElement = createPhotoElement(photo);
        photosContainer.appendChild(photoElement);
    });

    lazyLoadImages();
}

function displayPhotos(photos) {
    const photosContainer = document.getElementById('photos');
    photosContainer.innerHTML = '';

    photos.forEach(photo => {
        const photoElement = createPhotoElement(photo);
        photosContainer.appendChild(photoElement);
    });

    lazyLoadImages();
}

function createPhotoElement(photo) {
    const photoElement = document.createElement('div');
    photoElement.className = 'photo';

    const img = document.createElement('img');
    if (photo.cloudUrl) {
        img.dataset.src = `${photo.cloudUrl}?imageView2/2/w/500`; // 使用 data-src 而不是 src
    } else {
        console.error('Photo missing cloudUrl:', photo);
        img.dataset.src = '/assets/image/placeholder.jpg'; // 使用占位图
    }
    img.alt = photo.description || photo.FileName || '照片';
    img.loading = 'lazy';

    photoElement.appendChild(img);
    photoElement.addEventListener('click', () => openLightbox(photo));
    return photoElement;
}

function lazyLoadImages() {
    const images = document.querySelectorAll('.photo img');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => observer.observe(img));
}

function setActiveTopicLink(activeLink) {
    document.querySelectorAll('.topic').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

function openLightbox(photo) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    lightboxImg.src = photo.cloudUrl; // 使用原图 URL

    // 解析快门速度
    function parseShutterSpeed(shutterSpeedValue) {
        if (shutterSpeedValue === undefined) return '未知';
        const speed = Math.pow(2, -shutterSpeedValue);
        return speed >= 1 ? Math.round(speed) + 's' : '1/' + Math.round(1 / speed) + 's';
    }

    // 格式化焦距
    function formatFocalLength(focalLength) {
        return focalLength ? focalLength + 'mm' : '未知';
    }

    lightboxCaption.innerHTML = `
        <p class="photo-description">${photo.description || ''}</p>
        <div class="photo-info">
            📍${photo.location || '未知'}
            ${photo.DateTimeOriginal || '未知'}
            📸 ${photo.Model || '未知'}
            ${formatFocalLength(photo.FocalLengthIn35mmFilm)}
            f/${photo.FNumber || '未知'}
            ${parseShutterSpeed(photo.ShutterSpeedValue)}
            ISO${photo.ISOSpeedRatings || '未知'}
        </div>
    `;

    lightbox.style.display = 'block';
}

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('lightbox').style.display = 'none';
});
