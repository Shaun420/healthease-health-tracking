import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Firebase configuration
const firebaseConfig = {
  type: "service_account",
  project_id: "fir-4ca9b",
  private_key_id: "c8a84dd8cfc0d5815967357e1ba8d1a620d46898",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDx1dbtz5ylSSIF\n8aUC6SaZQVkZrIYjCjV4+dmvHt3sfmzFvSSregllwqat4dAa6i+Etstq8XphQYU5\nbV+byOb66P3oFfq3crOqIJXbXW1IGIg6DfY56oMjp/WiUVLl5h3PF+ndidKzQcco\nqB9O/t01WD8YqOsP19M5FYFlhAc9h65qT2NrihxIc0B3t87J6S7qKHn1rVIRuInL\nSnvxIazGODZFPyqaJqq2kjguCPBMkUYTtd1R75LSm3ddDUjKvukhGRXlhWW8WM2t\nuMXeSO+pNdHKGE4Ptn/qwaE0sulcNgLqiO9xEpYqYjUsIjIJWSWTn5fiLIkjUag9\nnBxtQZ2xAgMBAAECggEAAnxNv8wkYnAt55eReDDFxbRN0mKlzp/jp06SwxxDMH5R\n0gwiNO9QP+nAKqWEF6FkY3iOftb5s0ddXhb78Sm03WDTf+ppP9qaXUta8ZzUS0tR\n68jUyPPFAnLkO9Vv+kQYdoEFgBJTJlECLJk3wyksRF4CaKzkckP9XDGWpCC3LgBy\nd8T7hwJ1UzmKbBbolBKD0HGBYt0U8uSeAFG5/hT8H+F4iRI3CUhEtbP2lR5fSvfZ\nhDM42s3QHcsUtK0HC4WAxZkTD5SsxQUikDvaTg9babePac8kMTrNzW+hLbG93GkJ\nPe3Bqh/R5ZXCOFFa+4fN28P7brdA7q0vUYqNzxPDHQKBgQD/MVN8hwKn/J+bff14\nkIJjamRP22WdHRPO1sSiwmAnrgC3aB7Itdfd7+jksuPLxjHhWwNEM/LMdwssPdMi\nXdDsb7y6v+L1Nr/MbM9hesq53XYq8I9naMKJ1Z8nrtM0RqhDifjvAZ/Qg/7BJyBW\ndDCJLPn3oBOSFU3WuDKuJuFylQKBgQDymbIW+Q7BB6A3sPrJpGI+5NW+V8xSsFW3\n+HVjLzU7aiVpT66L02f7T+xEFtvjgDS0zK/KSv36GZy1gPCWpn1xLG5RFHE/U07c\nsPcfcQS6mP1UbVMPHSbwo44dLDX1kqGspB5EEUNybAW3c1p8pLoes8u2/IIOzZ00\neMKUU2WzrQKBgQDhCty22lDLV4phEzAt3DI//ZjMm4v2i6fmJZtudL9a/qV/GADd\nuw7Mlz7oP6GHGBbwxtQQl0csbGab80F38wfFGZxzi7hXyppFakdPjXutgNEueMnd\nxZKY/pvF4PQ8C3tjZA70ppgKx/wm1Zw84WXT8qfVaYMYtlTYX8PBtGPoKQKBgQCk\nBhKIwb+d9x/2R2xoZQIf7+wsE4SL67ko9422j7Z4A15kA4HJ/BdzrSfbKXFmMcpw\n62t3ZJivPh3cAd+om8x4dkfn/eBLpnHNeMC8u1ctKj8tk/TyZQ1s6cguJTQeYxN4\nfEYSU3G8rRh4Xj+xwlYsZ/e2MqdkhtRhI7y7OF+syQKBgErpQ4wdt7MFqGEe29NJ\noIBZng8bnqYfdlMuzJ2iseJQYx0p6xYkYuRiaSCda9qJefQrV4lcN8tHL+0vYV1D\nuhhRY5/2c8GLTPIps3nategKDVyZXKyR9KeZG8Qtx+93yqIWEo1BqdUnSTowhY5W\n/Jp9tPCRkd6vkfm8KQVnxOJB\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@fir-4ca9b.iam.gserviceaccount.com",
  client_id: "116924428304155981669",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40fir-4ca9b.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

// Initialize Firebase
const app = initializeApp({
  credential: cert(firebaseConfig),
});

// Initialize Firestore
const db = getFirestore(app);

export { db };
