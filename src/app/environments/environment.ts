export const environment = {
  production: false,
  apiUrl: 'http://staffportalapi.naturalstate.org/api/',
  //apiUrl: 'http://microservices.sysre.co.ke/api/',
  appName: 'Natural State HR System',
  version: '1.0.0',
  features: {
    enableNotifications: true,
    enableFileUpload: true,
    enableRealTimeUpdates: false,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedFileTypes: ['pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx']
  },
  api: {
    timeout: 30000,
    retryAttempts: 2
  }
};