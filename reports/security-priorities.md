# StayWise Security Priorities: Top 5 Critical Fixes

## Overview

Based on the comprehensive security audit, these are the **top 5 highest impact security fixes** that should be implemented immediately before production deployment. These fixes address the most critical vulnerabilities that pose the greatest risk to user data and application security.

---

## 🔴 Priority 1: Secure Authentication Implementation
**Risk Level:** CRITICAL | **Impact:** VERY HIGH | **Effort:** HIGH

### The Problem
- Authentication context is incomplete with no actual JWT handling
- Tokens stored in localStorage (vulnerable to XSS)
- No refresh token mechanism or proper session management
- Logout doesn't invalidate server sessions

### Why This Matters
- **Data Exposure Risk**: User sessions can be hijacked
- **Compliance**: Violates security best practices
- **User Trust**: Fundamental security flaw in core functionality

### Implementation Plan
```typescript
// 1. Implement httpOnly cookie storage
const authConfig = {
  tokenStorage: 'httpOnly', // NOT localStorage
  sameSite: 'strict',
  secure: true
};

// 2. Add proper JWT handling
interface AuthState {
  user: User | null;
  accessToken: string | null; // stored in httpOnly cookie
  refreshToken: string | null; // stored in httpOnly cookie
  isAuthenticated: boolean;
}

// 3. Implement token refresh
const refreshTokens = async () => {
  // Call /api/auth/refresh endpoint
  // Update httpOnly cookies server-side
};

// 4. Secure logout
const logout = async () => {
  await fetch('/api/auth/logout', { method: 'POST' });
  // Server invalidates tokens and clears cookies
  window.location.reload();
};
```

### Files to Modify
- `src/components/contexts/AuthContext.tsx` - Complete rewrite
- Add backend `/api/auth/` endpoints
- `src/src/components/TopBar/SettingsDropdown.tsx` - Fix logout

---

## 🔴 Priority 2: Content Security Policy Implementation  
**Risk Level:** CRITICAL | **Impact:** VERY HIGH | **Effort:** MEDIUM

### The Problem
- No CSP headers configured
- Application vulnerable to XSS attacks
- Inline scripts and unsafe-eval allowed by default

### Why This Matters
- **XSS Prevention**: Primary defense against script injection
- **Attack Surface**: Significantly reduces malicious script execution
- **Compliance**: Required for production security standards

### Implementation Plan
```typescript
// Add to Next.js config or server configuration
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' https://maps.googleapis.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' data: https:;
      font-src 'self' https://fonts.gstatic.com;
      connect-src 'self' https://api.supabase.co wss://api.supabase.co;
      frame-src 'none';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
    `.replace(/\s{2,}/g, ' ').trim()
  }
];
```

### Files to Modify
- `next.config.js` - Add security headers
- `vite.config.ts` - Add CSP plugin for development
- Review all `dangerouslySetInnerHTML` usage

---

## 🟡 Priority 3: Eliminate Console Logging & Information Disclosure
**Risk Level:** HIGH | **Impact:** MEDIUM | **Effort:** LOW

### The Problem
- Console.log statements in production code
- DevTools component logs localStorage (may contain PII)
- Error details exposed in development mode

### Why This Matters
- **Information Disclosure**: Sensitive data leaked to browser console
- **GDPR Compliance**: PII exposure violations
- **Security**: Provides attack intelligence to malicious actors

### Implementation Plan
```typescript
// 1. Create secure logging utility
const logger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, data);
    }
    // Send to monitoring service in production
  },
  error: (message: string, error?: Error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[ERROR] ${message}`, error);
    }
    // Send to error tracking service
  }
};

// 2. Sanitize DevTools logging
const sanitizeForLogging = (data: any) => {
  // Remove sensitive fields
  const { password, token, email, ...safe } = data;
  return safe;
};
```

### Files to Modify  
- `src/components/TravelGuideApp.tsx:157` - Replace console.error
- `src/src/components/DevTools/DevPanel.tsx:281` - Sanitize logging
- All other console.log instances found in audit

---

## 🟡 Priority 4: Fix Unsafe DOM Manipulation
**Risk Level:** HIGH | **Impact:** MEDIUM | **Effort:** MEDIUM

### The Problem
- Multiple uses of `dangerouslySetInnerHTML` for JSON-LD
- No input sanitization on user-generated content
- Potential XSS through structured data injection

### Why This Matters
- **XSS Risk**: Malicious scripts can be injected via JSON-LD
- **Data Integrity**: Improper handling of structured data
- **SEO Security**: Compromised structured data affects search rankings

### Implementation Plan
```typescript
// 1. Create safe JSON-LD component
const SafeJsonLd: React.FC<{ data: object }> = ({ data }) => {
  // Sanitize and validate JSON-LD structure
  const sanitizedData = sanitizeJsonLd(data);
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(sanitizedData)
      }}
    />
  );
};

// 2. Input sanitization utility
import DOMPurify from 'dompurify';

const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
    ALLOWED_ATTR: []
  });
};
```

### Files to Modify
- All pages using `dangerouslySetInnerHTML` (8 files)
- Add `dompurify` dependency
- Create `SafeJsonLd` component

---

## 🟡 Priority 5: Dependency Security & Update Vite
**Risk Level:** MEDIUM | **Impact:** HIGH | **Effort:** LOW

### The Problem
- Vite 6.0.0-6.3.5 has known security vulnerabilities
- Missing package integrity verification
- No automated dependency scanning

### Why This Matters
- **Supply Chain Risk**: Known vulnerabilities in build tool
- **Easy Fix**: Simple version update resolves issues
- **Foundation**: Secure build process is critical for all other security

### Implementation Plan
```bash
# 1. Update vulnerable dependencies
npm audit fix --force
npm install vite@^6.3.6

# 2. Add dependency scanning
npm install --save-dev @npmcli/arborist
npm audit --audit-level=moderate

# 3. Add to CI/CD pipeline
- name: Security Audit
  run: |
    npm audit --audit-level=moderate
    npm run build # Ensure no build-time vulnerabilities
```

### Files to Modify
- `package.json` - Update Vite version
- `.github/workflows/` - Add security checks
- `package-lock.json` - Regenerate lock file

---

## Implementation Timeline

| Priority | Timeline | Dependencies | Validation |
|----------|----------|--------------|------------|
| **P1: Auth** | Week 1-2 | Backend API endpoints | User login/logout flow testing |
| **P2: CSP** | Week 1 | None | Browser console, security headers |
| **P3: Logging** | Week 1 | Logging utility | Code review, no console output |
| **P4: DOM** | Week 2 | DOMPurify dependency | XSS testing, JSON-LD validation |
| **P5: Dependencies** | Week 1 | None | Vulnerability scan clean |

## Success Metrics

✅ **Security Headers**: CSP, HSTS, X-Frame-Options implemented  
✅ **Authentication**: No tokens in localStorage, proper session management  
✅ **Information Disclosure**: No console logs in production build  
✅ **XSS Prevention**: All user inputs sanitized, no unsafe innerHTML  
✅ **Dependencies**: Zero high/critical vulnerabilities in npm audit  

## Post-Implementation Verification

1. **Penetration Testing**: Hire security firm for external validation
2. **Automated Scanning**: Set up continuous security monitoring
3. **Code Review**: Establish security-focused review process
4. **User Testing**: Validate that security changes don't break UX

---

*These priorities represent the minimum viable security posture for production deployment. Additional security hardening should continue after these critical fixes are implemented.*
