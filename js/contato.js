const CONFIG = {
    emailjs: {
        active: false,
        serviceId: 'service_xxx',
        templateId: 'template_xxx',
        // <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
        // <script>emailjs.init("SUA_PUBLIC_KEY");</script>
    },
    formspree: {
        active: false,
        endpoint: 'https://formspree.io/f/SEU_ID',
    },
};


function initContato(ctx = document) {
    const $ = id => ctx.querySelector('#' + id);

    function validate() {
        let ok = true;
        const rules = [
            { id: 'assunto', err: 'err-assunto', test: v => v !== '', msg: 'Selecione um assunto.' },
            { id: 'nome', err: 'err-nome', test: v => v.trim().length >= 3, msg: 'Informe seu nome.' },
            { id: 'email', err: 'err-email', test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'E-mail inválido.' },
            { id: 'msg', err: 'err-msg', test: v => v.trim().length >= 10, msg: 'Mensagem muito curta.' },
        ];
        rules.forEach(({ id, err, test, msg }) => {
            const el = $(id);
            const valid = test(el.value);
            el.classList.toggle('invalid', !valid);
            $(err).textContent = valid ? '' : msg;
            if (!valid) ok = false;
        });
        return ok;
    }

    async function send(data) {
        if (CONFIG.emailjs.active) {
            const r = await emailjs.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, data);
            return r.status === 200;
        }
        if (CONFIG.formspree.active) {
            const r = await fetch(CONFIG.formspree.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(data),
            });
            return r.ok;
        }
        await new Promise(r => setTimeout(r, 800)); 
        return true;
    }

    $('form').addEventListener('submit', async e => {
        e.preventDefault();
        if (!validate()) return;

        const btn = $('btn');
        const fb = $('feedback');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Enviando…';

        const data = {
            assunto: $('assunto').value,
            nome: $('nome').value.trim(),
            email: $('email').value.trim(),
            contato: $('tel').value.trim(),
            mensagem: $('msg').value.trim(),
        };

        try {
            const ok = await send(data);
            fb.className = `feedback ${ok ? 'ok' : 'fail'}`;
            fb.textContent = ok ? '✓ Mensagem enviada! Responderei em breve.' : 'Erro ao enviar. Tente novamente.';
            fb.style.display = 'block';
            if (ok) $('form').reset();
        } catch (err) {
            fb.className = 'feedback fail';
            fb.textContent = `Erro: ${err.message}`;
            fb.style.display = 'block';
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar mensagem';
        }
    });

    ['assunto', 'nome', 'email', 'msg'].forEach(id =>
        $(id)?.addEventListener('input', () => $(id).classList.remove('invalid'))
    );

    $('tel')?.addEventListener('input', function () {
        let v = this.value.replace(/\D/g, '').slice(0, 11);
        if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d*)$/, '($1) $2-$3');
        else if (v.length > 2) v = v.replace(/^(\d{2})(\d*)$/, '($1) $2');
        this.value = v;
    });
}

if (document.getElementById('form')) {
    initContato(document);
}