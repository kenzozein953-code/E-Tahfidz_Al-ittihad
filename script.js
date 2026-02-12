document.addEventListener('DOMContentLoaded', () => {
    const tahfidzForm = document.getElementById('tahfidzForm');
    const aiFeedback = document.getElementById('aiFeedback');
    const submitBtn = document.getElementById('submitBtn');

    tahfidzForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nama = document.getElementById('namaSantri').value;
        const surah = document.getElementById('surah').value;
        const fotoFile = document.getElementById('buktiFoto').files[0];

        submitBtn.disabled = true;
        aiFeedback.innerHTML = "Memproses data... ⏳";

        try {
            let fotoURL = null;
            if (fotoFile) {
                const fileRef = window.fbUtils.ref(window.storage, `bukti/${Date.now()}_${fotoFile.name}`);
                const uploadSnap = await window.fbUtils.uploadBytes(fileRef, fotoFile);
                fotoURL = await window.fbUtils.getDownloadURL(uploadSnap.ref);
            }

            await window.fbUtils.addDoc(window.fbUtils.collection(window.db, "setoran_hafalan"), {
                nama_santri: nama,
                surah_ayat: surah,
                foto_bukti: fotoURL,
                waktu_input: window.fbUtils.serverTimestamp()
            });

            aiFeedback.innerHTML = `Sukses simpan data ${nama}! 💰✨`;
            tahfidzForm.reset();
        } catch (error) {
            aiFeedback.innerHTML = `Error: ${error.message} ❌`;
        } finally {
            submitBtn.disabled = false;
        }
    });
});
