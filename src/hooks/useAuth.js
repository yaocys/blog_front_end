import { useState, useEffect } from 'react';

/**
 * 认证状态 hook
 * @returns {null|boolean} null=加载中, true=已认证, false=未认证
 */
export function useAuth() {
    const [isAuth, setIsAuth] = useState(null);
    useEffect(() => {
        fetch('/api1/auth/check', { credentials: 'include' })
            .then(r => setIsAuth(r.ok))
            .catch(() => setIsAuth(false));
    }, []);
    return isAuth;
}
