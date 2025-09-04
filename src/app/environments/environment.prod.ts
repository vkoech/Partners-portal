export const environment = {
  production: true,
  // apiUrl: 'http://microservices.sysre.co.ke/api/',
  apiUrl: 'http://staffportalapi.naturalstate.org/api/',
  appName: 'Natural State HR System',
  version: '1.0.0',
  features: {
    enableNotifications: true,
    enableFileUpload: true,
    enableRealTimeUpdates: true,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedFileTypes: ['pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx']
  },
  api: {
    timeout: 30000,
    retryAttempts: 3
  }
};