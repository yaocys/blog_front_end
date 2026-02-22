import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import './index.css';

const Auth = () => {
    const [digits, setDigits] = useState(['', '', '', '', '', '']);
    const [status, setStatus] = useState('idle'); // idle | loading | error
    const [errMsg, setErrMsg] = useState('');
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    // 已经认证过就直接跳转
    useEffect(() => {
        fetch('/api1/auth/check', {credentials: 'include'})
            .then(r => {
                if (r.ok) navigate('/backstage', {replace: true});
            })
            .catch(() => {});
    }, [navigate]);

    const doSubmit = async (code) => {
        setStatus('loading');
        setErrMsg('');
        try {
            const res = await fetch('/api1/auth/verify', {
                method: 'POST',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({code}),
            });
            const data = await res.json();
            if (data.success) {
                navigate('/backstage', {replace: true});
            } else {
                setErrMsg(data.message || '验证失败');
                setStatus('error');
                setDigits(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        } catch {
            setErrMsg('网络错误，请重试');
            setStatus('error');
        }
    };

    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;
        const next = [...digits];
        next[index] = value;
        setDigits(next);
        if (status === 'error') setStatus('idle');
        // 自动移到下一格
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
        // 第6位填入时自动提交
        if (value && index === 5 && next.every(d => d !== '')) {
            doSubmit(next.join(''));
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'Enter') {
            const code = digits.join('');
            if (code.length === 6) doSubmit(code);
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const next = [...digits];
        for (let i = 0; i < 6; i++) {
            next[i] = pasted[i] ?? '';
        }
        setDigits(next);
        const focusIdx = Math.min(pasted.length, 5);
        inputRefs.current[focusIdx]?.focus();
        // 粘贴满6位时自动提交
        if (pasted.length === 6) {
            doSubmit(pasted);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-icon">🔐</div>
                <h2 className="auth-title">后台验证</h2>
                <p className="auth-desc">请打开 Authenticator，输入当前的 6 位动态码</p>

                <div className="otp-row" onPaste={handlePaste}>
                    {digits.map((d, i) => (
                        <input
                            key={i}
                            ref={el => (inputRefs.current[i] = el)}
                            className={`otp-input ${status === 'error' ? 'otp-error' : ''}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={d}
                            autoFocus={i === 0}
                            onChange={e => handleChange(i, e.target.value)}
                            onKeyDown={e => handleKeyDown(i, e)}
                        />
                    ))}
                </div>

                {status === 'error' && (
                    <p className="auth-err">{errMsg}</p>
                )}

                {status === 'loading' && (
                    <p className="auth-loading">验证中…</p>
                )}
            </div>
        </div>
    );
};

export default Auth;
