// Local demo store
console.log("start")
const storage = typeof localStorage !== 'undefined'
  ? localStorage
  : { getItem: () => null, setItem: () => {}, removeItem: () => {} };
let notes = JSON.parse(storage.getItem('notes_v2') || '[]');
let editIndex = null;

function render() {
  const list = document.getElementById('list');
  const empty = document.getElementById('empty');
  list.innerHTML = '';
  if (!notes.length) { empty.style.display = 'block'; return; }
  empty.style.display = 'none';

  notes.forEach((n, i) => {
    const attachmentHtml = n.attachment
      ? `<div class="attachment"><p onclick="openAttachment(${i}); return false;">📎<b> ${escapeHtml(n.attachment.name)} </b></p></div>`
      : '';

    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `
      <div>
        <h3 max:5>${escapeHtml(n.title)}</h3>
        <p>${escapeHtml(n.content || '')}</p>
        ${attachmentHtml}
      </div>
      <div class="actions">
        <span title="View" onclick="openDetail(${i})">👁️</span>
        <span title="Edit" onclick="openModal(${i})">✏️</span>
        <span title="Delete" onclick="removeNote(${i})">🗑️</span>
      </div>`;
    list.appendChild(el);
  });
}

function openModal(i = null) {
  editIndex = i;
  const m = document.getElementById('modal');
  m.classList.add('show');
  document.getElementById('modalTitle').innerText = i === null ? 'New Note' : 'Edit Note';
  document.getElementById('title').value = i === null ? '' : notes[i].title;
  document.getElementById('content').value = i === null ? '' : notes[i].content;
}
function closeModal() { document.getElementById('modal').classList.remove('show'); }

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function saveNote() {
  const t = document.getElementById('title').value.trim();
  const c = document.getElementById('content').value.trim();
  const fileInput = document.getElementById('doc');
  const file = fileInput.files[0];
  if (!t) return alert('Title required');

  let attachment = null;
  if (file) {
    const dataUrl = await readFileAsDataURL(file);
    attachment = { name: file.name, type: file.type, data: dataUrl };
  }

  if (editIndex === null) {
    const note = {
      title: t,
      content: c,
      created: new Date().toISOString(),
    };
    if (attachment) note.attachment = attachment;
    notes.unshift(note);
  } else {
    const existing = notes[editIndex] || {};
    const note = {
      ...existing,
      title: t,
      content: c,
      created: existing.created || new Date().toISOString(),
    };
    if (attachment) note.attachment = attachment;
    notes[editIndex] = note;
  }

  persist();
  fileInput.value = '';
  closeModal();
  render();
}

function openDetail(i) {
  editIndex = i;
  const note = notes[i];
  if (!note) return;

  document.getElementById('detailTitle').innerText = note.title || 'Note Details';
  document.getElementById('detailDate').innerText = `Created on: ${formatDate(note.created || new Date().toISOString())}`;
  document.getElementById('detailBody').innerHTML = renderDetailBody(note.content || 'No additional details.', note.attachment, i);
  document.getElementById('detailModal').classList.add('show');
}

function closeDetail() { document.getElementById('detailModal').classList.remove('show'); }

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

function renderDetailBody(content, attachment, index) {
  const lines = content.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const contentHtml = !lines.length
    ? '<p>No details available.</p>'
    : (() => {
      const listLines = lines.filter(line => /^[-*•]\s+/.test(line));
      if (listLines.length === lines.length) {
        return `<ul>${listLines.map(line => `<li>${escapeHtml(line.replace(/^[-*•]\s+/, ''))}</li>`).join('')}</ul>`;
      }
      return lines.map(line => `<p>${escapeHtml(line)}</p>`).join('');
    })();

  const attachmentHtml = attachment
    ? `<div class="detail-attachment">📎 Attached file: <a href="#" onclick="openAttachment(${index}); return false;" style="textDecoration : none;">${escapeHtml(attachment.name)}</a></div>`
    : '';

  return `${contentHtml}${attachmentHtml}`;
}

function openAttachment(i) {
  const note = notes[i];
  if (!note || !note.attachment || !note.attachment.data) {
    return alert('No attached file available.');
  }

  const blob = getAttachmentBlob(note.attachment);
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 15000);
}

function getAttachmentBlob(attachment) {
  const dataUrl = attachment.data;
  const [, base64Data] = dataUrl.split(',');
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type: attachment.type || 'application/octet-stream' });
}

function removeNote(i) { if (!confirm('Delete this note?')) return; notes.splice(i, 1); persist(); render(); }

function persist() { storage.setItem('notes_v2', JSON.stringify(notes)); }

function escapeHtml(s) { return s.replace(/[&<>\"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;' }[m])); }

// init
if (typeof document !== 'undefined' && document.getElementById) {
  render();
}