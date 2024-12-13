export class TokenHelper {
    /**
     * Decode JWT token
     * @param token - The JWT token string
     * @returns Decoded payload object, or null if token is invalid
     */
    static decodeToken(token: string): any {
      if (!token) {
        console.error('Token is required');
        return null;
      }
  
      try {
        const payload = token.split('.')[1];
        const decodedPayload = atob(payload); // Decode Base64 string
        return JSON.parse(decodedPayload); // Parse JSON object
      } catch (error) {
        console.error('Invalid Token:', error);
        return null;
      }
    }
    static getUserId(token: string): string  {
        const decodedToken = TokenHelper.decodeToken(token);
        if (decodedToken) {
          return decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || null;
        }
        return "null";
    }
  }
  