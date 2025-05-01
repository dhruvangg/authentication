# Authentication System using JWT

In this approach, I have used accessToken and refreshToken and stored them in HTTP only cookies, so there is no control at client level for authentication.

## ✅ Pros of Storing Both Tokens in HTTP-only Cookies

| Advantage | Explanation |
|----------|-------------|
| 🔐 **Highly secure against XSS** | HTTP-only cookies **cannot be accessed via JavaScript**, so malicious scripts can't steal tokens. |
| 📦 **Simpler client-side logic** | No need to manually attach tokens in headers — cookies are automatically sent with each request when using `credentials: 'include'`. |
| 🧩 **Works well with traditional backend frameworks** | This pattern aligns with cookie-based session auth, so it's easy to integrate in frameworks like Express, Django, etc. |
| 🛡️ **Enables strong CSRF protection** | With proper CSRF tokens and `SameSite` cookie settings, this setup can be secure from CSRF attacks. |
| 🔄 **Automatic refresh** | Frontend doesn’t have to manage or store tokens — only needs to call a refresh endpoint when a request fails. |
| 🌐 **Better user experience** | Persistent login feels seamless without managing tokens in localStorage or memory. |

---

## ❌ Cons of Storing Both Tokens in HTTP-only Cookies

| Disadvantage | Explanation |
|--------------|-------------|
| 🌐 **Cross-origin issues** | Requires proper CORS setup: `credentials: 'include'`, `Access-Control-Allow-Credentials`, and `SameSite=None; Secure` cookies if frontend/backend are on different domains. |
| 🔁 **All requests go through the server** | Even verifying authentication or getting user data requires an API call — can’t just read a token from memory. |
| 🔒 **Needs CSRF protection** | Since cookies are automatically sent, you must defend against CSRF (e.g., via CSRF tokens or `SameSite=Strict`). |
| 🚫 **Less control on client** | You can’t introspect or use the token on the client for user info or UI personalization unless you call a user endpoint. |
| 🧠 **Slightly more complex server logic** | Token rotation, revocation, and CSRF token generation must all be handled server-side. |
| 📉 **No offline access** | Since client cannot read tokens, any logic that needs offline token access is not possible (e.g., PWA features). |

---

## 🔁 Typical Use Case Example

1. User logs in → server sets two HTTP-only cookies:
   - `accessToken` (short-lived, e.g., 15 mins)
   - `refreshToken` (long-lived, e.g., 7 days)

2. All requests auto-send cookies → backend verifies `accessToken`

3. If access token expired → frontend calls `/refresh-token` → backend reads `refreshToken` from cookie and issues a new `accessToken`

4. On logout → server clears both cookies

---

## 🏁 Verdict

**Storing both tokens in HTTP-only cookies is one of the most secure patterns**, especially when:
- Your app is **hosted on a secure HTTPS domain**
- You configure CORS + CSRF protection correctly
- You want to keep tokens **entirely on the server side**

---

Would you like a comparison table between this approach and localStorage/in-memory patterns for JWT handling?